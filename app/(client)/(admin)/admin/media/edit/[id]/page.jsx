"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import React, { use, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editMediaSchema } from "@/lib/zSchema";
import { Input } from "@/components/ui/input";
import UIButton from "@/components/shared/UIButton";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const EditMedia = ({ params }) => {
  const { id } = use(params);
  const { data: mediaData, loading } = useFetch(`/api/media/edit/${id}`);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editMediaSchema),
  });

  // Populate form when data loads
  useEffect(() => {
    if (mediaData?.success) {
      reset({
        _id: mediaData.data._id,
        alt: mediaData.data.alt,
        title: mediaData.data.title,
      });
    }
  }, [mediaData, reset]);

  const onSubmit = async (values) => {
    try {
      const { data } = await axios.put(`/api/media/update`, values);
      if (data.success) {
        toast.success(data.message || "Media updated successfully!");
      } else {
        toast.error(data.message || "Media update failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  if (loading) {
    return (
      <Card className="sm:py-4 py-2">
        <CardContent className="flex justify-center py-20 text-gray-500">
          Loading...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sm:py-4 py-2 gap-3 sm:gap-6">
      <CardHeader className="border-b pb-3">
        <h4 className="text-xl font-semibold">Edit Media</h4>
        <p className="text-sm text-gray-500">Update the alt text and title for this media file.</p>
      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row gap-6">
        {/* Image Preview */}
        {mediaData?.data?.secure_url && (
          <div className="shrink-0">
            <Image
              src={mediaData.data.secure_url}
              alt={mediaData.data.alt || "Media preview"}
              height={200}
              width={200}
              className="rounded-md object-cover border"
            />
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 flex-1">
          {/* Hidden _id field */}
          <input type="hidden" {...register("_id")} />

          {/* Alt Field */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              type="text"
              placeholder="Describe the image for accessibility"
              {...register("alt")}
            />
            {errors.alt && <p className="text-sm text-red-500">{errors.alt.message}</p>}
          </div>

          {/* Title Field */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Media title"
              {...register("title")}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <UIButton type="submit" loading={isSubmitting} className="w-full sm:w-auto">
            Save Changes
          </UIButton>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditMedia;
