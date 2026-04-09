import { connectDB } from "@/configs/connectDB";
import userModel from "@/models/user.model";
import { sendEmail } from "@/configs/sendMail";
import Otp from "@/models/otp.model";
import { otpEmail } from "@/emails/otpEmail";
import { catchError, response } from "@/lib/server-helper";
import { generateOTP } from "@/lib/helper";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return response(false, 400, "Email is required");
    }

    const user = await userModel.findOne({ deletedAt: null, email });
    if (!user) {
      return response(false, 404, "User not found");
    }

    await Otp.deleteMany({ email });

    const otp = generateOTP();
    const newOtpData = new Otp({ email, otp });
    await newOtpData.save();

    const otpEmailStatus = await sendEmail(
      "Resend OTP request from the Panda Bees",
      email,
      otpEmail(otp),
    );

    if (!otpEmailStatus.success) {
      return response(false, 400, "Failed to send Verification OTP");
    }

    return response(true, 200, "OTP has been resent successfully");
  } catch (error) {
    return catchError(error);
  }
}
