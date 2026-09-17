// src/app/api/admin/users/[userId]/enrollments/[courseId]/route.ts

import { revokeEnrollment } from "@/src/backend/admin/user-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";


export const DELETE = withApiHandler< { userId: string; courseId: string }>(async (_req, { params } ) => {
  const user = await requireAdmin(await auth());
  const {courseId} = await params;
  await revokeEnrollment(user.id, courseId);
  return { revoked: true };
});