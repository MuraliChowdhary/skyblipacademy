// src/app/api/admin/lessons/[lessonId]/key-takeaways/route.ts
import { setKeyTakeaways } from "@/src/backend/admin/wrapup-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";


export const PUT = withApiHandler<{ lessonId: string }>(async (req, { params }) => {
  await requireAdmin(await auth());
  const { keyTakeaways } = z.object({ keyTakeaways: z.array(z.string()) }).parse(await req.json());
  const {lessonId} = await params;
  return await setKeyTakeaways(lessonId, keyTakeaways);
});