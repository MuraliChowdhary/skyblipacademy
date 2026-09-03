import { AppError, isUniqueConstraintError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";
import { prisma } from "@/src/lib/prisma";

/**
 * Layer 1 — idempotency key.
 *
 * The client generates one UUID per checkout attempt (e.g. on "Buy"
 * button press) and sends it as `Idempotency-Key`. If this exact key was
 * already used, we return the existing order instead of creating a new
 * one — this absorbs double-clicks and client-side network retries
 * before they ever become a database race.
 *
 * The `findUnique` up front is a fast path for the common case; the real
 * safety net is the `catch` below, which handles two requests with the
 * same key arriving concurrently (both pass the fast-path check, only
 * one insert wins, the loser reads back the winner's row).
 */
export async function createOrder(
  userId: string,
  courseId: string,
  idempotencyKey: string,
) {
  const existing = await prisma.order.findUnique({ where: { idempotencyKey } });
  if (existing) return existing;

  // Fast-path UX check — NOT the source of truth for correctness.
  // The Enrollment unique constraint (layer 3) is what actually
  // guarantees this can never be double-sold.
  const alreadyOwned = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (alreadyOwned) {
    throw new AppError("ALREADY_ENROLLED", "You already own this course.", 409);
  }

  const course = await prisma.course.findUniqueOrThrow({
    where: { id: courseId },
  });

  if (!course.isPublished) {
    throw new AppError("COURSE_UNAVAILABLE", "This course isn't available for purchase.", 409);
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        courseId,
        amountCents: course.priceCents,
        currency: course.currency,
        idempotencyKey,
        status: "PENDING",
      },
    });
    logger.info({ orderId: order.id, userId, courseId }, "order.created");
    return order;
  } catch (err) {
    if (isUniqueConstraintError(err, "idempotencyKey")) {
      // Lost the race to a concurrent identical request — return the
      // winner's order rather than erroring, since from the client's
      // point of view this IS their checkout attempt succeeding.
      logger.info({ idempotencyKey }, "order.idempotent_replay");
      return prisma.order.findUniqueOrThrow({ where: { idempotencyKey } });
    }
    throw err;
  }
}

/**
 * Layer 2 — compare-and-swap status transition.
 * Layer 3 — the Enrollment unique constraint as the final backstop.
 *
 * Payment gateways retry webhooks (at-least-once delivery is the norm,
 * not the exception) and can deliver them out of order. `updateMany`
 * with `status: "PENDING"` in the WHERE clause is an atomic
 * compare-and-swap: only the FIRST delivery of this event can ever
 * flip PENDING -> PAID. Every subsequent delivery matches zero rows
 * and becomes a safe no-op — not an error, not a double-charge, not a
 * duplicate enrollment.
 */
export async function confirmPayment(
  gatewayOrderId: string,
  gatewayPaymentId: string,
) {
  return prisma.$transaction(
    async (tx) => {
      const { count } = await tx.order.updateMany({
        where: { gatewayOrderId, status: "PENDING" },
        data: { status: "PAID", gatewayPaymentId },
      });

      if (count === 0) {
        logger.warn({ gatewayOrderId }, "payment.webhook.duplicate_or_stale");
        return null;
      }

      const order = await tx.order.findUniqueOrThrow({
        where: { gatewayOrderId },
      });

      // Even if every layer above had a bug and this transaction ran
      // twice concurrently for the same order, this constraint means
      // at most one Enrollment row can ever exist for (userId, courseId).
      await tx.enrollment.upsert({
        where: {
          userId_courseId: { userId: order.userId, courseId: order.courseId },
        },
        create: {
          userId: order.userId,
          courseId: order.courseId,
          orderId: order.id,
        },
        update: {},
      });

      logger.info({ orderId: order.id }, "payment.confirmed");
      return order;
    },
    { isolationLevel: "Serializable" },
  );
}