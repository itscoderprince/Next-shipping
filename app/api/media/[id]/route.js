import cloudinary from "@/configs/cloudinary";
import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/helper";
import Media from "@/models/media.model";

/**
 * Update media state (Soft delete or Restore)
 */
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) return response(false, 401, "Unauthorized.");

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    let update = {};
    if (action === "soft") {
      update = { deletedAt: new Date() };
    } else if (action === "restore") {
      update = { deletedAt: null };
    } else {
      return response(false, 400, "Invalid action");
    }

    const updatedMedia = await Media.findByIdAndUpdate(id, update, {
      returnDocument: "after",
    });
    if (!updatedMedia) return response(false, 404, "Media not found");

    return response(true, 200, "Media updated successfully", updatedMedia);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * Permanent Delete
 */
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) return response(false, 401, "Unauthorized.");

    const { id } = await params;
    const media = await Media.findById(id);
    if (!media) return response(false, 404, "Media not found");

    // Remove from Cloudinary
    if (media.public_id) {
      await cloudinary.uploader.destroy(media.public_id);
    }

    await Media.findByIdAndDelete(id);

    return response(true, 200, "Media permanently deleted");
  } catch (error) {
    return catchError(error);
  }
}
