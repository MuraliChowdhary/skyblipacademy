// src/backend/services/lesson-nav.service.ts

import { Errors } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";


export async function getLessonNav(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, title: true, moduleId: true, parentId: true, order: true },
  });
  if (!lesson) throw Errors.notFound("Lesson");

  const module_ = await prisma.module.findUnique({
    where: { id: lesson.moduleId },
    select: { id: true, title: true, courseId: true },
  });
  if (!module_) throw Errors.notFound("Module");

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: module_.courseId } },
  });
  if (!enrolled) throw Errors.forbidden();

  const [course, modules, siblingLessons] = await Promise.all([
    prisma.course.findUniqueOrThrow({ where: { id: module_.courseId }, select: { id: true, title: true } }),
    prisma.module.findMany({
      where: { courseId: module_.courseId, isPublished: true },
      orderBy: { order: "asc" },
      select: { id: true, title: true },
    }),
    // The lesson dropdown + prev/next both walk this same ordered, top-level
    // list within the current module — topics under an OVERVIEW aren't
    // included here, since they're reached via that OVERVIEW lesson itself.
    prisma.lesson.findMany({
      where: { moduleId: lesson.moduleId, parentId: null, contentStatus: "PUBLISHED" },
      orderBy: { order: "asc" },
      select: { id: true, title: true, order: true },
    }),
  ]);

  // Resolve the top-level ancestor (if this is a TOPIC, prev/next and the
  // dropdown operate on its parent OVERVIEW row, not the topic itself).
  const anchorLessonId = lesson.parentId ?? lesson.id;
  const currentIndex = siblingLessons.findIndex((l) => l.id === anchorLessonId);

  return {
    course,
    modules,
    currentModuleId: module_.id,
    currentModuleTitle: module_.title,
    lessons: siblingLessons,
    currentLessonId: anchorLessonId,
    prevLessonId: currentIndex > 0 ? siblingLessons[currentIndex - 1].id : null,
    nextLessonId: currentIndex >= 0 && currentIndex < siblingLessons.length - 1
      ? siblingLessons[currentIndex + 1].id
      : null,
  };
}