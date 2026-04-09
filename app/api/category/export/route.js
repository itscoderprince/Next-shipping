import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/server-helper";
import { isValidObjectId } from "mongoose";
import Category from "@/models/category.model";

export async function GET(req) {
  try {
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) return response(false, 401, "Unauthorized.");

    await connectDB();

    const filter = { deletedAt: null };

    const getCategory = await Category.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (!getCategory) {
      response(false, 404, "Collection empty");
    }

    return response(true, 200, "Collection found!", getCategory);
  } catch (error) {
    return catchError(error);
  }
}
