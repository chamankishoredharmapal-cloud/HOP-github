import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { siteSectionService } from "@/services/siteSectionService";
import { supabase } from "@/integrations/supabase/client";
import {
  BROADCAST_CHANNEL_NAME,
  LOCAL_STORAGE_SYNC_KEY,
} from "@/lib/broadcastSync";
import {
  HeroBannerPayloadSchema,
  HomepageVideoPayloadSchema,
  HomepageImagePayloadSchema,
  CraftStoryPayloadSchema,
  PhilosophyPayloadSchema,
  NoteCardsPayloadSchema,
  InvitationPayloadSchema,
  AboutStoryPayloadSchema,
  CustomerCarePayloadSchema,
  PolicyDocumentPayloadSchema,
  DEFAULT_HERO_PAYLOAD,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HOMEPAGE_VIDEO_PAYLOAD,
  DEFAULT_HOMEPAGE_IMAGE_PAYLOAD,
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
  type HeroBannerPayload,
  type HomepageVideoPayload,
  type HomepageImagePayload,
  type CraftStoryPayload,
  type PhilosophyPayload,
  type NoteCardsPayload,
  type InvitationPayload,
  type AboutStoryPayload,
  type CustomerCarePayload,
  type PolicyDocumentPayload,
  type PolicySectionKey,
} from "@/types/siteSections";

export interface HomepageSectionsResult {
  hero: HeroBannerPayload;
  image: HomepageImagePayload;
  video: HomepageVideoPayload;
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
 * Automatically synchronizes site sections across open tabs and windows when
 * an administrator publishes live changes in Studio.
 */
export function useCrossTabSiteSectionSync(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSync = () => {
      queryClient.invalidateQueries({ queryKey: ["site_sections", "published"] });
    };

    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.onmessage = handleSync;
      }
    } catch {
      // Ignore
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_SYNC_KEY && e.newValue) {
        handleSync();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      if (channel) {
        try {
          channel.close();
        } catch {
          // Channel already closed or unavailable
        }
      }
      window.removeEventListener("storage", handleStorage);
    };
  }, [queryClient]);
}

/**
 * Canonical hook for fetching database-backed homepage site sections.
 * Guarantees zero draft leakage to public visitors, validated payload structure,
 * and seamless fallback to grounded source-code defaults.
 */
export function useSiteSections(pageName: string = "home"): HomepageSectionsResult {
  useCrossTabSiteSectionSync();

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
    staleTime: isAdminPreview ? 0 : 1000 * 15, // 15 sec cache for public, immediate for preview
    refetchOnWindowFocus: true,
  });

  // Parse and validate each supported homepage section with safe fallbacks

  // 1. Hero (home.hero)
  let hero: HeroBannerPayload = DEFAULT_HERO_PAYLOAD;
  if (rawSections["home.hero"]) {
    const parsed = HeroBannerPayloadSchema.safeParse(rawSections["home.hero"]);
    if (parsed.success) {
      hero = parsed.data;
      if (!hero.slides || hero.slides.length === 0) {
        hero.slides = DEFAULT_HERO_SLIDES;
      }
    } else {
      console.warn("Invalid payload for home.hero, falling back to defaults:", parsed.error.issues);
    }
  }

  // 2. Full-Screen Editorial Image (home.image)
  let image: HomepageImagePayload = DEFAULT_HOMEPAGE_IMAGE_PAYLOAD;
  if (rawSections["home.image"]) {
    const parsed = HomepageImagePayloadSchema.safeParse(rawSections["home.image"]);
    if (parsed.success) {
      image = parsed.data;
    } else {
      console.warn("Invalid payload for home.image, falling back to defaults:", parsed.error.issues);
    }
  }

  // 3. Video Placeholder (obsolete - disabled by site-wide policy)
  const video: HomepageVideoPayload = {
    ...DEFAULT_HOMEPAGE_VIDEO_PAYLOAD,
    is_enabled: false,
  };

  // 4. Craft (home.craft)
  let craft: CraftStoryPayload = DEFAULT_CRAFT_PAYLOAD;
  if (rawSections["home.craft"]) {
    const parsed = CraftStoryPayloadSchema.safeParse(rawSections["home.craft"]);
    if (parsed.success) {
      craft = parsed.data;
    } else {
      console.warn("Invalid payload for home.craft, falling back to defaults:", parsed.error.issues);
    }
  }

  // 5. Philosophy (home.philosophy)
  let philosophy: PhilosophyPayload = DEFAULT_PHILOSOPHY_PAYLOAD;
  if (rawSections["home.philosophy"]) {
    const parsed = PhilosophyPayloadSchema.safeParse(rawSections["home.philosophy"]);
    if (parsed.success) {
      philosophy = parsed.data;
    } else {
      console.warn("Invalid payload for home.philosophy, falling back to defaults:", parsed.error.issues);
    }
  }

  // 6. Ownership (home.ownership)
  let ownership: NoteCardsPayload = DEFAULT_OWNERSHIP_PAYLOAD;
  if (rawSections["home.ownership"]) {
    const parsed = NoteCardsPayloadSchema.safeParse(rawSections["home.ownership"]);
    if (parsed.success) {
      ownership = parsed.data;
    } else {
      console.warn("Invalid payload for home.ownership, falling back to defaults:", parsed.error.issues);
    }
  }

  // 7. Invitation (home.invitation)
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
    image,
    video,
    craft,
    philosophy,
    ownership,
    invitation,
    isLoading,
    isError,
    isPreview: isAdminPreview,
  };
}

export interface AboutStorySectionResult {
  story: AboutStoryPayload;
  isLoading: boolean;
  isError: boolean;
  isPreview: boolean;
}

export function useAboutStorySection(): AboutStorySectionResult {
  useCrossTabSiteSectionSync();

  const isPreviewRequested =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("studio_preview") === "true";

  const { data: isAdminPreview = false } = useQuery({
    queryKey: ["site_sections", "preview_auth_check"],
    queryFn: checkAdminPreviewSession,
    enabled: isPreviewRequested,
    staleTime: 1000 * 30,
  });

  const { data: rawSections = {}, isLoading, isError } = useQuery<Record<string, Record<string, unknown>>>({
    queryKey: isAdminPreview
      ? ["site_sections", "draft_preview", "about"]
      : ["site_sections", "published", "about"],
    queryFn: async () => {
      if (isAdminPreview) {
        const records = await siteSectionService.getAdminSections("about");
        const map: Record<string, Record<string, unknown>> = {};
        for (const rec of records) {
          map[rec.key] = rec.draft_payload as Record<string, unknown>;
        }
        return map;
      }
      return siteSectionService.getPublishedPageSections("about");
    },
    staleTime: isAdminPreview ? 0 : 1000 * 15,
    refetchOnWindowFocus: true,
  });

  let story: AboutStoryPayload = DEFAULT_ABOUT_STORY_PAYLOAD;
  if (rawSections["about.story"]) {
    const parsed = AboutStoryPayloadSchema.safeParse(rawSections["about.story"]);
    if (parsed.success) {
      story = parsed.data;
    } else {
      console.warn("Invalid payload for about.story, falling back to defaults:", parsed.error.issues);
    }
  }

  return {
    story,
    isLoading,
    isError,
    isPreview: isAdminPreview,
  };
}

export interface CustomerCareSectionResult {
  care: CustomerCarePayload;
  isLoading: boolean;
  isError: boolean;
  isPreview: boolean;
}

export function useCustomerCareSection(): CustomerCareSectionResult {
  useCrossTabSiteSectionSync();

  const isPreviewRequested =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("studio_preview") === "true";

  const { data: isAdminPreview = false } = useQuery({
    queryKey: ["site_sections", "preview_auth_check"],
    queryFn: checkAdminPreviewSession,
    enabled: isPreviewRequested,
    staleTime: 1000 * 30,
  });

  const { data: rawSections = {}, isLoading, isError } = useQuery<Record<string, Record<string, unknown>>>({
    queryKey: isAdminPreview
      ? ["site_sections", "draft_preview", "care"]
      : ["site_sections", "published", "care"],
    queryFn: async () => {
      if (isAdminPreview) {
        const records = await siteSectionService.getAdminSections("care");
        const map: Record<string, Record<string, unknown>> = {};
        for (const rec of records) {
          map[rec.key] = rec.draft_payload as Record<string, unknown>;
        }
        return map;
      }
      return siteSectionService.getPublishedPageSections("care");
    },
    staleTime: isAdminPreview ? 0 : 1000 * 15,
    refetchOnWindowFocus: true,
  });

  let care: CustomerCarePayload = DEFAULT_CUSTOMER_CARE_PAYLOAD;
  if (rawSections["care.info"]) {
    const parsed = CustomerCarePayloadSchema.safeParse(rawSections["care.info"]);
    if (parsed.success) {
      care = parsed.data;
    } else {
      console.warn("Invalid payload for care.info, falling back to defaults:", parsed.error.issues);
    }
  }

  return {
    care,
    isLoading,
    isError,
    isPreview: isAdminPreview,
  };
}

export interface PolicySectionResult {
  policy: PolicyDocumentPayload;
  isLoading: boolean;
  isError: boolean;
  isPreview: boolean;
}

export function usePolicySection(policyKey: PolicySectionKey): PolicySectionResult {
  useCrossTabSiteSectionSync();

  const isPreviewRequested =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("studio_preview") === "true";

  const { data: isAdminPreview = false } = useQuery({
    queryKey: ["site_sections", "preview_auth_check"],
    queryFn: checkAdminPreviewSession,
    enabled: isPreviewRequested,
    staleTime: 1000 * 30,
  });

  const { data: rawSections = {}, isLoading, isError } = useQuery<Record<string, Record<string, unknown>>>({
    queryKey: isAdminPreview
      ? ["site_sections", "draft_preview", "policy"]
      : ["site_sections", "published", "policy"],
    queryFn: async () => {
      if (isAdminPreview) {
        const records = await siteSectionService.getAdminSections("policy");
        const map: Record<string, Record<string, unknown>> = {};
        for (const rec of records) {
          map[rec.key] = rec.draft_payload as Record<string, unknown>;
        }
        return map;
      }
      return siteSectionService.getPublishedPageSections("policy");
    },
    staleTime: isAdminPreview ? 0 : 1000 * 15,
    refetchOnWindowFocus: true,
  });

  let defaultPayload = DEFAULT_SHIPPING_POLICY_PAYLOAD;
  if (policyKey === "policy.returns") defaultPayload = DEFAULT_RETURNS_POLICY_PAYLOAD;
  else if (policyKey === "policy.privacy") defaultPayload = DEFAULT_PRIVACY_POLICY_PAYLOAD;
  else if (policyKey === "policy.terms") defaultPayload = DEFAULT_TERMS_POLICY_PAYLOAD;

  let policy: PolicyDocumentPayload = defaultPayload;
  if (rawSections[policyKey]) {
    const parsed = PolicyDocumentPayloadSchema.safeParse(rawSections[policyKey]);
    if (parsed.success) {
      policy = parsed.data;
    } else {
      console.warn(`Invalid payload for ${policyKey}, falling back to defaults:`, parsed.error.issues);
    }
  }

  return {
    policy,
    isLoading,
    isError,
    isPreview: isAdminPreview,
  };
}
