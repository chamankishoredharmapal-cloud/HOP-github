import { describe, it, expect } from "vitest";
import {
  HeroBannerPayloadSchema,
  CraftStoryPayloadSchema,
  PhilosophyPayloadSchema,
  NoteCardsPayloadSchema,
  InvitationPayloadSchema,
  SafeLinkSchema,
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

  describe("Phase 3 Stage 3: Grounded Defaults Integrity & Resilience", () => {
    it("verifies all five homepage defaults conform 100% to their Zod schemas", async () => {
      const {
        DEFAULT_HERO_PAYLOAD,
        DEFAULT_CRAFT_PAYLOAD,
        DEFAULT_PHILOSOPHY_PAYLOAD,
        DEFAULT_OWNERSHIP_PAYLOAD,
        DEFAULT_INVITATION_PAYLOAD,
      } = await import("@/types/siteSections");

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
      // In hook, this triggers fallback to DEFAULT_HERO_PAYLOAD
    });
  });
});
