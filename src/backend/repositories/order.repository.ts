import type { Db } from "@/src/lib/prisma";

export function findByIdempotencyKey(db: Db, idempotencyKey: string) {
  return db.order.findUnique({ where: { idempotencyKey } });
}

export function create(
  db: Db,
  data: {
    userId: string;
    courseId: string;
    amountCents: number;
    currency: string;
    idempotencyKey: string;
    billingName:string,
    billingEmail:string,
    billingPhone:string,
    billingAddress:string
  },
) {
  return db.order.create({ data: { ...data, status: "PENDING" } });
}

export function findById(db: Db, id: string) {
  return db.order.findUniqueOrThrow({ where: { id } });
}

export function findByGatewayOrderId(db: Db, gatewayOrderId: string) {
  return db.order.findUniqueOrThrow({ where: { gatewayOrderId } });
}

export function findManyByUser(db: Db, userId: string) {
  return db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function setGatewayOrderId(db: Db, id: string, gatewayOrderId: string) {
  return db.order.update({ where: { id }, data: { gatewayOrderId } });
}

// The compare-and-swap at the heart of confirmPayment: `status` in the
// WHERE clause makes this atomic — only the first caller to run this
// against a given gatewayOrderId can ever match a row and flip it to
// PAID. Every later call (duplicate webhook delivery) matches zero rows.
export function markPaidIfPending(
  db: Db,
  gatewayOrderId: string,
  gatewayPaymentId: string,
) {
  return db.order.updateMany({
    where: { gatewayOrderId, status: "PENDING" },
    data: { status: "PAID", gatewayPaymentId },
  });
}