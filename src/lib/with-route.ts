// src/backend/lib/with-route.ts
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { logger } from "./logger";
import { fail } from "./api-response";
import { AppError } from "./errors";

export function withRoute(
  handler: (req: NextRequest, ctx: any) => Promise<Response>
) {
  return async (req: NextRequest, ctx: any) => {
    const requestId = crypto.randomUUID();
    const start = Date.now();
    try {
      const res = await handler(req, ctx);
      logger.info({ requestId, method: req.method, url: req.url, status: res.status, durationMs: Date.now() - start });
      res.headers.set("X-Request-ID", requestId);
      return res;
    } catch (err) {
      if (err instanceof ZodError) {
        return fail("VALIDATION_ERROR", err.issues[0]?.message ?? "Invalid input", 400);
      }
      if (err instanceof AppError) {
        return fail(err.code, err.message, err.statusCode);
      }
      logger.error({ requestId, err }, "Unhandled route error");
      return fail("INTERNAL_ERROR", "Something went wrong", 500);
    }
  };
}