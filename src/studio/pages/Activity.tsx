import { useState, useEffect } from "react";
import { History, Film, Layers, Package, Image as ImageIcon, BookOpen, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    case "media_deleted":
      return `Permanently removed media asset "${act.entityName}"`;
    case "journal_created":
      return `Penned new journal reflection "${act.entityName}"`;
    case "journal_updated":
      return `Updated journal reflection "${act.entityName}"`;
    default:
      return `${act.action.replace(/_/g, " ")}: ${act.entityName}`;
  }
}

export default function StudioActivityPage() {
  const [activities, setActivities] = useState<StudioActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityService.getRecent(50).then((data) => {
      setActivities(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-border/40">
        <h2 className="font-serif text-xl font-light text-foreground tracking-tight flex items-center gap-2">
          <History className="h-4 w-4 text-ink" />
          Atelier Activity &amp; Audit Log
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Verifiable record of administrative actions, film updates, publishing events, and catalog changes.
        </p>
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
            <p className="font-serif text-base text-foreground">No activity recorded yet.</p>
            <p className="text-xs text-muted-foreground">
              Operations performed in the Studio will be recorded here automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {activities.map((act) => {
            const Icon = getEntityIcon(act.entityType);

            return (
              <div
                key={act.id}
                className="flex items-start sm:items-center justify-between gap-4 p-3.5 rounded-lg border border-border/40 bg-card hover:border-signature-crimson/20 transition-all text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-md bg-muted/60 text-foreground shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-medium text-foreground truncate">
                      {formatActionText(act)}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="capitalize">{act.entityType}</span>
                      {act.userEmail && <span>· {act.userEmail}</span>}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
                  {formatTimestamp(act.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
