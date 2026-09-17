// src/backend/services/admin/analytics.service.ts

import { prisma } from "@/src/lib/prisma";

export async function getPlatformOverview() {
  const [totalUsers, totalEnrollments, revenue, pendingReviews] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.enrollment.count(),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } }),
    prisma.submission.count({ where: { status: { in: ["SUBMITTED", "IN_REVIEW"] } } }),
  ]);

  return {
    totalUsers,
    totalEnrollments,
    totalRevenueCents: revenue._sum.amountCents ?? 0,
    pendingReviews,
  };
}

export async function getCourseAnalytics(courseId: string) {
  const [enrollmentCount, lessons] = await Promise.all([
    prisma.enrollment.count({ where: { courseId } }),
    prisma.lesson.findMany({
      where: { module: { courseId }, parentId: null },
      include: { progress: { select: { status: true } }, children: { include: { progress: { select: { status: true } } } } },
    }),
  ]);

  // Drop-off signal: completion rate per leaf lesson, so you can see exactly
  // where people stop — the thing the original design plan flagged as the
  // real diagnostic, not just an aggregate percentage.
  const leaves = lessons.flatMap((l) => (l.kind === "OVERVIEW" ? l.children : [l]));
  const perLesson = leaves.map((l) => ({
    lessonId: l.id,
    title: l.title,
    completions: l.progress.filter((p) => p.status === "COMPLETED").length,
    completionRate: enrollmentCount ? l.progress.filter((p) => p.status === "COMPLETED").length / enrollmentCount : 0,
  }));

  return { enrollmentCount, lessons: perLesson };
}