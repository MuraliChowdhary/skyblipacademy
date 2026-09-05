// src/backend/lib/app-error.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export const Errors = {
  unauthorized: () => new AppError("UNAUTHORIZED", "Sign in required", 401),
  notFound: (what: string) => new AppError("NOT_FOUND", `${what} not found`, 404),
  forbidden: () => new AppError("FORBIDDEN", "Not allowed", 403),
  validation: (message: string) => new AppError("VALIDATION_ERROR", message, 400),
};