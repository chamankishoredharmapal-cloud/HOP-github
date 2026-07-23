import { useState, useEffect, useCallback, useRef, type ChangeEvent } from "react";
import { Upload, Search, Trash2, Edit3, X } from "lucide-react";
import { useMediaList, useUploadMedia, useUpdateMedia, useDeleteMedia } from "../hooks/useMedia";
import type { MediaListParams } from "../types/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function formatSize(bytes: number): string {
  if (bytes === 0) return "—";
  const sizes = ["B", "KB", "MB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export default function Media() {
  const [params, setParams] = useState<MediaListParams>({
    search: "",
    type: "all",
    page: 1,
    perPage: 24,
    sortBy: "created_at",
    sortDir: "desc",
  });
  const [searchInput, setSearchInput] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useMediaList(params);
  const uploadMedia = useUploadMedia();
  const updateMedia = useUpdateMedia();
  const deleteMedia = useDeleteMedia();

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await uploadMedia.mutateAsync({ file });
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [uploadMedia],
  );

  const handlePreview = useCallback((id: string) => {
    setPreviewId(id);
    setPreviewOpen(true);
  }, []);

  const handleEditStart = useCallback((item: { id: string; alt_text: string | null }) => {
    setEditingId(item.id);
    setEditAlt(item.alt_text ?? "");
  }, []);

  const handleEditSave = useCallback(() => {
    if (!editingId) return;
    updateMedia.mutate({ id: editingId, alt_text: editAlt || null });
    setEditingId(null);
  }, [editingId, editAlt, updateMedia]);

  const previewItem = data?.items.find((i) => i.id === previewId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploadMedia.isPending}>
          <Upload className="h-4 w-4 mr-2" />
          {uploadMedia.isPending ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-sm py-12">
          Failed to load media. Please try again.
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center text-muted-foreground text-sm py-12">
          {params.search ? "No media matches your search." : "No media yet. Upload your first image."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.items.map((item) => (
            <Card
              key={item.id}
              className="border-border/50 bg-card overflow-hidden group cursor-pointer hover:border-teal/30 transition-colors"
              onClick={() => handlePreview(item.id)}
            >
              <div className="aspect-square bg-muted/30 relative overflow-hidden">
                <img
                  src={item.url}
                  alt={item.alt_text ?? item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <CardContent className="p-2.5 space-y-1">
                <p className="text-xs text-foreground truncate font-medium">
                  {item.alt_text || item.name}
                </p>
                <p className="text-[10px] text-muted-foreground">{formatDate(item.created_at)}</p>
                {item.product_name && (
                  <p className="text-[10px] text-teal-deep truncate">{item.product_name}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Page {data.page} of {data.totalPages} ({data.total} items)
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={data.page <= 1}
              onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.page >= data.totalPages}
              onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          {previewItem && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-lg">{previewItem.alt_text || previewItem.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-muted/20 rounded-lg overflow-hidden">
                  <img
                    src={previewItem.url}
                    alt={previewItem.alt_text ?? previewItem.name}
                    className="w-full h-auto object-contain max-h-[50vh]"
                  />
                </div>
                <div className="space-y-3 text-sm md:w-48 shrink-0">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">File</p>
                    <p className="text-foreground">{previewItem.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Type</p>
                    <p className="text-foreground capitalize">{previewItem.mime_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Size</p>
                    <p className="text-foreground">{formatSize(previewItem.file_size)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Uploaded</p>
                    <p className="text-foreground">{formatDate(previewItem.created_at)}</p>
                  </div>
                  {previewItem.product_name && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Product</p>
                      <p className="text-foreground">{previewItem.product_name}</p>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="flex items-center gap-2">
                {editingId === previewItem.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={editAlt}
                      onChange={(e) => setEditAlt(e.target.value)}
                      placeholder="Alt text..."
                      className="flex-1"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleEditSave} disabled={updateMedia.isPending}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditStart(previewItem)}
                    >
                      <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                      Edit Alt Text
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this image?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove the image. Products using this image may appear broken.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              deleteMedia.mutate(previewItem.id, {
                                onSuccess: () => setPreviewOpen(false),
                              });
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
