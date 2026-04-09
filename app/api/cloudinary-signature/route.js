import cloudinary from "@/configs/cloudinary";
import env from "@/configs/env";
import { catchError } from "@/lib/server-helper";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const payload = await req.json();
    const { paramsToSign } = payload;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    );

    return NextResponse.json({
      success: true,
      signature,
    });
  } catch (error) {
    catchError(error);
  }
}
