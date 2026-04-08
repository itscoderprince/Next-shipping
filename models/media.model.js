import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    asset_id: {
      type: String,
      required: [true, "Asset ID is required for media"],
      trim: true,
    },
    public_id: {
      type: String,
      required: [true, "Public ID is required for media"],
      trim: true,
    },
    path: {
      type: String,
      required: [true, "Storage path or URL is required"],
      trim: true,
    },
    thumbnail_url: {
      type: String,
      trim: true,
    },
    secure_url: {
      type: String,
      trim: true,
    },
    alt: {
      type: String,
      required: [true, "Alt text is required for accessibility"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required for media management"],
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

const Media = mongoose.models.Media || mongoose.model("Media", MediaSchema);

export default Media;
