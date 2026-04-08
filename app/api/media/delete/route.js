import cloudinary from "@/configs/cloudinary";
import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/helper";
import Media from "@/models/media.model";
import mongoose from "mongoose";

export async function PUT(req) {
  try {
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    await connectDB();
    const payload = await req.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    const media = await Media.find({ _id: { $in: ids } }).lean();
    if (!media.length) {
      return response(false, 404, "Data not found.");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid delete operations. Delete type should be SD or RSD for this route.",
      );
    }

    if (deleteType === "SD") {
      await Media.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toString() } },
      );
    } else {
      await Media.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } },
      );
    }

    const message = deleteType === "SD" ? "Data moved to trash." : "Data restored.";
    return response(true, 200, message);
  } catch (err) {
    return catchError(err);
  }
}

export async function DELETE(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    await connectDB();
    const payload = await req.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    const media = await Media.find({ _id: { $in: ids } })
      .session(session)
      .lean();
    if (!media.length) {
      return response(false, 404, "Data not found.");
    }

    if (deleteType !== "PD") {
      return response(
        false,
        400,
        "Invalid delete operations. Delete type should be PD for this route.",
      );
    }

    await Media.deleteMany({ _id: { $in: ids } }).session(session);
    const publicIds = media.map((m) => m.public_id);

    try {
      if (publicIds.length > 0) {
        await cloudinary.api.delete_all_resources(publicIds);
      }
      await session.commitTransaction();
      return response(true, 200, "Media deleted permanently.");
    } catch (error) {
      await session.abortTransaction();
      return response(false, 500, "Cloudinary deletion failed.");
    } finally {
      session.endSession();
    }
  } catch (err) {
    return catchError(err);
  }
}
