import { listCourses } from "@/src/backend/courses/list.courses";
import { withApiHandler } from "@/src/lib/api-handler";

export const GET = withApiHandler(async () => {
  const courses = await listCourses();

  return courses;
});