import { getUserHistory } from "@/src/backend/services/history.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { requireUser } from "@/src/lib/require-user";


export const GET = withApiHandler(async () => {
  const userId = await requireUser();
  return await getUserHistory(userId);
});