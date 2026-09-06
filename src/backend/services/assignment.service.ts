import { Errors } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";


export async function getLessonAssignment(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { module: { select: { courseId: true } } },
  });
  if (!lesson) throw Errors.notFound("Lesson");

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.module.courseId } },
  });
  if (!enrolled) throw Errors.forbidden();

  const assignment = await prisma.assignment.findUnique({
    where: { lessonId },
    include: { submissions: { where: { userId } } },
  });
  if (!assignment) return null; // no assignment on this lesson yet — not an error

  return {
    id: assignment.id,
    title: assignment.title,
    tier: assignment.tier,
    instructions: assignment.instructions,
    starterRepoUrl: assignment.starterRepoUrl,
    submission: assignment.submissions[0] ?? null,
  };
}

export async function submitAssignment(userId: string, assignmentId: string, prUrl: string) {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { lesson: { select: { module: { select: { courseId: true } } } } },
  });
  if (!assignment) throw Errors.notFound("Assignment");

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: assignment.lesson.module.courseId } },
  });
  if (!enrolled) throw Errors.forbidden();

  // Resubmission overwrites the PR link and resets to SUBMITTED — a stale
  // "changes requested" verdict shouldn't linger against a brand-new PR.
  return prisma.submission.upsert({
    where: { userId_assignmentId: { userId, assignmentId } },
    create: { userId, assignmentId, prUrl },
    update: { prUrl, status: "SUBMITTED", reviewNote: null, reviewedAt: null, submittedAt: new Date() },
  });
}