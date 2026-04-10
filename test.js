// "use client";

// import {
//   Loader2,
//   Package,
//   Trash2,
//   ImagePlus,
//   Check,
//   X,
//   Plus,
//   FileText,
//   LayoutList,
//   DollarSign,
//   Tag as TagIcon,
// } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupInput,
//   InputGroupText,
// } from "@/components/ui/input-group";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Field,
//   FieldGroup,
//   FieldError,
//   FieldLabel,
//   FieldTitle,
//   FieldDescription,
//   FieldSet,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { productSchema } from "@/lib/zSchema";
// import slugify from "slugify";
// import axios from "axios";
// import { toast } from "sonner";
// import { useMutation } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import UploadMedia from "@/components/shared/UploadMedia";
// import { useRouter } from "next/navigation";
// import useFetch from "@/hooks/useFetch";
// import Select from "@/components/shared/Select";
// import Editor from "@/components/shared/CkEditor";
// import MediaModel from "@/components/shared/MediaModel";

// const AddProduct = () => {
//   const router = useRouter();
//   const [selectedMediaItems, setSelectedMediaItems] = useState([]);
//   const [openMediaPicker, setOpenMediaPicker] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     control,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       name: "",
//       slug: "",
//       category: "",
//       mrp: 0,
//       sellingPrice: 0,
//       discountPercentage: 0,
//       stock: 0,
//       media: [],
//       description: "",
//       isFeatured: false,
//       status: "active",
//     },
//   });

//   const productName = watch("name");
//   const mrp = watch("mrp");
//   const sellingPrice = watch("sellingPrice");
//   const selectedCategory = watch("category");
//   const selectedStatus = watch("status");

//   // Auto-generate slug from name
//   useEffect(() => {
//     if (productName) {
//       setValue("slug", slugify(productName, { lower: true, strict: true }), {
//         shouldValidate: true,
//       });
//     }
//   }, [productName, setValue]);

//   // Auto-calculate discount percentage
//   useEffect(() => {
//     const mrpVal = parseFloat(mrp) || 0;
//     const sellingPriceVal = parseFloat(sellingPrice) || 0;
//     if (mrpVal > 0 && sellingPriceVal > 0) {
//       const discount = ((mrpVal - sellingPriceVal) / mrpVal) * 100;
//       setValue("discountPercentage", Math.round(discount > 0 ? discount : 0), {
//         shouldValidate: true,
//       });
//     }
//   }, [mrp, sellingPrice, setValue]);

//   // Fetch Categories using useFetch
//   const { data: categoriesResponse, loading: categoriesLoading } = useFetch(
//     "/api/category?size=1000",
//   );

//   const categoryOptions = useMemo(() => {
//     return (
//       categoriesResponse?.data?.map((cat) => ({
//         value: cat._id,
//         label: cat.name,
//       })) || []
//     );
//   }, [categoriesResponse]);

//   // Fetch Media for Picker using useFetch
//   const {
//     data: mediaResponse,
//     loading: mediaLoading,
//     refetch: refetchMedia,
//   } = useFetch("/api/media?limit=50&deleteType=SD");

//   const mediaData = mediaResponse?.mediaData;

//   // Mutation for creating product
//   const createMutation = useMutation({
//     mutationFn: async (values) => {
//       return await axios.post("/api/product", values);
//     },
//     onSuccess: () => {
//       toast.success("Product created successfully!");
//       router.push("/admin/product");
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     },
//   });

//   const onSubmit = (values) => {
//     if (selectedMediaItems.length === 0) {
//       toast.error("Please select at least one media file");
//       return;
//     }
//     const finalValues = {
//       ...values,
//       media: selectedMediaItems.map((m) => m._id),
//     };
//     createMutation.mutate(finalValues);
//   };

//   const toggleMediaSelection = (media) => {
//     setSelectedMediaItems((prev) => {
//       const exists = prev.find((m) => m._id === media._id);
//       if (exists) {
//         return prev.filter((m) => m._id !== media._id);
//       } else {
//         return [...prev, media];
//       }
//     });
//   };

//   useEffect(() => {
//     setValue(
//       "media",
//       selectedMediaItems.map((m) => m._id),
//       { shouldValidate: true },
//     );
//   }, [selectedMediaItems, setValue]);

//   const statusOptions = [
//     { value: "active", label: "Active" },
//     { value: "inactive", label: "Inactive" },
//     { value: "draft", label: "Draft" },
//   ];

//   return (
//     <div className="flex flex-col gap-8 w-full pb-20">
//       {/* PAGE HEADER */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 px-1">
//         <div className="space-y-1.5">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-primary/10 rounded-xl shadow-inner">
//               <Package className="w-6 h-6 text-primary" />
//             </div>
//             <h1 className="text-3xl font-extrabold tracking-tight">Create Product</h1>
//           </div>
//           <p className="text-muted-foreground text-[13px] font-medium max-w-md">
//             Enter all the necessary information to publish your product to the catalog.
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button variant="outline" className="h-10 px-6 rounded-lg text-[13px] font-bold uppercase tracking-wider" onClick={() => router.back()}>
//             Discard
//           </Button>
//           <Button
//             onClick={handleSubmit(onSubmit)}
//             disabled={createMutation.isPending}
//             className="h-10 px-8 gap-2 rounded-lg text-[13px] font-bold uppercase tracking-wider shadow-lg shadow-primary/20"
//           >
//             {createMutation.isPending ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <Plus className="w-4 h-4" />
//             )}
//             Publish to Store
//           </Button>
//         </div>
//       </div>

//       {/* UNIFIED FORM CARD */}
//       <Card className="rounded-2xl shadow-xl border-border/40 overflow-hidden bg-card/50 backdrop-blur-sm">
//         <CardContent className="p-0">
//           <form className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
//             {/* MAIN CONTENT AREA (Left 8 Cols) */}
//             <div className="lg:col-span-8 p-6 sm:p-8 space-y-10">
//               {/* SECTION: Basic Info */}
//               <FieldSet className="space-y-6">
//                 <div className="space-y-1">
//                   <h3 className="text-lg font-bold flex items-center gap-2">
//                     <FileText className="w-5 h-5 text-primary" />
//                     Essential Information
//                   </h3>
//                   <p className="text-muted-foreground text-xs font-medium">Mention the core specifications and description of your product.</p>
//                 </div>

//                 <FieldGroup className="gap-8">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <Field>
//                       <FieldTitle className="text-primary font-bold tracking-tight">Product Title</FieldTitle>
//                       <Input
//                         placeholder="e.g. Nike Air Max Alpha"
//                         {...register("name")}
//                         className="h-11 rounded-xl shadow-sm focus-visible:ring-primary/20 border-border/80"
//                       />
//                       <FieldError errors={[errors.name]} />
//                     </Field>

//                     <Field>
//                       <FieldTitle className="text-muted-foreground/60 font-bold tracking-tight">Product Slug</FieldTitle>
//                       <Input
//                         {...register("slug")}
//                         readOnly
//                         className="h-11 rounded-xl bg-muted/30 border-dashed opacity-70 cursor-not-allowed italic"
//                       />
//                       <FieldDescription className="text-[11px]">URL-optimized name, generated automatically.</FieldDescription>
//                     </Field>
//                   </div>

//                   <Field>
//                     <FieldTitle className="text-primary font-bold tracking-tight">Full Description</FieldTitle>
//                     <div className="rounded-xl border border-border/80 bg-background overflow-hidden ring-offset-background focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
//                       <Controller
//                         name="description"
//                         control={control}
//                         render={({ field }) => (
//                           <Editor
//                             onChange={field.onChange}
//                             initialData={field.value}
//                           />
//                         )}
//                       />
//                     </div>
//                     <FieldError errors={[errors.description]} />
//                   </Field>
//                 </FieldGroup>
//               </FieldSet>

//               <Separator className="bg-border/40" />

//               {/* SECTION: Media */}
//               <FieldSet className="space-y-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div className="space-y-1">
//                     <h3 className="text-lg font-bold flex items-center gap-2">
//                       <ImagePlus className="w-5 h-5 text-primary" />
//                       Visual Gallery
//                     </h3>
//                     <p className="text-muted-foreground text-xs font-medium">Add stunning images to capture customer attention.</p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <UploadMedia onUpload={() => refetchMedia()} isMultiple />
//                     <MediaModel
//                       open={openMediaPicker}
//                       onOpenChange={setOpenMediaPicker}
//                       mediaLoading={mediaLoading}
//                       mediaData={mediaData}
//                       selectedMediaItems={selectedMediaItems}
//                       toggleMediaSelection={toggleMediaSelection}
//                     />
//                   </div>
//                 </div>

//                 <div className="rounded-2xl border-2 border-dashed bg-muted/5 border-border/50 transition-colors hover:bg-muted/10">
//                   {selectedMediaItems.length > 0 ? (
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-5">
//                       {selectedMediaItems.map((m) => (
//                         <div
//                           key={m._id}
//                           className="group relative aspect-square rounded-xl border-2 border-transparent bg-muted overflow-hidden transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
//                         >
//                           <Image
//                             src={m.secure_url}
//                             alt={m.alt}
//                             fill
//                             className="object-cover"
//                           />
//                           <Button
//                             type="button"
//                             variant="destructive"
//                             size="icon-xs"
//                             className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
//                             onClick={() => toggleMediaSelection(m)}
//                           >
//                             <X className="w-3.5 h-3.5" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center py-20 text-center">
//                       <div className="p-4 bg-primary/5 rounded-full mb-4 animate-pulse">
//                         <ImagePlus className="w-10 h-10 text-primary/30" />
//                       </div>
//                       <p className="font-bold text-muted-foreground text-base">Select Gallery Images</p>
//                       <p className="text-sm text-muted-foreground/50 mt-1 max-w-[280px]">Drag and drop files or choose from your media library.</p>
//                     </div>
//                   )}
//                 </div>
//                 <FieldError errors={[errors.media]} className="mt-2" />
//               </FieldSet>
//             </div>

//             {/* SIDEBAR PANEL (Right 4 Cols) */}
//             <div className="lg:col-span-4 bg-muted/20 p-6 sm:p-8 space-y-10">
//               {/* SECTION: Classification */}
//               <FieldSet className="space-y-6">
//                 <div className="space-y-1">
//                   <h3 className="text-base font-bold flex items-center gap-2">
//                     <LayoutList className="w-4 h-4 text-primary" />
//                     Categorization
//                   </h3>
//                 </div>

//                 <div className="space-y-6">
//                   <Field>
//                     <FieldTitle className="text-primary font-bold text-xs uppercase tracking-widest">Store Status</FieldTitle>
//                     <Select
//                       options={statusOptions}
//                       selected={selectedStatus}
//                       setSelected={(val) => setValue("status", val, { shouldValidate: true })}
//                       className="h-11 rounded-xl shadow-sm border-border/80"
//                     />
//                     <FieldError errors={[errors.status]} />
//                   </Field>

//                   <Field>
//                     <FieldTitle className="text-primary font-bold text-xs uppercase tracking-widest">Main Category</FieldTitle>
//                     <Select
//                       options={categoryOptions}
//                       selected={selectedCategory}
//                       setSelected={(val) => setValue("category", val, { shouldValidate: true })}
//                       placeholder={categoriesLoading ? "Loading..." : "Select category"}
//                       className="h-11 rounded-xl shadow-sm border-border/80"
//                     />
//                     <FieldError errors={[errors.category]} />
//                   </Field>

//                   <div className="flex items-center justify-between p-5 rounded-2xl bg-background border-2 border-border/50 transition-all hover:border-primary/30 shadow-sm">
//                     <div className="space-y-0.5">
//                       <Label className="font-bold cursor-pointer text-sm text-primary" htmlFor="isFeatured">Featured</Label>
//                       <p className="text-[11px] text-muted-foreground font-medium">Highlight on home screen.</p>
//                     </div>
//                     <Controller
//                       name="isFeatured"
//                       control={control}
//                       render={({ field }) => (
//                         <Switch
//                           id="isFeatured"
//                           checked={field.value}
//                           onCheckedChange={field.onChange}
//                           className="data-[state=checked]:bg-primary"
//                         />
//                       )}
//                     />
//                   </div>
//                 </div>
//               </FieldSet>

//               <Separator className="bg-border/30" />

//               {/* SECTION: Pricing */}
//               <FieldSet className="space-y-6">
//                 <div className="space-y-1">
//                   <h3 className="text-base font-bold flex items-center gap-2">
//                     <DollarSign className="w-4 h-4 text-primary" />
//                     Market Logic
//                   </h3>
//                 </div>

//                 <div className="space-y-6">
//                   <Field>
//                     <FieldTitle className="text-primary font-bold text-xs uppercase tracking-widest">Selling Price</FieldTitle>
//                     <InputGroup className="h-11 rounded-xl shadow-sm border-border/80 bg-background overflow-hidden">
//                       <InputGroupAddon align="inline-start" className="bg-muted/50 border-r border-border/40 w-10">
//                         <InputGroupText className="font-bold text-primary">$</InputGroupText>
//                       </InputGroupAddon>
//                       <InputGroupInput
//                         type="number"
//                         step="0.01"
//                         placeholder="0.00"
//                         {...register("sellingPrice")}
//                         className="font-bold text-lg px-4"
//                       />
//                     </InputGroup>
//                     <FieldError errors={[errors.sellingPrice]} />
//                   </Field>

//                   <Field>
//                     <FieldTitle className="text-muted-foreground font-bold text-xs uppercase tracking-widest">MRP (Retail)</FieldTitle>
//                     <InputGroup className="h-11 rounded-xl shadow-sm border-border/80 bg-background overflow-hidden">
//                       <InputGroupAddon align="inline-start" className="bg-muted/30 border-r border-border/40 w-10">
//                         <InputGroupText className="text-muted-foreground">$</InputGroupText>
//                       </InputGroupAddon>
//                       <InputGroupInput
//                         type="number"
//                         step="0.01"
//                         placeholder="0.00"
//                         {...register("mrp")}
//                         className="italic text-muted-foreground/80 px-4"
//                       />
//                     </InputGroup>
//                     <FieldError errors={[errors.mrp]} />
//                   </Field>

//                   <div className="grid grid-cols-2 gap-4">
//                     <Field>
//                       <FieldTitle className="text-primary font-bold text-xs uppercase tracking-widest">In Stock</FieldTitle>
//                       <Input type="number" placeholder="0" className="h-11 rounded-xl shadow-sm border-border/80 bg-background" {...register("stock")} />
//                       <FieldError errors={[errors.stock]} />
//                     </Field>

//                     <Field>
//                       <FieldTitle className="text-primary font-bold text-xs uppercase tracking-widest">Discount</FieldTitle>
//                       <InputGroup className="h-11 rounded-xl shadow-sm border-border/80 bg-background overflow-hidden">
//                         <InputGroupInput
//                           type="number"
//                           placeholder="0"
//                           {...register("discountPercentage")}
//                           className="font-bold px-4"
//                         />
//                         <InputGroupAddon align="inline-end" className="bg-muted/50 border-l border-border/40 w-10">
//                           <InputGroupText className="font-bold text-primary">%</InputGroupText>
//                         </InputGroupAddon>
//                       </InputGroup>
//                       <FieldError errors={[errors.discountPercentage]} />
//                     </Field>
//                   </div>
//                 </div>
//               </FieldSet>

//               <div className="pt-4">
//                 <Button
//                   className="w-full h-14 text-[13px] font-extrabold uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 rounded-2xl hover:translate-y-[-2px] active:translate-y-0 transition-all duration-300 pointer-events-auto"
//                   onClick={handleSubmit(onSubmit)}
//                   disabled={createMutation.isPending}
//                 >
//                   {createMutation.isPending ? <Loader2 className="animate-spin" /> : "Publish Product"}
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AddProduct;
