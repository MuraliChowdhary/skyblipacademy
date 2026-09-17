// src/app/api/admin/submissions/route.ts

import { listSubmissionsForReview } from "@/src/backend/admin/review.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";


export const GET = withApiHandler(async (req) => {
  await requireAdmin(await auth());
  const status = new URL(req.url).searchParams.get("status") ?? undefined;
  return await listSubmissionsForReview(status);
});