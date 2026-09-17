// src/app/api/admin/key-terms/[termId]/route.ts
import { deleteKeyTerm, updateKeyTerm } from "@/src/backend/admin/wrapup-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";


const bodySchema = z.object({ term: z.string().optional(), definition: z.string().optional() });

export const PATCH = withApiHandler(async (req, { params }) => {
  await requireAdmin(await auth());
  const body = bodySchema.parse(await req.json());
  const {termId} = await params;
  return await updateKeyTerm(termId, body);
});

export const DELETE = withApiHandler<{ termId: string }>(async (_req, { params }) => {
  await requireAdmin(await auth());
  const {termId} = await params;
  await deleteKeyTerm(termId);
  return { deleted: true };
});