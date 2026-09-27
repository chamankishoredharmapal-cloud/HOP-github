import { useState, useEffect, useCallback, useRef, type ChangeEvent } from "react";
import {
  Upload,
  Search,
  Trash2,
  Edit3,
  X,
  Film,
  Image as ImageIcon,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Play,
} from "lucide-react";
import {
  useMediaList,
  useUploadMedia,
  useUpdateMedia,
  useDeleteMedia,
  useCheckMediaUsage,
} from "../hooks/useMedia";
import type { MediaItem, MediaListParams, MediaType } from "../types/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { validateVideoFile } from "../utils/videoValidation";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export default function Media() {
  const [params, setParams] = useState<MediaListParams>({
    search: "",
    type: "all",
    page: 1,
    perPage: 32,
  });
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "image" | "video">("all");

  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Edit Alt Modal
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editAlt, setEditAlt] = useState("");

  // Safe Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Copy state
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useMediaList(params);
  const uploadMedia = useUploadMedia();
  const updateMedia = useUpdateMedia();
  const deleteMedia = useDeleteMedia();

  // Usage check for delete target
  const { data: usageCheck, isLoading: checkingUsage } = useCheckMediaUsage(
    deleteTarget?.url ?? null,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleTabChange = (type: "all" | "image" | "video") => {
    setActiveTab(type);
    setParams((prev) => ({ ...prev, type, page: 1 }));
  };

  const handleImageUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        await uploadMedia.mutateAsync({ file, targetBucket: "product-images" });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [uploadMedia],
  );

  const handleVideoUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      toast.info("Validating film specifications...");
      const validation = await validateVideoFile(file);
      if (!validation.isValid) {
        toast.error(validation.error || "Video rejected");
        if (videoInputRef.current) videoInputRef.current.value = "";
        return;
      }

      try {
        await uploadMedia.mutateAsync({ file, targetBucket: "HOP-films" });
      } finally {
        if (videoInputRef.current) videoInputRef.current.value = "";
      }
    },
    [uploadMedia],
  );

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("Public URL copied to clipboard");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleInitiateDelete = (item: MediaItem) => {
    setDeleteTarget(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMedia.mutateAsync(deleteTarget);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      if (previewItem?.id === deleteTarget.id) {
        setPreviewOpen(false);
      }
    } catch {
      // Handled in mutation onError
    }
  };

  const handleSaveAlt = () => {
    if (!editingItem) return;
    updateMedia.mutate({ id: editingItem.id, alt_text: editAlt || null });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h2 className="font-serif text-xl font-light text-foreground tracking-tight">
            Media Library
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Central repository for collection films, product imagery, and atmospheric stills across HOP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Upload Image Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            size="sm"
            variant="outline"
            disabled={uploadMedia.isPending}
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5 text-xs h-8"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Upload Image
          </Button>

          {/* Upload Video Input */}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={handleVideoUpload}
          />
          <Button
            size="sm"
            disabled={uploadMedia.isPending}
            onClick={() => videoInputRef.current?.click()}
            className="gap-1.5 text-xs h-8 bg-ink text-jasmine hover:bg-signature-crimson transition-colors"
          >
            <Film className="h-3.5 w-3.5" />
            Upload Film
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Type tabs */}
        <div className="flex items-center gap-1 p-1 rounded-md bg-muted/40 border border-border/40 self-start">
          <button
            onClick={() => handleTabChange("all")}
            className={`px-3 py-1 text-xs rounded transition-colors font-medium ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Media
          </button>
          <button
            onClick={() => handleTabChange("video")}
            className={`px-3 py-1 text-xs rounded transition-colors font-medium flex items-center gap-1.5 ${
              activeTab === "video"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Film className="h-3 w-3" />
            Collection Films
          </button>
          <button
            onClick={() => handleTabChange("image")}
            className={`px-3 py-1 text-xs rounded transition-colors font-medium flex items-center gap-1.5 ${
              activeTab === "image"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="h-3 w-3" />
            Photography & Stills
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, collection, product..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8 text-xs h-8 bg-background"
          />
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-border/50 bg-card">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-destructive">Failed to load media assets.</p>
          </CardContent>
        </Card>
      ) : !data || data.items.length === 0 ? (
        <Card className="border-border/50 bg-card">
          <CardContent className="p-12 text-center space-y-2">
            <p className="font-serif text-base text-foreground">No media assets found.</p>
            <p className="text-xs text-muted-foreground">
              {searchInput ? "Try adjusting your search query." : "Upload films or photography to populate the library."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.items.map((item) => {
            const isVideo = item.type === "video";

            return (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-lg border border-border/50 bg-card overflow-hidden hover:border-signature-crimson/40 hover:shadow-xs transition-all"
              >
                {/* Media Preview Box */}
                <div
                  onClick={() => {
                    setPreviewItem(item);
                    setPreviewOpen(true);
                  }}
                  className="relative aspect-square cursor-pointer bg-muted/20 overflow-hidden flex items-center justify-center"
                >
                  {isVideo ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        preload="metadata"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                        <Play className="h-7 w-7 text-white fill-white/80" />
                      </span>
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] uppercase tracking-wider text-jasmine font-medium flex items-center gap-1">
                        <Film className="h-2.5 w-2.5" /> Film
                      </span>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.alt_text || item.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}

                  {/* Bucket tag */}
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-xs text-[9px] font-mono text-muted-foreground">
                    {item.bucket === "HOP-films" ? "HOP-films" : "product-images"}
                  </span>
                </div>

                {/* Footer Metadata */}
                <div className="p-2 space-y-1 bg-card">
                  <p className="text-xs font-medium text-foreground truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {item.usage_context || (isVideo ? "Cinematic Video" : "Storefront Image")}
                  </p>
                </div>

                {/* Action Hover Overlay */}
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(item.url);
                    }}
                    className="p-1 rounded bg-background/90 text-foreground hover:bg-background shadow-xs text-xs"
                    title="Copy Public URL"
                  >
                    {copiedUrl === item.url ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInitiateDelete(item);
                    }}
                    className="p-1 rounded bg-background/90 text-sakura hover:text-destructive hover:bg-background shadow-xs text-xs"
                    title="Safe Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl bg-card border-border/60">
          <DialogHeader>
            <DialogTitle className="font-serif text-base font-light text-foreground">
              {previewItem?.name || "Media Asset"}
            </DialogTitle>
          </DialogHeader>

          {previewItem && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border/50 bg-black flex items-center justify-center">
                {previewItem.type === "video" ? (
                  <video
                    src={previewItem.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={previewItem.url}
                    alt={previewItem.alt_text || previewItem.name}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border rounded-lg p-3 bg-muted/20 border-border/40">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Type</span>
                  <span className="font-medium text-foreground capitalize">{previewItem.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Usage Context</span>
                  <span className="font-medium text-foreground">{previewItem.usage_context || "None"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Storage Bucket</span>
                  <span className="font-mono text-foreground">{previewItem.bucket || "product-images"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Uploaded</span>
                  <span className="text-foreground">{formatDate(previewItem.created_at)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Public Asset URL</span>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={previewItem.url}
                    className="text-xs font-mono h-8 bg-background"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyUrl(previewItem.url)}
                    className="h-8 gap-1 text-xs shrink-0"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between sm:justify-between pt-2 border-t border-border/40">
            {previewItem && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleInitiateDelete(previewItem)}
                className="text-xs text-sakura hover:text-destructive hover:bg-destructive/10 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Asset
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Safe Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border/60 max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle className="font-serif text-lg font-light text-foreground">
                Safe Delete Verification
              </AlertDialogTitle>
            </div>

            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2 text-xs text-foreground/90">
                {checkingUsage ? (
                  <p className="text-muted-foreground">Checking live references across HOP...</p>
                ) : usageCheck?.inUse ? (
                  <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 space-y-2 text-amber-900 dark:text-amber-200">
                    <p className="font-medium">
                      This media is currently in active use on the website:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-[11px]">
                      {usageCheck.references.map((ref, idx) => (
                        <li key={idx} className="font-medium">
                          {ref}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] pt-1 border-t border-amber-500/20 text-destructive font-medium">
                      Deleting it will cause broken visuals or missing films on the live website.
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    This media item is not actively linked as a primary image or collection film. Are you sure you wish to delete it permanently?
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground font-mono truncate">
                  Asset: {deleteTarget?.name}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteTarget(null);
              }}
              className="text-xs h-8"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="text-xs h-8 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {usageCheck?.inUse ? "Remove Anyway" : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
