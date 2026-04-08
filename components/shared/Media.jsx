import React from "react";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { EllipsisVertical, Loader2, Edit2Icon, Link2Icon, Trash2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ADMIN_MEDIA_EDIT } from "@/routes/Admin.route";
import { toast } from "sonner";

const Media = ({
  media,
  handleDelete,
  deleteType,
  selectedMedia,
  setSelectedMedia,
  isLoading,
}) => {
  const handleCheck = () => {
    let newSelectedMedia = [];

    if (selectedMedia.includes(media._id)) {
      newSelectedMedia = selectedMedia.filter((m) => m != media._id);
    } else {
      newSelectedMedia = [...selectedMedia, media._id];
    }
    setSelectedMedia(newSelectedMedia);
  };

  const handleCopyLink = async (url) => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied.");
  };

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 group rounded overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Checkbox */}
      <div className="absolute top-2 left-2 z-20">
        <Checkbox
          checked={selectedMedia.includes(media._id)}
          onCheckedChange={handleCheck}
          className="rounded-full bg-white shadow"
          disabled={isLoading}
        />
      </div>

      {/* Dropdown */}
      <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <button className="p-1 bg-white/70 backdrop-blur cursor-pointer rounded-md hover:bg-white disabled:opacity-50">
              <EllipsisVertical className="w-3 h-5 rounded-full" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-35 sm:w-40">
            {deleteType === "SD" && (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href={ADMIN_MEDIA_EDIT(media._id)}
                    className="flex gap-2 items-center"
                  >
                    <Edit2Icon className="w-4 h-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCopyLink(media.secure_url)}
                  className="flex items-center gap-2"
                >
                  <Link2Icon className="w-4 h-4" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={() => handleDelete([media._id], deleteType)}
              className="flex w-auto items-center gap-2 hover:text-red-500! transition"
            >
              <Trash2Icon className="w-4 h-4 flex gap-3 hover:text-red-500! transition" />
              {deleteType === "SD" ? "Move to Trash" : "Delete permanently"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-10 bg-transparent group-hover:bg-black/20 transition-all duration-150 ease-in pointer-events-none" />

      {/* Image */}
      <Image
        src={media?.secure_url}
        alt={media?.alt || "Image"}
        height={300}
        width={300}
        className="w-full sm:h-[200px] h-[150px] object-cover"
      />
    </div>
  );
};

export default Media;
