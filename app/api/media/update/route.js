import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/server-helper";
import { editMediaSchema } from "@/lib/zSchema";
import Media from "@/models/media.model";

export async function PUT(req) {
  try {
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) return response(false, 401, "Unauthorized.");

    await connectDB();

    const body = await req.json();

    // Zod validation
    const parsed = editMediaSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message || "Invalid input.";
      return response(false, 400, message);
    }

    const { _id, alt, title } = parsed.data;

    const updated = await Media.findByIdAndUpdate(
      _id,
      { alt, title },
      { new: true }
    ).lean();

    if (!updated) return response(false, 404, "Media not found.");

    return response(true, 200, "Media updated successfully.", updated);
  } catch (error) {
    return catchError(error);
  }
}
