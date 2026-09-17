// src/app/api/admin/submissions/[submissionId]/review/route.ts
import { reviewSubmission } from "@/src/backend/admin/review.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";


const bodySchema = z.object({
  status: z.enum(["IN_REVIEW", "APPROVED", "CHANGES_REQUESTED"]),
  reviewNote: z.string().optional(),
});

export const POST = withApiHandler< { submissionId: string }>(async (req, { params }) => {
  await requireAdmin(await auth());
  const body = bodySchema.parse(await req.json());
  const {submissionId} = await params;
  return await reviewSubmission(submissionId, body);
});