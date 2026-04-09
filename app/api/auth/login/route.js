import { connectDB } from "@/configs/connectDB";
import { loginSchema } from "@/lib/zSchema";
import { catchError, response } from "@/lib/server-helper";
import { generateOTP } from "@/lib/helper";
import userModel from "@/models/user.model";
import { generateToken } from "@/lib/token";
import env from "@/configs/env";
import { sendEmail } from "@/configs/sendMail";
import Otp from "@/models/otp.model";
import { otpEmail } from "@/emails/otpEmail";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const validate = loginSchema.safeParse(body);
    if (!validate.success) {
      return response(false, 400, validate.error.issues[0].message);
    }
    const { email, password } = validate.data;

    const user = await userModel
      .findOne({ deletedAt: null, email })
      .select("+password");
    if (!user) {
      return response(false, 404, "User not found with this email");
    }

    if (!user.isEmailVerified) {
      const token = await generateToken({ id: user._id.toString() });
      const link = await `${env.NEXT_PUBLIC_APP_URL}/verify-email/${token}`;

      await sendEmail(
        "Email verification request from the Panda Bees",
        email,
        emailVerificationLink(link),
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return response(false, 401, "Invalid password");
    }

    await Otp.deleteMany({ email });

    const otp = generateOTP();
    const newOtpData = new Otp({ email, otp });
    await newOtpData.save();

    const otpEmailStatus = await sendEmail(
      "OTP verification request from the Panda Bees",
      email,
      otpEmail(otp),
    );

    if (!otpEmailStatus.success) {
      return response(false, 400, "Failed to send Verification OTP");
    }

    return response(true, 200, "Please verify your device to login", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return catchError(error);
  }
}
