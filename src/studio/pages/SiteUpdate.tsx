import { useState, useEffect } from "react";
import {
  ExternalLink,
  Save,
  Send,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Film,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  useStudioSiteSections,
  useSaveSectionDraft,
  usePublishSection,
} from "../hooks/useStudioSiteSections";
import { MediaPickerModal } from "../components/MediaPickerModal";
import type { MediaItem, MediaType } from "../types/media";
import {
  HOMEPAGE_SECTION_KEYS,
  type HomepageSectionKey,
  type SiteSectionRecord,
  HeroBannerPayloadSchema,
  CraftStoryPayloadSchema,
  PhilosophyPayloadSchema,
  NoteCardsPayloadSchema,
  InvitationPayloadSchema,
} from "@/types/siteSections";
import { toast } from "sonner";

export default function SiteUpdate() {
  const { data: sections = [], isLoading, refetch } = useStudioSiteSections("home");
  const saveDraftMutation = useSaveSectionDraft();
  const publishMutation = usePublishSection();

  const [activeKey, setActiveKey] = useState<HomepageSectionKey>("home.hero");
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [changeSummary, setChangeSummary] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerField, setMediaPickerField] = useState<string>("");
  const [mediaPickerType, setMediaPickerType] = useState<MediaType[]>(["image"]);

  const currentSection = sections.find((s) => s.key === activeKey);

  // Sync form data whenever the active section changes
  useEffect(() => {
    if (currentSection) {
      setFormData(JSON.parse(JSON.stringify(currentSection.draft_payload || {})));
      setIsDirty(false);
      setValidationErrors([]);
    }
  }, [currentSection]);

  const handleFieldChange = (path: string, value: unknown) => {
    setIsDirty(true);
    setValidationErrors([]);
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let current = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const handleTabSwitch = (newKey: HomepageSectionKey) => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes in this section. Discard changes and switch tabs?"
      );
      if (!confirmLeave) return;
    }
    setActiveKey(newKey);
  };

  const validateCurrentPayload = (): boolean => {
    let result;
    if (activeKey === "home.hero") {
      result = HeroBannerPayloadSchema.safeParse(formData);
    } else if (activeKey === "home.craft") {
      result = CraftStoryPayloadSchema.safeParse(formData);
    } else if (activeKey === "home.philosophy") {
      result = PhilosophyPayloadSchema.safeParse(formData);
    } else if (activeKey === "home.ownership") {
      result = NoteCardsPayloadSchema.safeParse(formData);
    } else if (activeKey === "home.invitation") {
      result = InvitationPayloadSchema.safeParse(formData);
    }

    if (result && !result.success) {
      const errors = result.error.issues.map((err) => `${err.path.join(".")}: ${err.message}`);
      setValidationErrors(errors);
      toast.error("Validation errors detected in payload", {
        description: errors[0],
      });
      return false;
    }
    setValidationErrors([]);
    return true;
  };

  const handleSaveDraft = async () => {
    if (!currentSection) return;
    if (!validateCurrentPayload()) return;

    try {
      await saveDraftMutation.mutateAsync({
        key: currentSection.key,
        expectedVersion: currentSection.version,
        draftPayload: formData,
      });
      setIsDirty(false);
    } catch {
      // Error handled by mutation onError
    }
  };

  const handlePublishConfirm = async () => {
    if (!currentSection) return;
    if (!validateCurrentPayload()) return;

    try {
      // If there are unsaved local edits, save draft first
      if (isDirty) {
        const saveRes = await saveDraftMutation.mutateAsync({
          key: currentSection.key,
          expectedVersion: currentSection.version,
          draftPayload: formData,
        });
        if (!saveRes.success) return;
        setIsDirty(false);
      }

      const activeVersion = isDirty
        ? (currentSection.version + 1)
        : currentSection.version;

      await publishMutation.mutateAsync({
        key: currentSection.key,
        expectedVersion: activeVersion,
        changeSummary: changeSummary.trim() || undefined,
      });
      setIsPublishDialogOpen(false);
      setChangeSummary("");
    } catch {
      // Error handled by mutation onError
    }
  };

  const openMediaPicker = (field: string, types: MediaType[] = ["image"]) => {
    setMediaPickerField(field);
    setMediaPickerType(types);
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (asset: MediaItem) => {
    if (!mediaPickerField) return;
    handleFieldChange(mediaPickerField, asset.public_url);

    // If setting an image, automatically backfill alt_text if blank
    if (mediaPickerField.includes("image_url") && asset.alt_text) {
      const currentAlt = (formData as Record<string, unknown>).alt_text as string;
      if (!currentAlt || currentAlt.trim() === "") {
        handleFieldChange("alt_text", asset.alt_text);
      }
    }
    setMediaPickerOpen(false);
    toast.success("Media selected from library", { description: asset.title });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <Clock className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground font-light">Loading site sections…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-serif tracking-wide text-foreground">Homepage Site Update</h1>
          <p className="text-sm text-muted-foreground">
            Manage live website copy and media for the House of Padmavati homepage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("/?studio_preview=true", "_blank")}
            className="flex items-center gap-1.5"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Storefront Draft Preview</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reload</span>
          </Button>
        </div>
      </div>

      {/* Section Selection Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {HOMEPAGE_SECTION_KEYS.map((key) => {
          const sec = sections.find((s) => s.key === key);
          const isSelected = activeKey === key;
          const hasUnpublished = sec?.has_unpublished_changes;

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTabSwitch(key)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-border/80 bg-card hover:bg-accent/40"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-mono font-medium truncate">
                  {key.replace("home.", "")}
                </span>
                <Badge
                  variant={hasUnpublished ? "outline" : "secondary"}
                  className={`text-[10px] px-1.5 py-0 ${
                    hasUnpublished
                      ? "border-amber-500/60 text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {hasUnpublished ? "Draft" : "Live"}
                </Badge>
              </div>
              <p className="text-xs text-foreground font-serif font-medium truncate">
                {sec?.display_name || key}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">v{sec?.version ?? 1}</p>
            </button>
          );
        })}
      </div>

      {/* Main Section Editor Card */}
      {currentSection && (
        <Card>
          <CardHeader className="border-b bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-serif">{currentSection.display_name}</CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    key: {currentSection.key}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    version: v{currentSection.version}
                  </Badge>
                </div>
                <CardDescription className="mt-1">
                  Section Type: <code className="font-mono">{currentSection.section_type}</code>
                  {currentSection.has_unpublished_changes && (
                    <span className="ml-2 text-amber-600 font-medium">
                      ● Has unpublished draft changes
                    </span>
                  )}
                </CardDescription>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={saveDraftMutation.isPending || publishMutation.isPending}
                  className="flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>{saveDraftMutation.isPending ? "Saving…" : "Save Draft"}</span>
                </Button>
                <Button
                  onClick={() => setIsPublishDialogOpen(true)}
                  disabled={saveDraftMutation.isPending || publishMutation.isPending}
                  className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                  <span>Publish Live</span>
                </Button>
              </div>
            </div>

            {/* Validation errors */}
            {validationErrors.length > 0 && (
              <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-xs text-destructive space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Payload Validation Issues:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="editor">Structured Editor</TabsTrigger>
                <TabsTrigger value="published">Current Live Content</TabsTrigger>
                <TabsTrigger value="draft-json">Draft JSON</TabsTrigger>
              </TabsList>

              {/* Tab 1: Structured Editor */}
              <TabsContent value="editor" className="space-y-6">
                {/* 1. Hero Editor */}
                {activeKey === "home.hero" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hero-eyebrow">Eyebrow / Collection Tag</Label>
                        <Input
                          id="hero-eyebrow"
                          value={(formData.eyebrow as string) || ""}
                          onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
                          placeholder="House of Padmavati"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hero-title">Headline (Title) *</Label>
                        <Input
                          id="hero-title"
                          value={(formData.title as string) || ""}
                          onChange={(e) => handleFieldChange("title", e.target.value)}
                          placeholder="Saree. Time. You."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero-subtitle">Supporting Subtitle</Label>
                      <Textarea
                        id="hero-subtitle"
                        rows={2}
                        value={(formData.subtitle as string) || ""}
                        onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                        placeholder="Five ways of wearing tradition — considered deeply, chosen quietly."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/10">
                      <div className="space-y-2">
                        <Label htmlFor="hero-primary-label">Primary CTA Label *</Label>
                        <Input
                          id="hero-primary-label"
                          value={
                            ((formData.primary_cta as Record<string, string>)?.label as string) || ""
                          }
                          onChange={(e) => handleFieldChange("primary_cta.label", e.target.value)}
                          placeholder="Enter the House"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hero-primary-href">Primary CTA Destination (Href) *</Label>
                        <Input
                          id="hero-primary-href"
                          value={
                            ((formData.primary_cta as Record<string, string>)?.href as string) || ""
                          }
                          onChange={(e) => handleFieldChange("primary_cta.href", e.target.value)}
                          placeholder="/collections"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/10">
                      <div className="space-y-2">
                        <Label htmlFor="hero-secondary-label">Secondary CTA Label</Label>
                        <Input
                          id="hero-secondary-label"
                          value={
                            ((formData.secondary_cta as Record<string, string>)?.label as string) || ""
                          }
                          onChange={(e) => handleFieldChange("secondary_cta.label", e.target.value)}
                          placeholder="Descend into the house"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hero-secondary-href">Secondary CTA Destination (Href)</Label>
                        <Input
                          id="hero-secondary-href"
                          value={
                            ((formData.secondary_cta as Record<string, string>)?.href as string) || ""
                          }
                          onChange={(e) => handleFieldChange("secondary_cta.href", e.target.value)}
                          placeholder="#collections"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero-alt">Accessibility Alt Text *</Label>
                      <Input
                        id="hero-alt"
                        value={(formData.alt_text as string) || ""}
                        onChange={(e) => handleFieldChange("alt_text", e.target.value)}
                        placeholder="House of Padmavati collection film"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="hero-video">Film / Video URL (Optional)</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openMediaPicker("video_url", ["video"])}
                            className="h-6 text-xs px-2"
                          >
                            <Film className="h-3 w-3 mr-1" /> Choose Video
                          </Button>
                        </div>
                        <Input
                          id="hero-video"
                          value={(formData.video_url as string) || ""}
                          onChange={(e) => handleFieldChange("video_url", e.target.value)}
                          placeholder="https://... or leave blank for featured collection video"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="hero-poster">Poster Image URL (Optional)</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openMediaPicker("poster_url", ["image"])}
                            className="h-6 text-xs px-2"
                          >
                            <ImageIcon className="h-3 w-3 mr-1" /> Choose Poster
                          </Button>
                        </div>
                        <Input
                          id="hero-poster"
                          value={(formData.poster_url as string) || ""}
                          onChange={(e) => handleFieldChange("poster_url", e.target.value)}
                          placeholder="https://... or leave blank for featured collection image"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Craft Editor */}
                {activeKey === "home.craft" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="craft-title">Headline (Title) *</Label>
                      <Input
                        id="craft-title"
                        value={(formData.title as string) || ""}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        placeholder="Detail is part of the design."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="craft-lede">Lede Description *</Label>
                      <Textarea
                        id="craft-lede"
                        rows={2}
                        value={(formData.lede as string) || ""}
                        onChange={(e) => handleFieldChange("lede", e.target.value)}
                        placeholder="Before a saree reaches the wardrobe, it passes through a series of considered decisions."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="craft-quote">Weaver Quote *</Label>
                        <Input
                          id="craft-quote"
                          value={(formData.quote as string) || ""}
                          onChange={(e) => handleFieldChange("quote", e.target.value)}
                          placeholder="The border is the signature. Without it, the saree is a stranger."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="craft-attribution">Attribution *</Label>
                        <Input
                          id="craft-attribution"
                          value={(formData.attribution as string) || ""}
                          onChange={(e) => handleFieldChange("attribution", e.target.value)}
                          placeholder="Gangamma"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="craft-facts">Craft Facts / Heritage Details</Label>
                      <Input
                        id="craft-facts"
                        value={(formData.craft_facts as string) || ""}
                        onChange={(e) => handleFieldChange("craft_facts", e.target.value)}
                        placeholder="Molakalmuru, Karnataka · Temple border weaving · Fourth generation"
                      />
                    </div>

                    <div className="p-4 border rounded-md space-y-3 bg-muted/10">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="craft-image">Portrait Image URL *</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openMediaPicker("image_url", ["image"])}
                          className="h-7 text-xs flex items-center gap-1.5"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                          <span>Select from Media Library</span>
                        </Button>
                      </div>
                      <Input
                        id="craft-image"
                        value={(formData.image_url as string) || ""}
                        onChange={(e) => handleFieldChange("image_url", e.target.value)}
                        placeholder="/content/weaver-portrait/... or https://..."
                      />
                      {Boolean(formData.image_url) && (
                        <div className="h-28 w-44 rounded border overflow-hidden bg-black/5 mt-2">
                          <img
                            src={formData.image_url as string}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="craft-caption">Image Caption</Label>
                        <Input
                          id="craft-caption"
                          value={(formData.caption as string) || ""}
                          onChange={(e) => handleFieldChange("caption", e.target.value)}
                          placeholder="Gangamma at her pit loom · Molakalmuru · 6:30 AM"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="craft-alt">Image Accessibility Alt Text *</Label>
                        <Input
                          id="craft-alt"
                          value={(formData.alt_text as string) || ""}
                          onChange={(e) => handleFieldChange("alt_text", e.target.value)}
                          placeholder="Gangamma at her pit loom, morning light from window"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/10">
                      <div className="space-y-2">
                        <Label htmlFor="craft-cta-label">CTA Link Label *</Label>
                        <Input
                          id="craft-cta-label"
                          value={
                            ((formData.cta as Record<string, string>)?.label as string) || ""
                          }
                          onChange={(e) => handleFieldChange("cta.label", e.target.value)}
                          placeholder="Meet the makers"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="craft-cta-href">CTA Link Destination *</Label>
                        <Input
                          id="craft-cta-href"
                          value={
                            ((formData.cta as Record<string, string>)?.href as string) || ""
                          }
                          onChange={(e) => handleFieldChange("cta.href", e.target.value)}
                          placeholder="/journal/gangamma-molakalmuru"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Philosophy Editor */}
                {activeKey === "home.philosophy" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phil-title">Headline (Title) *</Label>
                      <Input
                        id="phil-title"
                        value={(formData.title as string) || ""}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        placeholder="A House, Not a Shop."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phil-lede">Lede Copy *</Label>
                      <Textarea
                        id="phil-lede"
                        rows={3}
                        value={(formData.lede as string) || ""}
                        onChange={(e) => handleFieldChange("lede", e.target.value)}
                        placeholder="We make room for the intelligence of considered making..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phil-closing">Closing Statement</Label>
                      <Textarea
                        id="phil-closing"
                        rows={2}
                        value={(formData.closing as string) || ""}
                        onChange={(e) => handleFieldChange("closing", e.target.value)}
                        placeholder="Not a season. Not a trend. A relationship with what lasts."
                      />
                    </div>
                  </div>
                )}

                {/* 4. Ownership (Note Cards) Editor */}
                {activeKey === "home.ownership" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="own-heading">Section Heading *</Label>
                        <Input
                          id="own-heading"
                          value={(formData.heading as string) || ""}
                          onChange={(e) => handleFieldChange("heading", e.target.value)}
                          placeholder="Wear it slowly. Keep it long."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="own-subheading">Subheading</Label>
                        <Input
                          id="own-subheading"
                          value={(formData.subheading as string) || ""}
                          onChange={(e) => handleFieldChange("subheading", e.target.value)}
                          placeholder="A first drape, a simple ritual, a lifetime of care..."
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-semibold">House Note Cards (1 to 6 cards)</Label>
                      {Array.isArray(formData.cards) &&
                        (formData.cards as Array<Record<string, string>>).map((card, idx) => (
                          <div key={idx} className="p-4 border rounded-md space-y-3 bg-muted/10">
                            <span className="text-xs font-mono font-medium text-muted-foreground uppercase">
                              Card #{idx + 1}
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label htmlFor={`card-${idx}-label`} className="text-xs">
                                  Card Tag / Label
                                </Label>
                                <Input
                                  id={`card-${idx}-label`}
                                  value={card.label || ""}
                                  onChange={(e) =>
                                    handleFieldChange(`cards.${idx}.label`, e.target.value)
                                  }
                                  placeholder="The hand"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`card-${idx}-title`} className="text-xs">
                                  Title
                                </Label>
                                <Input
                                  id={`card-${idx}-title`}
                                  value={card.title || ""}
                                  onChange={(e) =>
                                    handleFieldChange(`cards.${idx}.title`, e.target.value)
                                  }
                                  placeholder="A body in motion."
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`card-${idx}-text`} className="text-xs">
                                Body Text
                              </Label>
                              <Textarea
                                id={`card-${idx}-text`}
                                rows={2}
                                value={card.text || ""}
                                onChange={(e) =>
                                  handleFieldChange(`cards.${idx}.text`, e.target.value)
                                }
                                placeholder="A saree holds the decisions behind it..."
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label htmlFor={`card-${idx}-link-label`} className="text-xs">
                                  Link Text
                                </Label>
                                <Input
                                  id={`card-${idx}-link-label`}
                                  value={card.link_label || ""}
                                  onChange={(e) =>
                                    handleFieldChange(`cards.${idx}.link_label`, e.target.value)
                                  }
                                  placeholder="Read the pit loom"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`card-${idx}-href`} className="text-xs">
                                  Link Destination (Href)
                                </Label>
                                <Input
                                  id={`card-${idx}-href`}
                                  value={card.href || ""}
                                  onChange={(e) =>
                                    handleFieldChange(`cards.${idx}.href`, e.target.value)
                                  }
                                  placeholder="/journal/the-pit-loom"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 5. Invitation Editor */}
                {activeKey === "home.invitation" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="inv-title">Headline (Title) *</Label>
                      <Input
                        id="inv-title"
                        value={(formData.title as string) || ""}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        placeholder="Come in quietly. Choose slowly."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inv-body">Body Copy *</Label>
                      <Textarea
                        id="inv-body"
                        rows={3}
                        value={(formData.body as string) || ""}
                        onChange={(e) => handleFieldChange("body", e.target.value)}
                        placeholder="There is no rush here. Explore the collections..."
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Invitation Action Links</Label>
                      {Array.isArray(formData.links) &&
                        (formData.links as Array<Record<string, string>>).map((lnk, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-md bg-muted/10"
                          >
                            <div className="space-y-1">
                              <Label htmlFor={`inv-link-${idx}-label`} className="text-xs">
                                Link #{idx + 1} Label
                              </Label>
                              <Input
                                id={`inv-link-${idx}-label`}
                                value={lnk.label || ""}
                                onChange={(e) =>
                                  handleFieldChange(`links.${idx}.label`, e.target.value)
                                }
                                placeholder="Explore Collections"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`inv-link-${idx}-href`} className="text-xs">
                                Link Destination (Href)
                              </Label>
                              <Input
                                id={`inv-link-${idx}-href`}
                                value={lnk.href || ""}
                                onChange={(e) =>
                                  handleFieldChange(`links.${idx}.href`, e.target.value)
                                }
                                placeholder="/collections"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Current Live Content */}
              <TabsContent value="published" className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-md">
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Live Published Payload (v{currentSection.version})</span>
                    <span>· Published at: {currentSection.published_at || "Initial Migration"}</span>
                  </div>
                  <pre className="text-xs font-mono bg-background p-4 rounded border overflow-x-auto max-h-96">
                    {JSON.stringify(currentSection.published_payload, null, 2)}
                  </pre>
                </div>
              </TabsContent>

              {/* Tab 3: Draft JSON */}
              <TabsContent value="draft-json" className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-md">
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>Draft Payload Staged for Next Publish</span>
                  </div>
                  <pre className="text-xs font-mono bg-background p-4 rounded border overflow-x-auto max-h-96">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog for Publishing */}
      <AlertDialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">
              Publish {currentSection?.display_name} to Live Storefront?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This action will atomically promote the current draft payload to live production.
                Visitors to <code>https://houseofpadmavati.pages.dev</code> will immediately receive
                these changes without requiring a frontend deployment.
              </p>
              <div className="pt-2">
                <Label htmlFor="publish-summary" className="text-xs font-medium">
                  Change Summary / Audit Note (Optional)
                </Label>
                <Input
                  id="publish-summary"
                  placeholder="e.g. Updated weaver story and headline"
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  className="mt-1"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={publishMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublishConfirm}
              disabled={publishMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {publishMutation.isPending ? "Publishing…" : "Confirm & Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reusable Media Picker Modal from Stage 2 */}
      <MediaPickerModal
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleMediaSelect}
        allowedTypes={mediaPickerType}
        title="Select Media for Section"
      />
    </div>
  );
}
