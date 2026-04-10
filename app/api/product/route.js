import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/server-helper";
import Product from "@/models/product.model";
import { productSchema } from "@/lib/zSchema";
import { NextResponse } from "next/server";

/**
 * @route   POST /api/product
 * @desc    Create a new product
 * @access  Private (Admin)
 */
export async function POST(req) {
  try {
    // 1. Auth check
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    // 2. Database connection
    await connectDB();

    // 3. Parse and validate body
    const body = await req.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return response(false, 400, result.error.issues[0].message);
    }

    // 4. Create product
    const product = await Product.create(result.data);

    // 5. Return success response
    return response(true, 201, "Product created successfully.", product);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * @route   GET /api/product
 * @desc    Get all products (with filters)
 * @access  Private (Admin)
 */
export async function GET(req) {
  try {
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const deleteType = searchParams.get("deleteType") || "SD";

    let matchQuery = {};
    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    const products = await Product.find(matchQuery)
      .populate("category", "name")
      .populate("media")
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(size);

    const totalRowCount = await Product.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: products,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
