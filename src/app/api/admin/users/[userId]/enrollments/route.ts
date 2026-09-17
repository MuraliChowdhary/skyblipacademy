// src/app/api/admin/users/[userId]/enrollments/route.ts
import { grantEnrollment } from "@/src/backend/admin/user-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";


export const POST = withApiHandler<{userId: string}>(async (req, { params }) => {
  const user = await requireAdmin(await auth());
  const { courseId } = z.object({ courseId: z.string() }).parse(await req.json());
  const {userId} = await params;
  return await grantEnrollment(user.id,courseId);
});