import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductStatus } from "../types/product";

const statusLabels: Record<ProductStatus, string> = {
  draft: "Draft",
  review: "Ready for Review",
  published: "Published",
  archived: "Archived",
};

const statusStyles: Record<ProductStatus, string> = {
  draft: "bg-jasmine-deep text-ink",
  review: "bg-sand/60 text-ink",
  published: "bg-teal-deep/10 text-teal-deep",
  archived: "bg-muted text-muted-foreground",
};

interface TopActionBarProps {
  title: string;
  status: ProductStatus;
  isDirty: boolean;
  saving: boolean;
  onSave: () => void;
  onPublish: () => void;
  onPreview: () => void;
}

export function TopActionBar({
  title, status, isDirty, saving, onSave, onPublish, onPreview,
}: TopActionBarProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur-sm px-6 py-3 -mx-6 -mt-6 mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/studio/products")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>

        <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || "bg-jasmine-deep text-ink"}`}>
          {statusLabels[status] || "Draft"}
        </span>

        {isDirty && (
          <span className="text-xs text-sakura font-medium">Unsaved changes</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {title && (
          <span className="text-sm font-serif text-foreground/70 hidden md:block max-w-[200px] truncate">
            {title}
          </span>
        )}
        <Button variant="outline" size="sm" onClick={onPreview} className="gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          Preview
        </Button>
        <Button variant="secondary" size="sm" onClick={onSave} disabled={saving} className="gap-1.5">
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : "Save Draft"}
        </Button>
        <Button size="sm" onClick={onPublish} disabled={saving} className="gap-1.5 bg-teal-deep text-jasmine hover:bg-teal transition-colors">
          <Send className="h-3.5 w-3.5" />
          Publish
        </Button>
      </div>
    </div>
  );
}
