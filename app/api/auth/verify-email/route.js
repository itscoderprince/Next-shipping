import { connectDB } from "@/configs/connectDB";
import { catchError, response } from "@/lib/server-helper";
import userModel from "@/models/user.model";
import { verifyToken } from "@/lib/token";

export async function POST(req) {
  try {
    await connectDB();
    const { token } = await req.json();

    if (!token) {
      return response(false, 400, "Token is required.");
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return response(false, 400, "Invalid token.");
    }

    const user = await userModel.findById(payload.id);
    if (!user) {
      return response(false, 404, "User not found.");
    }

    user.isEmailVerified = true;
    await user.save();

    return response(true, 200, "Your email has been successfully verified.", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return catchError(error);
  }
}
