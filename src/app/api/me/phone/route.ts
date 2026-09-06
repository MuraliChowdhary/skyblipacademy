import { auth } from "@/src/lib/auth";
import * as accountService from "@/src/backend/services/account.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { requireSession } from "@/src/lib/require-session";

export const PATCH = withApiHandler(async (req) => {
  const user = requireSession(await auth());

  const body = await req.json();

  return accountService.updatePhone(
    user.id,
    body,
  );
});