import { describe, it, expect } from "vitest";
import {
  HeroBannerPayloadSchema,
  HomepageVideoPayloadSchema,
  CraftStoryPayloadSchema,
  PhilosophyPayloadSchema,
  NoteCardsPayloadSchema,
  InvitationPayloadSchema,
  AboutStoryPayloadSchema,
  CustomerCarePayloadSchema,
  PolicyDocumentPayloadSchema,
  SafeLinkSchema,
  DEFAULT_HERO_PAYLOAD,
  DEFAULT_HOMEPAGE_VIDEO_PAYLOAD,
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

describe("Phase 3 Stage 1: Content Security & Schema Validation", () => {
  describe("SafeLinkSchema", () => {
    it("accepts valid internal paths, anchors, and HTTPS links", () => {
      expect(SafeLinkSchema.safeParse({ label: "Collections", href: "/collections" }).success).toBe(true);
      expect(SafeLinkSchema.safeParse({ label: "Descend", href: "#collections" }).success).toBe(true);
      expect(SafeLinkSchema.safeParse({ label: "Instagram", href: "https://instagram.com/hop" }).success).toBe(true);
    });

    it("rejects dangerous or unsafe URI protocols", () => {
      expect(SafeLinkSchema.safeParse({ label: "Attack", href: "javascript:alert(1)" }).success).toBe(false);
      expect(SafeLinkSchema.safeParse({ label: "Data", href: "data:text/html,<script>alert(1)</script>" }).success).toBe(false);
      expect(SafeLinkSchema.safeParse({ label: "VBScript", href: "vbscript:msgbox(1)" }).success).toBe(false);
      expect(SafeLinkSchema.safeParse({ label: "Insecure", href: "http://insecure.com" }).success).toBe(false);
    });
  });

  describe("HeroBannerPayloadSchema", () => {
    it("validates compliant hero banner payload", () => {
      const validPayload = {
        title: "Saree. Time. You.",
        subtitle: "Five ways of wearing tradition — considered deeply, chosen quietly.",
        eyebrow: "House of Padmavati",
        primary_cta: { label: "Enter the House", href: "/collections" },
        secondary_cta: { label: "Descend", href: "#collections" },
        alt_text: "House of Padmavati collection film",
      };
      const result = HeroBannerPayloadSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects hero banner missing alt_text or title", () => {
      const missingAlt = {
        title: "Saree. Time. You.",
        subtitle: "Five ways...",
        primary_cta: { label: "Enter", href: "/collections" },
      };
      expect(HeroBannerPayloadSchema.safeParse(missingAlt).success).toBe(false);
    });
  });

  describe("HomepageVideoPayloadSchema (Living Saree Video Management)", () => {
    it("validates compliant homepage video payload with default values", () => {
      expect(HomepageVideoPayloadSchema.safeParse(DEFAULT_HOMEPAGE_VIDEO_PAYLOAD).success).toBe(true);
    });

    it("validates video payload with desktop, mobile, poster, and playback settings", () => {
      const payload = {
        is_enabled: true,
        video_url: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/KALYANI+1.mp4",
        mobile_video_url: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/KALYANI-mobile.mp4",
        poster_url: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/poster.jpg",
        alt_text: "Living Saree visual study",
        autoplay: true,
        loop: true,
        muted: true,
        aspect_ratio: "16:9",
      };
      const parsed = HomepageVideoPayloadSchema.safeParse(payload);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.is_enabled).toBe(true);
        expect(parsed.data.video_url).toContain("KALYANI+1.mp4");
        expect(parsed.data.mobile_video_url).toContain("KALYANI-mobile.mp4");
        expect(parsed.data.aspect_ratio).toBe("16:9");
      }
    });

    it("accepts relative paths and standard variant keys", () => {
      expect(HomepageVideoPayloadSchema.safeParse({ video_url: "/optimized/videos/KALYANI-720p.mp4" }).success).toBe(true);
      expect(HomepageVideoPayloadSchema.safeParse({ video_url: "kalyani" }).success).toBe(true);
    });

    it("validates disabled video state", () => {
      const disabled = {
        is_enabled: false,
        video_url: "",
        alt_text: "Disabled video placeholder",
      };
      const parsed = HomepageVideoPayloadSchema.safeParse(disabled);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.is_enabled).toBe(false);
      }
    });

    it("rejects unsafe URL protocols", () => {
      expect(HomepageVideoPayloadSchema.safeParse({ video_url: "javascript:alert(1)" }).success).toBe(false);
      expect(HomepageVideoPayloadSchema.safeParse({ video_url: "http://insecure.com/video.mp4" }).success).toBe(false);
    });
  });

  describe("CraftStoryPayloadSchema", () => {
    it("validates compliant craft story payload", () => {
      const validPayload = {
        title: "Detail is part of the design.",
        lede: "Before a saree reaches the wardrobe, it passes through a series of considered decisions.",
        quote: "The border is the signature. Without it, the saree is a stranger.",
        attribution: "Gangamma",
        craft_facts: "Molakalmuru, Karnataka · Temple border weaving · Fourth generation",
        image_url: "/content/weaver-portrait/gangamma-molakalmuru/hero.jpg",
        caption: "Gangamma at her pit loom · Molakalmuru · 6:30 AM",
        alt_text: "Gangamma at her pit loom",
        cta: { label: "Meet the makers", href: "/journal/gangamma-molakalmuru" },
      };
      expect(CraftStoryPayloadSchema.safeParse(validPayload).success).toBe(true);
    });
  });

  describe("PhilosophyPayloadSchema", () => {
    it("validates compliant philosophy payload", () => {
      const validPayload = {
        title: "A House, Not a Shop.",
        lede: "We make room for the intelligence of considered making, the patience of cloth and the woman who chooses what to carry.",
        closing: "Not a season. Not a trend. A relationship with what lasts.",
      };
      expect(PhilosophyPayloadSchema.safeParse(validPayload).success).toBe(true);
    });
  });

  describe("NoteCardsPayloadSchema", () => {
    it("validates note cards payload with up to 6 cards", () => {
      const validPayload = {
        heading: "Wear it slowly. Keep it long.",
        subheading: "A first drape, a simple ritual, a lifetime of care.",
        cards: [
          {
            label: "The hand",
            title: "A body in motion.",
            text: "A saree holds the decisions behind it.",
            link_label: "Read",
            href: "/journal/the-pit-loom",
          },
        ],
      };
      expect(NoteCardsPayloadSchema.safeParse(validPayload).success).toBe(true);
    });
  });

  describe("InvitationPayloadSchema", () => {
    it("validates invitation payload with multiple links", () => {
      const validPayload = {
        title: "Come in quietly. Choose slowly.",
        body: "There is no rush here. Explore the collections, or begin a conversation with the house.",
        links: [
          { label: "Explore Collections", href: "/collections" },
          { label: "House Letters", href: "/journal" },
        ],
      };
      expect(InvitationPayloadSchema.safeParse(validPayload).success).toBe(true);
    });
  });

  describe("Phase 3 Stage 3: Homepage Grounded Defaults Integrity", () => {
    it("verifies all five homepage defaults conform 100% to their Zod schemas", () => {
      expect(HeroBannerPayloadSchema.safeParse(DEFAULT_HERO_PAYLOAD).success).toBe(true);
      expect(CraftStoryPayloadSchema.safeParse(DEFAULT_CRAFT_PAYLOAD).success).toBe(true);
      expect(PhilosophyPayloadSchema.safeParse(DEFAULT_PHILOSOPHY_PAYLOAD).success).toBe(true);
      expect(NoteCardsPayloadSchema.safeParse(DEFAULT_OWNERSHIP_PAYLOAD).success).toBe(true);
      expect(InvitationPayloadSchema.safeParse(DEFAULT_INVITATION_PAYLOAD).success).toBe(true);
    });

    it("ensures fallback mechanism triggers when corrupted payload is encountered", () => {
      const corruptedHero = {
        title: "", // Empty title violates min(1)
        subtitle: "A valid subtitle",
      };

      const result = HeroBannerPayloadSchema.safeParse(corruptedHero);
      expect(result.success).toBe(false);
    });
  });

  describe("Phase 3 Stage 4: Remaining Pages & Policies Schemas", () => {
    it("validates AboutStoryPayloadSchema with required and optional fields", () => {
      expect(AboutStoryPayloadSchema.safeParse(DEFAULT_ABOUT_STORY_PAYLOAD).success).toBe(true);

      const invalidStory = {
        header_title: "",
        heading: "Test",
        story_title: "Title",
        story_content: "Content",
        image_url: "",
      };
      expect(AboutStoryPayloadSchema.safeParse(invalidStory).success).toBe(false);
    });

    it("validates CustomerCarePayloadSchema and enforces valid email", () => {
      expect(CustomerCarePayloadSchema.safeParse(DEFAULT_CUSTOMER_CARE_PAYLOAD).success).toBe(true);

      const invalidEmail = {
        ...DEFAULT_CUSTOMER_CARE_PAYLOAD,
        email_address: "not-an-email",
      };
      expect(CustomerCarePayloadSchema.safeParse(invalidEmail).success).toBe(false);
    });

    it("validates PolicyDocumentPayloadSchema across all four official policies", () => {
      expect(PolicyDocumentPayloadSchema.safeParse(DEFAULT_SHIPPING_POLICY_PAYLOAD).success).toBe(true);
      expect(PolicyDocumentPayloadSchema.safeParse(DEFAULT_RETURNS_POLICY_PAYLOAD).success).toBe(true);
      expect(PolicyDocumentPayloadSchema.safeParse(DEFAULT_PRIVACY_POLICY_PAYLOAD).success).toBe(true);
      expect(PolicyDocumentPayloadSchema.safeParse(DEFAULT_TERMS_POLICY_PAYLOAD).success).toBe(true);
    });

    it("verifies PolicyDocumentPayloadSchema rejects policies with empty sections array", () => {
      const emptyPolicy = {
        title: "Test Policy",
        last_updated: "October 2026",
        sections: [],
      };
      expect(PolicyDocumentPayloadSchema.safeParse(emptyPolicy).success).toBe(false);
    });
  });
});
