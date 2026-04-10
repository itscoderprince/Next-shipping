"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Check, Search, RefreshCw } from "lucide-react";
import Image from "next/image";
import UIButton from "./UIButton";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const MediaModel = ({
  open,
  setOpen,
  selectedMedia = [],
  setSelectedMedia,
  allowMultiple = true,
}) => {
  const [search, setSearch] = useState("");
  
  // Fetch Media
  const { data, loading, refetch } = useFetch("/api/media?limit=50&deleteType=SD");
  const mediaData = data?.mediaData || [];

  const handleToggle = (item) => {
    if (!allowMultiple) {
      setSelectedMedia([item]);
      return;
    }

    const isExist = selectedMedia.find((m) => m._id === item._id);
    if (isExist) {
      setSelectedMedia((prev) => prev.filter((m) => m._id !== item._id));
    } else {
      setSelectedMedia((prev) => [...prev, item]);
    }
  };

  const handleClear = () => setSelectedMedia([]);
  const handleClose = () => setOpen(false);

  const filteredMedia = mediaData.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.alt?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] max-h-[90vh] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl"
      >
        <DialogDescription className="sr-only text-transparent">
          Selective media picker for product images and assets.
        </DialogDescription>

        <div className="flex flex-col h-[90vh] md:h-[80vh]">
          {/* HEADER */}
          <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-muted/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <RefreshCw className={cn("w-4 h-4 text-violet-600 cursor-pointer transition-transform hover:rotate-180", loading && "animate-spin")} onClick={() => refetch()} />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-800">Media Library</DialogTitle>
                <p className="text-[10px] text-slate-500 font-medium tracking-tight">Select assets to include in your product.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 max-w-[200px] h-9">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input 
                  placeholder="Search..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs bg-muted/50 border-none rounded-lg focus-visible:ring-violet-200"
                />
              </div>
            </div>
          </DialogHeader>

          {/* CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/30">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 opacity-60">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                <p className="text-xs font-semibold text-slate-500">Retrieving assets...</p>
              </div>
            ) : filteredMedia.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredMedia.map((m) => {
                  const isSelected = selectedMedia.some((item) => item._id === m._id);
                  return (
                    <div
                      key={m._id}
                      onClick={() => handleToggle(m)}
                      className={cn(
                        "group relative aspect-square cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform active:scale-95",
                        isSelected
                          ? "border-violet-600 ring-4 ring-violet-50 shadow-md"
                          : "border-transparent hover:border-violet-200 bg-white"
                      )}
                    >
                      <Image
                        src={m.secure_url}
                        alt={m.alt || "media"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-violet-600 text-white p-1 rounded-full shadow-lg z-10 animate-in zoom-in spin-in-90 fill-mode-both">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-violet-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3 opacity-40 py-20">
                <RefreshCw className="w-12 h-12 text-slate-300" />
                <div className="text-center">
                  <p className="font-bold text-slate-600">No media found</p>
                  <p className="text-xs text-slate-400">Try uploading new files or clearing filters.</p>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-lg">
                Selected: <span className="text-violet-600">{selectedMedia.length}</span>
              </p>
              {selectedMedia.length > 0 && (
                <button 
                  onClick={handleClear}
                  className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <UIButton 
                variant="outline" 
                onClick={handleClose}
                className="flex-1 sm:flex-none h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold uppercase text-[11px] tracking-wider"
              >
                Cancel
              </UIButton>
              <UIButton 
                onClick={handleClose}
                className="flex-1 sm:flex-none h-10 px-10 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-violet-200/50 bg-violet-600 hover:bg-violet-700 active:scale-95"
              >
                Confirm
              </UIButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaModel;
