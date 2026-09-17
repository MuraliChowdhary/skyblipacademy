// src/app/(admin)/admin/lessons/[lessonId]/page.ts

import { LessonContentForm } from "@/src/components/admin/lesson-content-form";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { requireRole } from "@/src/lib/require-session";


export default async function AdminLessonEditPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const session = await auth();
    const user = requireRole(session,"ADMIN");

  const { lessonId } = await params;
  const lesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: lessonId },
    include: { Assignment: true, wrapUpKeyTerms: true, wrapUpQuestions: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-xl font-semibold">{lesson.title}</h1>
      <LessonContentForm lesson={lesson} />
    </div>
  );
}