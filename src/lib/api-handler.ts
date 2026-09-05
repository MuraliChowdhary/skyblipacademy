import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { handleAllErrors } from "./errors";
import { logger, type Logger } from "./logger";

type RouteContext<P> = {
  params: Promise<P>;
};

type Handler<P, T> = (
  req: Request,
  ctx: RouteContext<P>,
  log: Logger,
) => Promise<T>;

export function withApiHandler<
  P = Record<string, string>,
  T = unknown,
>(
  handler: Handler<P, T>,
) {
  return async (
    req: Request,
    ctx: RouteContext<P>,
  ): Promise<Response> => {
    const requestId = crypto.randomUUID();

    const log = logger.child({
      requestId,
      method: req.method,
      url: req.url,
    });

    try {
      const data = await handler(req, ctx, log);

      return NextResponse.json(
        {
          success: true,
          data,
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      console.log("ERROR:", error);

      log.error(
        { err: error },
        "request.error",
      );

      // handleAllErrors already returns a Response
      return handleAllErrors(error);
    }
  };
}