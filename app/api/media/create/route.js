import cloudinary from "@/configs/cloudinary";
import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/helper";
import Media from "@/models/media.model";

export async function POST(req) {
  const payload = await req.json();
  try {
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    if (!payload || payload.length === 0) {
      return response(false, 400, "No media files provided");
    }

    await connectDB();

    const newMedia = await Media.insertMany(payload);

    return response(true, 201, "Media upload successfully", newMedia);
  } catch (error) {
    if (payload && payload.length > 0) {
      const publicIds = payload.map((item) => item.public_id);

      try {
        await cloudinary.api.delete_resources(publicIds);
      } catch (deleteError) {
        error.cloudinary = deleteError;
      }
    }

    return catchError(error);
  }
}
