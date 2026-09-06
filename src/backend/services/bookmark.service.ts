import { BookmarkType } from "@/src/generated/prisma";
import { Errors } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";



export async function getUserBookmarks(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      lesson: { select: { id: true, title: true, module: { select: { course: { select: { id: true, title: true } } } } } },
    },
  });

  return bookmarks.map((b) => ({
    id: b.id,
    type: b.type,
    videoTimestampSeconds: b.videoTimestampSeconds,
    sectionAnchor: b.sectionAnchor,
    note: b.note,
    createdAt: b.createdAt,
    lesson: { id: b.lesson.id, title: b.lesson.title },
    course: b.lesson.module.course,
  }));
}

async function assertEnrolled(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { module: { select: { courseId: true } } },
  });
  if (!lesson) throw Errors.notFound("Lesson");

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.module.courseId } },
  });
  if (!enrolled) throw Errors.forbidden();
}

export async function createBookmark(
  userId: string,
  input: { lessonId: string; type: BookmarkType; videoTimestampSeconds?: number; sectionAnchor?: string; note?: string }
) {
  await assertEnrolled(userId, input.lessonId);
  return prisma.bookmark.create({ data: { userId, ...input } });
}

export async function deleteBookmark(userId: string, bookmarkId: string) {
  const bookmark = await prisma.bookmark.findUnique({ where: { id: bookmarkId } });
  if (!bookmark || bookmark.userId !== userId) throw Errors.notFound("Bookmark");
  await prisma.bookmark.delete({ where: { id: bookmarkId } });
}