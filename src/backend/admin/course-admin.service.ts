import { Errors } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";


export async function listCoursesAdmin() {
  return prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true, orders: true } } },
  });
}

export async function createCourse(input: {
  slug: string; title: string; description: string; syllabus?: string;
  priceCents: number; currency?: string;
}) {
  return prisma.course.create({ data: { ...input, currency: input.currency ?? "INR" } });
}

export async function updateCourse(courseId: string, input: Partial<{
  title: string; description: string; syllabus: string; priceCents: number;
  isPublished: boolean;
}>) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw Errors.notFound("Course");
  return prisma.course.update({ where: { id: courseId }, data: input });
}

export async function createModule(courseId: string, input: { title: string; order: number }) {
  return prisma.module.create({ data: { courseId, ...input } });
}

export async function updateModule(moduleId: string, input: Partial<{
  title: string; order: number; isPublished: boolean;
}>) {
  const module_ = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!module_) throw Errors.notFound("Module");
  return prisma.module.update({ where: { id: moduleId }, data: input });
}

export async function createLesson(input: {
  moduleId: string; parentId?: string | null; slug: string; title: string;
  order: number; kind?: "STANDALONE" | "OVERVIEW" | "TOPIC";
}) {
  return prisma.lesson.create({
    data: { ...input, parentId: input.parentId ?? null, kind: input.kind ?? "STANDALONE" },
  });
}

// The two independent toggles are the core of the live-cohort model — kept
// as one function so admin can flip either without touching unrelated fields.
export async function updateLesson(lessonId: string, input: Partial<{
  title: string; order: number; contentStatus: "DRAFT" | "PUBLISHED";
  videoStatus: "NOT_RECORDED" | "EDITING" | "PUBLISHED"; videoUrl: string;
  notionUrl: string; contentBody: string; learningGoals: string[];
  estimatedMinutes: number; keyTakeaways: string[];
}>) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) throw Errors.notFound("Lesson");
  return prisma.lesson.update({ where: { id: lessonId }, data: input });
}

export async function deleteLesson(lessonId: string) {
  const children = await prisma.lesson.count({ where: { parentId: lessonId } });
  if (children > 0) throw Errors.validation("Delete or reassign child topics first");
  await prisma.lesson.delete({ where: { id: lessonId } });
}


// src/backend/services/admin/course-admin.service.ts — add this one function
export async function deleteModule(moduleId: string) {
  const lessonCount = await prisma.lesson.count({ where: { moduleId } });
  if (lessonCount > 0) throw Errors.validation("Delete all lessons in this module first");
  await prisma.module.delete({ where: { id: moduleId } });
}