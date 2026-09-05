import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { randomUUID } from "node:crypto";
import { createOrder, confirmPayment } from "@/src/backend/services/order.service";
import { prisma } from "@/src/lib/prisma";


let userId: string;
let courseId: string;

describe("purchase concurrency", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    // Order/Enrollment first — FK constraints mean parents can't be
    // deleted while children exist.
    await prisma.enrollment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { name: "Test Buyer", email: `buyer-${randomUUID()}@example.com` },
    });
    const course = await prisma.course.create({
      data: {
        slug: `course-${randomUUID()}`,
        title: "Full-Stack Engineering",
        description: "Test course",
        priceCents: 49900,
        currency: "INR",
        isPublished: true,
      },
    });
    userId = user.id;
    courseId = course.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("double-clicking Buy (same idempotency key, concurrent requests) creates exactly one order", async () => {
    const idempotencyKey = randomUUID();

    const results = await Promise.all([
      createOrder(userId, courseId, idempotencyKey),
      createOrder(userId, courseId, idempotencyKey),
      createOrder(userId, courseId, idempotencyKey),
    ]);

    const uniqueOrderIds = new Set(results.map((o) => o.id));
    expect(uniqueOrderIds.size).toBe(1);

    const count = await prisma.order.count({ where: { idempotencyKey } });
    expect(count).toBe(1);
  });

  it("duplicate webhook delivery for the same payment confirms exactly once, one enrollment", async () => {
    const order = await createOrder(userId, courseId, randomUUID());
    const gatewayOrderId = `razorpay_order_${randomUUID()}`;
    const gatewayPaymentId = `razorpay_pay_${randomUUID()}`;

    // Simulate Razorpay giving us the gateway order id at checkout time,
    // before the webhook ever fires.
    await prisma.order.update({
      where: { id: order.id },
      data: { gatewayOrderId },
    });

    // Simulate the gateway delivering the same "payment.captured" webhook
    // three times concurrently — this happens in production more often
    // than people expect.
    await Promise.all([
      confirmPayment(gatewayOrderId, gatewayPaymentId),
      confirmPayment(gatewayOrderId, gatewayPaymentId),
      confirmPayment(gatewayOrderId, gatewayPaymentId),
    ]);

    const enrollmentCount = await prisma.enrollment.count({
      where: { userId, courseId },
    });
    expect(enrollmentCount).toBe(1);

    const finalOrder = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(finalOrder.status).toBe("PAID");
  });

  it("rejects a second purchase attempt once the course is already owned", async () => {
    const order = await createOrder(userId, courseId, randomUUID());
    const gatewayOrderId = `razorpay_order_${randomUUID()}`;
    await prisma.order.update({
      where: { id: order.id },
      data: { gatewayOrderId },
    });
    await confirmPayment(gatewayOrderId, `razorpay_pay_${randomUUID()}`);

    await expect(
      createOrder(userId, courseId, randomUUID()),
    ).rejects.toMatchObject({ code: "ALREADY_ENROLLED" });
  });
});
