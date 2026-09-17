// src/backend/services/admin/wrapup-admin.service.ts

import { Errors } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";


export async function setKeyTakeaways(lessonId: string, keyTakeaways: string[]) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) throw Errors.notFound("Lesson");
  return prisma.lesson.update({ where: { id: lessonId }, data: { keyTakeaways } });
}

export async function addKeyTerm(lessonId: string, input: { term: string; definition: string }) {
  const count = await prisma.wrapUpKeyTerm.count({ where: { lessonId } });
  return prisma.wrapUpKeyTerm.create({ data: { lessonId, order: count + 1, ...input } });
}

export async function updateKeyTerm(id: string, input: { term?: string; definition?: string }) {
  return prisma.wrapUpKeyTerm.update({ where: { id }, data: input });
}

export async function deleteKeyTerm(id: string) {
  await prisma.wrapUpKeyTerm.delete({ where: { id } });
}

export async function addQuestion(lessonId: string, input: { prompt: string; answer: string }) {
  const count = await prisma.wrapUpQuestion.count({ where: { lessonId } });
  return prisma.wrapUpQuestion.create({ data: { lessonId, order: count + 1, ...input } });
}

export async function updateQuestion(id: string, input: { prompt?: string; answer?: string }) {
  return prisma.wrapUpQuestion.update({ where: { id }, data: input });
}

export async function deleteQuestion(id: string) {
  await prisma.wrapUpQuestion.delete({ where: { id } });
}