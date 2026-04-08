import { connectDB } from "@/configs/connectDB";
import { resetPasswordSchema } from "@/lib/zSchema";
import { catchError, response } from "@/lib/helper";
import userModel from "@/models/user.model";
import Otp from "@/models/otp.model";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const validate = resetPasswordSchema.safeParse(body);
    if (!validate.success) {
      return response(false, 400, validate.error.issues[0].message);
    }
    const { email, otp, newPassword } = validate.data;

    const getOtpData = await Otp.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 404, "Invalid OTP or expired");
    }

    const user = await userModel.findOne({ deletedAt: null, email });
    if (!user) {
      return response(false, 404, "User not found");
    }

    user.password = newPassword;
    await user.save();

    await Otp.deleteMany({ email });

    return response(true, 200, "Password has been reset successfully");
  } catch (error) {
    return catchError(error);
  }
}
