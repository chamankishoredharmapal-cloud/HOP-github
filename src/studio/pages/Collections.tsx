import { useNavigate } from "react-router-dom";
import { Plus, Edit3, Film, Globe, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStudioCollections } from "../hooks/useCollections";
import { getWorld } from "@/data/collectionWorlds";

const statusStyles: Record<string, string> = {
  draft: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  archived: "bg-muted text-muted-foreground border-border",
};

export default function StudioCollections() {
  const navigate = useNavigate();
  const { data: collections, isLoading, error } = useStudioCollections();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h2 className="font-serif text-xl font-light text-foreground tracking-tight">
            Collections & Films
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curate the five worlds, assign ambient collection films, and manage storefront chapters.
          </p>
        </div>
        <Button
          onClick={() => navigate("/studio/collections/new")}
          className="gap-1.5 bg-ink text-jasmine hover:bg-signature-crimson transition-colors text-xs"
          size="sm"
        >
          <Plus className="h-3.5 w-3.5" />
          New Collection
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
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
            <p className="text-muted-foreground text-sm font-serif">No collections yet.</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Create the first collection room to begin curating films and associating sarees.
            </p>
            <Button
              onClick={() => navigate("/studio/collections/new")}
              variant="outline"
              size="sm"
              className="gap-1.5 mt-2"
            >
              <Plus className="h-3.5 w-3.5" />
              Create your first collection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {collections.map((c) => {
            const world = getWorld(c.slug);
            const hasFilm = Boolean(c.hero_video_url);

            return (
              <div
                key={c.id}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border/50 bg-card hover:border-signature-crimson/30 hover:shadow-xs transition-all"
              >
                {/* Accent strip */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg"
                  style={{ backgroundColor: world?.accent || "#333" }}
                />

                <div className="flex items-center gap-4 min-w-0 pl-2">
                  {/* Thumbnail / Poster */}
                  <div className="relative h-14 w-20 shrink-0 rounded overflow-hidden border border-border/40 bg-muted/40">
                    {c.hero_image_url ? (
                      <img
                        src={c.hero_image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground font-serif"
                        style={{ backgroundColor: world ? `${world.accent}20` : undefined }}
                      >
                        {world?.name.slice(0, 2) || "HOP"}
                      </div>
                    )}
                    {hasFilm && (
                      <span className="absolute bottom-1 right-1 p-0.5 rounded bg-black/70 text-white">
                        <Film className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  {/* Identity */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3
                        onClick={() => navigate(`/studio/collections/${c.id}`)}
                        className="font-serif text-base font-light text-foreground hover:text-signature-crimson cursor-pointer transition-colors"
                      >
                        {c.name}
                      </h3>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase border ${
                          statusStyles[c.status] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {c.status}
                      </span>
                      {c.featured_on_homepage && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-signature-crimson font-medium bg-signature-crimson/10 px-2 py-0.5 rounded-full border border-signature-crimson/20">
                          <Sparkles className="h-2.5 w-2.5" />
                          Hero Threshold
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.tagline || `/collections/${c.slug}`}
                    </p>
                  </div>
                </div>

                {/* Right Metadata & Controls */}
                <div className="flex items-center gap-3 self-end sm:self-center pl-2">
                  <div className="text-right text-xs text-muted-foreground hidden md:block">
                    <div className="flex items-center gap-1.5 justify-end">
                      {hasFilm ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                          <Film className="h-3 w-3" /> Film Active
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 text-[11px]">No Film</span>
                      )}
                    </div>
                    <span className="text-[11px]">Order: {c.display_order}</span>
                  </div>

                  <a
                    href={`/collections/${c.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="View public room"
                  >
                    <Globe className="h-4 w-4" />
                  </a>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/studio/collections/${c.id}`)}
                    className="gap-1.5 text-xs h-8"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Manage
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
