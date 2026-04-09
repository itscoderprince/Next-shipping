// ─── Imports ──────────────────────────────────────────────────────────────────
import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/server-helper";
import Category from "@/models/category.model";
import { NextResponse } from "next/server";

// ─── GET API Handler ──────────────────────────────────────────────────────────
export async function GET(req) { // 🟢 AI CHANGE: Added 'req' parameter which was missing
  try {
    // 1. Auth check
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    // 2. Database connection
    await connectDB();

    const searchParams = req.nextUrl.searchParams;

    // 3. Extract Query parameters
    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || ""; // 🟢 AI CHANGE: Fixed typo from 'globalFilters' to match DataTable
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType") || "SD";

    // 4. Build Match query (Filtering Logic)
    let matchQuery = {};

    // Filter by Delete Type (SD: Soft Delete/Non-deleted, PD: Permanent/Trash)
    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    // Global Search (Name or Slug)
    if (globalFilter) {
      matchQuery["$or"] = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
      ];
    }

    // Column Filters (ID based regex)
    filters.forEach((filter) => {
      matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
    });

    // 5. Build Sort query
    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    // 6. Aggregation Pipeline (Performance optimized)
    const aggregationPipeline = [
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1, // 🟢 AI CHANGE: Added slug back to projection
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // 7. Execute Queries
    const getCategory = await Category.aggregate(aggregationPipeline);
    const totalRowCount = await Category.countDocuments(matchQuery);

    // 8. Return Response
    return NextResponse.json({
      success: true,
      data: getCategory,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
