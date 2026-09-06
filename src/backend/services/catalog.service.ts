// src/backend/services/catalog.service.ts

import { Errors } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";


export async function getCourseCatalog(userId: string) {
  const [courses, enrollments] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "asc" },
      select: { id: true, slug: true, title: true, description: true, priceCents: true, currency: true, syllabus:true},
    }),
    prisma.enrollment.findMany({ where: { userId }, select: { courseId: true } }),
  ]);

  const enrolledIds = new Set(enrollments.map((e) => e.courseId));
  return courses.map((c) => ({ ...c, isEnrolled: enrolledIds.has(c.id) }));
}

// Preview no longer walks modules/lessons — the syllabus field already
// carries whatever outline the admin wrote, so there's nothing to derive.
export async function getCoursePreview(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      syllabus: true,
      priceCents: true,
      currency: true,
    },
  });
  if (!course) throw Errors.notFound("Course");

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  return { course, isEnrolled: !!enrollment };
}