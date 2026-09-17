// src/app/api/admin/analytics/overview/route.ts

import { getCourseAnalytics } from "@/src/backend/admin/analytics.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";


export const GET = withApiHandler<{courseId : string}>(async (req,{params}) => {
  await requireAdmin(await auth());
  const {courseId} = await params;
  return await getCourseAnalytics(courseId);
});