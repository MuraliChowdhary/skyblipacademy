import { getLessonDetail } from "@/src/backend/services/course-progress.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireSession } from "@/src/lib/require-session";


export const GET = withApiHandler<{ lessonId: string }>(async (_req, { params }) => {
  const user = await requireSession(await auth());
  const { lessonId } = await params;
  const lesson = await getLessonDetail(user.id, lessonId);
  return lesson;
});