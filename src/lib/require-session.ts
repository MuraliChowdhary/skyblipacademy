import type { Session } from "next-auth";
import { AppError } from "@/src/lib/errors";

export function requireSession(session: Session | null) {
  if (!session?.user) {
    throw new AppError("UNAUTHENTICATED", "Sign in required.", 401);
  }
  return session.user;
}
