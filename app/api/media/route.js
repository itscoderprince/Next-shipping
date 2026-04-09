import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/server-helper";
import Media from "@/models/media.model";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const isAuth = await isAuthenticated("admin");
    if (!isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(0, parseInt(searchParams.get("page"), 10) || 0);
    const limit = Math.min(
      Math.max(1, parseInt(searchParams.get("limit"), 10) || 10),
      100,
    );
    const deleteType = searchParams.get("deleteType");

    let filter = {};
    if (deleteType === "SD") {
      filter = { deletedAt: null };
    } else if (deleteType === "PD") {
      filter = { deletedAt: { $ne: null } };
    }

    // ✅ Parallel — faster
    const [mediaData, totalMedia] = await Promise.all([
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip(page * limit)
        .limit(limit)
        .lean(),
      Media.countDocuments(filter),
    ]);

    return NextResponse.json({
      mediaData: mediaData,
      hasMore: (page + 1) * limit < totalMedia,
    });
  } catch (error) {
    return catchError(error);
  }
}
