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
   MEDIA EDIT
========================= */

export const editMediaSchema = z.object({
  _id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId."),
  alt: z.string().min(3, "Alt must be at least 3 characters."),
  title: z.string().min(3, "Title must be at least 3 characters."),
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
   ENV SCHEMA
========================= */

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000).optional(),
  DATABASE_URL: z.string().url("Invalid DATABASE_URL").optional(),
  JWT_SECRET: z
    .string()
    .min(10, "JWT_SECRET must be at least 10 characters")
    .optional(),

  // Nodemailer (SMTP)
  MAIL_HOST: z.string().min(1, "MAIL_HOST is required").optional(),
  MAIL_PORT: z.coerce.number().default(587).optional(),
  MAIL_USER: z.string().min(1, "MAIL_USER is required").optional(),
  MAIL_PASS: z.string().min(1, "MAIL_PASS is required").optional(),

  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, "CLOUDINARY_CLOUD_NAME is required"),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z
    .string()
    .min(1, "CLOUDINARY_API_KEY is required"),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z
    .string()
    .min(1, "CLOUDINARY_UPLOAD_PRESET is required"),
  NEXT_PUBLIC_CLOUDINARY_API_SECRET: z
    .string()
    .min(1, "CLOUDINARY_API_SECRET is required")
    .optional(),
});

/* =========================
   TYPES (optional if using TS)
========================= */
// export type RegisterInput = z.infer<typeof registerSchema>;
