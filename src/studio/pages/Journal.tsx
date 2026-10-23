import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit3,
  Globe,
  BookOpen,
  Trash2,
  Save,
  History,
  Image as ImageIcon,
  ExternalLink,
  Archive,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Hash,
} from "lucide-react";
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
import {
  journalService,
  type StudioJournalArticle,
  type JournalArticleRevision,
} from "../services/journalService";
import { MediaPickerModal } from "../components/MediaPickerModal";
import type { MediaItem } from "../types/media";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function StudioJournal() {
  const [articles, setArticles] = useState<StudioJournalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Editor modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<StudioJournalArticle | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tag, setTag] = useState("Weave");
  const [dek, setDek] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("House of Padmavati");
  const [imageAlt, setImageAlt] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [img, setImg] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("published");
  const [changeSummary, setChangeSummary] = useState("");

  // Slug collision state
  const [slugStatus, setSlugStatus] = useState<"checking" | "available" | "taken" | "idle">("idle");

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Revisions Modal state
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionArticle, setRevisionArticle] = useState<StudioJournalArticle | null>(null);
  const [revisions, setRevisions] = useState<JournalArticleRevision[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<JournalArticleRevision | null>(null);

  // Permanent Delete Alert
  const [deleteTarget, setDeleteTarget] = useState<StudioJournalArticle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await journalService.getAll({
        status: activeTab,
        search: searchQuery,
      });
      setArticles(data);
    } catch {
      toast.error("Failed to load journal articles");
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadArticles();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadArticles]);

  // Check slug availability with debounce
  useEffect(() => {
    if (!slug.trim()) {
      setSlugStatus("idle");
      return;
    }
    const timer = setTimeout(async () => {
      setSlugStatus("checking");
      try {
        const res = await journalService.checkSlugAvailability(slug.trim(), editingArticle?.id);
        setSlugStatus(res.available ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [slug, editingArticle]);

  const handleOpenNew = () => {
    setEditingArticle(null);
    setTitle("");
    setSlug("");
    setTag("Weave");
    setDek("");
    setContent("");
    setAuthor("House of Padmavati");
    setImageAlt("");
    setSortOrder(articles.length > 0 ? Math.max(...articles.map((a) => a.sort_order)) + 10 : 10);
    setImg("");
    setStatus("published");
    setChangeSummary("Initial publication");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (article: StudioJournalArticle) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSlug(article.slug);
    setTag(article.tag);
    setDek(article.dek);
    setContent(article.content || "");
    setAuthor(article.author || "House of Padmavati");
    setImageAlt(article.image_alt || "");
    setSortOrder(article.sort_order ?? 0);
    setImg(article.img || "");
    setStatus(article.status);
    setChangeSummary("");
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!dek.trim()) {
      toast.error("Dek / Subtitle is required");
      return;
    }
    const cleanSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    if (slugStatus === "taken") {
      toast.error("This slug is already used by another article. Please use a unique slug.");
      return;
    }

    setSaving(true);
    try {
      if (editingArticle) {
        await journalService.update(
          editingArticle.id,
          {
            title: title.trim(),
            slug: cleanSlug,
            tag: tag.trim(),
            dek: dek.trim(),
            content: content.trim(),
            author: author.trim() || "House of Padmavati",
            image_alt: imageAlt.trim() || null,
            sort_order: Number(sortOrder) || 0,
            img: img || editingArticle.img,
            status,
          },
          changeSummary.trim() || "Updated editorial content"
        );
        toast.success("Journal reflection updated and revision saved");
      } else {
        await journalService.create(
          {
            title: title.trim(),
            slug: cleanSlug,
            tag: tag.trim(),
            dek: dek.trim(),
            content: content.trim(),
            author: author.trim() || "House of Padmavati",
            image_alt: imageAlt.trim() || null,
            sort_order: Number(sortOrder) || 0,
            img: img || "src/assets/hop-fabric.jpg",
            status,
          },
          changeSummary.trim() || "Initial publication"
        );
        toast.success("New journal reflection created");
      }
      setIsEditorOpen(false);
      await loadArticles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save reflection");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (article: StudioJournalArticle) => {
    try {
      await journalService.archive(article.id);
      toast.success(`"${article.title}" archived`);
      await loadArticles();
    } catch {
      toast.error("Failed to archive article");
    }
  };

  const handleRestore = async (article: StudioJournalArticle) => {
    try {
      await journalService.restore(article.id);
      toast.success(`"${article.title}" restored to draft`);
      await loadArticles();
    } catch {
      toast.error("Failed to restore article");
    }
  };

  const handleInitiatePermanentDelete = (article: StudioJournalArticle) => {
    setDeleteTarget(article);
    setDeleteDialogOpen(true);
  };

  const handleConfirmPermanentDelete = async () => {
    if (!deleteTarget) return;
    try {
      await journalService.delete(deleteTarget.id);
      toast.success("Article permanently deleted");
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      await loadArticles();
    } catch {
      toast.error("Failed to delete article");
    }
  };

  const handleOpenRevisions = async (article: StudioJournalArticle) => {
    setRevisionArticle(article);
    setSelectedRevision(null);
    setRevisionModalOpen(true);
    setLoadingRevisions(true);
    try {
      const revs = await journalService.getRevisions(article.id);
      setRevisions(revs);
      if (revs.length > 0) setSelectedRevision(revs[0]);
    } catch {
      toast.error("Failed to fetch revision history");
    } finally {
      setLoadingRevisions(false);
    }
  };

  const handleRestoreRevision = async (rev: JournalArticleRevision) => {
    if (!revisionArticle) return;
    if (
      !window.confirm(
        `Are you sure you want to restore revision #${rev.revision_number} from ${formatDate(
          rev.created_at
        )}? This will overwrite the current content.`
      )
    ) {
      return;
    }

    try {
      await journalService.restoreRevision(revisionArticle.id, rev.revision_number);
      toast.success(`Restored to revision #${rev.revision_number}`);
      setRevisionModalOpen(false);
      await loadArticles();
    } catch {
      toast.error("Failed to restore revision");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h2 className="font-serif text-xl font-light text-foreground tracking-tight">
            Editorial &amp; Journal Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage reflections, field notes, cover photography, revision histories, and publication state.
          </p>
        </div>

        <Button
          onClick={handleOpenNew}
          className="gap-1.5 bg-brand-violet text-brand-ivory hover:bg-signature-crimson transition-colors text-xs h-8"
          size="sm"
        >
          <Plus className="h-3.5 w-3.5" />
          New Reflection
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status tabs */}
        <div className="flex items-center gap-1 p-1 rounded-md bg-muted/40 border border-border/40 self-start">
          {(["all", "published", "draft", "archived"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs rounded transition-colors font-medium capitalize ${
                activeTab === tab
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search reflections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs h-8 bg-background"
          />
        </div>
      </div>

      {/* Articles Listing */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <Card className="border-border/50 bg-card">
          <CardContent className="p-12 text-center space-y-3">
            <BookOpen className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="font-serif text-base text-foreground">No reflections found.</p>
            <p className="text-xs text-muted-foreground">
              {searchQuery ? "Try refining your search filter." : "Write your first editorial reflection."}
            </p>
            <Button onClick={handleOpenNew} variant="outline" size="sm" className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> Pen First Reflection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {articles.map((article) => {
            const isPublished = article.status === "published";
            const isArchived = article.status === "archived";

            return (
              <div
                key={article.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border/50 bg-card hover:border-signature-crimson/30 hover:shadow-xs transition-all"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="h-14 w-20 shrink-0 rounded overflow-hidden border border-border/40 bg-muted/40">
                    <img
                      src={article.img}
                      alt={article.image_alt || article.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-0.5 rounded bg-muted/60 font-medium">
                        {article.tag}
                      </span>
                      <h3 className="font-serif text-base font-light text-foreground truncate">
                        {article.title}
                      </h3>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-medium border ${
                          isPublished
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                            : isArchived
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {article.status}
                      </span>
                      {article.sort_order !== 0 && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          Order: {article.sort_order}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate max-w-xl">
                      {article.dek}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>By {article.author || "House of Padmavati"}</span>
                      {article.published_at && (
                        <span>· Published: {formatDate(article.published_at)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Public or Draft Preview Link */}
                  <a
                    href={`/journal/${article.slug}${isPublished ? "" : "?studio_preview=true"}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title={isPublished ? "View Live on Website" : "Open Authenticated Draft Preview"}
                  >
                    {isPublished ? <Globe className="h-4 w-4" /> : <ExternalLink className="h-4 w-4 text-amber-500" />}
                  </a>

                  {/* Revision History */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenRevisions(article)}
                    className="h-8 text-xs gap-1.5"
                    title="View Revisions & History"
                  >
                    <History className="h-3.5 w-3.5" />
                    History
                  </Button>

                  {/* Edit */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(article)}
                    className="h-8 text-xs gap-1.5"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </Button>

                  {/* Archive / Restore / Delete */}
                  {isArchived ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(article)}
                        className="h-8 text-xs gap-1 text-emerald-600 hover:text-emerald-700"
                        title="Restore to Draft"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Restore
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInitiatePermanentDelete(article)}
                        className="h-8 text-xs text-sakura hover:text-destructive hover:bg-destructive/10"
                        title="Delete Permanently"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchive(article)}
                      className="h-8 text-xs text-muted-foreground hover:text-amber-600"
                      title="Archive Article"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editorial Compose / Edit Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-3xl bg-card border-border/60 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-light text-foreground">
              {editingArticle ? "Edit Journal Reflection" : "New Journal Reflection"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Title *
              </label>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingArticle) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "")
                    );
                  }
                }}
                placeholder="e.g. How morning light reads a weave."
                className="text-sm font-serif"
              />
            </div>

            {/* Slug & Tag */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Slug *
                  </label>
                  {slugStatus === "checking" && (
                    <span className="text-[10px] text-muted-foreground">Checking...</span>
                  )}
                  {slugStatus === "available" && (
                    <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Available
                    </span>
                  )}
                  {slugStatus === "taken" && (
                    <span className="text-[10px] text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Slug in use
                    </span>
                  )}
                </div>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="how-morning-light-reads-a-weave"
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Theme / Tag
                </label>
                <Input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Light, Drape, Loom, Ritual"
                  className="text-xs"
                />
              </div>
            </div>

            {/* Author Byline & Sort Order */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Author Byline
                </label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="House of Padmavati"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Curation Sort Order
                </label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  placeholder="0 (Lower numbers appear first)"
                  className="text-xs font-mono"
                />
              </div>
            </div>

            {/* Dek / Subtitle */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Dek / Short Subtitle *
              </label>
              <textarea
                value={dek}
                onChange={(e) => setDek(e.target.value)}
                placeholder="On the soft hour between five and seven, when zari forgets to shine..."
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            {/* Cover Image with Media Library Picker */}
            <div className="space-y-2 border rounded-lg p-3 bg-muted/20 border-border/50">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Cover Image
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMediaPickerOpen(true)}
                  className="h-7 text-xs gap-1.5"
                >
                  <ImageIcon className="h-3 w-3" />
                  Select from Media Library
                </Button>
              </div>

              {img ? (
                <div className="flex items-center gap-3">
                  <div className="h-16 w-24 rounded overflow-hidden border border-border/60 bg-black/10 shrink-0">
                    <img src={img} alt="Cover preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <Input
                      value={img}
                      onChange={(e) => setImg(e.target.value)}
                      placeholder="Image URL"
                      className="text-xs font-mono h-7"
                    />
                    <Input
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Image alt text (accessibility)"
                      className="text-xs h-7"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImg("");
                      setImageAlt("");
                    }}
                    className="h-7 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Clear
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => setMediaPickerOpen(true)}
                  className="border border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <ImageIcon className="h-6 w-6 text-muted-foreground/40 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Click to select cover photograph</p>
                </div>
              )}
            </div>

            {/* Reflection Body */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Reflection Body (Field Notes)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dispatches from the loom, memories of the weaver, reflections on time and cloth..."
                rows={7}
                className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y font-serif"
              />
            </div>

            {/* Publication Status & Change Summary */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "published" | "draft" | "archived")}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="published">Published (Live in Journal)</option>
                  <option value="draft">Draft (Private in Studio)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Revision Change Note
                </label>
                <Input
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder="e.g. Polished phrasing, updated cover"
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border/40">
            {editingArticle && (
              <a
                href={`/journal/${editingArticle.slug}?studio_preview=true`}
                target="_blank"
                rel="noreferrer"
                className="mr-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Draft Preview
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditorOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={saving}
              onClick={handleSave}
              className="gap-1.5 text-xs bg-brand-violet text-brand-ivory hover:bg-signature-crimson transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Reflection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Picker Modal */}
      <MediaPickerModal
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        allowedTypes={["image"]}
        title="Select Journal Cover Image"
        onSelect={(asset: MediaItem) => {
          setImg(asset.url);
          if (asset.alt_text && !imageAlt) {
            setImageAlt(asset.alt_text);
          }
        }}
      />

      {/* Revisions History Dialog */}
      <Dialog open={revisionModalOpen} onOpenChange={setRevisionModalOpen}>
        <DialogContent className="max-w-4xl bg-card border-border/60 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-light text-foreground flex items-center gap-2">
              <History className="h-4 w-4" />
              Revision History: {revisionArticle?.title}
            </DialogTitle>
          </DialogHeader>

          {loadingRevisions ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Loading immutable revision history...
            </div>
          ) : revisions.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No revisions recorded for this reflection yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Revision list */}
              <div className="border rounded-md border-border/50 divide-y divide-border/40 max-h-[50vh] overflow-y-auto">
                {revisions.map((rev) => {
                  const isSelected = selectedRevision?.id === rev.id;

                  return (
                    <div
                      key={rev.id}
                      onClick={() => setSelectedRevision(rev)}
                      className={`p-3 text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-muted font-medium border-l-2 border-l-signature-crimson"
                          : "hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">
                          Revision #{rev.revision_number}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {rev.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {rev.change_summary || "Updated reflection"}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(rev.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Revision Detail & Diff View */}
              <div className="md:col-span-2 border rounded-md border-border/50 p-4 space-y-3 bg-muted/10 text-xs">
                {selectedRevision ? (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <div>
                        <h4 className="font-serif text-sm font-medium text-foreground">
                          Revision #{selectedRevision.revision_number} Snapshot
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          Recorded: {formatDate(selectedRevision.created_at)} · Actor:{" "}
                          {selectedRevision.actor_email || "admin"}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleRestoreRevision(selectedRevision)}
                        className="h-7 text-xs gap-1.5 bg-brand-violet text-brand-ivory hover:bg-signature-crimson"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore This Version
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                          Title
                        </span>
                        <p className="text-foreground font-medium">{selectedRevision.title}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                            Slug
                          </span>
                          <p className="font-mono text-[11px]">{selectedRevision.slug}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                            Tag / Theme
                          </span>
                          <p>{selectedRevision.tag}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                          Dek / Subtitle
                        </span>
                        <p className="text-muted-foreground italic">{selectedRevision.dek}</p>
                      </div>

                      {selectedRevision.content && (
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                            Body Content Preview
                          </span>
                          <div className="max-h-32 overflow-y-auto p-2 rounded bg-background border border-border/40 font-serif text-[11px] leading-relaxed">
                            {selectedRevision.content}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-10">Select a revision to inspect</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-border/40">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRevisionModalOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permanent Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border/60 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-lg font-light text-foreground text-destructive">
              Permanently Delete Reflection
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-xs text-foreground/90 pt-2">
                <p>
                  Are you sure you want to permanently remove <strong>&ldquo;{deleteTarget?.title}&rdquo;</strong>?
                </p>
                <p className="text-muted-foreground">
                  This action is irreversible and will delete the article along with all immutable revision snapshots.
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
              onClick={handleConfirmPermanentDelete}
              className="text-xs h-8 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Permanently Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
