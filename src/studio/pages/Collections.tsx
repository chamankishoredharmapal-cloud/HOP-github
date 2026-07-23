import { useNavigate } from "react-router-dom";
import { Plus, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStudioCollections } from "../hooks/useCollections";

const statusStyles: Record<string, string> = {
  draft: "bg-jasmine-deep text-ink",
  published: "bg-teal-deep/10 text-teal-deep",
};

export default function StudioCollections() {
  const navigate = useNavigate();
  const { data: collections, isLoading, error } = useStudioCollections();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-light text-foreground tracking-tight">
          Collections
        </h2>
        <Button
          onClick={() => navigate("/studio/collections/new")}
          className="gap-1.5 bg-teal-deep text-jasmine hover:bg-teal transition-colors"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New Collection
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-border/50 bg-card">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-destructive">Failed to load collections.</p>
          </CardContent>
        </Card>
      ) : !collections || collections.length === 0 ? (
        <Card className="border-border/50 bg-card">
          <CardContent className="p-12 text-center space-y-3">
            <p className="text-muted-foreground text-sm">No collections yet.</p>
            <Button
              onClick={() => navigate("/studio/collections/new")}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Create your first collection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {collections.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/studio/collections/${c.id}`)}
              className="w-full text-left p-4 rounded-lg border border-border/40 bg-card hover:border-teal/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-base font-light text-foreground">
                      {c.name}
                    </h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[c.status] || "bg-jasmine-deep text-ink"}`}>
                      {c.status}
                    </span>
                    {c.featured_on_homepage && (
                      <span className="text-[10px] uppercase tracking-[0.12em] text-teal-deep font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    /collections/{c.slug}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {c.hero_video_url ? <span>Has video</span> : <span className="text-sakura/60">No video</span>}
                  <span>Order: {c.display_order}</span>
                  <Edit3 className="h-3.5 w-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
