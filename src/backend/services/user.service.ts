import { AppError, isUniqueConstraintError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";
import { prisma } from "@/src/lib/prisma";
import { RegisterInput, registerSchema } from "@/src/schema/auth.schema";
import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
  // Argon2id is the current OWASP-recommended KDF for password storage —
  // resistant to both GPU cracking (memory-hard) and side-channel attacks
  // (the "id" variant), and is what any new system should default to.
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    // A malformed hash should fail closed, not throw past the caller.
    return false;
  }
}

/**
 * Registers a new user.
 *
 * Deliberately NOT written as "check if email exists, then create" — that
 * pattern has a race window: two concurrent signups with the same email
 * can both pass the check before either has inserted. Instead we attempt
 * the insert directly and let the database's unique constraint on
 * `email` be the single source of truth, then translate the resulting
 * P2002 into a clean, expected error.
 */
export async function registerUser(input: unknown) {
  const data: RegisterInput = registerSchema.parse(input);
  const passwordHash = await hashPassword(data.password);

  try {
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    logger.info({ userId: user.id }, "user.registered");
    return user;
  } catch (err) {
    if (isUniqueConstraintError(err, "email")) {
      throw new AppError(
        "EMAIL_TAKEN",
        "An account with this email already exists.",
        409,
      );
    }
    throw err;
  }
}