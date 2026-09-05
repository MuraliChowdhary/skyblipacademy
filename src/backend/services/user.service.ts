import crypto from "node:crypto";
import argon2 from "argon2";
import { prisma } from "@/src/lib/prisma";
import { logger } from "@/src/lib/logger";
import { AppError, isUniqueConstraintError } from "@/src/lib/errors";
import { registerSchema, type RegisterInput } from "@/src/schema/auth.schema";
import {
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/src/schema/user.schema";
import { sendPasswordResetEmail } from "@/src/lib/mailer";
import * as userRepository from "@/src/backend/repositories/user.repository";
import * as verificationTokenRepository from '@/src/backend/repositories/verification-token.repository';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

/**
 * Deliberately NOT "check if email exists, then create" — that has a
 * race window between two concurrent signups with the same email.
 * Attempts the insert directly and lets the database's unique
 * constraint be the single source of truth.
 */
export async function registerUser(input: unknown) {
  const data: RegisterInput = registerSchema.parse(input);
  const passwordHash = await hashPassword(data.password);

  try {
    const user = await userRepository.create(prisma, {
      name: data.name,
      email: data.email,
      passwordHash,
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

// Used only by lib/auth.ts's Credentials authorize() — keeps NextAuth
// config decoupled from the repository/Prisma layer entirely.
export async function findUserByEmail(email: string) {
  return userRepository.findByEmail(prisma, email);
}

export async function getProfile(userId: string) {
  const user = await userRepository.findById(prisma, userId);
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found.", 404);
  }
  return user;
}

// Deliberately name-only for now — email is tied to login identity, so
// changing it needs its own re-verification flow (confirm the new
// address before it takes effect), not a plain field update. Scoped out
// until that flow exists rather than shipping an unverified email change.
export async function updateProfile(userId: string, input: unknown) {
  const data = updateProfileSchema.parse(input);
  return userRepository.updateName(prisma, userId, data.name);
}

export async function changePassword(userId: string, input: unknown) {
  const data = changePasswordSchema.parse(input);

  const user = await userRepository.findByIdWithPasswordHash(prisma, userId);
  if (!user?.passwordHash) {
    throw new AppError(
      "NO_PASSWORD_SET",
      "This account has no password set — it was likely created via a social login.",
      400,
    );
  }

  const valid = await verifyPassword(data.currentPassword, user.passwordHash);
  if (!valid) {
    throw new AppError("INVALID_CURRENT_PASSWORD", "Current password is incorrect.", 400);
  }

  const newHash = await hashPassword(data.newPassword);
  await userRepository.updatePasswordHash(prisma, userId, newHash);
  logger.info({ userId }, "user.password_changed");
  return { success: true };
}

/**
 * Always returns the same generic response whether or not the email is
 * registered — same "don't reveal which emails exist" reasoning as
 * login. The raw token is only ever sent by email, never returned here;
 * only its SHA-256 hash is stored, so a leaked/logged DB row can't be
 * used to reset anyone's password.
 */
export async function requestPasswordReset(input: unknown) {
  const { email } = forgotPasswordSchema.parse(input);
  const user = await userRepository.findByEmail(prisma, email);

  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");

    // One valid link at a time — a new request invalidates any earlier,
    // unused one rather than letting several stay redeemable at once.
    await verificationTokenRepository.deleteByIdentifier(prisma, email);
    await verificationTokenRepository.create(prisma, {
      identifier: email,
      token: hashToken(rawToken),
      expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    const resetUrl = `${process.env.APP_URL}/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail(email, resetUrl);
    logger.info({ userId: user.id }, "user.password_reset_requested");
  }

  return {
    success: true,
    message: "If that email is registered, a reset link has been sent.",
  };
}

export async function resetPassword(input: unknown) {
  const { token, newPassword } = resetPasswordSchema.parse(input);
  const record = await verificationTokenRepository.findByToken(prisma, hashToken(token));

  if (!record || record.expires < new Date()) {
    throw new AppError(
      "INVALID_OR_EXPIRED_TOKEN",
      "This reset link is invalid or has expired.",
      400,
    );
  }

  const user = await userRepository.findByEmail(prisma, record.identifier);
  if (!user) {
    // User deleted after requesting a reset — same generic error, not a
    // confusing 404 about an account the caller was never told existed.
    throw new AppError(
      "INVALID_OR_EXPIRED_TOKEN",
      "This reset link is invalid or has expired.",
      400,
    );
  }

  const passwordHash = await hashPassword(newPassword);
  await userRepository.updatePasswordHash(prisma, user.id, passwordHash);

  // Single-use: burn this token and any other outstanding ones for this
  // email the moment a reset actually succeeds.
  await verificationTokenRepository.deleteByIdentifier(prisma, record.identifier);

  logger.info({ userId: user.id }, "user.password_reset_completed");
  return { success: true };
}