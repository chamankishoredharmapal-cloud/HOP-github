import { useQuery } from "@tanstack/react-query";
import { siteSectionService } from "@/services/siteSectionService";
import { supabase } from "@/integrations/supabase/client";
import {
  HeroBannerPayloadSchema,
  CraftStoryPayloadSchema,
  PhilosophyPayloadSchema,
  NoteCardsPayloadSchema,
  InvitationPayloadSchema,
  DEFAULT_HERO_PAYLOAD,
  DEFAULT_CRAFT_PAYLOAD,
  DEFAULT_PHILOSOPHY_PAYLOAD,
  DEFAULT_OWNERSHIP_PAYLOAD,
  DEFAULT_INVITATION_PAYLOAD,
  type HeroBannerPayload,
  type CraftStoryPayload,
  type PhilosophyPayload,
  type NoteCardsPayload,
  type InvitationPayload,
} from "@/types/siteSections";

export interface HomepageSectionsResult {
  hero: HeroBannerPayload;
  craft: CraftStoryPayload;
  philosophy: PhilosophyPayload;
  ownership: NoteCardsPayload;
  invitation: InvitationPayload;
  isLoading: boolean;
  isError: boolean;
  isPreview: boolean;
}

/**
 * Checks whether the current visitor is an authorized administrator
 * requesting an isolated draft preview via ?studio_preview=true.
 */
async function checkAdminPreviewSession(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("studio_preview") !== "true") return false;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    // Direct check: verify RLS allows admin read of site_sections
    const { data, error } = await supabase.from("site_sections").select("key").limit(1);
    return !error && Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Canonical hook for fetching database-backed homepage site sections.
 * Guarantees zero draft leakage to public visitors, validated payload structure,
 * and seamless fallback to grounded source-code defaults.
 */
export function useSiteSections(pageName: string = "home"): HomepageSectionsResult {
  const isPreviewRequested = typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("studio_preview") === "true";

  // First, determine if this is an authorized admin preview session
  const { data: isAdminPreview = false } = useQuery({
    queryKey: ["site_sections", "preview_auth_check"],
    queryFn: checkAdminPreviewSession,
    enabled: isPreviewRequested,
    staleTime: 1000 * 30,
  });

  // Query either draft payloads (for authorized admin preview) or published payloads (public)
  const { data: rawSections = {}, isLoading, isError } = useQuery<Record<string, Record<string, unknown>>>({
    queryKey: isAdminPreview
      ? ["site_sections", "draft_preview", pageName]
      : ["site_sections", "published", pageName],
    queryFn: async () => {
      if (isAdminPreview) {
        // Authenticated admin preview: query draft payloads via admin method
        const records = await siteSectionService.getAdminSections(pageName);
        const map: Record<string, Record<string, unknown>> = {};
        for (const rec of records) {
          map[rec.key] = rec.draft_payload as Record<string, unknown>;
        }
        return map;
      }

      // Canonical public storefront query: published RPC only
      return siteSectionService.getPublishedPageSections(pageName);
    },
    staleTime: isAdminPreview ? 0 : 1000 * 60, // 1 min cache for public, immediate for preview
  });

  // Parse and validate each supported homepage section with safe fallbacks

  // 1. Hero (home.hero)
  let hero: HeroBannerPayload = DEFAULT_HERO_PAYLOAD;
  if (rawSections["home.hero"]) {
    const parsed = HeroBannerPayloadSchema.safeParse(rawSections["home.hero"]);
    if (parsed.success) {
      hero = parsed.data;
    } else {
      console.warn("Invalid payload for home.hero, falling back to defaults:", parsed.error.issues);
    }
  }

  // 2. Craft (home.craft)
  let craft: CraftStoryPayload = DEFAULT_CRAFT_PAYLOAD;
  if (rawSections["home.craft"]) {
    const parsed = CraftStoryPayloadSchema.safeParse(rawSections["home.craft"]);
    if (parsed.success) {
      craft = parsed.data;
    } else {
      console.warn("Invalid payload for home.craft, falling back to defaults:", parsed.error.issues);
    }
  }

  // 3. Philosophy (home.philosophy)
  let philosophy: PhilosophyPayload = DEFAULT_PHILOSOPHY_PAYLOAD;
  if (rawSections["home.philosophy"]) {
    const parsed = PhilosophyPayloadSchema.safeParse(rawSections["home.philosophy"]);
    if (parsed.success) {
      philosophy = parsed.data;
    } else {
      console.warn("Invalid payload for home.philosophy, falling back to defaults:", parsed.error.issues);
    }
  }

  // 4. Ownership (home.ownership)
  let ownership: NoteCardsPayload = DEFAULT_OWNERSHIP_PAYLOAD;
  if (rawSections["home.ownership"]) {
    const parsed = NoteCardsPayloadSchema.safeParse(rawSections["home.ownership"]);
    if (parsed.success) {
      ownership = parsed.data;
    } else {
      console.warn("Invalid payload for home.ownership, falling back to defaults:", parsed.error.issues);
    }
  }

  // 5. Invitation (home.invitation)
  let invitation: InvitationPayload = DEFAULT_INVITATION_PAYLOAD;
  if (rawSections["home.invitation"]) {
    const parsed = InvitationPayloadSchema.safeParse(rawSections["home.invitation"]);
    if (parsed.success) {
      invitation = parsed.data;
    } else {
      console.warn("Invalid payload for home.invitation, falling back to defaults:", parsed.error.issues);
    }
  }

  return {
    hero,
    craft,
    philosophy,
    ownership,
    invitation,
    isLoading,
    isError,
    isPreview: isAdminPreview,
  };
}
