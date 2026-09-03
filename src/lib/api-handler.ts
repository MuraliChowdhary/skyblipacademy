import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";
import { logger, Logger } from "./logger";
import { ApiResponse } from "../types/api";

type RouteContext<P> = { params: Promise<P> };
type Handler<P, T> = (
  req: Request,
  ctx: RouteContext<P>,
  log: Logger,
) => Promise<T>;

/**
 * Wraps a route handler so every endpoint gets, without repeating itself:
 *  - a request-scoped logger carrying a requestId for correlation
 *  - one consistent success/error JSON envelope
 *  - correct HTTP status + stable error `code` for every known failure
 *  - unknown errors logged loudly but never leaked to the client
 */
export function withApiHandler<P = Record<string, string>, T = unknown>(
  handler: Handler<P, T>,
) {
  return async (
    req: Request,
    ctx: RouteContext<P>,
  ): Promise<NextResponse<ApiResponse<T>>> => {
    const requestId = crypto.randomUUID();
    const log = logger.child({ requestId, method: req.method, url: req.url });

    try {
      const data = await handler(req, ctx, log);
      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
      if (err instanceof AppError) {
        log.warn({ code: err.code }, "request.expected_error");
        return NextResponse.json(
          { success: false, error: { code: err.code, message: err.message } },
          { status: err.statusCode },
        );
      }

      if (err instanceof ZodError) {
        log.warn({ issues: err.issues }, "request.validation_error");
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "The request body failed validation.",
              issues: err.issues,
            },
          },
          { status: 422 },
        );
      }

      log.error({ err }, "request.unhandled_error");
      return NextResponse.json(
        {
          success: false,
          error: { code: "INTERNAL_ERROR", message: "Something went wrong." },
        },
        { status: 500 },
      );
    }
  };
}