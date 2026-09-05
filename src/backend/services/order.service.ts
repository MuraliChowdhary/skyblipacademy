import { prisma } from "@/src/lib/prisma";
import { logger } from "@/src/lib/logger";
import {
  AppError,
  isUniqueConstraintError,
  isRecordNotFoundError,
} from "@/src/lib/errors";
import * as orderRepository from "@/src/backend/repositories/order.repository";
import * as enrollmentRepository from "@/src/backend/repositories/enrollment.repository";
import * as courseRepository from "@/src/backend/repositories/course.repository";

/**
 * Layer 1 of 3 — idempotency key. See order.repository's
 * markPaidIfPending and the Enrollment unique constraint in
 * schema.prisma for layers 2 and 3.
 */
export async function createOrder(
  userId: string,
  courseId: string,
  idempotencyKey: string,
) {
  const existing = await orderRepository.findByIdempotencyKey(prisma, idempotencyKey);
  if (existing) {
    // Key matching alone doesn't prove this is *this* checkout — only
    // that some earlier request used this key. Reusing it across a
    // different user/course is a bug worth failing loudly on, not
    // silently handing back the wrong order for.
    if (existing.userId !== userId || existing.courseId !== courseId) {
      throw new AppError(
        "IDEMPOTENCY_KEY_REUSED",
        "This Idempotency-Key was already used for a different purchase.",
        409,
      );
    }
    return existing;
  }

  // Fast-path UX check only — the Enrollment unique constraint is the
  // actual source of truth for "can never be double-sold."
  const alreadyOwned = await enrollmentRepository.findByUserAndCourse(
    prisma,
    userId,
    courseId,
  );
  if (alreadyOwned) {
    throw new AppError("ALREADY_ENROLLED", "You already own this course.", 409);
  }

  const course = await courseRepository.findById(prisma, courseId);
  if (!course.isPublished) {
    throw new AppError(
      "COURSE_UNAVAILABLE",
      "This course isn't available for purchase.",
      409,
    );
  }

  try {
    const order = await orderRepository.create(prisma, {
      userId,
      courseId,
      amountCents: course.priceCents,
      currency: course.currency,
      idempotencyKey,
    });
    logger.info({ orderId: order.id, userId, courseId }, "order.created");
    return order;
  } catch (err) {
    if (isUniqueConstraintError(err, "idempotencyKey")) {
      const winner = await orderRepository.findByIdempotencyKey(prisma, idempotencyKey);
      if (!winner) {
        throw new AppError("INTERNAL_ERROR", "Order lookup failed after conflict.", 500);
      }
      if (winner.userId !== userId || winner.courseId !== courseId) {
        throw new AppError(
          "IDEMPOTENCY_KEY_REUSED",
          "This Idempotency-Key was already used for a different purchase.",
          409,
        );
      }
      logger.info({ idempotencyKey }, "order.idempotent_replay");
      return winner;
    }
    throw err;
  }
}

/**
 * Layers 2 + 3 — atomic compare-and-swap (order.repository's
 * markPaidIfPending) inside a Serializable transaction, then an
 * enrollment upsert backstopped by the DB unique constraint.
 */
export async function confirmPayment(
  gatewayOrderId: string,
  gatewayPaymentId: string,
) {
  return prisma.$transaction(
    async (tx) => {
      const { count } = await orderRepository.markPaidIfPending(
        tx,
        gatewayOrderId,
        gatewayPaymentId,
      );

      if (count === 0) {
        logger.warn({ gatewayOrderId }, "payment.webhook.duplicate_or_stale");
        return null;
      }

      const order = await orderRepository.findByGatewayOrderId(tx, gatewayOrderId);

      await enrollmentRepository.upsert(tx, {
        userId: order.userId,
        courseId: order.courseId,
        orderId: order.id,
      });

      logger.info({ orderId: order.id }, "payment.confirmed");
      return order;
    },
    { isolationLevel: "Serializable" },
  );
}

export async function listMyOrders(userId: string) {
  return orderRepository.findManyByUser(prisma, userId);
}

/**
 * 404, not 403, when the order belongs to someone else — same reasoning
 * as course visibility: a 403 confirms the id is a real order, which
 * this endpoint has no business revealing to a non-owner.
 */
export async function getOrderDetail(orderId: string, userId: string) {
  let order;
  try {
    order = await orderRepository.findById(prisma, orderId);
  } catch (err) {
    if (isRecordNotFoundError(err)) {
      throw new AppError("NOT_FOUND", "Order not found.", 404);
    }
    throw err;
  }

  if (order.userId !== userId) {
    throw new AppError("NOT_FOUND", "Order not found.", 404);
  }
  return order;
}