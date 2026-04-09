import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/server-helper";
import { categorySchema } from "@/lib/zSchema";
import Category from "@/models/category.model";

export async function PUT(req) {
  try {
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    await connectDB();
    const payload = await req.json();

    const validate = categorySchema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, validate.error.errors[0].message);
    }

    const { _id, name, slug } = validate.data;

    if (!_id) {
      return response(false, 400, "Category ID is required for updating.");
    }

    // Check if another category is already using this slug
    const existingCategory = await Category.findOne({ slug, _id: { $ne: _id } });
    if (existingCategory) {
      return response(false, 400, "Another category with this slug already exists.");
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      { name, slug },
      { new: true }
    );

    if (!updatedCategory) {
      return response(false, 404, "Category not found.");
    }

    return response(true, 200, "Category updated successfully!");
  } catch (error) {
    return catchError(error);
  }
}
