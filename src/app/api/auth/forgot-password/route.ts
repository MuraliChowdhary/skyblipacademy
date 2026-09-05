import { withApiHandler } from "@/src/lib/api-handler";
import { requestPasswordReset } from "@/src/backend/services/user.service";

export const POST = withApiHandler(async (req) => {
  const body = await req.json();
  return requestPasswordReset(body);
});