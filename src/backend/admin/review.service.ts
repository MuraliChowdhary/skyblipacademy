// src/backend/services/admin/review.service.ts

import { Errors } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";


export async function listSubmissionsForReview(status?: string) {
  return prisma.submission.findMany({
    where: status ? { status: status as any } : { status: { in: ["SUBMITTED", "IN_REVIEW"] } },
    orderBy: { submittedAt: "asc" }, // oldest-first — fairness queue
    include: {
      user: { select: { id: true, name: true, email: true } },
      assignment: { select: { id: true, title: true, lessonId: true } },
    },
  });
}

export async function reviewSubmission(
  submissionId: string,
  input: { status: "IN_REVIEW" | "APPROVED" | "CHANGES_REQUESTED"; reviewNote?: string }
) {
  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!submission) throw Errors.notFound("Submission");

  return prisma.submission.update({
    where: { id: submissionId },
    data: { ...input, reviewedAt: new Date() },
  });
}