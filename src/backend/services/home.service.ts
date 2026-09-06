// src/backend/services/home.service.ts

import { prisma } from "@/src/lib/prisma";

const RECENT_WINDOW_DAYS = 14;

export async function getContinueLearning(userId: string) {
  const recent = await prisma.lessonProgress.findMany({
    where: { userId, status: { in: ["IN_PROGRESS", "NOT_STARTED"] } },
    orderBy: { lastAccessedAt: "desc" },
    take: 3,
    include: {
      lesson: {
        include: { module: { include: { course: true } } },
      },
    },
  });

  return recent.map((p) => ({
    courseId: p.lesson.module.course.id,
    courseTitle: p.lesson.module.course.title,
    lessonId: p.lesson.id,
    lessonTitle: p.lesson.title,
    videoPositionSeconds: p.videoPositionSeconds,
  }));
}

export async function getWhatsNew(userId: string) {
  const since = new Date(Date.now() - RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    select: { courseId: true },
  });
  const courseIds = enrollments.map((e) => e.courseId);
  if (courseIds.length === 0) return [];

  const [newVideos, newAssignments] = await Promise.all([
    prisma.lesson.findMany({
      where: {
        module: { courseId: { in: courseIds } },
        videoStatus: "PUBLISHED",
        updatedAt: { gte: since },
      },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, title: true, updatedAt: true },
    }),
    prisma.assignment.findMany({
      where: { lesson: { module: { courseId: { in: courseIds } } }, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, lessonId: true, createdAt: true },
    }),
  ]);

  const videoItems = newVideos.map((v) => ({
    type: "video_ready" as const,
    text: `Recording for "${v.title}" is now live`,
    lessonId: v.id,
    at: v.updatedAt,
  }));
  const assignmentItems = newAssignments.map((a) => ({
    type: "new_assignment" as const,
    text: `New assignment posted: "${a.title}"`,
    lessonId: a.lessonId,
    at: a.createdAt,
  }));

  return [...videoItems, ...assignmentItems].sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 5);
}

export async function getPendingWork(userId: string) {
  const submissions = await prisma.submission.findMany({
    where: { userId, status: { in: ["SUBMITTED", "IN_REVIEW", "CHANGES_REQUESTED"] } },
    include: { assignment: { select: { title: true, lessonId: true } } },
    orderBy: { submittedAt: "desc" },
    take: 5,
  });

  return submissions.map((s) => ({
    assignmentTitle: s.assignment.title,
    lessonId: s.assignment.lessonId,
    status: s.status,
  }));
}

export async function getUserStats(userId: string) {
  const [user, enrollments, orders, completedCount] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { createdAt: true } }),
    prisma.enrollment.count({ where: { userId } }),
    prisma.order.aggregate({ where: { userId, status: "PAID" }, _sum: { amountCents: true } }),
    prisma.lessonProgress.count({ where: { userId, status: "COMPLETED" } }),
  ]);

  return {
    memberSince: user.createdAt,
    coursesInProgress: enrollments,
    investedCents: orders._sum.amountCents ?? 0,
    lessonsCompleted: completedCount,
  };
}

export async function getFeaturedCourses(excludeCourseIds: string[]) {
  return prisma.course.findMany({
    where: { isPublished: true, id: { notIn: excludeCourseIds } },
    take: 3,
    select: { id: true, slug: true, title: true, description: true },
  });
}