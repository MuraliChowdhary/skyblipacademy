import crypto from "node:crypto";

import { prisma } from "@/src/lib/prisma";
import {
  updateProfileSchema,
  updateBillingSchema,
  changeEmailSchema,
  updatePhoneSchema,
  deleteAccountSchema,
  verifyEmailChangeSchema,
  type UpdateProfileInput,
  type UpdateBillingInput,
  type ChangeEmailInput,
  type UpdatePhoneInput,
  type DeleteAccountInput,
  type VerifyEmailChangeInput,
} from "@/src/schema/account";

import * as userRepository from "@/src/backend/repositories/user.repository";
import * as billingRepository from "@/src/backend/repositories/billing.repository";
import * as sessionRepository from "@/src/backend/repositories/session.repository";
import * as accountRepository from "@/src/backend/repositories/account.repository";
import * as verificationRepository from "@/src/backend/repositories/verification-token.repository";

import { AppError } from "@/src/lib/app-error";
import argon2 from 'argon2';

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
) {
  const data = updateProfileSchema.parse(input);

  return userRepository.updateName(
    prisma,
    userId,
    data.name,
  );
}

export async function getBilling(
  userId: string,
) {
  return billingRepository.findByUserId(
    prisma,
    userId,
  );
}

export async function updateBilling(
  userId: string,
  input: UpdateBillingInput,
) {
  const data = updateBillingSchema.parse(input);

  return billingRepository.upsert(
    prisma,
    userId,
    data,
  );
}

export async function updatePhone(
  userId: string,
  input: UpdatePhoneInput,
) {
  const data = updatePhoneSchema.parse(input);

  return userRepository.updatePhone(
    prisma,
    userId,
    data.phone,
  );
}

export async function requestEmailChange(
  userId: string,
  input: ChangeEmailInput,
) {
  const data = changeEmailSchema.parse(input);

  const currentUser =
    await userRepository.findById(
      prisma,
      userId,
    );

  if (!currentUser) {
    throw new AppError(
      "USER_NOT_FOUND",
      "User not found.",
      404,
    );
  }

  if (
    currentUser.email.toLowerCase() ===
    data.newEmail.toLowerCase()
  ) {
    throw new AppError(
      "EMAIL_UNCHANGED",
      "The new email is the same as your current email.",
      400,
    );
  }

  const existing =
    await userRepository.findByEmail(
      prisma,
      data.newEmail,
    );

  if (existing) {
    throw new AppError(
      "EMAIL_ALREADY_IN_USE",
      "That email address is already in use.",
      409,
    );
  }

  const rawToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const identifier = `email-change:${userId}`;

  await verificationRepository.deleteByIdentifier(
    prisma,
    identifier,
  );

  await verificationRepository.create(
    prisma,
    {
      identifier,
      token: tokenHash,
      expires: new Date(
        Date.now() + 30 * 60 * 1000,
      ),
    },
  );

  // TODO:
  // Send email containing rawToken.
  //
  // Example:
  // https://your-domain.com/account/verify-email?token=...

  return {
    success: true,
  };
}

export async function verifyEmailChange(
  userId: string,
  input: VerifyEmailChangeInput,
) {
  const data = verifyEmailChangeSchema.parse(input);

  const tokenHash = crypto
    .createHash("sha256")
    .update(data.token)
    .digest("hex");

  const identifier = `email-change:${userId}`;

  const verification =
    await verificationRepository.findByIdentifier(
      prisma,
      identifier,
    );

  if (!verification) {
    throw new AppError(
      "INVALID_EMAIL_TOKEN",
      "This email verification link is invalid or has expired.",
      400,
    );
  }

  if (verification.token !== tokenHash) {
    throw new AppError(
      "INVALID_EMAIL_TOKEN",
      "This email verification link is invalid or has expired.",
      400,
    );
  }

  // The token itself does not tell us the new email.
  //
  // Therefore, for this flow, the pending email must be
  // stored somewhere. With your current schema there is
  // nowhere safe to store it.
}

export async function getSessions(
  userId: string,
) {
  return sessionRepository.findByUserId(
    prisma,
    userId,
  );
}

export async function revokeSession(
  userId: string,
  sessionId: string,
) {
  const session =
    await sessionRepository.findById(
      prisma,
      sessionId,
    );

  if (!session || session.userId !== userId) {
    throw new AppError(
      "SESSION_NOT_FOUND",
      "Session not found.",
      404,
    );
  }

  await sessionRepository.deleteById(
    prisma,
    sessionId,
  );

  return {
    success: true,
  };
}

export async function revokeOtherSessions(
  userId: string,
  currentSessionId: string,
) {
  await sessionRepository.deleteOtherSessions(
    prisma,
    userId,
    currentSessionId,
  );

  return {
    success: true,
  };
}

export async function getConnectedAccounts(
  userId: string,
) {
  return accountRepository.findByUserId(
    prisma,
    userId,
  );
}

export async function disconnectAccount(
  userId: string,
  accountId: string,
) {
  const account =
    await accountRepository.findById(
      prisma,
      accountId,
    );

  if (!account || account.userId !== userId) {
    throw new AppError(
      "ACCOUNT_NOT_FOUND",
      "Connected account not found.",
      404,
    );
  }

  const user =
    await userRepository.findByIdWithPasswordHash(
      prisma,
      userId,
    );

  if (!user) {
    throw new AppError(
      "USER_NOT_FOUND",
      "User not found.",
      404,
    );
  }

  /**
   * Don't allow the user to disconnect their
   * final authentication method.
   */
  const connectedAccounts =
    await accountRepository.findByUserId(
      prisma,
      userId,
    );

  if (
    connectedAccounts.length === 1 &&
    !user.passwordHash
  ) {
    throw new AppError(
      "LAST_AUTH_METHOD",
      "You cannot disconnect your only sign-in method.",
      400,
    );
  }

  await accountRepository.deleteById(
    prisma,
    accountId,
  );

  return {
    success: true,
  };
}

export async function getAccountInfo(
  userId: string,
) {
  const user = await userRepository.findById(
    prisma,
    userId,
  );

  if (!user) {
    throw new AppError(
      "USER_NOT_FOUND",
      "User not found.",
      404,
    );
  }

  return {
    id: user.id,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function exportAccountData(
  userId: string,
) {
  const user = await userRepository.findById(
    prisma,
    userId,
  );

  if (!user) {
    throw new AppError(
      "USER_NOT_FOUND",
      "User not found.",
      404,
    );
  }

  const [
    billing,
    sessions,
    connectedAccounts,
  ] = await Promise.all([
    billingRepository.findByUserId(
      prisma,
      userId,
    ),

    sessionRepository.findByUserId(
      prisma,
      userId,
    ),

    accountRepository.findByUserId(
      prisma,
      userId,
    ),
  ]);

  return {
    profile: user,
    billing,
    sessions,
    connectedAccounts,
  };
}

export async function deleteAccount(
  userId: string,
  input: DeleteAccountInput,
) {
  const data = deleteAccountSchema.parse(input);

  const user =
    await userRepository.findByIdWithPasswordHash(
      prisma,
      userId,
    );

  if (!user) {
    throw new AppError(
      "USER_NOT_FOUND",
      "User not found.",
      404,
    );
  }

  if (user.passwordHash) {
    if (!data.password) {
      throw new AppError(
        "PASSWORD_REQUIRED",
        "Your password is required to delete your account.",
        400,
      );
    }

    const valid = await argon2.verify(
      user.passwordHash,
      data.password,
    );

    if (!valid) {
      throw new AppError(
        "INVALID_PASSWORD",
        "Password is incorrect.",
        400,
      );
    }
  }

  await userRepository.deleteById(
    prisma,
    userId,
  );

  return {
    success: true,
  };
}