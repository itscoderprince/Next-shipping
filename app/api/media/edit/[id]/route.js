import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/helper";
import Media from "@/models/media.model";
import { isValidObjectId } from "mongoose";

export async function GET(req, { params }) {
  try {
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) return response(false, 401, "Unauthorized.");

    await connectDB();

    const getParams = await params;
    const id = getParams.id;

    const filter = { deletedAt: null };

    if (!isValidObjectId(id))
      return response(false, 400, "Invalid object id.");

    filter._id = id;

    const getMedia = await Media.findOne(filter).lean();

    if (!getMedia) return response(false, 404, "Media not found.");
    return response(true, 200, "Media found!", getMedia);
  } catch (error) {
    return catchError(error);
  }
}
