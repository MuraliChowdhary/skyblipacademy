// src/app/api/assignments/[assignmentId]/submissions/route.ts
import { z } from "zod";
import { submitAssignment } from "@/src/backend/services/assignment.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { requireUser } from "@/src/lib/require-user";

const bodySchema = z.object({
  prUrl: z.string().url().refine((u) => u.includes("github.com"), "Must be a GitHub PR URL"),
});

export const POST = withApiHandler<{assignmentId:string}>(async (req, { params }) => {
  const userId = await requireUser();
  const { prUrl } = bodySchema.parse(await req.json());
  const {assignmentId} = await params;
  const submission = await submitAssignment(userId, assignmentId, prUrl);
  return submission;
});