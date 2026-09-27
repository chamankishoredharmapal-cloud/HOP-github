import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  Package,
  Film,
  Image as ImageIcon,
  BookOpen,
  ArrowRight,
  History,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudioCollections } from "../hooks/useCollections";
import { useProductsList } from "../hooks/useProducts";
import { useMediaList } from "../hooks/useMedia";
import { activityService, type StudioActivity } from "../services/activityService";
import { getStudioEnvironment } from "../utils/environment";

export default function Dashboard() {
  const navigate = useNavigate();
  const env = getStudioEnvironment();

  const { data: collections, isLoading: loadingCollections } = useStudioCollections();
  const { data: products, isLoading: loadingProducts } = useProductsList();
  const { data: media, isLoading: loadingMedia } = useMediaList({ perPage: 1 });
  const [recentActivities, setRecentActivities] = useState<StudioActivity[]>([]);

  useEffect(() => {
    activityService.getRecent(6).then(setRecentActivities);
  }, []);

  // Compute operational figures
  const totalCollections = collections?.length ?? 0;
  const collectionsWithFilms = collections?.filter((c) => Boolean(c.hero_video_url)).length ?? 0;
  const publishedCollections = collections?.filter((c) => c.status === "published").length ?? 0;
  const draftCollections = collections?.filter((c) => c.status === "draft").length ?? 0;

  const totalProducts = products?.length ?? 0;
  const publishedProducts = products?.filter((p) => p.status === "published").length ?? 0;
  const draftProducts = products?.filter((p) => p.status === "draft").length ?? 0;

  const totalMedia = media?.total ?? 0;

  const quickActions = [
    {
      title: "Collections & Films",
      desc: "Curate the 5 collection worlds and manage full-screen films",
      path: "/studio/collections",
      icon: Film,
      badge: `${collectionsWithFilms} of ${totalCollections} Films Active`,
    },
    {
      title: "Product Catalog",
      desc: "Manage sarees, craft stories, inventories, and pricing",
      path: "/studio/products",
      icon: Package,
      badge: `${publishedProducts} Active Drapes`,
    },
    {
      title: "Media Library",
      desc: "Central repository for films, stills, and photography",
      path: "/studio/media",
      icon: ImageIcon,
      badge: `${totalMedia} Assets Stored`,
    },
    {
      title: "Editorial & Journal",
      desc: "Reflections from the loom, histories, and house notes",
      path: "/studio/journal",
      icon: BookOpen,
      badge: "Field Notes",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Atelier Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-border/50 bg-card/60 backdrop-blur-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-2xl font-light text-foreground tracking-tight">
              House of Padmavati
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">
              · Atelier Studio
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
            The private operational control room. Curation of films, saree collections, and editorial
            narratives without code intervention.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/studio/collections")}
            className="text-xs h-8 gap-1.5"
          >
            <Film className="h-3.5 w-3.5" />
            Curate Films
          </Button>
          <Button
            size="sm"
            onClick={() => window.open("/", "_blank")}
            className="text-xs h-8 gap-1.5 bg-ink text-jasmine hover:bg-signature-crimson transition-colors"
          >
            <span>Visit House</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Operational Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card">
          <CardContent className="p-5 space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] uppercase tracking-wider font-medium">Collections</span>
              <Layers className="h-4 w-4" />
            </div>
            <div className="text-2xl font-serif font-light text-foreground">
              {loadingCollections ? "—" : totalCollections}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {publishedCollections} published · {draftCollections} draft
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardContent className="p-5 space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] uppercase tracking-wider font-medium">Collection Films</span>
              <Film className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-serif font-light text-foreground">
              {loadingCollections ? "—" : `${collectionsWithFilms} / ${totalCollections}`}
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              Cinematic loops active
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardContent className="p-5 space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] uppercase tracking-wider font-medium">Saree Catalog</span>
              <Package className="h-4 w-4" />
            </div>
            <div className="text-2xl font-serif font-light text-foreground">
              {loadingProducts ? "—" : totalProducts}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {publishedProducts} active · {draftProducts} drafts
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardContent className="p-5 space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] uppercase tracking-wider font-medium">Media Assets</span>
              <ImageIcon className="h-4 w-4" />
            </div>
            <div className="text-2xl font-serif font-light text-foreground">
              {loadingMedia ? "—" : totalMedia}
            </div>
            <p className="text-[11px] text-muted-foreground">Films, stills &amp; details</p>
          </CardContent>
        </Card>
      </div>

      {/* Primary Workspaces Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {quickActions.map((qa) => {
          const Icon = qa.icon;
          return (
            <div
              key={qa.title}
              onClick={() => navigate(qa.path)}
              className="group cursor-pointer p-5 rounded-lg border border-border/50 bg-card hover:border-signature-crimson/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-muted/70 text-muted-foreground border border-border/40">
                    {qa.badge}
                  </span>
                  <h3 className="font-serif text-lg font-light text-foreground group-hover:text-signature-crimson transition-colors pt-1">
                    {qa.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {qa.desc}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40 text-foreground group-hover:bg-signature-crimson/10 group-hover:text-signature-crimson transition-colors shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                <span>Enter workspace</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Atelier Activity */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
          <CardTitle className="font-serif text-base font-light text-foreground flex items-center gap-2">
            <History className="h-4 w-4 text-ink" />
            Recent Administrative Activity
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/studio/activity")}
            className="text-xs h-7 text-muted-foreground hover:text-foreground"
          >
            View Full Audit Log &rarr;
          </Button>
        </CardHeader>

        <CardContent className="p-4">
          {recentActivities.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">
              No recent changes logged in this session.
            </p>
          ) : (
            <div className="divide-y divide-border/30">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-signature-crimson/70 shrink-0" />
                    <span className="font-medium text-foreground truncate">
                      {act.action.replace(/_/g, " ")}: {act.entityName}
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize hidden sm:inline">
                      ({act.entityType})
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
                    {new Intl.DateTimeFormat("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "short",
                    }).format(new Date(act.createdAt))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
