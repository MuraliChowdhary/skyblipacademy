// src/backend/services/course-progress.service.ts

import { ProgressStatus } from "@/src/generated/prisma";
import { Errors } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";


export async function getUserCourses(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                where: { parentId: null }, // top-level only — children come via the relation below
                include: {
                  progress: { where: { userId } },
                  children: { include: { progress: { where: { userId } } } },
                },
              },
            },
          },
        },
      },
    },
  });

  return enrollments.map(({ course }) => {
    const leaves = course.modules.flatMap((m) =>
      m.lessons.flatMap((l) => (l.kind === "OVERVIEW" ? l.children : [l]))
    );

    const completed = leaves.filter((l) => l.progress[0]?.status === "COMPLETED").length;
    const last = leaves
      .flatMap((l) => l.progress)
      .sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime())[0];

    return {
      courseId: course.id,
      title: course.title,
      slug: course.slug,
      totalLessons: leaves.length,
      completedLessons: completed,
      lastAccessedLessonId: last?.lessonId ?? null,
    };
  });
}

export async function getCourseDetail(userId: string, courseId: string) {
  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrolled) throw Errors.forbidden();

  const course = await prisma.course.findUniqueOrThrow({
    where: { id: courseId },
    select: { id: true, title: true },
  });

  const modules = await prisma.module.findMany({
    where: { courseId, isPublished: true },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        where: { contentStatus: "PUBLISHED", parentId: null },
        orderBy: { order: "asc" },
        include: { progress: { where: { userId } }, _count: { select: { children: true } } },
      },
    },
  });

  return { course, modules };
}

export async function upsertLessonProgress(
  userId: string,
  lessonId: string,
  input: { status?: ProgressStatus; videoPositionSeconds?: number }
) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { moduleId: true, module: { select: { courseId: true } } },
  });
  if (!lesson) throw Errors.notFound("Lesson");

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.module.courseId } },
  });
  if (!enrolled) throw Errors.forbidden();

  return prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, ...input, lastAccessedAt: new Date() },
    update: { ...input, lastAccessedAt: new Date() },
  });
}

// src/backend/services/course-progress.service.ts
export async function getLessonDetail(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: { select: { courseId: true } },
      progress: { where: { userId } },
      children: {
        orderBy: { order: "asc" },
        where: { contentStatus: "PUBLISHED" },
        include: { progress: { where: { userId } } },
      },
      wrapUpQuestions: { orderBy: { order: "asc" } },
      wrapUpKeyTerms: { orderBy: { order: "asc" } },
    },
  });
  if (!lesson) throw Errors.notFound("Lesson");

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.module.courseId } },
  });
  if (!enrolled) throw Errors.forbidden();

  return {
    id: lesson.id,
    title: lesson.title,
    kind: lesson.kind,
    contentStatus: lesson.contentStatus,
    videoStatus: lesson.videoStatus,
    contentBody:lesson.contentBody,
    videoUrl: lesson.videoStatus === "PUBLISHED" ? lesson.videoUrl : null,
    notionUrl: lesson.notionUrl,
    learningGoals: lesson.learningGoals,
    estimatedMinutes: lesson.estimatedMinutes,
    progress: lesson.progress[0] ?? null,
    topics:
      lesson.kind === "OVERVIEW"
        ? lesson.children.map((child) => ({
            id: child.id,
            title: child.title,
            slug: child.slug,
            status: child.progress[0]?.status ?? "NOT_STARTED",
          }))
        : null,
    wrapUp: {
      keyTakeaways: lesson.keyTakeaways,
      keyTerms: lesson.wrapUpKeyTerms.map((t) => ({ term: t.term, definition: t.definition })),
      questions: lesson.wrapUpQuestions.map((q) => ({ id: q.id, prompt: q.prompt, answer: q.answer })),
    },
  };
}


// src/backend/services/course-progress.service.ts
export async function getLessonBreadcrumb(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } }, parent: true },
  });
  if (!lesson) throw Errors.notFound("Lesson");

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.module.courseId } },
  });
  if (!enrolled) throw Errors.forbidden();

  return {
    course: { id: lesson.module.course.id, title: lesson.module.course.title },
    module: { id: lesson.module.id, title: lesson.module.title },
    parentLesson: lesson.parent ? { id: lesson.parent.id, title: lesson.parent.title } : null,
    lesson: { id: lesson.id, title: lesson.title },
  };
}