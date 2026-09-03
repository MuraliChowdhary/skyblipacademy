import { Prisma } from "../generated/prisma/client";



/**
 * A known, expected failure with a stable machine-readable `code` — these
 * are the errors the client is meant to branch on ("EMAIL_TAKEN" shows a
 * specific inline message; a raw 500 does not). Anything that isn't an
 * AppError is treated as a bug and gets logged at "error" level with a
 * generic message returned to the client — never leak internals.
 */
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Prisma's P2002 is "unique constraint violated" — this is how we detect
 * that we lost a race to a concurrent request, rather than treating it as
 * an unexpected crash. `field` should match a column in the constraint
 * (Prisma reports the target columns in `meta.target`).
 */
export function isUniqueConstraintError(err: unknown, field: string): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002" &&
    Array.isArray(err.meta?.target) &&
    (err.meta!.target as string[]).includes(field)
  );
}

export function isRecordNotFoundError(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025"
  );
}