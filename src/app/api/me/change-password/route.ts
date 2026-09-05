import { auth } from "@/src/lib/auth";
import { withApiHandler } from "@/src/lib/api-handler";
import * as userService from "@/src/backend/services/user.service";
import { requireSession } from "@/src/lib/require-session";

export const POST = withApiHandler(async (req) => {
  const user = requireSession(await auth());
  const body = await req.json();
  return userService.changePassword(user.id, body);
});