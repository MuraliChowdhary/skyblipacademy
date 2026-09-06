import { z } from "zod";

/**
 * Profile
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must not exceed 80 characters."),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Billing
 */
export const updateBillingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  country: z
    .string()
    .trim()
    .min(2)
    .max(100),

  state: z
    .string()
    .trim()
    .max(100)
    .optional(),

  address: z
    .string()
    .trim()
    .max(250)
    .optional(),

  city: z
    .string()
    .trim()
    .max(100)
    .optional(),

  postalCode: z
    .string()
    .trim()
    .max(20)
    .optional(),

  taxId: z
    .string()
    .trim()
    .max(50)
    .optional(),
});

export type UpdateBillingInput =
  z.infer<typeof updateBillingSchema>;

/**
 * Change password
 *
 * Reuse your existing password schema if you already
 * have one. Otherwise use this.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(10, "New password must be at least 10 characters.")
      .max(128, "New password is too long."),
  })
  .refine(
    ({ currentPassword, newPassword }) =>
      currentPassword !== newPassword,
    {
      message:
        "New password must be different from your current password.",
      path: ["newPassword"],
    },
  );

export type ChangePasswordInput =
  z.infer<typeof changePasswordSchema>;

/**
 * Change email
 */
export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
});

export type ChangeEmailInput =
  z.infer<typeof changeEmailSchema>;

/**
 * Verify email change
 */
export const verifyEmailChangeSchema = z.object({
  token: z
    .string()
    .min(1, "Verification token is required."),
});

export type VerifyEmailChangeInput =
  z.infer<typeof verifyEmailChangeSchema>;

/**
 * Phone
 *
 * No verification flow for now.
 */
export const updatePhoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20, "Phone number is too long."),
});

export type UpdatePhoneInput =
  z.infer<typeof updatePhoneSchema>;

/**
 * Session
 */
export const sessionIdSchema = z.object({
  sessionId: z
    .string()
    .min(1, "Session ID is required."),
});

export type SessionIdInput =
  z.infer<typeof sessionIdSchema>;

/**
 * Connected account
 */
export const connectedAccountIdSchema = z.object({
  accountId: z
    .string()
    .min(1, "Account ID is required."),
});

export type ConnectedAccountIdInput =
  z.infer<typeof connectedAccountIdSchema>;

/**
 * Delete account
 */
export const deleteAccountSchema = z.object({
  confirmation: z.literal("DELETE", {
    error:
      'Type "DELETE" to confirm account deletion.',
  }),

  password: z
    .string()
    .optional(),
});

export type DeleteAccountInput =
  z.infer<typeof deleteAccountSchema>;