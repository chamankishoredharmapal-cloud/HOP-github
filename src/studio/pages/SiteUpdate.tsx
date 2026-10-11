import { useState, useEffect, useMemo } from "react";
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
  Plus,
  Trash2,
  BookOpen,
  Mail,
  Home,
  Shield,
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
  ABOUT_SECTION_KEYS,
  CARE_SECTION_KEYS,
  POLICY_SECTION_KEYS,
  type HomepageSectionKey,
  type AboutSectionKey,
  type CareSectionKey,
  type PolicySectionKey,
  type SitePageKey,
  type SiteSectionRecord,
  HeroBannerPayloadSchema,
  CraftStoryPayloadSchema,
  PhilosophyPayloadSchema,
  NoteCardsPayloadSchema,
  InvitationPayloadSchema,
  AboutStoryPayloadSchema,
  CustomerCarePayloadSchema,
  PolicyDocumentPayloadSchema,
  DEFAULT_HERO_PAYLOAD,
  DEFAULT_CRAFT_PAYLOAD,
  DEFAULT_PHILOSOPHY_PAYLOAD,
  DEFAULT_OWNERSHIP_PAYLOAD,
  DEFAULT_INVITATION_PAYLOAD,
  DEFAULT_ABOUT_STORY_PAYLOAD,
  DEFAULT_CUSTOMER_CARE_PAYLOAD,
  DEFAULT_SHIPPING_POLICY_PAYLOAD,
  DEFAULT_RETURNS_POLICY_PAYLOAD,
  DEFAULT_PRIVACY_POLICY_PAYLOAD,
  DEFAULT_TERMS_POLICY_PAYLOAD,
} from "@/types/siteSections";
import { toast } from "sonner";

export default function SiteUpdate() {
  const [activePage, setActivePage] = useState<SitePageKey>("home");
  const { data: sections = [], isLoading, refetch } = useStudioSiteSections(activePage);
  const saveDraftMutation = useSaveSectionDraft();
  const publishMutation = usePublishSection();

  const [activeKey, setActiveKey] = useState<string>("home.hero");
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [changeSummary, setChangeSummary] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerField, setMediaPickerField] = useState<string>("");
  const [mediaPickerType, setMediaPickerType] = useState<MediaType[]>(["image"]);

  // Available section keys for the active page
  const pageSectionKeys = useMemo<readonly string[]>(() => {
    if (activePage === "home") return HOMEPAGE_SECTION_KEYS;
    if (activePage === "about") return ABOUT_SECTION_KEYS;
    if (activePage === "care") return CARE_SECTION_KEYS;
    if (activePage === "policy") return POLICY_SECTION_KEYS;
    return HOMEPAGE_SECTION_KEYS;
  }, [activePage]);

  // Ensure activeKey belongs to active page
  useEffect(() => {
    if (!pageSectionKeys.includes(activeKey)) {
      setActiveKey(pageSectionKeys[0]);
    }
  }, [activePage, pageSectionKeys, activeKey]);

  // Find or create fallback section record
  const currentSection = useMemo<SiteSectionRecord>(() => {
    const existing = sections.find((s) => s.key === activeKey);
    if (existing) return existing;

    // Fallback virtual record if section row is not yet in the DB
    let defaultPayload: Record<string, unknown> = DEFAULT_HERO_PAYLOAD as unknown as Record<string, unknown>;
    let type = "hero_banner";
    let displayName = "Homepage Hero";

    if (activeKey === "home.craft") {
      defaultPayload = DEFAULT_CRAFT_PAYLOAD as unknown as Record<string, unknown>;
      type = "craft_story";
      displayName = "Homepage Craft (Gangamma)";
    } else if (activeKey === "home.philosophy") {
      defaultPayload = DEFAULT_PHILOSOPHY_PAYLOAD as unknown as Record<string, unknown>;
      type = "philosophy";
      displayName = "Homepage Philosophy";
    } else if (activeKey === "home.ownership") {
      defaultPayload = DEFAULT_OWNERSHIP_PAYLOAD as unknown as Record<string, unknown>;
      type = "note_cards";
      displayName = "Homepage Ownership (House Notes)";
    } else if (activeKey === "home.invitation") {
      defaultPayload = DEFAULT_INVITATION_PAYLOAD as unknown as Record<string, unknown>;
      type = "invitation";
      displayName = "Homepage Invitation";
    } else if (activeKey === "about.story") {
      defaultPayload = DEFAULT_ABOUT_STORY_PAYLOAD as unknown as Record<string, unknown>;
      type = "story";
      displayName = "The House (Our Story)";
    } else if (activeKey === "care.info") {
      defaultPayload = DEFAULT_CUSTOMER_CARE_PAYLOAD as unknown as Record<string, unknown>;
      type = "custom_section";
      displayName = "Customer Care Info";
    } else if (activeKey === "policy.shipping") {
      defaultPayload = DEFAULT_SHIPPING_POLICY_PAYLOAD as unknown as Record<string, unknown>;
      type = "policy_document";
      displayName = "Shipping Policy";
    } else if (activeKey === "policy.returns") {
      defaultPayload = DEFAULT_RETURNS_POLICY_PAYLOAD as unknown as Record<string, unknown>;
      type = "policy_document";
      displayName = "Returns & Refund Policy";
    } else if (activeKey === "policy.privacy") {
      defaultPayload = DEFAULT_PRIVACY_POLICY_PAYLOAD as unknown as Record<string, unknown>;
      type = "policy_document";
      displayName = "Privacy Policy";
    } else if (activeKey === "policy.terms") {
      defaultPayload = DEFAULT_TERMS_POLICY_PAYLOAD as unknown as Record<string, unknown>;
      type = "policy_document";
      displayName = "Terms & Conditions";
    }

    return {
      key: activeKey,
      page_name: activePage,
      section_type: type,
      display_name: displayName,
      version: 1,
      draft_payload: defaultPayload,
      published_payload: defaultPayload,
      status: "published",
      has_unpublished_changes: false,
      published_at: null,
      published_by: null,
      updated_at: new Date().toISOString(),
      updated_by: null,
      created_at: new Date().toISOString(),
    };
  }, [sections, activeKey, activePage]);

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
        if (!current[parts[i]]) {
          current[parts[i]] = isNaN(Number(parts[i + 1])) ? {} : [];
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const handlePageSwitch = (newPage: SitePageKey) => {
    if (newPage === activePage) return;
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes on this page. Discard changes and switch?"
      );
      if (!confirmLeave) return;
    }
    setActivePage(newPage);
  };

  const handleTabSwitch = (newKey: string) => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes in this section. Discard changes and switch sections?"
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
    } else if (activeKey === "about.story") {
      result = AboutStoryPayloadSchema.safeParse(formData);
    } else if (activeKey === "care.info") {
      result = CustomerCarePayloadSchema.safeParse(formData);
    } else if (activeKey.startsWith("policy.")) {
      result = PolicyDocumentPayloadSchema.safeParse(formData);
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
        ? currentSection.version + 1
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

    if (mediaPickerField.includes("image_url") && asset.alt_text) {
      const currentAlt = (formData as Record<string, unknown>).image_alt as string;
      if (!currentAlt || currentAlt.trim() === "") {
        handleFieldChange("image_alt", asset.alt_text);
      }
    }
    setMediaPickerOpen(false);
    toast.success("Media selected from library", { description: asset.title });
  };

  const getPreviewUrl = () => {
    if (activePage === "home") return "/?studio_preview=true";
    if (activePage === "about") return "/about?studio_preview=true";
    if (activePage === "care") return "/customer-care?studio_preview=true";
    if (activeKey === "policy.shipping") return "/shipping-policy?studio_preview=true";
    if (activeKey === "policy.returns") return "/returns-policy?studio_preview=true";
    if (activeKey === "policy.privacy") return "/privacy-policy?studio_preview=true";
    if (activeKey === "policy.terms") return "/terms-of-service?studio_preview=true";
    return "/?studio_preview=true";
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-serif tracking-wide text-foreground">Site Update Workspace</h1>
          <p className="text-sm text-muted-foreground">
            Manage live website copy, brand story, policies, and media with draft/publish protection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(getPreviewUrl(), "_blank")}
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

      {/* Page Navigation Tabs */}
      <div className="flex items-center gap-2 border-b pb-3 overflow-x-auto">
        <Button
          variant={activePage === "home" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handlePageSwitch("home")}
          className="flex items-center gap-1.5 shrink-0"
        >
          <Home className="h-4 w-4" />
          <span>Homepage</span>
        </Button>
        <Button
          variant={activePage === "about" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handlePageSwitch("about")}
          className="flex items-center gap-1.5 shrink-0"
        >
          <BookOpen className="h-4 w-4" />
          <span>About (The House)</span>
        </Button>
        <Button
          variant={activePage === "care" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handlePageSwitch("care")}
          className="flex items-center gap-1.5 shrink-0"
        >
          <Mail className="h-4 w-4" />
          <span>Customer Care</span>
        </Button>
        <Button
          variant={activePage === "policy" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handlePageSwitch("policy")}
          className="flex items-center gap-1.5 shrink-0"
        >
          <Shield className="h-4 w-4" />
          <span>Policies</span>
        </Button>
      </div>

      {/* Section Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {pageSectionKeys.map((key) => {
          const sec = sections.find((s) => s.key === key) || (currentSection.key === key ? currentSection : null);
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
                  {key.split(".").pop()}
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
                      <Label htmlFor="hero-subtitle">Subtitle *</Label>
                      <Input
                        id="hero-subtitle"
                        value={(formData.subtitle as string) || ""}
                        onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                        placeholder="Five ways of wearing tradition — considered deeply, chosen quietly."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 border rounded-md space-y-2">
                        <Label className="text-xs font-semibold">Primary CTA</Label>
                        <div className="space-y-1">
                          <Label htmlFor="hero-cta1-label" className="text-xs">Label</Label>
                          <Input
                            id="hero-cta1-label"
                            value={((formData.primary_cta as Record<string, string>)?.label) || ""}
                            onChange={(e) => handleFieldChange("primary_cta.label", e.target.value)}
                            placeholder="Enter the House"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="hero-cta1-href" className="text-xs">Href Destination</Label>
                          <Input
                            id="hero-cta1-href"
                            value={((formData.primary_cta as Record<string, string>)?.href) || ""}
                            onChange={(e) => handleFieldChange("primary_cta.href", e.target.value)}
                            placeholder="/collections"
                          />
                        </div>
                      </div>

                      <div className="p-3 border rounded-md space-y-2">
                        <Label className="text-xs font-semibold">Secondary CTA</Label>
                        <div className="space-y-1">
                          <Label htmlFor="hero-cta2-label" className="text-xs">Label</Label>
                          <Input
                            id="hero-cta2-label"
                            value={((formData.secondary_cta as Record<string, string>)?.label) || ""}
                            onChange={(e) => handleFieldChange("secondary_cta.label", e.target.value)}
                            placeholder="Descend into the house"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="hero-cta2-href" className="text-xs">Href Destination</Label>
                          <Input
                            id="hero-cta2-href"
                            value={((formData.secondary_cta as Record<string, string>)?.href) || ""}
                            onChange={(e) => handleFieldChange("secondary_cta.href", e.target.value)}
                            placeholder="#collections"
                          />
                        </div>
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
                        <Label htmlFor="craft-quote">Weaver Quote</Label>
                        <Input
                          id="craft-quote"
                          value={(formData.quote as string) || ""}
                          onChange={(e) => handleFieldChange("quote", e.target.value)}
                          placeholder="The border is the signature. Without it, the saree is a stranger."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="craft-attribution">Attribution</Label>
                        <Input
                          id="craft-attribution"
                          value={(formData.attribution as string) || ""}
                          onChange={(e) => handleFieldChange("attribution", e.target.value)}
                          placeholder="Gangamma"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="craft-facts">Craft Facts</Label>
                      <Input
                        id="craft-facts"
                        value={(formData.craft_facts as string) || ""}
                        onChange={(e) => handleFieldChange("craft_facts", e.target.value)}
                        placeholder="Molakalmuru, Karnataka · Temple border weaving · Fourth generation"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="craft-image">Weaver Portrait Image URL *</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openMediaPicker("image_url", ["image"])}
                          className="h-6 text-xs px-2"
                        >
                          <ImageIcon className="h-3 w-3 mr-1" /> Choose from Library
                        </Button>
                      </div>
                      <Input
                        id="craft-image"
                        value={(formData.image_url as string) || ""}
                        onChange={(e) => handleFieldChange("image_url", e.target.value)}
                        placeholder="/content/weaver-portrait/gangamma-molakalmuru/hero.jpg"
                      />
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
                        <Label htmlFor="craft-alt">Image Alt Text *</Label>
                        <Input
                          id="craft-alt"
                          value={(formData.alt_text as string) || ""}
                          onChange={(e) => handleFieldChange("alt_text", e.target.value)}
                          placeholder="Gangamma at her pit loom"
                        />
                      </div>
                    </div>

                    <div className="p-3 border rounded-md space-y-2">
                      <Label className="text-xs font-semibold">Story Link CTA</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="craft-cta-label" className="text-xs">Label</Label>
                          <Input
                            id="craft-cta-label"
                            value={((formData.cta as Record<string, string>)?.label) || ""}
                            onChange={(e) => handleFieldChange("cta.label", e.target.value)}
                            placeholder="Meet the makers"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="craft-cta-href" className="text-xs">Href Destination</Label>
                          <Input
                            id="craft-cta-href"
                            value={((formData.cta as Record<string, string>)?.href) || ""}
                            onChange={(e) => handleFieldChange("cta.href", e.target.value)}
                            placeholder="/journal/gangamma-molakalmuru"
                          />
                        </div>
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

                {/* 6. About Story Editor */}
                {activeKey === "about.story" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="about-header-title">Page Header Title *</Label>
                        <Input
                          id="about-header-title"
                          value={(formData.header_title as string) || ""}
                          onChange={(e) => handleFieldChange("header_title", e.target.value)}
                          placeholder="The House."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about-header-subtitle">Page Header Subtitle</Label>
                        <Input
                          id="about-header-subtitle"
                          value={(formData.header_subtitle as string) || ""}
                          onChange={(e) => handleFieldChange("header_subtitle", e.target.value)}
                          placeholder="A digital fashion house for Indian sarees."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="about-heading">Brand Heading *</Label>
                        <Input
                          id="about-heading"
                          value={(formData.heading as string) || ""}
                          onChange={(e) => handleFieldChange("heading", e.target.value)}
                          placeholder="House of Padmavati"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about-story-title">Story Headline *</Label>
                        <Input
                          id="about-story-title"
                          value={(formData.story_title as string) || ""}
                          onChange={(e) => handleFieldChange("story_title", e.target.value)}
                          placeholder="House of Padmavati is named for a real woman."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="about-story-content">Story Narrative Body *</Label>
                      <Textarea
                        id="about-story-content"
                        rows={4}
                        value={(formData.story_content as string) || ""}
                        onChange={(e) => handleFieldChange("story_content", e.target.value)}
                        placeholder="We curate the Indian saree for the modern wardrobe..."
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="about-image">Featured Story Image URL *</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openMediaPicker("image_url", ["image"])}
                          className="h-6 text-xs px-2"
                        >
                          <ImageIcon className="h-3 w-3 mr-1" /> Choose from Library
                        </Button>
                      </div>
                      <Input
                        id="about-image"
                        value={(formData.image_url as string) || ""}
                        onChange={(e) => handleFieldChange("image_url", e.target.value)}
                        placeholder="/content/weaver-portrait/gangamma-molakalmuru/hero.jpg"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="about-image-alt">Image Alt Text</Label>
                        <Input
                          id="about-image-alt"
                          value={(formData.image_alt as string) || ""}
                          onChange={(e) => handleFieldChange("image_alt", e.target.value)}
                          placeholder="House of Padmavati - The House"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about-image-pos">Image Alignment</Label>
                        <select
                          id="about-image-pos"
                          className="w-full h-10 px-3 border rounded-md bg-background text-sm"
                          value={(formData.image_position as string) || "left"}
                          onChange={(e) => handleFieldChange("image_position", e.target.value)}
                        >
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Customer Care Editor */}
                {activeKey === "care.info" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="care-header-title">Page Header Title *</Label>
                        <Input
                          id="care-header-title"
                          value={(formData.header_title as string) || ""}
                          onChange={(e) => handleFieldChange("header_title", e.target.value)}
                          placeholder="Customer Care."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="care-header-subtitle">Page Header Subtitle</Label>
                        <Input
                          id="care-header-subtitle"
                          value={(formData.header_subtitle as string) || ""}
                          onChange={(e) => handleFieldChange("header_subtitle", e.target.value)}
                          placeholder="We are here to assist you."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="care-intro-heading">Intro Section Heading *</Label>
                        <Input
                          id="care-intro-heading"
                          value={(formData.intro_heading as string) || ""}
                          onChange={(e) => handleFieldChange("intro_heading", e.target.value)}
                          placeholder="Write to the House"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="care-email">Official Support Email *</Label>
                        <Input
                          id="care-email"
                          type="email"
                          value={(formData.email_address as string) || ""}
                          onChange={(e) => handleFieldChange("email_address", e.target.value)}
                          placeholder="houseofpadmavati@gmail.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="care-intro-text">Introduction Note *</Label>
                      <Textarea
                        id="care-intro-text"
                        rows={3}
                        value={(formData.intro_text as string) || ""}
                        onChange={(e) => handleFieldChange("intro_text", e.target.value)}
                        placeholder="We welcome your thoughts and questions. Please leave a message below..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="care-response-time">Response Time Note (Shown after sending)</Label>
                      <Input
                        id="care-response-time"
                        value={(formData.response_time_note as string) || ""}
                        onChange={(e) => handleFieldChange("response_time_note", e.target.value)}
                        placeholder="We have received your message and will reply within two business days."
                      />
                    </div>
                  </div>
                )}

                {/* 8. Policy Document Editor */}
                {activeKey.startsWith("policy.") && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="policy-title">Document Title *</Label>
                        <Input
                          id="policy-title"
                          value={(formData.title as string) || ""}
                          onChange={(e) => handleFieldChange("title", e.target.value)}
                          placeholder="Policy Title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-last-updated">Last Updated Date *</Label>
                        <Input
                          id="policy-last-updated"
                          value={(formData.last_updated as string) || ""}
                          onChange={(e) => handleFieldChange("last_updated", e.target.value)}
                          placeholder="October 2026"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-meta-desc">Meta Description</Label>
                        <Input
                          id="policy-meta-desc"
                          value={(formData.meta_description as string) || ""}
                          onChange={(e) => handleFieldChange("meta_description", e.target.value)}
                          placeholder="Short summary for search engines"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="policy-email">Contact Email</Label>
                        <Input
                          id="policy-email"
                          value={(formData.contact_email as string) || ""}
                          onChange={(e) => handleFieldChange("contact_email", e.target.value)}
                          placeholder="houseofpadmavati@gmail.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-business">Business Details</Label>
                        <Input
                          id="policy-business"
                          value={(formData.contact_business as string) || ""}
                          onChange={(e) => handleFieldChange("contact_business", e.target.value)}
                          placeholder="House of Padmavati, Bangalore, India"
                        />
                      </div>
                    </div>

                    {/* Policy Sections Accordion/List */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Policy Sections</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const current = Array.isArray(formData.sections) ? formData.sections : [];
                            const nextId = String(current.length + 1);
                            handleFieldChange(`sections.${current.length}`, {
                              id: nextId,
                              title: `${nextId}. New Section`,
                              content: "",
                            });
                          }}
                          className="h-7 text-xs flex items-center gap-1"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Section</span>
                        </Button>
                      </div>

                      {Array.isArray(formData.sections) &&
                        (formData.sections as Array<{ id: string; title: string; content: string }>).map(
                          (sec, idx) => (
                            <div key={idx} className="p-4 border rounded-md space-y-3 bg-muted/10">
                              <div className="flex items-center justify-between gap-2">
                                <Input
                                  value={sec.title || ""}
                                  onChange={(e) =>
                                    handleFieldChange(`sections.${idx}.title`, e.target.value)
                                  }
                                  placeholder="Section Title"
                                  className="font-serif font-medium"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Are you sure you want to delete section "${sec.title}"?`
                                      )
                                    ) {
                                      const updated = [...(formData.sections as Array<unknown>)];
                                      updated.splice(idx, 1);
                                      handleFieldChange("sections", updated);
                                    }
                                  }}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <Textarea
                                rows={4}
                                value={sec.content || ""}
                                onChange={(e) =>
                                  handleFieldChange(`sections.${idx}.content`, e.target.value)
                                }
                                placeholder="Section content with paragraphs, bullet points (•), or numbered lists..."
                                className="font-sans text-sm leading-relaxed"
                              />
                            </div>
                          )
                        )}
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
                  placeholder="e.g. Updated returns timeline or dispatch policy"
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
