import { connectDB } from "@/configs/connectDB";
import { verifyOtpSchema } from "@/lib/zSchema";
import { catchError, response } from "@/lib/server-helper";
import Otp from "@/models/otp.model";
import userModel from "@/models/user.model";
import { generateToken } from "@/lib/token";
import { cookies } from "next/headers";
import env from "@/configs/env";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const validate = verifyOtpSchema.safeParse(body);
    if (!validate.success) {
      return response(false, 400, validate.error.issues[0].message);
    }
    const { email, otp } = validate.data;

    const getOtpData = await Otp.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 404, "Invalid OTP or expire");
    }

    const getUser = await userModel.findOne({ deletedAt: null, email }).lean();
    if (!getUser) {
      return response(false, 404, "User not found");
    }

    await Otp.deleteOne({ email });

    const token = await generateToken({ id: getUser._id.toString() });

    const cookieStore = await cookies();
    cookieStore.set("panda_bees", token, {
      httpOnly: env.NODE_ENV === "production",
      secure: env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response(true, 200, "Login successful", {
      user: {
        id: getUser._id,
        name: getUser.name,
        email: getUser.email,
        avatar: getUser.avatar,
      },
    });
  } catch (error) {
    return catchError(error);
  }
}
