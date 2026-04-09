import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/token";

// 🟢 AI CHANGE: Extracted backend-only APIs (`NextResponse`, `cookies`) to this separate file `server-helper.js`.
// This resolves the Next.js App Router crash where `next/headers` was accidentally bleeding into Client Components via `helper.js`.

/**
 * Standard API response formatter.
 */
export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json(
    { success, statusCode, message, data },
    { status: statusCode },
  );
};

/**
 * Standard API error handler for catch blocks.
 */
export const catchError = (error) => {
  console.error("❌ Catch Error:", error);

  let message = error.message || "An unexpected system error occurred.";
  let status = error.statusCode || 500;

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    status = 409;
  }
  if (error.name === "ValidationError") {
    message = Object.values(error.errors)
      .map((val) => val.message)
      .join(", ");
    status = 400;
  }
  if (error.name === "ZodError") {
    message = error.issues[0]?.message || "Invalid validation schema.";
    status = 400;
  }

  return response(false, status, message);
};

/**
 * Authenticate a request and verify user details.
 */
export const isAuthenticated = async (role = null) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("panda_bees")?.value;
    if (!token) return null;
    const decoded = await verifyToken(token);
    if (role && decoded?.role !== role) return { isAuth: false };
    return decoded;
  } catch (err) {
    console.error("Auth helper error:", err);
    return null;
  }
};
