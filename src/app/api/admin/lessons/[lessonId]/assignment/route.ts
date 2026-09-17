// src/app/api/admin/lessons/[lessonId]/assignment/route.ts
import { deleteAssignment, upsertAssignment } from "@/src/backend/admin/assignment-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";


const bodySchema = z.object({
  title: z.string().min(1), tier: z.enum(["INLINE", "REPO", "OPEN_ENDED"]),
  instructions: z.string().min(1), starterRepoUrl: z.string().url().optional().nullable(),
});

export const PUT = withApiHandler<{ lessonId: string }>(async (req, { params }) => {
  await requireAdmin(await auth());
  const body = bodySchema.parse(await req.json());
  const {lessonId} = await params;
  return await upsertAssignment(lessonId, body);
});

export const DELETE = withApiHandler<{ lessonId: string }>(async (_req, { params }) => {
  await requireAdmin(await auth());
   const {lessonId} = await params;
  await deleteAssignment(lessonId);
  return { deleted: true };
});