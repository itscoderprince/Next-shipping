import { SignJWT, jwtVerify } from "jose";
import env from "@/configs/env";

const JWT_SECRET = env.JWT_SECRET;

const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Generate a JWT token
 * @param {Object} payload - Data to be encoded in the token (e.g., user id/role)
 * @param {string} expiresIn - Expiration time (e.g., '1d', '2h', '15m')
 */
export const generateToken = async (payload, expiresIn = "1d") => {
  if (!JWT_SECRET) {
    console.warn(
      "⚠️ JWT_SECRET is missing. Using default secret for development.",
    );
  }

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
};

/**
 * Verify a JWT token
 * @param {string} token - The signed JWT string
 */
export const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return null;
  }
};
