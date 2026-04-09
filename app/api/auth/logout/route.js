import { connectDB } from "@/configs/connectDB";
import { catchError, response } from "@/lib/server-helper";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    cookieStore.delete("panda_bees");
    return response(true, 200, "logout successfully");
  } catch (error) {
    catchError(error);
  }
}
