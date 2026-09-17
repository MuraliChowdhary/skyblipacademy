import type { Session } from "next-auth";
import { AppError } from "@/src/lib/errors";

export function requireSession(session: Session | null) {
  if (!session?.user) {
    throw new AppError("UNAUTHENTICATED", "Sign in required.", 401);
  }
  return session.user;
}

type Role = "STUDENT" | "ADMIN";

export function requireRole(
  session: Session | null,
  role: Role
) {
  const user = requireSession(session);

  if (user.role !== role) {
    throw new AppError(
      "FORBIDDEN",
      "You do not have permission to access this resource.",
      403
    );
  }

  return user;
}