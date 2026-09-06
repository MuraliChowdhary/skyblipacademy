import { auth } from "@/src/lib/auth";
import * as accountService from "@/src/backend/services/account.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { requireSession } from "@/src/lib/require-session";

export const GET = withApiHandler(async () => {
  const user = requireSession(await auth());

  return accountService.getConnectedAccounts(
    user.id,
  );
});