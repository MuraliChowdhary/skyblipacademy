import { z } from "zod";

// Passwords: 72-byte cap matches argon2/bcrypt's practical input limits —
// validate it here so a truncated-silently hash never happens downstream.
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone : z.string().regex(/^\+?[1-9]\d{1,14}$/, {
          message: "Invalid phone number format",
        }),
  password: z
    .string()
    .min(10, "Use at least 10 characters")
    .max(72, "Use at most 72 characters"),
  role:z.enum(["ADMIN","STUDENT"])
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;