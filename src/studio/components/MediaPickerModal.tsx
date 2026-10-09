import { useState, useRef } from "react";
import {
  Search,
  Upload,
  Image as ImageIcon,
  Film,
  Check,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaList, useUploadMedia } from "../hooks/useMedia";
import type { MediaItem, MediaType } from "../types/media";
import { toast } from "sonner";

export interface MediaPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: MediaItem) => void;
  allowedTypes?: MediaType[];
  title?: string;
  recommendedAspectRatio?: string;
}

export function MediaPickerModal({
  open,
  onOpenChange,
  onSelect,
  allowedTypes = ["image", "video"],
  title = "Select Media Asset",
  recommendedAspectRatio,
}: MediaPickerModalProps) {
  const [activeType, setActiveType] = useState<MediaType | "all">(
    allowedTypes.length === 1 ? allowedTypes[0] : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaItem | null>(null);

  // Quick Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadAltText, setUploadAltText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useMediaList({
    type: activeType === "all" ? undefined : activeType,
    search: searchQuery,
    page: 1,
    perPage: 24,
  });

  const uploadMutation = useUploadMedia();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|webm|mov)$/i);
    const mediaType: MediaType = isVideo ? "video" : "image";

    if (!allowedTypes.includes(mediaType)) {
      toast.error(`Only ${allowedTypes.join(", ")} files are permitted in this section`);
      return;
    }

    try {
      setIsUploading(true);
      const uploaded = await uploadMutation.mutateAsync({
        file,
        altText: uploadAltText || file.name.replace(/\.[^/.]+$/, ""),
      });
      toast.success("Media asset uploaded and cataloged");
      setSelectedAsset(uploaded);
      setUploadAltText("");
      refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error("Upload error: " + msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirm = () => {
    if (!selectedAsset) return;
    onSelect(selectedAsset);
    onOpenChange(false);
  };

  const items = data?.items || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-6 gap-4">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div>
            <DialogTitle className="font-serif text-xl">{title}</DialogTitle>
            {recommendedAspectRatio && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Recommended aspect ratio: <span className="font-medium text-foreground">{recommendedAspectRatio}</span>
              </p>
            )}
          </div>
        </DialogHeader>

        {/* Search & Type Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media by filename, alt text..."
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2">
            {allowedTypes.includes("image") && allowedTypes.includes("video") && (
              <div className="flex rounded-md border p-0.5 bg-muted/40">
                <button
                  type="button"
                  onClick={() => setActiveType("all")}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    activeType === "all" ? "bg-background shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveType("image")}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    activeType === "image" ? "bg-background shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Images
                </button>
                <button
                  type="button"
                  onClick={() => setActiveType("video")}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    activeType === "video" ? "bg-background shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Films
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes.includes("video") ? "image/*,video/mp4,video/webm" : "image/*"}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 shrink-0 h-9"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload New
            </Button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto min-h-[320px] max-h-[460px] border rounded-md p-3 bg-muted/20">
          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading media library...
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm text-center">
              <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
              <p>No media assets found</p>
              <p className="text-xs mt-1">Upload a new image or film to select it</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((item) => {
                const isSelected = selectedAsset?.id === item.id || selectedAsset?.url === item.url;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedAsset(item)}
                    className={`group relative rounded-md border overflow-hidden text-left transition-all aspect-square bg-background flex flex-col ${
                      isSelected
                        ? "ring-2 ring-primary border-primary shadow-sm"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex-1 overflow-hidden bg-muted relative">
                      {item.type === "video" ? (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-100">
                          <Film className="h-8 w-8 opacity-75" />
                          <span className="absolute bottom-1 right-1 text-[10px] bg-black/75 px-1 rounded text-white font-mono">
                            Film
                          </span>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.alt_text || item.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground rounded-full p-0.5 shadow">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="p-1.5 px-2 bg-background border-t">
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize truncate">
                        {item.category || item.type}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Summary & Action Footer */}
        <DialogFooter className="flex flex-row items-center justify-between sm:justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground truncate max-w-[50%]">
            {selectedAsset ? (
              <span className="font-medium text-foreground">
                Selected: {selectedAsset.name} ({selectedAsset.type})
              </span>
            ) : (
              <span>No asset selected</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!selectedAsset}
              onClick={handleConfirm}
            >
              Select Asset
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
