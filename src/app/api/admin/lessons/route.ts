// src/app/api/admin/lessons/route.ts
import { createLesson } from "@/src/backend/admin/course-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";

const bodySchema = z.object({
  moduleId: z.string(), parentId: z.string().nullable(), slug: z.string(), title: z.string().min(1),
  order: z.number().int(), kind: z.enum(["STANDALONE", "OVERVIEW", "TOPIC"]).optional(),
});

export const POST = withApiHandler(async (req) => {
  await requireAdmin(await auth());
  const body = bodySchema.parse(await req.json());
  return (await createLesson(body));
});