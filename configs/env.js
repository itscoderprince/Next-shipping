import { envSchema } from "@/lib/zSchema";

const isServer = typeof window === "undefined";

const env = isServer
  ? envSchema.parse(process.env)
  : envSchema.partial().parse({
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      NEXT_PUBLIC_CLOUDINARY_API_KEY:
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      NEXT_PUBLIC_CLOUDINARY_API_SECRET:
        process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    });

export default env;
