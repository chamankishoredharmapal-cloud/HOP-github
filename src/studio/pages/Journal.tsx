import { useState, useEffect, useCallback } from "react";
import { Plus, Edit3, Globe, BookOpen, Trash2, CheckCircle2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { journalService, type StudioJournalArticle } from "../services/journalService";

export default function StudioJournal() {
  const [articles, setArticles] = useState<StudioJournalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<StudioJournalArticle | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tag, setTag] = useState("Weave");
  const [dek, setDek] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("published");

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await journalService.getAll();
      setArticles(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleOpenNew = () => {
    setEditingArticle(null);
    setTitle("");
    setSlug("");
    setTag("Weave");
    setDek("");
    setContent("");
    setImg("");
    setStatus("published");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (article: StudioJournalArticle) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSlug(article.slug);
    setTag(article.tag);
    setDek(article.dek);
    setContent(article.content || "");
    setImg(article.img || "");
    setStatus(article.status);
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const cleanSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    setSaving(true);
    try {
      if (editingArticle) {
        await journalService.update(editingArticle.id, {
          title,
          slug: cleanSlug,
          tag,
          dek,
          content,
          img: img || editingArticle.img,
          status,
        });
        toast.success("Journal reflection updated");
      } else {
        await journalService.create({
          title,
          slug: cleanSlug,
          tag,
          dek,
          content,
          img: img || "src/assets/hop-fabric.jpg",
          status,
        });
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

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from Journal?`)) return;
    try {
      await journalService.delete(id);
      toast.success("Article removed");
      await loadArticles();
    } catch (err) {
      toast.error("Failed to delete article");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h2 className="font-serif text-xl font-light text-foreground tracking-tight">
            Editorial & Journal
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Field notes, reflections from the loom, and histories of the weave.
          </p>
        </div>

        <Button
          onClick={handleOpenNew}
          className="gap-1.5 bg-ink text-jasmine hover:bg-signature-crimson transition-colors text-xs h-8"
          size="sm"
        >
          <Plus className="h-3.5 w-3.5" />
          New Reflection
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <Card className="border-border/50 bg-card">
          <CardContent className="p-12 text-center space-y-3">
            <BookOpen className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="font-serif text-base text-foreground">No reflections published yet.</p>
            <Button onClick={handleOpenNew} variant="outline" size="sm" className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> Write first reflection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border/50 bg-card hover:border-signature-crimson/30 hover:shadow-xs transition-all"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="h-12 w-16 shrink-0 rounded overflow-hidden border border-border/40 bg-muted/40">
                  <img
                    src={article.img}
                    alt=""
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
                      className={`inline-block px-2 py-0.2 rounded-full text-[10px] uppercase font-medium border ${
                        article.status === "published"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate max-w-xl">
                    {article.dek}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <a
                  href={`/journal/${article.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="View in public journal"
                >
                  <Globe className="h-4 w-4" />
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(article)}
                  className="h-8 text-xs gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(article.id, article.title)}
                  className="h-8 text-xs text-sakura hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editorial Compose / Edit Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-2xl bg-card border-border/60 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-light text-foreground">
              {editingArticle ? "Edit Reflection" : "New Journal Reflection"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Title
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
                        .replace(/^-|-$/g, ""),
                    );
                  }
                }}
                placeholder="e.g. How morning light reads a weave."
                className="text-sm"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Slug
                </label>
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
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Dek / Short Subtitle
              </label>
              <textarea
                value={dek}
                onChange={(e) => setDek(e.target.value)}
                placeholder="On the soft hour between five and seven, when zari forgets to shine..."
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Cover Image URL
              </label>
              <Input
                value={img}
                onChange={(e) => setImg(e.target.value)}
                placeholder="https://... or src/assets/hop-fabric.jpg"
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Reflection Body (Field Notes)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dispatches from the loom, memories of the weaver, reflections on time and cloth..."
                rows={6}
                className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y font-sans"
              />
            </div>

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
          </div>

          <DialogFooter className="pt-2 border-t border-border/40">
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
              className="gap-1.5 text-xs bg-ink text-jasmine hover:bg-signature-crimson transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Reflection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
