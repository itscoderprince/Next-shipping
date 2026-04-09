import { connectDB } from "@/configs/connectDB";
import { registerSchema } from "@/lib/zSchema";
import { catchError, response } from "@/lib/server-helper";
import userModel from "@/models/user.model";
import { generateToken } from "@/lib/token";
import env from "@/configs/env";
import { sendEmail } from "@/configs/sendMail";
import { emailVerificationLink } from "@/emails/emailVerification";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const validate = registerSchema.safeParse(body);
    if (!validate.success) {
      return response(false, 400, validate.error.issues[0].message);
    }
    const { name, email, password } = validate.data;

    const existingUser = await userModel.exists({ email });
    if (existingUser) {
      return response(false, 400, "An account already exists with this email.");
    }

    const newUser = await userModel.create({ name, email, password });

    const token = await generateToken({ id: newUser._id.toString() });

    const link = await `${env.NEXT_PUBLIC_APP_URL}/auth/verify-email/${token}`;

    await sendEmail(
      "Email verification request from the Panda Bees",
      email,
      emailVerificationLink(link),
    );

    return response(
      true,
      201,
      "Welcome! Please check your inbox to verify your account.",
      {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
    );
  } catch (error) {
    return catchError(error);
  }
}
