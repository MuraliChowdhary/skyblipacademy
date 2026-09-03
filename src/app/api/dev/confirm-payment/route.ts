import { NextResponse } from "next/server";
import { withApiHandler } from "@/src/lib/api-handler";
import { AppError } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";
import { confirmPayment } from "@/src/backend/services/enrollment.service";

/**
 * Local-testing convenience only: lets you confirm a payment via Postman
 * without a real Razorpay account or a valid webhook signature. Hard
 * guard on NODE_ENV — this must never exist in a deployed environment,
 * since it's an unauthenticated way to mark any order as paid.
 *
 * Usage: POST /api/dev/confirm-payment
 *   { "orderId": "<id from the purchase response>" }
 *
 * Takes your internal orderId (not a real Razorpay id) and assigns it a
 * synthetic gatewayOrderId if it doesn't have one yet, then runs the
 * exact same confirmPayment path the real webhook uses — this exercises
 * the actual compare-and-swap logic, not a fake shortcut around it.
 */
export const POST = withApiHandler(async (req) => {
  if (process.env.NODE_ENV === "production") {
    // Deliberately a generic 404, not a 403 — don't reveal this route
    // exists at all in a production build.
    throw new AppError("NOT_FOUND", "Not found.", 404);
  }

  const body = await req.json();
  if (!body?.orderId) {
    throw new AppError("INVALID_BODY", "orderId is required.", 400);
  }

  const order = await prisma.order.findUniqueOrThrow({
    where: { id: body.orderId },
  });

  const gatewayOrderId = order.gatewayOrderId ?? `dev_order_${order.id}`;
  if (!order.gatewayOrderId) {
    await prisma.order.update({
      where: { id: order.id },
      data: { gatewayOrderId },
    });
  }

  return confirmPayment(gatewayOrderId, `dev_payment_${crypto.randomUUID()}`);
});

export function GET() {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}