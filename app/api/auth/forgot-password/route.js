import { connectDB } from "@/configs/connectDB";
import { forgotPasswordSchema } from "@/lib/zSchema";
import { catchError, response } from "@/lib/server-helper";
import { generateOTP } from "@/lib/helper";
import userModel from "@/models/user.model";
import { sendEmail } from "@/configs/sendMail";
import Otp from "@/models/otp.model";
import { otpEmail } from "@/emails/otpEmail";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const validate = forgotPasswordSchema.safeParse(body);
    if (!validate.success) {
      return response(false, 400, validate.error.issues[0].message);
    }
    const { email } = validate.data;

    const user = await userModel.findOne({ deletedAt: null, email });
    if (!user) {
      return response(false, 404, "User not found with this email");
    }

    await Otp.deleteMany({ email });

    const otp = generateOTP();
    const newOtpData = new Otp({ email, otp });
    await newOtpData.save();

    const otpEmailStatus = await sendEmail(
      "Password Reset request from the Panda Bees",
      email,
      otpEmail(otp)
    );

    if (!otpEmailStatus.success) {
      return response(false, 400, "Failed to send Reset OTP");
    }

    return response(true, 200, "Password reset OTP sent successfully");
  } catch (error) {
    return catchError(error);
  }
}
