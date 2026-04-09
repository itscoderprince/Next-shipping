import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/server-helper";
import { categorySchema } from "@/lib/zSchema";
import Category from "@/models/category.model";

export async function POST(req) {
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

    const { name, slug } = validate.data;

    // Check if category already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return response(false, 400, "Category with this slug already exists.");
    }

    const newCategory = new Category({ name, slug });
    await newCategory.save();

    return response(true, 201, "Category created successfully!");
  } catch (error) {
    return catchError(error);
  }
}
