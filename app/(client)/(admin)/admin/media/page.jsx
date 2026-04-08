"use client";

import axios from "axios";
import UploadMedia from "@/components/shared/UploadMedia";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Media from "@/components/shared/Media";
import UIButton from "@/components/shared/UIButton";
import Link from "next/link";
import { Trash2Icon, ImageIcon } from "lucide-react";
import { ADMIN_MEDIA_SHOW } from "@/routes/Admin.route";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";
import { TooltipButton } from "@/components/shared/TooltipButton";
import useDeleteMutation from "@/hooks/useDeleteMutation";

const MediaPage = () => {
  const queryClient = useQueryClient();
  const [deleteType, setDeleteType] = useState("SD");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const trashOf = searchParams.get("trashof");
      setSelectedMedia([]);

      if (trashOf) {
        setDeleteType("PD");
      } else {
        setDeleteType("SD");
      }
    }
  }, [searchParams]);

  // ✅ fixed query string (& instead of &&)
  const fetchMedia = async (page, deleteType) => {
    const { data } = await axios.get(
      `/api/media?page=${page}&limit=18&deleteType=${deleteType}`,
    );
    return data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["media-data", deleteType],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
  });

  const deleteMutation = useDeleteMutation("media-data", "/api/media/delete");

  const handleDelete = (ids, deleteType) => {
    let c = true;
    if (deleteType === "PD") {
      c = confirm("Are you sure want to delete to the data permanently ?");
    }

    if (c) {
      deleteMutation.mutate({ ids, deleteType });
    }

    setSelectAll(false);
    setSelectedMedia([]);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const allMediaIds = React.useMemo(
    () =>
      data?.pages?.flatMap((page) => page.mediaData.map((m) => m._id)) || [],
    [data],
  );

  useEffect(() => {
    if (selectAll) {
      setSelectedMedia(allMediaIds);
    } else {
      setSelectedMedia([]);
    }
  }, [selectAll, allMediaIds]);

  return (
    <Card className="sm:py-4 py-2 gap-3 sm:gap-6">
      {/* HEADER */}
      <CardHeader className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b [.border-b]:pb-3">
        {/* Left */}
        <div>
          <h4 className="text-xl font-semibold">
            {deleteType === "SD" ? "Media" : "Trash Media"}
          </h4>
          <span className="text-gray-500 text-sm">
            {" "}
            {deleteType === "SD"
              ? "Manage your media files"
              : "Manage your trash media files"}{" "}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 flex-wrap">
          {deleteType === "SD" && (
            <UploadMedia
              isMultiple={true}
              onUpload={() => queryClient.invalidateQueries(["media-data"])}
            />
          )}

          {deleteType === "SD" ? (
            <UIButton
              className="flex items-center gap-2"
              variant="destructive"
              size="sm"
            >
              <Link
                href={`${ADMIN_MEDIA_SHOW}?trashof=media`}
                className="flex items-center gap-2"
              >
                <Trash2Icon className="w-4 h-4" />
                <span>Trash</span>
              </Link>
            </UIButton>
          ) : (
            <UIButton className="flex items-center gap-2" size="sm">
              <Link href={ADMIN_MEDIA_SHOW} className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Media</span>
              </Link>
            </UIButton>
          )}
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent>
        {/* LOADING */}
        {status === "pending" ? (
          <div className="flex justify-center py-10 text-gray-500">
            Loading media...
          </div>
        ) : status === "error" ? (
          <div>
            <h4 className="text-red-500">{error.message}</h4>
          </div>
        ) : (
          <>
            {selectedMedia.length > 0 && (
              <div className="flex px-3 py-2 bg-violet-100 mb-2 rounded justify-between items-center">
                <Label>
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    className="border-primary"
                  />
                  Select All
                </Label>

                <div className="flex gap-2">
                  {deleteType === "SD" ? (
                    <UIButton
                      variant="destructive"
                      onClick={() => handleDelete(selectedMedia, deleteType)}
                    >
                      Move to Trash
                    </UIButton>
                  ) : (
                    <>
                      <TooltipButton
                        icon={<RotateCcw />}
                        text="Restore"
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => handleDelete(selectedMedia, "RSD")}
                      />
                      <TooltipButton
                        icon={<Trash2Icon />}
                        text="Permanently Delete"
                        variant="destructive"
                        onClick={() => handleDelete(selectedMedia, deleteType)}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* EMPTY STATE */}
            {allMediaIds.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                <ImageIcon className="w-16 h-16 opacity-20" />
                <p className="text-lg">No media found</p>
              </div>
            )}

            {/* GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {data?.pages?.map((page, index) => (
                <React.Fragment key={index}>
                  {page?.mediaData?.map((media) => (
                    <Media
                      key={media._id}
                      media={media}
                      handleDelete={handleDelete}
                      deleteType={deleteType}
                      isLoading={
                        deleteMutation.isPending &&
                        deleteMutation.variables?.ids?.includes(media._id)
                      }
                      selectedMedia={selectedMedia}
                      setSelectedMedia={setSelectedMedia}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>

            {/* LOAD MORE */}
            {hasNextPage && (
              <div className="flex justify-center mt-8 pt-4 border-t">
                <UIButton
                  loading={isFetchingNextPage}
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  className="px-8"
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </UIButton>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaPage;
