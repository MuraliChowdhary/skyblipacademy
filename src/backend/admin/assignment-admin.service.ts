import { prisma } from "@/src/lib/prisma";


export async function upsertAssignment(lessonId: string, input: {
  title: string; tier: "INLINE" | "REPO" | "OPEN_ENDED"; instructions: string; starterRepoUrl?: string | null;
}) {
  return prisma.assignment.upsert({
    where: { lessonId },
    create: { lessonId, ...input },
    update: input,
  });
}

export async function deleteAssignment(lessonId: string) {
  await prisma.assignment.delete({ where: { lessonId } }).catch(() => null); // no-op if none exists
}