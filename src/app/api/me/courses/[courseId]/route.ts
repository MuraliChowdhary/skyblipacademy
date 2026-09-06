
import { getCourseDetail } from "@/src/backend/services/course-progress.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireSession } from "@/src/lib/require-session";


export const GET = withApiHandler(async (_req: Request, { params }: { params: Promise<{ courseId: string }> }) => {
  const user = await requireSession(await auth());
  const { courseId } = await params;
  const modules = await getCourseDetail(user.id, courseId);
  return modules;
});