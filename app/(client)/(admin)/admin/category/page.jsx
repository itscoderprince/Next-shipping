"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlusIcon, Loader2 } from "lucide-react";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/lib/zSchema";
import slugify from "slugify";
import axios from "axios";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DatatableWrapper from "@/components/shared/DatatableWrapper";
import { EditAction, DeleteAction } from "@/components/shared/ActionsButtons";
import { ADMIN_TRASH, ADMIN_CATEGORY_EDIT } from "@/routes/Admin.route";
import { columnConfig } from "@/lib/helper";
import { DT_CATEGORY_COLUMN } from "@/lib/column";

const Category = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  const categoryName = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (categoryName) {
      setValue("slug", slugify(categoryName, { lower: true, strict: true }));
    }
  }, [categoryName, setValue]);

  // Handle Modal Close/Open
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        reset();
      }, 200);
    }
  };

  // Create Category Mutation
  const createMutation = useMutation({
    mutationFn: async (values) => {
      const { data } = await axios.post("/api/category/create", values);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["categories", "category-data"]);
        handleOpenChange(false);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (values) => {
    createMutation.mutate(values);
  };

  // Tables data code starts here
  const columns = useMemo(() => columnConfig(DT_CATEGORY_COLUMN), []);
  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = [];
    actionMenu.push(
      <EditAction href={ADMIN_CATEGORY_EDIT(row.original._id)} key="edit" />,
    );
    actionMenu.push(
      <DeleteAction
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
        key="delete"
      />,
    );
    return actionMenu;
  }, []);

  const isPending = createMutation.isPending;

  return (
    <Card className="sm:py-4 py-2 gap-3 sm:gap-0">
      <CardHeader className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b [.border-b]:pb-3">
        <div>
          <h1 className="text-xl font-bold">Category</h1>
          <p className="text-sm text-gray-500">Manage your categories here</p>
        </div>
        <div>
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="rounded-full gap-2">
                <PlusIcon className="w-4 h-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Create a new category for your products. The slug will be
                    generated automatically.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup className="py-4">
                  <Field>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Electronics"
                      {...register("name")}
                    />
                    {errors.name && (
                      <FieldError>{errors.name.message}</FieldError>
                    )}
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
                    {errors.slug && (
                      <FieldError>{errors.slug.message}</FieldError>
                    )}
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Category"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="mt-2">
        <DatatableWrapper
          queryKey="category-data"
          fetchUrl="/api/category"
          initialPageSize={10}
          columnConfig={columns}
          exportEndpoint="/api/category/export"
          deleteEndpoint="/api/category/delete"
          deleteType="SD"
          trashView={`${ADMIN_TRASH}?trashof=category`}
          createAction={action}
        />
      </CardContent>
    </Card>
  );
};

export default Category;
