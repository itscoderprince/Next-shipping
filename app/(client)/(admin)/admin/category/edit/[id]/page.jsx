"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, use } from "react";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/lib/zSchema";
import slugify from "slugify";
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const EditCategory = ({ params }) => {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: categoryData } = useFetch(`/api/category/edit/${id}`);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  const categoryName = watch("name");

  // Auto-set data
  useEffect(() => {
    if (categoryData && categoryData.success) {
      setValue("name", categoryData.data.name);
      setValue("slug", categoryData.data.slug);
    }
  }, [categoryData, setValue]);

  // Auto-generate slug from name
  useEffect(() => {
    if (categoryName) {
      setValue("slug", slugify(categoryName, { lower: true, strict: true }));
    }
  }, [categoryName, setValue]);

  // Update Category Mutation
  const updateMutation = useMutation({
    mutationFn: async (values) => {
      const { data } = await axios.put("/api/category/update", {
        ...values,
        _id: id,
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["categories", "category-data"]);
        router.push("/admin/category");
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (values) => {
    updateMutation.mutate(values);
  };

  const isPending = updateMutation.isPending;

  return (
    <Card className="sm:py-4 py-2 gap-3 sm:gap-2">
      <CardHeader className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b [.border-b]:pb-3">
        <div>
          <h1 className="text-xl font-bold">Edit Category</h1>
          <p className="text-sm text-gray-500">Update your category details below</p>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="py-4">
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Electronics"
                {...register("name")}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>
            <Field>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="e.g. electronics"
                {...register("slug")}
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
              {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/category")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditCategory;
