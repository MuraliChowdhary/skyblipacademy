import { NextResponse } from "next/server";
import { ZodError } from "zod";

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
 * Safely extracts an error code from an unknown error.
 *
 * We don't use `instanceof PrismaClientKnownRequestError` here because
 * Prisma adapter/runtime errors can cross module boundaries and may not
 * always pass an instanceof check.
 */
function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const code = (error as { code?: unknown }).code;

    return typeof code === "string" ? code : undefined;
  }

  return undefined;
}

/**
 * Determines whether an error means Prisma cannot establish/reach
 * the database connection.
 *
 * P1001 = Can't reach database server
 * P1002 = Database server timed out
 */
export function isDatabaseUnavailableError(
  error: unknown,
): boolean {
  const code = getErrorCode(error);

  return code === "P1001" || code === "P1002";
}

/**
 * Prisma P2002 = unique constraint violation.
 */
export function isUniqueConstraintError(
  error: unknown,
  field?: string,
): boolean {
  if (getErrorCode(error) !== "P2002") {
    return false;
  }

  // If no field is provided, any P2002 is considered unique violation.
  if (!field) {
    return true;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "meta" in error
  ) {
    const meta = (error as {
      meta?: Record<string, unknown>;
    }).meta;

    const target = meta?.target;

    if (Array.isArray(target)) {
      return target.includes(field);
    }
  }

  /*
   * Prisma 7 + driver adapters may not expose meta.target
   * consistently. P2002 is still sufficient to identify the
   * unique constraint violation.
   */
  return true;
}

/**
 * Prisma P2025 = record required but not found.
 */
export function isRecordNotFoundError(
  error: unknown,
): boolean {
  return getErrorCode(error) === "P2025";
}

/**
 * Converts application/infrastructure errors into a consistent
 * HTTP response.
 */
export function handleAllErrors(
  error: unknown,
): Response {
  // Application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      {
        status: error.statusCode,
      },
    );
  }

  // Validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "The request body failed validation.",
          issues: error.issues,
        },
      },
      {
        status: 422,
      },
    );
  }

  // Database unavailable
  if (isDatabaseUnavailableError(error)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_UNAVAILABLE",
          message: "The database is currently unavailable.",
        },
      },
      {
        status: 503,
      },
    );
  }

  // Unique constraint
  if (isUniqueConstraintError(error)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CONFLICT",
          message: "A record with this value already exists.",
        },
      },
      {
        status: 409,
      },
    );
  }

  // Record not found
  if (isRecordNotFoundError(error)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "The requested record was not found.",
        },
      },
      {
        status: 404,
      },
    );
  }

  // Unknown/unexpected error
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong.",
      },
    },
    {
      status: 500,
    },
  );
}