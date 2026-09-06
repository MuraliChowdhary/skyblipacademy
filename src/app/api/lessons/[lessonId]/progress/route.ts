import { upsertLessonProgress } from "@/src/backend/services/course-progress.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireSession } from "@/src/lib/require-session";
import { lessonSchema } from "@/src/schema/course.schema";



export const POST = withApiHandler(async (req: Request, ctx: { params: Promise<{ lessonId: string }> }) => {
    const user = await requireSession(await auth());
    const body = lessonSchema.parse(await req.json());
    const { lessonId } = await ctx.params;
    const progress = await upsertLessonProgress(user.id, lessonId, body);
    return progress;
});