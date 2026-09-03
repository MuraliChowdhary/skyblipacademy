import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { withApiHandler } from "@/src/lib/api-handler";
import { AppError } from "@/src/lib/errors";

export const GET = withApiHandler(async () => {
  const session = await auth();
  if (!session?.user) {
    throw new AppError("UNAUTHENTICATED", "Sign in to view your enrollments.", 401);
  }

  return prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: { course: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
});