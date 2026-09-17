import { getPlatformOverview } from "@/src/backend/admin/analytics.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";


export const GET = withApiHandler(async () => {
  await requireAdmin(await auth());
  return await getPlatformOverview();
});