"use client";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import env from "@/configs/env";
import { CloudUpload } from "lucide-react";
import UIButton from "./UIButton";
import axios from "axios";
import { toast } from "sonner";

const UploadMedia = ({ isMultiple = false, onUpload }) => {
  const handleOnQueuesEnd = async (result) => {
    const files = result?.info?.files || [];

    const formattedFiles = files
      .filter((file) => file.uploadInfo)
      .map((file) => ({
        asset_id: file.uploadInfo.asset_id,
        public_id: file.uploadInfo.public_id,
        path: file.uploadInfo.secure_url,
        secure_url: file.uploadInfo.secure_url,
        thumbnail_url: file.uploadInfo.thumbnail_url || "",
        alt: file.uploadInfo.original_filename || "media",
        title: file.uploadInfo.original_filename || "media",
      }));

    if (!formattedFiles.length) return;

    try {
      const { data } = await axios.post("/api/media/create", formattedFiles);
      toast.success(`${data.data.length} files uploaded successfully`);
      if (onUpload) onUpload(); // ✅ Refetch the list
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const onError = (error) => {
    console.log(error.statusText);
  };

  return (
    <CldUploadWidget
      uploadPreset={env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      signatureEndpoint="/api/cloudinary-signature"
      onQueuesEnd={handleOnQueuesEnd}
      onError={onError}
      config={{
        cloud: {
          cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          apiKey: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        },
      }}
      options={{
        multiple: isMultiple,
        sources: ["local", "url", "google_drive", "istock", "unsplash"],
      }}
    >
      {({ open }) => (
        <UIButton size="sm" onClick={() => open()}>
          <CloudUpload /> Upload
        </UIButton>
      )}
    </CldUploadWidget>
  );
};

export default UploadMedia;
