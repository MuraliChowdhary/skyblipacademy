// src/backend/admin/review.service.ts

import { Errors } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";

const submissionStatuses = [
  "SUBMITTED",
  "IN_REVIEW",
  "APPROVED",
  "CHANGES_REQUESTED",
] as const;

export type SubmissionStatus =
  (typeof submissionStatuses)[number];

export async function listSubmissionsForReview(
  status?: SubmissionStatus,
) {
  return prisma.submission.findMany({
    where: status ? { status } : undefined,

    orderBy: {
      submittedAt: "desc",
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      assignment: {
        select: {
          id: true,
          title: true,
          lessonId: true,
        },
      },
    },
  });
}

export async function reviewSubmission(
  submissionId: string,
  input: {
    status:
      | "IN_REVIEW"
      | "APPROVED"
      | "CHANGES_REQUESTED";
    reviewNote?: string;
  },
) {
  const submission = await prisma.submission.findUnique({
    where: {
      id: submissionId,
    },
  });

  if (!submission) {
    throw Errors.notFound("Submission");
  }

  return prisma.submission.update({
    where: {
      id: submissionId,
    },

    data: {
      status: input.status,
      reviewNote: input.reviewNote,
      reviewedAt: new Date(),
    },
  });
}