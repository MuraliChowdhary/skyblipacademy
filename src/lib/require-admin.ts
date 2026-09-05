import type { Session } from "next-auth";
import { AppError } from "@/src/lib/errors";

export function requireAdmin(session: Session | null) {
  if (!session?.user) {
    throw new AppError("UNAUTHENTICATED", "Sign in required.", 401);
  }
  if (session.user.role !== "ADMIN") {
    throw new AppError("FORBIDDEN", "Admin access required.", 403);
  }
  return session.user;
}
