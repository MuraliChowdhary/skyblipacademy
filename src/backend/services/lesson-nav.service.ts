// src/backend/services/lesson-nav.service.ts

import { Errors } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";

export async function getLessonNav(
  userId: string,
  lessonId: string,
) {
  // --------------------------------------------------
  // 1. Current lesson
  // --------------------------------------------------

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      moduleId: true,
      parentId: true,
      order: true,
      kind: true,
      contentStatus: true,
    },
  });

  if (!lesson) {
    throw Errors.notFound("Lesson");
  }

  // --------------------------------------------------
  // 2. Current module
  // --------------------------------------------------

  const currentModule = await prisma.module.findUnique({
    where: {
      id: lesson.moduleId,
    },
    select: {
      id: true,
      title: true,
      courseId: true,
    },
  });

  if (!currentModule) {
    throw Errors.notFound("Module");
  }

  // --------------------------------------------------
  // 3. Check student enrollment
  // --------------------------------------------------

  const enrollment =
    await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: currentModule.courseId,
        },
      },
      select: {
        id: true,
      },
    });

  if (!enrollment) {
    throw Errors.forbidden();
  }

  // --------------------------------------------------
  // 4. Load course, modules and current module lessons
  // --------------------------------------------------

  const [course, modules, moduleLessons] =
    await Promise.all([
      // Course
      prisma.course.findUnique({
        where: {
          id: currentModule.courseId,
        },
        select: {
          id: true,
          title: true,
        },
      }),

      // Published modules
      prisma.module.findMany({
        where: {
          courseId: currentModule.courseId,
          isPublished: true,
        },
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          title: true,
          order: true,
        },
      }),

      // Published top-level lessons in current module
      prisma.lesson.findMany({
        where: {
          moduleId: currentModule.id,
          parentId: null,
          contentStatus: "PUBLISHED",
        },
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          title: true,
          order: true,
          kind: true,
        },
      }),
    ]);

  if (!course) {
    throw Errors.notFound("Course");
  }

  // --------------------------------------------------
  // 5. Find the navigation anchor
  //
  // If current lesson is a TOPIC:
  //
  //   Overview
  //      ├── Topic A  <-- current lesson
  //      └── Topic B
  //
  // previous/next operates on the Overview-level
  // lessons, not individual topics.
  // --------------------------------------------------

  const anchorLessonId =
    lesson.parentId ?? lesson.id;

  const currentIndex =
    moduleLessons.findIndex(
      (item) => item.id === anchorLessonId,
    );

  // --------------------------------------------------
  // 6. Previous / next top-level lesson
  // --------------------------------------------------

  const prevLessonId =
    currentIndex > 0
      ? moduleLessons[currentIndex - 1].id
      : null;

  const nextLessonId =
    currentIndex >= 0 &&
    currentIndex < moduleLessons.length - 1
      ? moduleLessons[currentIndex + 1].id
      : null;

  // --------------------------------------------------
  // 7. Return navigation model
  // --------------------------------------------------

  return {
    course: {
      id: course.id,
      title: course.title,
    },

    modules: modules.map((module) => ({
      id: module.id,
      title: module.title,

      // We don't need firstLessonId here yet.
      // Module switching can be implemented separately
      // if required.
      firstLessonId: null,
    })),

    currentModuleId: currentModule.id,

    currentModuleTitle: currentModule.title,

    lessons: moduleLessons.map((item) => ({
      id: item.id,
      title: item.title,
    })),

    // Actual lesson currently being viewed.
    currentLessonId: lesson.id,

    prevLessonId,

    nextLessonId,
  };
}