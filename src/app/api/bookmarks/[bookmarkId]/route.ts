
import { deleteBookmark } from "@/src/backend/services/bookmark.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { requireUser } from "@/src/lib/require-user";

export const DELETE = withApiHandler<{ bookmarkId: string }>(async (_req, { params }) => {
  const userId = await requireUser();
  const {bookmarkId} = await params;
  await deleteBookmark(userId, bookmarkId);
  return  {deleted: true };
});