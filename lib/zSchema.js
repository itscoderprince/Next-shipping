import { z } from "zod";

/**
 * REUSABLE BASE SCHEMAS
 */
const mongoId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid Mongo ID.");
const email = z.string().email("Invalid email address.");
const password = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .regex(/[A-Z]/, "Include at least one uppercase letter.")
  .regex(/[0-9]/, "Include at least one number.");

const otp = z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits.");

/**
 * AUTHENTICATION SCHEMAS
 */
export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters.").max(50),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required."),
});

export const forgotPasswordSchema = z.object({
  email,
});

export const verifyOtpSchema = z.object({
  email,
  otp,
});

export const resetPasswordSchema = z
  .object({
    email,
    otp,
    newPassword: password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required."),
    newPassword: password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/**
 * MEDIA & ASSET SCHEMAS
 */
export const editMediaSchema = z.object({
  _id: mongoId,
  alt: z.string().min(3, "Alt text must be at least 3 characters."),
  title: z.string().min(3, "Title must be at least 3 characters."),
});

/**
 * CATEGORY SCHEMAS
 */
export const categorySchema = z.object({
  _id: mongoId.optional(),
  name: z.string().min(3, "Category name must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters."),
});

/**
 * PRODUCT SCHEMAS
 */
export const productSchema = z.object({
  _id: mongoId.optional(),
  name: z.string().min(3, "Product name must be at least 3 characters."),
  slug: z.string().min(3, "Product slug must be at least 3 characters."),
  category: mongoId,
  mrp: z.coerce.number().min(0, "MRP cannot be negative."),
  sellingPrice: z.coerce.number().min(0, "Selling price cannot be negative."),
  discountPercentage: z.coerce.number().min(0).max(100).default(0),
  stock: z.coerce.number().min(0, "Stock cannot be negative.").default(0),
  media: z.array(mongoId).min(1, "At least one media file is required."),
  description: z.string().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["active", "inactive", "draft"]).default("active"),
});

/**
 * INFRASTRUCTURE & CONFIG SCHEMAS
 */
export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url("Invalid DATABASE_URL."),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters."),

  // Mail Configuration
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number().default(587),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),

  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Cloudinary Configuration
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string(),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string(),
  NEXT_PUBLIC_CLOUDINARY_API_SECRET: z.string().optional(),
});
