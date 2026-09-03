import { prisma } from "@/src/lib/prisma";

export async function listCourses() {
  return prisma.course.findMany({
    where: {
      isPublished: true,
    },

    select: {
      id: true,
      slug: true,
      title: true,
      priceCents: true,
      currency: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
}