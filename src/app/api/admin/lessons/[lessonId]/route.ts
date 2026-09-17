// src/app/api/admin/lessons/[lessonId]/route.ts
import { deleteLesson, updateLesson } from "@/src/backend/admin/course-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";


const updateSchema = z.object({
  title: z.string().optional(),
  order: z.number().int().optional(),
  contentStatus: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  videoStatus: z.enum(["NOT_RECORDED", "EDITING", "PUBLISHED"]).optional(),
  videoUrl: z.string().url().optional(),
  notionUrl: z.string().url().optional(),
  contentBody: z.string().optional(),
  learningGoals: z.array(z.string()).optional(),
  estimatedMinutes: z.number().int().optional(),
  keyTakeaways: z.array(z.string()).optional(),
});

export const PATCH = withApiHandler<{ lessonId: string }>(async (req, { params }) => {
  await requireAdmin(await auth());
  const body = updateSchema.parse(await req.json());
  const {lessonId} = await params;
  return await updateLesson(lessonId, body);
});

export const DELETE = withApiHandler<{ lessonId: string }>(async (_req, { params }) => {
  await requireAdmin(await auth());
  const {lessonId} =  await params;
  await deleteLesson(lessonId);
  return { deleted: true };
});


