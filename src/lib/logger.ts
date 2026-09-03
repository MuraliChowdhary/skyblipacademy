import pino from "pino";

// Structured JSON logs, one object per line — this is what lets you
// actually query logs in production (by requestId, userId, orderId)
// instead of grepping strings. Redaction is not optional: a password
// or session token in a log line is a breach waiting to be discovered.
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: [
      "*.password",
      "*.passwordHash",
      "req.headers.authorization",
      "req.headers.cookie",
      "*.token",
    ],
    censor: "[redacted]",
  },
  base: { service: "skyblip-api" },
});

export type Logger = typeof logger;