// src/app/api/me/bookmarks/route.ts
import { z } from "zod";
import { getUserBookmarks, createBookmark } from "@/src/backend/services/bookmark.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { requireUser } from "@/src/lib/require-user";

export const GET = withApiHandler(async () => {
  const userId = await requireUser();
  return await getUserBookmarks(userId);
});

const bodySchema = z.object({
  lessonId: z.string(),
  type: z.enum(["VIDEO_TIMESTAMP", "CONTENT_SECTION"]),
  videoTimestampSeconds: z.number().int().min(0).optional(),
  sectionAnchor: z.string().optional(),
  note: z.string().optional(),
});

export const POST = withApiHandler(async (req) => {
  const userId = await requireUser();
  const body = bodySchema.parse(await req.json());
  return await createBookmark(userId, body);
});