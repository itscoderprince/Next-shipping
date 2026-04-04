import { z } from "zod";

/* =========================
   COMMON FIELDS
========================= */

const email = z.string().email("Invalid email");

const password = z
  .string()
  .min(6, "Minimum 6 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[0-9]/, "At least one number");

const otp = z.string().regex(/^\d{6}$/, "OTP must be 6 digits");

/* =========================
   REGISTER
========================= */

export const registerSchema = z
  .object({
    name: z.string().min(3, "Full name must be at least 3 characters").max(50),

    email,

    password,

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* =========================
   LOGIN
========================= */

export const loginSchema = z.object({
  email,
  password: z.string().min(6, "Password is required"),
});

/* =========================
   FORGOT PASSWORD (SEND OTP)
========================= */

export const forgotPasswordSchema = z.object({
  email,
});

/* =========================
   VERIFY OTP (GENERIC)
========================= */

export const verifyOtpSchema = z.object({
  email,
  otp,
});

/* =========================
   RESET PASSWORD
========================= */

export const resetPasswordSchema = z
  .object({
    email,
    otp,

    newPassword: password,

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* =========================
   OPTIONAL: CHANGE PASSWORD (LOGGED IN USER)
========================= */

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6),

    newPassword: password,

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* =========================
   TYPES (optional if using TS)
========================= */
// export type RegisterInput = z.infer<typeof registerSchema>;
