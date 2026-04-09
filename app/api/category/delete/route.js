// ─── Imports ──────────────────────────────────────────────────────────────────
import { connectDB } from "@/configs/connectDB";
import { catchError, isAuthenticated, response } from "@/lib/server-helper";
import Category from "@/models/category.model";

// ─── PUT Handler (Soft Delete & Restore) ──────────────────────────────────────
export async function PUT(req) {
  try {
    // 1. Auth check
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    // 2. Database connection & Payload extraction
    await connectDB();
    const payload = await req.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType; // SD = Soft Delete, RSD = Restore

    // 3. Validation
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    const categories = await Category.find({ _id: { $in: ids } }).lean();
    if (!categories.length) {
      return response(false, 404, "Categories not found.");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid operation. Use 'SD' to delete or 'RSD' to restore.",
      );
    }

    // 4. Execute Update
    if (deleteType === "SD") {
      // Soft Delete: Set deletedAt timestamp
      await Category.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } },
      );
    } else {
      // Restore: Clear deletedAt timestamp
      await Category.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } },
      );
    }

    const message =
      deleteType === "SD" ? "Categories moved to trash." : "Categories restored.";
    return response(true, 200, message);
  } catch (err) {
    return catchError(err);
  }
}

// ─── DELETE Handler (Permanent Delete) ────────────────────────────────────────
export async function DELETE(req) {
  try {
    // 1. Auth check
    const isAuth = await isAuthenticated("admin");
    if (!isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    // 2. Database connection & Payload extraction
    await connectDB();
    const payload = await req.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType; // PD = Permanent Delete

    // 3. Validation
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    const categories = await Category.find({ _id: { $in: ids } }).lean();
    if (!categories.length) {
      return response(false, 404, "Categories not found.");
    }

    if (deleteType !== "PD") {
      return response(
        false,
        400,
        "Invalid operation. Use 'PD' for permanent deletion.",
      );
    }

    // 4. Permanent Delete from Database
    await Category.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Categories deleted permanently.");
  } catch (err) {
    return catchError(err);
  }
}
