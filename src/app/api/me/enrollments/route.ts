import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/require-session";
import { withApiHandler } from "@/src/lib/api-handler";
import * as enrollmentRepository from "@/src/backend/repositories/enrollment.repository";

export const GET = withApiHandler(async () => {
  const user = requireSession(await auth());
  return enrollmentRepository.findManyByUser(prisma, user.id);
});