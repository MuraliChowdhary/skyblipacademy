// src/backend/services/history.service.ts

import { prisma } from "@/src/lib/prisma";

export async function getUserHistory(userId: string) {
  const entries = await prisma.lessonProgress.findMany({
    where: { userId },
    orderBy: { lastAccessedAt: "desc" },
    take: 50, // recent feed, not a full archive
    include: {
      lesson: { select: { id: true, title: true, module: { select: { course: { select: { id: true, title: true } } } } } },
    },
  });

  return entries.map((e) => ({
    lessonId: e.lesson.id,
    lessonTitle: e.lesson.title,
    courseTitle: e.lesson.module.course.title,
    status: e.status,
    videoPositionSeconds: e.videoPositionSeconds,
    lastAccessedAt: e.lastAccessedAt,
  }));
}