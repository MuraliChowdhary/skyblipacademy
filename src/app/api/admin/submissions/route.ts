// src/app/api/admin/submissions/route.ts

import { listSubmissionsForReview } from "@/src/backend/admin/review.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";

const statusSchema = z.enum([
  "SUBMITTED",
  "IN_REVIEW",
  "APPROVED",
  "CHANGES_REQUESTED",
]);

export const GET = withApiHandler(async (req) => {
  await requireAdmin(await auth());

  const statusParam = new URL(req.url).searchParams.get("status");

  const status = statusParam
    ? statusSchema.parse(statusParam)
    : undefined;

  return await listSubmissionsForReview(status);
});