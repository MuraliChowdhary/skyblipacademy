import type { Db } from "@/src/lib/prisma";

export function findByUserAndCourse(db: Db, userId: string, courseId: string) {
  return db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}

export function upsert(
  db: Db,
  params: { userId: string; courseId: string; orderId: string },
) {
  return db.enrollment.upsert({
    where: {
      userId_courseId: { userId: params.userId, courseId: params.courseId },
    },
    create: params,
    update: {},
  });
}

export function findManyByUser(db: Db, userId: string) {
  return db.enrollment.findMany({
    where: { userId },
    include: { course: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}
