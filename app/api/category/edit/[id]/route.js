import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/server-helper";
import { isValidObjectId } from "mongoose";
import Category from "@/models/category.model";

export async function GET(req, { params }) {
  try {
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) return response(false, 401, "Unauthorized.");

    await connectDB();

    const getParams = await params;
    const id = getParams.id;

    const filter = { deletedAt: null };

    if (!isValidObjectId(id)) return response(false, 400, "Invalid object id.");

    filter._id = id;

    const getCategory = await Category.findOne(filter).lean();

    if (!getCategory) return response(false, 404, "Category not found.");
    return response(true, 200, "Category found!", getCategory);
  } catch (error) {
    return catchError(error);
  }
}
