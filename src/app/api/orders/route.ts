import { auth } from "@/src/lib/auth";
import { requireSession } from "@/src/lib/require-session";
import { withApiHandler } from "@/src/lib/api-handler";
import * as orderService from "@/src/backend/services/order.service";

export const GET = withApiHandler(async () => {
  const user = requireSession(await auth());
  return orderService.listMyOrders(user.id);
});
