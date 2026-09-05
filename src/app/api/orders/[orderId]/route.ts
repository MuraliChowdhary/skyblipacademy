import { auth } from "@/src/lib/auth";
import { requireSession } from "@/src/lib/require-session";
import { withApiHandler } from "@/src/lib/api-handler";
import * as orderService from "@/src/backend/services/order.service";

type Params = { orderId: string };

export const GET = withApiHandler<Params>(async (_req, { params }) => {
  const user = requireSession(await auth());
  const { orderId } = await params;
  return orderService.getOrderDetail(orderId, user.id);
});
