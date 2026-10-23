import { useState, useRef, useCallback } from "react";
import {
  Film,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
  ExternalLink,
  Eye,
  Smartphone,
  Monitor,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { validateVideoFile, formatBytes, type VideoValidationResult } from "../utils/videoValidation";
import { uploadMedia } from "../services/mediaService";
import type { MediaType } from "../types/media";
import type { HomepageVideoPayload } from "@/types/siteSections";
import { toast } from "sonner";

export interface HomepageVideoSectionEditorProps {
  formData: HomepageVideoPayload;
  publishedPayload?: HomepageVideoPayload | null;
  hasUnpublishedChanges: boolean;
  publishedAt?: string | null;
  version: number;
  onChange: (path: string, value: unknown) => void;
  onOpenMediaPicker: (field: string, types?: MediaType[]) => void;
}

interface UploadProgressState {
  target: "desktop" | "mobile" | "poster" | null;
  isUploading: boolean;
  percentage: number;
  step: string;
  error: string | null;
  warning: string | null;
}

export function HomepageVideoSectionEditor({
  formData,
  publishedPayload,
  hasUnpublishedChanges,
  publishedAt,
  version,
  onChange,
  onOpenMediaPicker,
}: HomepageVideoSectionEditorProps) {
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [videoMeta, setVideoMeta] = useState<VideoValidationResult | null>(null);

  const [uploadState, setUploadState] = useState<UploadProgressState>({
    target: null,
    isUploading: false,
    percentage: 0,
    step: "",
    error: null,
    warning: null,
  });

  const isEnabled = formData.is_enabled !== false;
  const isPublishedEnabled = publishedPayload ? publishedPayload.is_enabled !== false : null;

  // Handle Desktop Video File Upload from Computer
  const handleDesktopUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadState({
        target: "desktop",
        isUploading: true,
        percentage: 15,
        step: "Validating video specifications (MP4/WebM, ≤ 30MB, ≤ 60s)...",
        error: null,
        warning: null,
      });

      try {
        const val = await validateVideoFile(file);
        setVideoMeta(val);

        if (!val.isValid) {
          setUploadState({
            target: "desktop",
            isUploading: false,
            percentage: 0,
            step: "",
            error: val.error || "Video rejected",
            warning: null,
          });
          toast.error("Video Validation Failed", { description: val.error });
          if (desktopInputRef.current) desktopInputRef.current.value = "";
          return;
        }

        if (val.warning) {
          setUploadState((prev) => ({ ...prev, warning: val.warning || null }));
          toast.warning("Video Warning", { description: val.warning });
        }

        // Upload to HOP-films bucket
        setUploadState({
          target: "desktop",
          isUploading: true,
          percentage: 55,
          step: "Uploading video to HOP-films storage...",
          error: null,
          warning: val.warning || null,
        });

        const uploadRes = await uploadMedia(
          file,
          formData.alt_text || "Living Saree visual study",
          "HOP-films",
          "film",
        );

        onChange("video_url", uploadRes.url);

        // Auto-assign poster if one was generated and current poster is empty
        if (uploadRes.poster_url && (!formData.poster_url || formData.poster_url.trim() === "")) {
          onChange("poster_url", uploadRes.poster_url);
        }

        setUploadState({
          target: "desktop",
          isUploading: false,
          percentage: 100,
          step: "Video uploaded & registered in media catalog successfully",
          error: null,
          warning: null,
        });

        toast.success("Desktop Video Uploaded", {
          description: `${val.width}×${val.height} · ${val.aspectRatioLabel} · ${val.fileSizeFormatted}`,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setUploadState({
          target: "desktop",
          isUploading: false,
          percentage: 0,
          step: "",
          error: msg,
          warning: null,
        });
        toast.error("Upload Error: " + msg);
      } finally {
        if (desktopInputRef.current) desktopInputRef.current.value = "";
      }
    },
    [formData.alt_text, formData.poster_url, onChange],
  );

  // Handle Mobile Portrait Video Upload
  const handleMobileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadState({
        target: "mobile",
        isUploading: true,
        percentage: 20,
        step: "Validating mobile video specifications...",
        error: null,
        warning: null,
      });

      try {
        const val = await validateVideoFile(file);

        if (!val.isValid) {
          setUploadState({
            target: "mobile",
            isUploading: false,
            percentage: 0,
            step: "",
            error: val.error || "Video rejected",
            warning: null,
          });
          toast.error("Mobile Video Rejected", { description: val.error });
          if (mobileInputRef.current) mobileInputRef.current.value = "";
          return;
        }

        setUploadState({
          target: "mobile",
          isUploading: true,
          percentage: 60,
          step: "Uploading mobile video to HOP-films storage...",
          error: null,
          warning: val.warning || null,
        });

        const uploadRes = await uploadMedia(
          file,
          `${formData.alt_text || "Living Saree visual study"} (Mobile Portrait)`,
          "HOP-films",
          "film",
        );

        onChange("mobile_video_url", uploadRes.url);

        setUploadState({
          target: "mobile",
          isUploading: false,
          percentage: 100,
          step: "Mobile video uploaded successfully",
          error: null,
          warning: null,
        });

        toast.success("Mobile Portrait Video Uploaded", {
          description: `${val.width}×${val.height} · ${val.aspectRatioLabel}`,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setUploadState({
          target: "mobile",
          isUploading: false,
          percentage: 0,
          step: "",
          error: msg,
          warning: null,
        });
        toast.error("Mobile Upload Error: " + msg);
      } finally {
        if (mobileInputRef.current) mobileInputRef.current.value = "";
      }
    },
    [formData.alt_text, onChange],
  );

  // Handle Poster Image Upload
  const handlePosterUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setUploadState({
          target: "poster",
          isUploading: true,
          percentage: 40,
          step: "Uploading poster still to HOP-films storage...",
          error: null,
          warning: null,
        });

        const uploadRes = await uploadMedia(
          file,
          `${formData.alt_text || "Living Saree visual study"} (Poster)`,
          "HOP-films",
          "editorial",
        );

        onChange("poster_url", uploadRes.url);

        setUploadState({
          target: "poster",
          isUploading: false,
          percentage: 100,
          step: "Poster still uploaded successfully",
          error: null,
          warning: null,
        });

        toast.success("Custom Poster Frame Updated");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Poster upload failed";
        setUploadState({
          target: "poster",
          isUploading: false,
          percentage: 0,
          step: "",
          error: msg,
          warning: null,
        });
        toast.error("Poster Upload Error: " + msg);
      } finally {
        if (posterInputRef.current) posterInputRef.current.value = "";
      }
    },
    [formData.alt_text, onChange],
  );

  return (
    <div className="space-y-6">
      {/* 1. STATUS & PUBLISHED STATE BANNER */}
      <Card className="border-border bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-serif">
                  Homepage Video Placeholder (Living Saree)
                </CardTitle>
                <Badge
                  variant={hasUnpublishedChanges ? "outline" : "secondary"}
                  className={`text-xs ${
                    hasUnpublishedChanges
                      ? "border-amber-500/70 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                      : "text-muted-foreground bg-secondary"
                  }`}
                >
                  {hasUnpublishedChanges ? "Draft with Unpublished Changes" : "Draft Matches Live"}
                </Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                Full-width 16:9 cinematic video study located immediately below the Hero Slider and above the Kalyani Collection Film.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open("/?studio_preview=true", "_blank")}
                className="text-xs h-8 flex items-center gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Preview Draft Live</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 rounded-lg bg-muted/40 border text-xs">
            {/* Left: Published Version Info */}
            <div className="space-y-1.5 border-r-0 md:border-r border-border/60 pr-0 md:pr-4">
              <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] block">
                Currently Published on Storefront
              </span>
              <div className="flex items-start gap-2.5">
                {publishedPayload?.video_url ? (
                  <div className="w-16 h-10 rounded overflow-hidden bg-black/60 shrink-0 border relative">
                    {publishedPayload.poster_url ? (
                      <img
                        src={publishedPayload.poster_url}
                        alt="Live Poster"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Film className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-16 h-10 rounded bg-muted/60 border flex items-center justify-center shrink-0 text-muted-foreground text-[10px]">
                    Empty
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate text-foreground">
                    {publishedPayload?.video_url
                      ? publishedPayload.video_url.split("/").pop()
                      : "No video published (Placeholder empty)"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                          isPublishedEnabled ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {isPublishedEnabled ? "Section Active" : "Section Disabled"}
                    </span>
                    {publishedAt && (
                      <span>· Published {new Date(publishedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Draft Status Info */}
            <div className="space-y-1.5 pl-0 md:pl-2">
              <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] block">
                Current Working Draft (v{version})
              </span>
              <p className="font-medium truncate text-foreground">
                {formData.video_url
                  ? formData.video_url.split("/").pop()
                  : "No video selected"}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      isEnabled ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {isEnabled ? "Enabled in Draft" : "Disabled in Draft"}
                </span>
                <span>· {formData.aspect_ratio || "16:9"} Landscape</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. SECTION ENABLE / DISABLE CONTROLS */}
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                <span>Enable Homepage Video Section</span>
                <Badge variant={isEnabled ? "default" : "outline"} className="text-[10px] px-1.5 py-0">
                  {isEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </Label>
              <p className="text-xs text-muted-foreground">
                When enabled, the video autoplays inside the full-width 16:9 frame on the public homepage. When disabled, the placeholder remains a clean empty visual frame preserving the homepage sequence.
              </p>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={(val) => onChange("is_enabled", val)}
              aria-label="Toggle homepage video section enabled"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. UPLOAD PROGRESS & ERROR BANNER */}
      {uploadState.isUploading && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="pt-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-primary flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                {uploadState.step}
              </span>
              <span className="font-mono text-muted-foreground">{uploadState.percentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${uploadState.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {uploadState.error && (
        <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Upload Rejected</p>
            <p>{uploadState.error}</p>
          </div>
        </div>
      )}

      {uploadState.warning && (
        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Notice</p>
            <p>{uploadState.warning}</p>
          </div>
        </div>
      )}

      {/* 4. VIDEO PREVIEW & DUAL-DEVICE CONTROLS */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span>Video Preview</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Inspect the visual study frame before saving or publishing.
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg">
              <Button
                type="button"
                variant={previewMode === "desktop" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode("desktop")}
                className="h-7 px-2.5 text-xs flex items-center gap-1.5"
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>Desktop (16:9)</span>
              </Button>
              <Button
                type="button"
                variant={previewMode === "mobile" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode("mobile")}
                className="h-7 px-2.5 text-xs flex items-center gap-1.5"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Mobile View</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.video_url ? (
            <div
              className={`mx-auto overflow-hidden rounded-lg border bg-black shadow-lg relative transition-all duration-300 ${
                previewMode === "desktop"
                  ? "w-full max-w-3xl aspect-video"
                  : "w-full max-w-[280px] aspect-[9/16]"
              }`}
            >
              <video
                key={`${formData.video_url}-${formData.mobile_video_url}-${previewMode}`}
                src={previewMode === "mobile" && formData.mobile_video_url ? formData.mobile_video_url : formData.video_url}
                poster={formData.poster_url || undefined}
                autoPlay={formData.autoplay !== false}
                loop={formData.loop !== false}
                muted={formData.muted !== false}
                playsInline
                controls
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                <Badge variant="secondary" className="bg-black/70 text-white border-white/20 text-[10px] backdrop-blur-sm">
                  {previewMode === "desktop" ? "16:9 Desktop Frame" : "Mobile View"}
                </Badge>
                {formData.muted !== false && (
                  <Badge variant="outline" className="bg-black/70 text-white/90 border-white/20 text-[10px]">
                    Muted
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 text-center space-y-2 bg-muted/20">
              <Film className="h-10 w-10 text-muted-foreground/60 mb-1" />
              <p className="text-sm font-medium text-foreground">No video currently configured</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Upload a 16:9 landscape video file from your computer or select a film from the HOP Media Library.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => desktopInputRef.current?.click()}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Video</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenMediaPicker("video_url", ["video"])}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Film className="h-3.5 w-3.5" />
                  <span>Media Library</span>
                </Button>
              </div>
            </div>
          )}

          {formData.video_url && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[11px]">
                  {videoMeta ? videoMeta.aspectRatioLabel : "16:9 Landscape"}
                </Badge>
                {videoMeta?.width && videoMeta?.height && (
                  <span>· {videoMeta.width}×{videoMeta.height}</span>
                )}
                {videoMeta?.duration && (
                  <span>· {videoMeta.duration}s</span>
                )}
                {videoMeta?.fileSizeFormatted && (
                  <span>· {videoMeta.fileSizeFormatted}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => desktopInputRef.current?.click()}
                  className="h-7 text-xs flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Replace Video</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onChange("video_url", "");
                    setVideoMeta(null);
                  }}
                  className="h-7 text-xs text-destructive hover:text-destructive flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Remove</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. PRIMARY DESKTOP VIDEO (16:9) SOURCE CONTROLS */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" />
            <span>Desktop Landscape Video (16:9)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Standard 16:9 horizontal film (1280×720 or 1920×1080, H.264 MP4/WebM, max 30MB, max 60s). Fast-start fast-playback optimized.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Video Source URL</Label>
            <div className="flex items-center gap-2">
              <Input
                value={formData.video_url || ""}
                onChange={(e) => onChange("video_url", e.target.value)}
                placeholder="https://.../HOP-films/your-film.mp4 or /optimized/videos/..."
                className="font-mono text-xs"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => desktopInputRef.current?.click()}
                disabled={uploadState.isUploading}
                className="shrink-0 flex items-center gap-1.5 text-xs"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Video</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenMediaPicker("video_url", ["video"])}
                className="shrink-0 flex items-center gap-1.5 text-xs"
              >
                <Film className="h-3.5 w-3.5" />
                <span>Library</span>
              </Button>
            </div>
            <input
              ref={desktopInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={handleDesktopUpload}
            />
          </div>

          {/* Quick presets for existing HOP collection films */}
          <div className="pt-2 border-t">
            <Label className="text-[11px] text-muted-foreground block mb-2">
              Or pick an existing HOP collection film:
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Kalyani (Master)", val: "/optimized/videos/KALYANI-720p.mp4", poster: "/optimized/videos/KALYANI-poster.webp" },
                { label: "Viara", val: "/optimized/videos/VIARA-720p.mp4", poster: "/optimized/videos/VIARA-poster.webp" },
                { label: "Arya", val: "/optimized/videos/ARYA-720p.mp4", poster: "/optimized/videos/ARYA-poster.webp" },
                { label: "Padma", val: "/optimized/videos/PADMA-720p.mp4", poster: "/optimized/videos/PADMA-poster.webp" },
                { label: "Yūgen (Spandana)", val: "/optimized/videos/SPANDANA-720p.mp4", poster: "/optimized/videos/SPANDANA-poster.webp" },
              ].map((film) => (
                <Button
                  key={film.val}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onChange("video_url", film.val);
                    if (!formData.poster_url) onChange("poster_url", film.poster);
                  }}
                  className="h-6 text-[11px] px-2"
                >
                  {film.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. MOBILE PORTRAIT VIDEO (9:16) SOURCE (OPTIONAL) */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            <span>Mobile Portrait Video (9:16) — Optional</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Optional portrait video variant served to mobile screens (width ≤ 767px) via media queries. If left empty, the desktop 16:9 video scales responsively.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Mobile Video URL</Label>
            <div className="flex items-center gap-2">
              <Input
                value={formData.mobile_video_url || ""}
                onChange={(e) => onChange("mobile_video_url", e.target.value)}
                placeholder="https://.../HOP-films/your-film-mobile.mp4 (Optional)"
                className="font-mono text-xs"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => mobileInputRef.current?.click()}
                disabled={uploadState.isUploading}
                className="shrink-0 flex items-center gap-1.5 text-xs"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload 9:16</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenMediaPicker("mobile_video_url", ["video"])}
                className="shrink-0 flex items-center gap-1.5 text-xs"
              >
                <Film className="h-3.5 w-3.5" />
                <span>Library</span>
              </Button>
              {formData.mobile_video_url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange("mobile_video_url", "")}
                  className="h-8 text-xs text-destructive shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            <input
              ref={mobileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={handleMobileUpload}
            />
          </div>
        </CardContent>
      </Card>

      {/* 7. POSTER FRAME / THUMBNAIL STILL */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" />
            <span>Poster Frame / Thumbnail</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Rendered immediately while the video prepares playback to guarantee zero black frames. Auto-extracted from the video or custom uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {formData.poster_url ? (
              <div className="w-40 aspect-video rounded-lg overflow-hidden border bg-black shrink-0 relative group">
                <img
                  src={formData.poster_url}
                  alt="Poster thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-40 aspect-video rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground text-xs shrink-0">
                No Poster
              </div>
            )}
            <div className="space-y-2 flex-1 w-full">
              <Label className="text-xs font-medium">Poster Image URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={formData.poster_url || ""}
                  onChange={(e) => onChange("poster_url", e.target.value)}
                  placeholder="https://.../HOP-films/poster.jpg"
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => posterInputRef.current?.click()}
                  disabled={uploadState.isUploading}
                  className="shrink-0 flex items-center gap-1.5 text-xs"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Poster</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenMediaPicker("poster_url", ["image"])}
                  className="shrink-0 flex items-center gap-1.5 text-xs"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Library</span>
                </Button>
              </div>
              <input
                ref={posterInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePosterUpload}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 8. PLAYBACK & LOOPING SETTINGS */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Playback &amp; Behavior Settings</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Configure ambient playback behavior. Standard luxury editorial conventions default to muted continuous autoplay.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Autoplay</Label>
                <p className="text-[11px] text-muted-foreground">Plays on viewport entry</p>
              </div>
              <Switch
                checked={formData.autoplay !== false}
                onCheckedChange={(val) => onChange("autoplay", val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Loop Continuously</Label>
                <p className="text-[11px] text-muted-foreground">Repeats video smoothly</p>
              </div>
              <Switch
                checked={formData.loop !== false}
                onCheckedChange={(val) => onChange("loop", val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Muted Audio</Label>
                <p className="text-[11px] text-muted-foreground">Required for autoplay</p>
              </div>
              <Switch
                checked={formData.muted !== false}
                onCheckedChange={(val) => onChange("muted", val)}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <Label className="text-xs font-medium">Alt Text / Accessibility Description</Label>
            <Input
              value={formData.alt_text || ""}
              onChange={(e) => onChange("alt_text", e.target.value)}
              placeholder="Living Saree visual study"
              className="text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              Screen reader description used for accessibility and aria-label.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomepageVideoSectionEditor;
