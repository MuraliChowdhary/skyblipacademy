// src/app/api/admin/modules/[moduleId]/route.ts
import { deleteModule, updateModule } from "@/src/backend/admin/course-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";


const updateSchema = z.object({
  title: z.string().optional(), order: z.number().int().optional(), isPublished: z.boolean().optional(),
});

export const PATCH = withApiHandler<{ moduleId: string }>(async (req, { params }) => {
  await requireAdmin(await auth());
  const body = updateSchema.parse(await req.json());
  const {moduleId} = await params;
  return await updateModule(moduleId, body);
});

export const DELETE = withApiHandler<{moduleId: string}>(async (_req, { params }) => {
  await requireAdmin(await auth());
  const {moduleId} = await params; 
  await deleteModule(moduleId);
  return { deleted: true };
});