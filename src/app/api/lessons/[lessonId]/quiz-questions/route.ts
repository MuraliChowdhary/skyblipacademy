// src/app/api/admin/lessons/[lessonId]/quiz-questions/route.ts
import { addQuizQuestion } from "@/src/backend/services/quiz-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";

const bodySchema = z.object({
  prompt: z.string().min(1),
  options: z.array(z.object({ id: z.string(), text: z.string().min(1) })).min(2),
  correctOptionId: z.string(),
  explanation: z.string().min(1),
  hint: z.string().optional(),
});

export const POST = withApiHandler<{ lessonId: string }>(async (req, { params }) => {
  await requireAdmin(await auth());
  const body = bodySchema.parse(await req.json());
  const {lessonId} = await params;
  return (await addQuizQuestion(lessonId, body));
});