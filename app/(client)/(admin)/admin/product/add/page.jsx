"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/zSchema";
import slugify from "slugify";
import axios from "axios";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Lucide Icons
import {
  Package,
  FileText,
  ImagePlus,
  LayoutList,
  DollarSign,
  Plus,
  X,
  Tag,
  Info,
  Archive,
  BarChart3,
} from "lucide-react";

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldDescription,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Shared Components
import UIButton from "@/components/shared/UIButton";
import Select from "@/components/shared/Select";
import Editor from "@/components/shared/CkEditor";
import MediaModel from "@/components/shared/MediaModel";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";
import { Box } from "lucide-react";

const AddProduct = () => {
  const router = useRouter();
  const [selectedMediaItems, setSelectedMediaItems] = useState([]);
  const [openMediaPicker, setOpenMediaPicker] = useState(false);

  // useForm hook initialization
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      stock: 0,
      media: [],
      description: "",
      isFeatured: false,
      status: "active",
    },
  });

  const productName = watch("name");
  const mrp = watch("mrp");
  const sellingPrice = watch("sellingPrice");
  const selectedCategory = watch("category");
  const selectedStatus = watch("status");

  // Auto-generate slug from product name
  useEffect(() => {
    if (productName) {
      setValue("slug", slugify(productName, { lower: true, strict: true }), {
        shouldValidate: true,
      });
    }
  }, [productName, setValue]);

  // Sync selected media with form state
  useEffect(() => {
    setValue(
      "media",
      selectedMediaItems.map((m) => m._id),
      { shouldValidate: true },
    );
  }, [selectedMediaItems, setValue]);

  // Fetch Categories
  const { data: categoriesResponse, loading: categoriesLoading } = useFetch(
    "/api/category?size=1000",
  );
  const categoryOptions = useMemo(() => {
    return (
      categoriesResponse?.data?.map((cat) => ({
        value: cat._id,
        label: cat.name,
      })) || []
    );
  }, [categoriesResponse]);

  // Mutate Product
  const createMutation = useMutation({
    mutationFn: async (values) => {
      const { data } = await axios.post("/api/product", values);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Product published successfully!");
        router.push("/admin/product");
      } else {
        toast.error(data.message || "Failed to create product");
      }
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    },
  });

  const onSubmit = (values) => {
    createMutation.mutate(values);
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "draft", label: "Draft" },
  ];

  const removeMedia = (id) => {
    setSelectedMediaItems((prev) => prev.filter((m) => m._id !== id));
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-20 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-violet-600" />
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Add New Product
            </h1>
          </div>
          <p className="text-slate-500 text-[12px] font-medium ml-7">
            Fill in the professional details to list your masterpiece in the
            catalog.
          </p>
        </div>
      </div>

      {/* MAIN UNIFIED CARD */}
      <Card className="py-0 gap-3 sm:gap-6">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* 1. PRODUCT ESSENTIALS SECTION */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold tracking-tight">
                  Product Essentials
                </h3>
              </div>

              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <Field data-invalid={!!errors.name}>
                  <FieldLabel className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Product Name
                  </FieldLabel>
                  <Input
                    placeholder="e.g. Nike Air Max Alpha"
                    {...register("name")}
                  />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>

                {/* URL Slug */}
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <LayoutList className="w-4 h-4" />
                    URL Slug
                  </FieldLabel>
                  <Input
                    {...register("slug")}
                    readOnly
                    placeholder="Automatically-generated-slug"
                    className="bg-slate-50 border-dashed border-primary-500 text-slate-400 italic"
                  />
                </Field>

                {/* Status */}
                <Field data-invalid={!!errors.status}>
                  <FieldLabel className="flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    Status
                  </FieldLabel>
                  <Select
                    options={statusOptions}
                    selected={selectedStatus}
                    setSelected={(val) =>
                      setValue("status", val, { shouldValidate: true })
                    }
                  />
                  {errors.status && (
                    <FieldError>{errors.status.message}</FieldError>
                  )}
                </Field>

                {/* Category */}
                <Field data-invalid={!!errors.category}>
                  <FieldLabel className="flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    Category
                  </FieldLabel>
                  <Select
                    options={categoryOptions}
                    selected={selectedCategory}
                    setSelected={(val) =>
                      setValue("category", val, { shouldValidate: true })
                    }
                    placeholder={
                      categoriesLoading ? "Fetching..." : "Select category"
                    }
                  />
                  {errors.category && (
                    <FieldError>{errors.category.message}</FieldError>
                  )}
                </Field>

                {/* Description - Full Width */}
                <Field
                  data-invalid={!!errors.description}
                  className="md:col-span-2"
                >
                  <FieldLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </FieldLabel>
                  <div className="border rounded-md overflow-hidden">
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Editor
                          onChange={field.onChange}
                          initialData={field.value}
                        />
                      )}
                    />
                  </div>
                  {errors.description && (
                    <FieldError>{errors.description.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </div>

            {/* 2. PRICING & VISUALS SECTION */}
            {/* 2. MEDIA & PRICING SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Gallery - Now on Left (Widened) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImagePlus className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold tracking-tight">
                      Product Gallery
                    </h3>
                  </div>
                  <UIButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenMediaPicker(true)}
                  >
                    Select Images
                  </UIButton>
                </div>

                <div className="min-h-[300px] border-2 border-dashed rounded-lg bg-muted/20 p-4">
                  {selectedMediaItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {selectedMediaItems.map((m) => (
                        <div
                          key={m._id}
                          className="group relative aspect-square rounded-md overflow-hidden border bg-background"
                        >
                          <Image
                            src={m.secure_url}
                            alt="product"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(m._id)}
                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <ImagePlus className="w-10 h-10 text-muted-foreground/40 mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">
                        No media selected
                      </p>
                    </div>
                  )}
                </div>
                {errors.media && (
                  <FieldError>{errors.media.message}</FieldError>
                )}
              </div>

              {/* Pricing & Stock - Now on Right (Narrowed) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold tracking-tight">
                    Market Specs
                  </h3>
                </div>

                <div className="space-y-5">
                  <Field data-invalid={!!errors.sellingPrice}>
                    <FieldLabel className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-violet-500" />
                      Selling Price
                    </FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("sellingPrice")}
                        className="pl-7"
                      />
                    </div>
                    {errors.sellingPrice && (
                      <FieldError>{errors.sellingPrice.message}</FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!errors.mrp}>
                    <FieldLabel className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      MRP (Retail)
                    </FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("mrp")}
                        className="pl-7"
                      />
                    </div>
                  </Field>

                  <Field data-invalid={!!errors.stock}>
                    <FieldLabel className="flex items-center gap-2">
                      <Archive className="w-3.5 h-3.5 text-violet-500" />
                      Stock Level
                    </FieldLabel>
                    <Input
                      type="number"
                      placeholder="0"
                      {...register("stock")}
                    />
                    {errors.stock && (
                      <FieldError>{errors.stock.message}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 rotate-90" />
                      Discount (%)
                    </FieldLabel>
                    <Input
                      type="number"
                      readOnly
                      {...register("discountPercentage")}
                      className="bg-slate-50 border-none text-violet-600 font-bold"
                    />
                  </Field>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/10">
                    <div className="space-y-0.5">
                      <Label
                        className="font-semibold cursor-pointer text-[13px]"
                        htmlFor="isFeatured"
                      >
                        Featured
                      </Label>
                      <p className="text-[10px] text-muted-foreground">
                        Spotlight on homepage.
                      </p>
                    </div>
                    <Controller
                      name="isFeatured"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="isFeatured"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-6 border-t flex flex-col sm:flex-row items-center gap-4">
              <UIButton
                type="submit"
                loading={createMutation.isPending}
                className="w-full sm:w-auto px-12"
              >
                Publish Product
              </UIButton>
              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Discard Changes
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* MEDIA PICKER MODEL */}
      <MediaModel
        open={openMediaPicker}
        setOpen={setOpenMediaPicker}
        selectedMedia={selectedMediaItems}
        setSelectedMedia={setSelectedMediaItems}
      />
    </div>
  );
};

export default AddProduct;
