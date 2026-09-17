// src/app/api/admin/quiz-questions/[questionId]/route.ts
import { deleteQuizQuestion, updateQuizQuestion } from "@/src/backend/services/quiz-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";


const bodySchema = z.object({
  prompt: z.string().optional(),
  options: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
  correctOptionId: z.string().optional(),
  explanation: z.string().optional(),
  hint: z.string().optional(),
});

export const PATCH = withApiHandler<{ questionId: string } >(async (req, { params }) => {
  await requireAdmin(await auth());
  const body = bodySchema.parse(await req.json());
  const {questionId} = await params;
  return (await updateQuizQuestion(questionId, body));
});

export const DELETE = withApiHandler<{ questionId: string }>(async (_req, { params }) => {
  await requireAdmin(await auth());
   const {questionId} = await params;
  await deleteQuizQuestion(questionId);
  return ({ deleted: true });
});