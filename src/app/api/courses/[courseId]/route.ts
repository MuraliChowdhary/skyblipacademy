import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { withApiHandler } from "@/src/lib/api-handler";
import * as courseService from "@/src/backend/services/course.service";

type Params = { courseId: string };

export const GET = withApiHandler<Params>(async (_req, { params }) => {
  const session = await auth();
  const { courseId } = await params;
  return courseService.getCourseDetail(courseId, session?.user?.role);
});

export const PATCH = withApiHandler<Params>(async (req, { params }) => {
  requireAdmin(await auth());
  const { courseId } = await params;
  const body = await req.json();
  return courseService.updateCourse(courseId, body);
});

export const DELETE = withApiHandler<Params>(async (_req, { params }) => {
  requireAdmin(await auth());
  const { courseId } = await params;
  return courseService.unpublishCourse(courseId);
});
