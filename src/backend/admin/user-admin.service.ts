// src/backend/services/admin/user-admin.service.ts

import { Errors } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";


export async function listUsers(search?: string) {
  return prisma.user.findMany({
    where: search
      ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true, name: true, email: true, role: true, createdAt: true,
      _count: { select: { enrollments: true, orders: true } },
    },
  });
}

export async function getUserDetail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: { include: { course: { select: { title: true } } } },
      orders: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!user) throw Errors.notFound("User");
  return user;
}

// Manual grant — comps, support cases, refund-and-reissue.
export async function grantEnrollment(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw Errors.notFound("Course");

  const order = await prisma.order.create({
    data: {
      userId, courseId, amountCents: 0, currency: course.currency,
      status: "PAID", idempotencyKey: `admin-grant-${userId}-${courseId}-${Date.now()}`,
    },
  });

  return prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, orderId: order.id },
    update: {},
  });
}

export async function revokeEnrollment(userId: string, courseId: string) {
  await prisma.enrollment.delete({ where: { userId_courseId: { userId, courseId } } });
}