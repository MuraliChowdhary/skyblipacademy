// src/app/api/lessons/[lessonId]/assignment/route.ts

import { getLessonAssignment } from "@/src/backend/services/assignment.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { requireUser } from "@/src/lib/require-user";

export const GET = withApiHandler<{ lessonId: string }>(async (_req, { params }) => {
  const userId = await requireUser();
  const {lessonId} = await params;
  const assignment = await getLessonAssignment(userId, lessonId);
  return assignment;
});