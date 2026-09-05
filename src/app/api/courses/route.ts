import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { withApiHandler } from "@/src/lib/api-handler";
import * as courseService from "@/src/backend/services/course.service";

export const GET = withApiHandler(async () => {
  return courseService.listPublishedCourses();
});

export const POST = withApiHandler(async (req) => {
  requireAdmin(await auth());
  const body = await req.json();
  return courseService.createCourse(body);
});