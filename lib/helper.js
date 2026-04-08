import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/token";

/**
 * Standard API response formatter.
 */
export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      data,
    },
    { status: statusCode },
  );
};

/**
 * Standard API error handler for catch blocks.
 * @param {Error} error - The error object to handle
 * @returns {NextResponse} - Formatted error response
 */
export const catchError = (error) => {
  console.error("❌ Catch Error:", error);

  let message = error.message || "An unexpected system error occurred.";
  let status = error.statusCode || 500;

  // Handle MongoDB Duplicate Key (e.g. User already exists)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    status = 409;
  }

  // Handle Mongoose Validation Errors
  if (error.name === "ValidationError") {
    message = Object.values(error.errors)
      .map((val) => val.message)
      .join(", ");
    status = 400;
  }

  // Handle Zod Errors (if parse is used directly)
  if (error.name === "ZodError") {
    message = error.issues[0]?.message || "Invalid validation schema.";
    status = 400;
  }

  return response(false, status, message);
};

/**
 * Higher-order function to wrap API routes with centralized error handling.
 */
export const wrapRoute = (handler) => {
  return async (req, ...args) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      return catchError(error);
    }
  };
};

/**
 * Authenticate a request and verify user details.
 * @param {string} role - Optional role to check for (e.g., 'admin')
 * @returns {Object|null} - Decoded user payload or null if unauthorized
 */
export const isAuthenticated = async (role = null) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("panda_bees")?.value;

    if (!token) return null;

    const decoded = await verifyToken(token);

    // If a specific role is required, check it
    if (role && decoded?.role !== role) {
      return {
        isAuth: false,
      };
    }

    return decoded;
  } catch (err) {
    console.error("Auth helper error:", err);
    return null;
  }
};

/**
 * Generates a standard 6-digit OTP.
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
