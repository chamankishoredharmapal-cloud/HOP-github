import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Globe,
  Film,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  useStudioCollection,
  useCreateCollection,
  useUpdateCollection,
  useUploadCollectionFile,
} from "../hooks/useCollections";
import type { CollectionFormData } from "../services/collectionService";
import { getWorld, type CollectionWorld } from "@/data/collectionWorlds";
import { validateVideoFile, type VideoValidationResult } from "../utils/videoValidation";

const emptyForm: CollectionFormData = {
  name: "",
  slug: "",
  hero_image_url: null,
  hero_video_url: null,
  editorial_story: "",
  tagline: "",
  description: "",
  display_order: 0,
  featured_on_homepage: false,
  status: "draft",
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
  const [videoValidation, setVideoValidation] = useState<VideoValidationResult | null>(null);

  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const world: CollectionWorld | undefined = getWorld(form.slug || form.name);

  const updateField = useCallback(
    <K extends keyof CollectionFormData>(key: K, value: CollectionFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSave = useCallback(
    async (overrideStatus?: string) => {
      setSaving(true);
      try {
        const payload = {
          ...form,
          ...(overrideStatus ? { status: overrideStatus } : {}),
        };

        if (isNew) {
          const created = await createMutation.mutateAsync(payload);
          setForm((prev) => ({ ...prev, ...payload }));
          toast.success("Collection created successfully");
          navigate(`/studio/collections/${created.id}`, { replace: true });
        } else {
          await updateMutation.mutateAsync({ id: id!, data: payload });
          setForm((prev) => ({ ...prev, ...payload }));
          toast.success(
            overrideStatus === "published"
              ? "Collection published to website!"
              : overrideStatus === "draft"
              ? "Collection unpublished to draft"
              : "Collection changes saved",
          );
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Unable to save collection");
      } finally {
        setSaving(false);
      }
    },
    [form, isNew, id, createMutation, updateMutation, navigate],
  );

  // Video Selection, Pre-flight Validation & Upload
  const handleVideoSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!id || id === "new") {
        toast.error("Please create/save the collection record first before uploading films.");
        return;
      }

      // Step 1: Pre-flight Validation
      toast.info("Validating video characteristics...");
      const validation = await validateVideoFile(file);
      setVideoValidation(validation);

      if (!validation.isValid) {
        toast.error(validation.error || "Video rejected. Check specifications.");
        if (videoInputRef.current) videoInputRef.current.value = "";
        return;
      }

      if (validation.warning) {
        toast.warning(validation.warning);
      }

      // Step 2: Upload to Supabase Storage
      setUploadingVideo(true);
      try {
        const videoUrl = await uploadFile.mutateAsync({
          collectionId: id,
          file,
          type: "video",
        });

        updateField("hero_video_url", videoUrl);

        // Auto-associate captured poster if collection doesn't have one
        let posterUrl = form.hero_image_url;
        if (!posterUrl && validation.posterFile) {
          try {
            posterUrl = await uploadFile.mutateAsync({
              collectionId: id,
              file: validation.posterFile,
              type: "image",
            });
            updateField("hero_image_url", posterUrl);
          } catch {
            // Poster upload non-fatal
          }
        }

        // Auto-save database record with new film URL
        await updateMutation.mutateAsync({
          id,
          data: {
            hero_video_url: videoUrl,
            ...(posterUrl ? { hero_image_url: posterUrl } : {}),
          },
        });

        toast.success("Collection film uploaded and saved!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Unable to upload film");
      } finally {
        setUploadingVideo(false);
        if (videoInputRef.current) videoInputRef.current.value = "";
      }
    },
    [id, uploadFile, updateField, form.hero_image_url, updateMutation],
  );

  // Still Image Upload
  const handleImageSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!id || id === "new") {
        toast.error("Please save the collection record first before uploading poster images.");
        return;
      }

      setUploadingImage(true);
      try {
        const url = await uploadFile.mutateAsync({ collectionId: id, file, type: "image" });
        updateField("hero_image_url", url);
        await updateMutation.mutateAsync({ id, data: { hero_image_url: url } });
        toast.success("Poster still frame uploaded and saved");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Unable to upload image");
      } finally {
        setUploadingImage(false);
        if (imageInputRef.current) imageInputRef.current.value = "";
      }
    },
    [id, uploadFile, updateField, updateMutation],
  );

  // Capture current playing frame as poster still
  const handleCapturePosterFrame = useCallback(async () => {
    if (!videoPlayerRef.current || !id || id === "new") return;
    const video = videoPlayerRef.current;
    if (video.readyState < 2) {
      toast.error("Wait for the video to load before capturing a frame.");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        async (blob) => {
          if (!blob) return;
          const file = new File([blob], `${form.slug || "collection"}-poster.jpg`, {
            type: "image/jpeg",
          });
          setUploadingImage(true);
          try {
            const url = await uploadFile.mutateAsync({ collectionId: id, file, type: "image" });
            updateField("hero_image_url", url);
            await updateMutation.mutateAsync({ id, data: { hero_image_url: url } });
            toast.success("Frame captured and set as poster image!");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save captured frame");
          } finally {
            setUploadingImage(false);
          }
        },
        "image/jpeg",
        0.88,
      );
    } catch (err) {
      toast.error("Failed to capture video frame");
    }
  }, [id, form.slug, uploadFile, updateField, updateMutation]);

  const handleRemoveFilm = useCallback(async () => {
    if (!window.confirm("Remove this collection film from the collection?")) return;
    updateField("hero_video_url", null);
    if (id && id !== "new") {
      await updateMutation.mutateAsync({ id, data: { hero_video_url: null } });
      toast.success("Film unlinked from collection");
    }
  }, [id, updateField, updateMutation]);

  const handleRemovePoster = useCallback(async () => {
    if (!window.confirm("Remove the poster image?")) return;
    updateField("hero_image_url", null);
    if (id && id !== "new") {
      await updateMutation.mutateAsync({ id, data: { hero_image_url: null } });
      toast.success("Poster unlinked from collection");
    }
  }, [id, updateField, updateMutation]);

  const handlePreviewCollection = useCallback(() => {
    if (!form.slug) {
      toast.info("Save the collection first to preview.");
      return;
    }
    window.open(`/collections/${form.slug}`, "_blank");
  }, [form.slug]);

  const handlePreviewHomepage = useCallback(() => {
    window.open(`/#collections`, "_blank");
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 rounded bg-muted" />
        <div className="h-96 rounded bg-muted" />
      </div>
    );
  }

  const isPublished = form.status === "published";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Sticky Atelier Action Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur-sm px-6 py-3.5 -mx-6 -mt-6 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/studio/collections")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Collections
          </button>
          <div className="h-4 w-[1px] bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-serif text-base font-light text-foreground">
              {form.name || "Untitled Collection"}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase border ${
                isPublished
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                  : form.status === "archived"
                  ? "bg-muted text-muted-foreground border-border"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              {form.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviewCollection}
                className="gap-1.5 text-xs h-8"
                title="Preview Collection Page"
              >
                <Globe className="h-3.5 w-3.5" />
                Preview Room
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviewHomepage}
                className="gap-1.5 text-xs h-8 hidden sm:flex"
                title="Preview on Homepage"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View on Homepage
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave()}
            disabled={saving}
            className="gap-1.5 text-xs h-8"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save Draft"}
          </Button>

          {isPublished ? (
            <Button
              size="sm"
              onClick={() => handleSave("draft")}
              disabled={saving}
              variant="outline"
              className="gap-1.5 text-xs h-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              Unpublish to Draft
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => handleSave("published")}
              disabled={saving}
              className="gap-1.5 text-xs h-8 bg-ink text-jasmine hover:bg-signature-crimson transition-colors"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Publish Collection
            </Button>
          )}
        </div>
      </div>

      {/* World Identity Context Bar */}
      {world && (
        <div
          className="rounded-lg border p-4 transition-all"
          style={{
            borderColor: `${world.accent}40`,
            backgroundColor: `${world.accent}08`,
          }}
        >
          <div className="flex items-start gap-4">
            <span
              className="h-7 w-7 rounded-full shrink-0 border mt-0.5 shadow-xs"
              style={{ backgroundColor: world.accent, borderColor: `${world.accent}60` }}
            />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-medium text-foreground">
                  World of {world.name}
                </span>
                <span className="text-[11px] text-muted-foreground">({world.accentName})</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 text-xs text-muted-foreground/90">
                <div>
                  <strong className="text-foreground/80 font-medium">Emotion:</strong> {world.emotion}
                </div>
                <div>
                  <strong className="text-foreground/80 font-medium">Light & Temp:</strong> {world.temperature}
                </div>
                <div>
                  <strong className="text-foreground/80 font-medium">Material:</strong> {world.material}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left = Metadata / Story; Right = Film Suite */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Column: Collection Record & Narrative */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-base font-light text-foreground">
                Collection Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Collection Name</Label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      updateField("name", name);
                      if (isNew) {
                        updateField(
                          "slug",
                          name
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, ""),
                        );
                      }
                    }}
                    placeholder="e.g. Kalyani"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>URL Slug</Label>
                  <div className="flex items-center">
                    <span className="px-2.5 py-2 text-xs text-muted-foreground bg-muted rounded-l-md border border-r-0 border-input">
                      /collections/
                    </span>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => updateField("slug", e.target.value)}
                      placeholder="kalyani"
                      className="w-full px-3 py-2 rounded-r-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Tagline (Editorial Header)</Label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => updateField("tagline", e.target.value)}
                  placeholder="e.g. The threshold · The one that changes the temperature of the room"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Short Description</Label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="A concise, quiet description of this collection drape..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Editorial Story (Full Narrative)</Label>
                <textarea
                  value={form.editorial_story}
                  onChange={(e) => updateField("editorial_story", e.target.value)}
                  placeholder="Long-form narrative about the weave, loom geography, weavers, and material history..."
                  rows={8}
                  className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y leading-relaxed font-sans"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-base font-light text-foreground">
                Settings & Storefront Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <p className="text-[11px] text-muted-foreground">
                    Determines position on homepage collection chapter list (0 = first).
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label>Publication Status</Label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="draft">Draft (Private in Studio)</option>
                    <option value="published">Published (Live on Public House)</option>
                    <option value="archived">Archived (Stored, Inactive)</option>
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                <input
                  type="checkbox"
                  checked={form.featured_on_homepage}
                  onChange={(e) => updateField("featured_on_homepage", e.target.checked)}
                  className="h-4 w-4 mt-0.5 rounded border-input text-ink focus:ring-ring"
                />
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-foreground">
                    Feature on Homepage Hero Threshold
                  </span>
                  <p className="text-xs text-muted-foreground">
                    When active, this collection film becomes the primary cinematic film greeting
                    visitors upon entering House of Padmavati.
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Collection Film Suite & Poster Image */}
        <div className="space-y-6">
          {/* COLLECTION FILM SUITE */}
          <Card className="border-border/60 bg-card overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-3 bg-muted/10">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-base font-light text-foreground flex items-center gap-2">
                  <Film className="h-4 w-4 text-ink" />
                  Collection Film
                </CardTitle>
                {form.hero_video_url && (
                  <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                    Active Video Linked
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-5">
              {/* Video Player Display */}
              {form.hero_video_url ? (
                <div className="space-y-3">
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-border/60 bg-black shadow-md group">
                    <video
                      ref={videoPlayerRef}
                      src={form.hero_video_url}
                      poster={form.hero_image_url || undefined}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                      loop
                    />
                  </div>

                  {/* Film controls & metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span className="truncate max-w-[240px] font-mono text-[11px]" title={form.hero_video_url}>
                      {form.hero_video_url.split("/").pop()}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCapturePosterFrame}
                        className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                        title="Capture current playing video frame as still poster"
                      >
                        <Camera className="h-3 w-3" />
                        Capture Frame
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFilm}
                        className="h-7 text-xs gap-1 text-sakura hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/9] rounded-lg border-2 border-dashed border-border/60 flex flex-col items-center justify-center p-6 text-center bg-muted/10">
                  <Film className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="font-serif text-sm text-foreground">No Collection Film Uploaded</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Upload an MP4 or WebM video (16:9, up to 30 MB, &le;60s) to be played full-screen on the website.
                  </p>
                </div>
              )}

              {/* Upload & Validation Area */}
              <div className="space-y-3 pt-2 border-t border-border/40">
                <div className="flex items-center gap-3">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={handleVideoSelect}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingVideo}
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full gap-2 border-border/80 hover:bg-muted"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {uploadingVideo
                      ? "Uploading & Optimizing..."
                      : form.hero_video_url
                      ? "Replace Collection Film"
                      : "Upload Collection Film"}
                  </Button>
                </div>

                {/* Validation Feedback Badge */}
                {videoValidation && (
                  <div
                    className={`rounded-md p-3 text-xs border ${
                      videoValidation.isValid
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                        : "bg-destructive/10 border-destructive/30 text-destructive"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {videoValidation.isValid ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
                      )}
                      <div className="space-y-1">
                        <p className="font-medium">
                          {videoValidation.isValid ? "Video Specs Verified" : "Validation Failed"}
                        </p>
                        <p className="text-[11px] opacity-90 leading-relaxed">
                          {videoValidation.error ||
                            `${videoValidation.width} × ${videoValidation.height} · ${videoValidation.fileSizeFormatted} · ${videoValidation.duration}s · Aspect ${videoValidation.aspectRatio}`}
                        </p>
                        {videoValidation.warning && (
                          <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                            Advisory: {videoValidation.warning}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* POSTER / FALLBACK STILL IMAGE */}
          <Card className="border-border/60 bg-card">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-base font-light text-foreground flex items-center gap-2">
                  <Camera className="h-4 w-4 text-ink" />
                  Poster & Fallback Photography
                </CardTitle>
                {form.hero_image_url && (
                  <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    Still Loaded
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {form.hero_image_url ? (
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-border/60 bg-jasmine-deep">
                    <img
                      src={form.hero_image_url}
                      alt={`${form.name} Poster`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePoster}
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-background/90 text-[11px] text-sakura hover:text-destructive hover:bg-background transition-all shadow-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate font-mono">
                    {form.hero_image_url}
                  </p>
                </div>
              ) : (
                <div className="aspect-[16/10] rounded-lg border-2 border-dashed border-border/60 flex flex-col items-center justify-center p-6 text-center bg-muted/10">
                  <Camera className="h-7 w-7 text-muted-foreground/40 mb-2" />
                  <p className="font-serif text-xs text-foreground">No Poster Still Attached</p>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
                    Displayed while the video buffers, on reduced-motion devices, and as the social share preview.
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-border/40">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingImage}
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full gap-2 border-border/80 hover:bg-muted text-xs"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingImage
                    ? "Uploading Poster..."
                    : form.hero_image_url
                    ? "Replace Poster Still"
                    : "Upload Poster Still"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.14em]">
      {children}
    </label>
  );
}
