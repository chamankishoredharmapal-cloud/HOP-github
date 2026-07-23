import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useStudioCollection, useCreateCollection, useUpdateCollection, useUploadCollectionFile,
} from "../hooks/useCollections";
import type { CollectionFormData } from "../services/collectionService";

const emptyForm: CollectionFormData = {
  name: "", slug: "", hero_image_url: null, hero_video_url: null,
  editorial_story: "", tagline: "", description: "", display_order: 0,
  featured_on_homepage: false, status: "draft",
};

export default function CollectionWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const { data: existing, isLoading } = useStudioCollection(isNew ? undefined : id);
  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();
  const uploadFile = useUploadCollectionFile();

  const [form, setForm] = useState<CollectionFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    if (existing && !isNew) {
      setForm({
        name: existing.name,
        slug: existing.slug,
        hero_image_url: existing.hero_image_url,
        hero_video_url: existing.hero_video_url,
        editorial_story: existing.editorial_story ?? "",
        tagline: existing.tagline ?? "",
        description: existing.description ?? "",
        display_order: existing.display_order,
        featured_on_homepage: existing.featured_on_homepage,
        status: existing.status,
      });
    }
  }, [existing, isNew]);

  const updateField = useCallback(<K extends keyof CollectionFormData>(key: K, value: CollectionFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      if (isNew) {
        const created = await createMutation.mutateAsync(form);
        navigate(`/studio/collections/${created.id}`, { replace: true });
      } else {
        await updateMutation.mutateAsync({ id: id!, data: form });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to save collection");
    } finally {
      setSaving(false);
    }
  }, [form, isNew, id, createMutation, updateMutation, navigate]);

  const handleUploadImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!id || id === "new") {
      toast.error("Save the collection first, then upload images.");
      return;
    }
    setUploadingImage(true);
    try {
      const url = await uploadFile.mutateAsync({ collectionId: id, file, type: "image" });
      updateField("hero_image_url", url);
      await updateMutation.mutateAsync({ id, data: { hero_image_url: url } });
      toast.success("Hero image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to upload hero image");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }, [id, uploadFile, updateField, updateMutation]);

  const handleUploadVideo = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!id || id === "new") {
      toast.error("Save the collection first, then upload videos.");
      return;
    }
    setUploadingVideo(true);
    try {
      const url = await uploadFile.mutateAsync({ collectionId: id, file, type: "video" });
      updateField("hero_video_url", url);
      await updateMutation.mutateAsync({ id, data: { hero_video_url: url } });
      toast.success("Hero video uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to upload hero video");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  }, [id, uploadFile, updateField, updateMutation]);

  const handlePreview = useCallback(() => {
    if (!form.slug) {
      toast.info("Save the collection first.");
      return;
    }
    window.open(`/collections/${form.slug}`, "_blank");
  }, [form.slug]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 rounded bg-muted" />
        <div className="h-96 rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur-sm px-6 py-3 -mx-6 -mt-6 mb-6">
        <button
          onClick={() => navigate("/studio/collections")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </button>
        <div className="flex items-center gap-3">
          {!isNew && (
            <Button variant="outline" size="sm" onClick={handlePreview} className="gap-1.5">
              Preview
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 bg-teal-deep text-jasmine hover:bg-teal transition-colors">
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : isNew ? "Create Collection" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8 min-w-0">
          <section className="space-y-5">
            <h3 className="font-serif text-lg font-light text-foreground tracking-tight">Identity</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Collection Name</Label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    updateField("name", e.target.value);
                    if (!form.slug || form.slug === form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")) {
                      updateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                    }
                  }}
                  placeholder="Kalyani"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="kalyani"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="font-serif text-lg font-light text-foreground tracking-tight">Content</h3>
            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                placeholder="Wedding Elegance · Heritage Luxury"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Editorial Story</Label>
              <textarea
                value={form.editorial_story}
                onChange={(e) => updateField("editorial_story", e.target.value)}
                placeholder="The story of this collection..."
                rows={6}
                className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Short Description</Label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="A brief description..."
                rows={3}
                className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="font-serif text-lg font-light text-foreground tracking-tight">Settings</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Display Order</Label>
                <input
                  type="number"
                  min={0}
                  value={form.display_order}
                  onChange={(e) => updateField("display_order", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured_on_homepage}
                onChange={(e) => updateField("featured_on_homepage", e.target.checked)}
                className="h-4 w-4 rounded border-input text-teal-deep focus:ring-ring"
              />
              <span className="text-sm text-muted-foreground">Show on homepage hero</span>
            </label>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
          <section className="space-y-4">
            <h3 className="font-serif text-lg font-light text-foreground tracking-tight">Hero Image</h3>
            {form.hero_image_url ? (
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border/40 bg-jasmine-deep">
                <img
                  src={form.hero_image_url}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => updateField("hero_image_url", null)}
                  className="absolute top-2 right-2 px-2 py-1 rounded bg-background/80 backdrop-blur-sm text-xs text-sakura hover:bg-background transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-[4/5] rounded-lg border-2 border-dashed border-border/60 cursor-pointer hover:border-teal/50 transition-colors bg-card">
                <Upload className="h-6 w-6 text-muted-foreground/50 mb-2" />
                <span className="text-xs text-muted-foreground/60">
                  {uploadingImage ? "Uploading..." : "Upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImage}
                />
              </label>
            )}
          </section>

          <section className="space-y-4">
            <h3 className="font-serif text-lg font-light text-foreground tracking-tight">Hero Video</h3>
            {form.hero_video_url ? (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-border/40 bg-black">
                <video
                  src={form.hero_video_url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <button
                  onClick={() => updateField("hero_video_url", null)}
                  className="absolute top-2 right-2 px-2 py-1 rounded bg-background/80 backdrop-blur-sm text-xs text-sakura hover:bg-background transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-[16/9] rounded-lg border-2 border-dashed border-border/60 cursor-pointer hover:border-teal/50 transition-colors bg-card">
                <Upload className="h-6 w-6 text-muted-foreground/50 mb-2" />
                <span className="text-xs text-muted-foreground/60">
                  {uploadingVideo ? "Uploading..." : "Upload video"}
                </span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleUploadVideo}
                />
              </label>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
      {children}
    </label>
  );
}
