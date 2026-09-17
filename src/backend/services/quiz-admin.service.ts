// src/backend/services/admin/quiz-admin.service.ts

import { prisma } from "@/src/lib/prisma";

export async function addQuizQuestion(lessonId: string, input: {
  prompt: string; options: { id: string; text: string }[]; correctOptionId: string;
  explanation: string; hint?: string;
}) {
  const count = await prisma.quizQuestion.count({ where: { lessonId } });
  return prisma.quizQuestion.create({ data: { lessonId, order: count + 1, ...input } });
}

export async function updateQuizQuestion(id: string, input: Partial<{
  prompt: string; options: { id: string; text: string }[]; correctOptionId: string;
  explanation: string; hint: string;
}>) {
  return prisma.quizQuestion.update({ where: { id }, data: input });
}

export async function deleteQuizQuestion(id: string) {
  await prisma.quizQuestion.delete({ where: { id } });
}