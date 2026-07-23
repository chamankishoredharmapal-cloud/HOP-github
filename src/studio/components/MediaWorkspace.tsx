import { useState, useRef, useCallback } from "react";
import { Upload, Trash2, Star, GripVertical } from "lucide-react";
import type { ProductImage } from "../types/product";

interface MediaWorkspaceProps {
  images: ProductImage[];
  uploading: boolean;
  onUpload: (file: File) => void;
  onDelete: (imageId: string) => void;
  onSetPrimary: (imageId: string) => void;
  onReorder: (orderedIds: string[]) => void;
}

export function MediaWorkspace({
  images, uploading, onUpload, onDelete, onSetPrimary, onReorder,
}: MediaWorkspaceProps) {
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hero = images.find((img) => img.is_primary);
  const gallery = images.filter((img) => !img.is_primary).sort((a, b) => a.sort_order - b.sort_order);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) onUpload(file);
  }, [onUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  }, [onUpload]);

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const reordered = [...gallery];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, moved);
    onReorder(reordered.map((img) => img.id));
    setDragIdx(idx);
  };
  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOver(false);
  };

  return (
    <section className="space-y-5">
      <h3 className="font-serif text-lg font-light text-foreground tracking-tight">Media</h3>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`relative aspect-[4/5] rounded-lg border-2 border-dashed transition-colors overflow-hidden ${
          dragOver ? "border-teal bg-teal/5" : "border-border/60"
        } ${hero ? "" : "flex items-center justify-center"}`}
      >
        {hero ? (
          <img
            src={hero.url}
            alt={hero.alt_text ?? "Hero image"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-6">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground/60">
              {uploading ? "Uploading..." : "Drop hero image here"}
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-teal border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      {gallery.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {gallery.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`relative group aspect-square rounded-md overflow-hidden border border-border/40 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
                dragIdx === idx ? "opacity-50" : ""
              }`}
            >
              <img
                src={img.url}
                alt={img.alt_text ?? ""}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => onSetPrimary(img.id)}
                  className="p-1.5 rounded-full bg-white/90 text-ink hover:bg-white transition-colors"
                  title="Set as hero"
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(img.id)}
                  className="p-1.5 rounded-full bg-white/90 text-sakura hover:bg-white transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="absolute top-1 left-1 p-0.5 rounded bg-white/70 text-muted-foreground">
                <GripVertical className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full py-2 rounded-md border border-dashed border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-teal/50 transition-colors disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Add Image"}
      </button>
    </section>
  );
}
