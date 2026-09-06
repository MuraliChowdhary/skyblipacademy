import { getUserCourses } from "@/src/backend/services/course-progress.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireSession } from "@/src/lib/require-session";


export const GET = withApiHandler(async () =>  {
  const user = await requireSession(await auth());
  const courses = await getUserCourses(user.id);
  return courses;
});