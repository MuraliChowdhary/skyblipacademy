import { NextResponse } from "next/server";
import { withApiHandler } from "@/src/lib/api-handler";
import { AppError } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";
import * as orderRepository from "@/src/backend/repositories/order.repository";
import { confirmPayment } from "@/src/backend/services/order.service";

/**
 * Local-testing convenience only — see README. Hard-blocked outside
 * development so this unauthenticated "mark anything as paid" shortcut
 * can never exist in a deployed environment.
 */
export const POST = withApiHandler(async (req) => {
  if (process.env.NODE_ENV === "production") {
    throw new AppError("NOT_FOUND", "Not found.", 404);
  }

  const body = await req.json();
  if (!body?.orderId) {
    throw new AppError("INVALID_BODY", "orderId is required.", 400);
  }

  const order = await orderRepository.findById(prisma, body.orderId);
  const gatewayOrderId = order.gatewayOrderId ?? `dev_order_${order.id}`;
  if (!order.gatewayOrderId) {
    await orderRepository.setGatewayOrderId(prisma, order.id, gatewayOrderId);
  }

  return confirmPayment(gatewayOrderId, `dev_payment_${crypto.randomUUID()}`);
});

export function GET() {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}
