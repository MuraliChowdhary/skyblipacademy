// src/app/api/admin/lessons/[lessonId]/key-terms/route.ts
import { addKeyTerm } from "@/src/backend/admin/wrapup-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";


const bodySchema = z.object({ term: z.string().min(1), definition: z.string().min(1) });

export const POST = withApiHandler<{lessonId: string}>(async (req, { params }) => {
  await requireAdmin(await auth());
  const body = bodySchema.parse(await req.json());
  const {lessonId} = await params;
  return await addKeyTerm(lessonId, body);
});