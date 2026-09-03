import { createOrder } from "@/src/backend/services/enrollment.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { AppError } from "@/src/lib/errors";

type Params = { courseId: string };

export const POST = withApiHandler<Params>(async (req, { params }, log) => {
  const session = await auth();
  if (!session?.user) {
    throw new AppError("UNAUTHENTICATED", "Sign in to purchase a course.", 401);
  }

  // Required, not optional — a checkout request with no idempotency key
  // has no protection against double-submission, so we reject it rather
  // than silently generating one server-side (that would defeat the
  // point: the key has to survive a client retry, which means the
  // *client* must own generating and resending it).
  const idempotencyKey = req.headers.get("Idempotency-Key");
  if (!idempotencyKey) {
    throw new AppError(
      "MISSING_IDEMPOTENCY_KEY",
      "Idempotency-Key header is required.",
      400,
    );
  }

  const { courseId } = await params;
  log.info({ userId: session.user.id, courseId }, "order.create.attempt");

  return createOrder(session.user.id, courseId, idempotencyKey);
});

