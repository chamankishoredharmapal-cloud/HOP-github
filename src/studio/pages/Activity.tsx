import { useState, useEffect, useCallback } from "react";
import {
  History,
  Film,
  Layers,
  Package,
  Image as ImageIcon,
  BookOpen,
  Clock,
  Layout,
  ShieldAlert,
  Sliders,
  Filter,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { activityService, type StudioActivity } from "../services/activityService";

function getEntityIcon(type: StudioActivity["entityType"]) {
  switch (type) {
    case "film":
      return Film;
    case "collection":
      return Layers;
    case "product":
      return Package;
    case "media":
      return ImageIcon;
    case "journal":
      return BookOpen;
    case "site_section":
      return Layout;
    case "disaster_recovery":
      return ShieldAlert;
    case "settings":
      return Sliders;
    default:
      return History;
  }
}

function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return iso;
  }
}

function formatActionText(act: StudioActivity): string {
  switch (act.action) {
    case "film_uploaded":
      return `Uploaded collection film for "${act.entityName}"`;
    case "film_updated":
      return `Updated collection film reference for "${act.entityName}"`;
    case "film_deleted":
      return `Removed film asset "${act.entityName}"`;
    case "collection_created":
      return `Created new collection record "${act.entityName}"`;
    case "collection_updated":
      return `Saved collection modifications for "${act.entityName}"`;
    case "product_created":
      return `Created product record "${act.entityName}"`;
    case "product_updated":
      return `Updated product details for "${act.entityName}"`;
    case "media_uploaded":
      return `Uploaded media asset "${act.entityName}"`;
    case "media_trashed":
      return `Moved media asset "${act.entityName}" to trash`;
    case "media_restored":
      return `Restored media asset "${act.entityName}" from trash`;
    case "media_permanently_purged":
      return `Permanently purged media asset "${act.entityName}"`;
    case "media_deleted":
      return `Permanently removed media asset "${act.entityName}"`;
    case "journal_created":
      return `Penned new journal reflection "${act.entityName}"`;
    case "journal_updated":
      return `Updated journal reflection "${act.entityName}"`;
    case "journal_archived":
      return `Archived journal reflection "${act.entityName}"`;
    case "journal_restored":
      return `Restored journal reflection "${act.entityName}" to draft`;
    case "journal_revision_restored":
      return `Restored previous revision for "${act.entityName}"`;
    case "section_draft_saved":
      return `Saved section draft for "${act.entityName}"`;
    case "section_published":
      return `Published live update for section "${act.entityName}"`;
    case "disaster_recovery_backup":
      return `Executed disaster recovery backup snapshot "${act.entityName}"`;
    default:
      return `${act.action.replace(/_/g, " ")}: ${act.entityName}`;
  }
}

export default function StudioActivityPage() {
  const [activities, setActivities] = useState<StudioActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [hasMore, setHasMore] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const PAGE_SIZE = 40;

  const loadActivities = useCallback(
    async (reset: boolean = true) => {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const offset = reset ? 0 : activities.length;

      try {
        const data = await activityService.getRecent({
          limit: PAGE_SIZE,
          offset,
          entityType: activeFilter === "all" ? undefined : activeFilter,
        });

        if (reset) {
          setActivities(data);
          setHasMore(data.length === PAGE_SIZE);
        } else {
          setActivities((prev) => [...prev, ...data]);
          setHasMore(data.length === PAGE_SIZE);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeFilter]
  );

  useEffect(() => {
    loadActivities(true);
  }, [loadActivities]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h2 className="font-serif text-xl font-light text-foreground tracking-tight flex items-center gap-2">
            <History className="h-4 w-4 text-ink" />
            Atelier Activity &amp; Audit Log
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable operational records of editorial revisions, media purges, section publications, and disaster recovery actions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadActivities(true)}
          className="h-8 text-xs gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="h-3 w-3" />
          Refresh Log
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: "all", label: "All Activity" },
          { key: "journal", label: "Journal & Editorial" },
          { key: "media", label: "Media Catalog" },
          { key: "site_section", label: "Site Sections" },
          { key: "product", label: "Products" },
          { key: "collection", label: "Collections" },
          { key: "settings", label: "Settings" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-3 py-1.5 rounded-md border text-xs whitespace-nowrap transition-colors ${
              activeFilter === tab.key
                ? "bg-brand-violet text-brand-ivory border-ink font-medium shadow-xs"
                : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <Card className="border-border/50 bg-card">
          <CardContent className="p-12 text-center space-y-2">
            <Clock className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="font-serif text-base text-foreground">No activity recorded for this category.</p>
            <p className="text-xs text-muted-foreground">
              Operations performed in Studio will be automatically recorded here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {activities.map((act) => {
            const Icon = getEntityIcon(act.entityType);
            const isExpanded = expandedId === act.id;
            const hasDetails = act.details && Object.keys(act.details).length > 0;

            return (
              <div
                key={act.id}
                onClick={() => hasDetails && setExpandedId(isExpanded ? null : act.id)}
                className={`p-3.5 rounded-lg border border-border/40 bg-card hover:border-signature-crimson/20 transition-all text-xs ${
                  hasDetails ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-md bg-muted/60 text-foreground shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="font-medium text-foreground truncate">
                        {formatActionText(act)}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="capitalize font-mono text-[10px] px-1.5 py-0.2 rounded bg-muted/50 border border-border/40">
                          {act.entityType.replace(/_/g, " ")}
                        </span>
                        {act.userEmail && <span>· {act.userEmail}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {formatTimestamp(act.createdAt)}
                    </span>
                    {hasDetails && (
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && act.details && (
                  <div className="mt-3 pt-3 border-t border-border/30 text-[11px] font-mono bg-muted/20 p-2.5 rounded">
                    <p className="text-muted-foreground mb-1 text-[10px] uppercase font-sans tracking-wider">
                      Audit Payload Snapshot:
                    </p>
                    <pre className="overflow-x-auto text-[10px] text-foreground">
                      {JSON.stringify(act.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}

          {hasMore && (
            <div className="pt-2 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadActivities(false)}
                disabled={loadingMore}
                className="text-xs h-8"
              >
                {loadingMore ? "Loading more..." : "Load Older Records"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
