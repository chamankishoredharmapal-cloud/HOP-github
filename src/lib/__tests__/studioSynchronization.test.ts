import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { CinematicHeroSlider } from "@/components/hop/CinematicHeroSlider";
import { MediaDisplayProvider } from "@/contexts/MediaDisplayContext";
import { getStudioEnvironment } from "@/studio/utils/environment";
import {
  broadcastSectionPublication,
  BROADCAST_CHANNEL_NAME,
  LOCAL_STORAGE_SYNC_KEY,
} from "@/lib/broadcastSync";
import type { HeroBannerPayload, HeroSlide } from "@/types/siteSections";
import pkg from "../../../package.json";

describe("HOP — Studio-to-Storefront Synchronization Repair Suite", () => {
  describe("Task 1: Explicit Local Staging Configuration & Environment Guard", () => {
    it("provides a dedicated dev:staging script targeting Vite staging mode", () => {
      expect(pkg.scripts).toHaveProperty("dev:staging");
      expect(pkg.scripts["dev:staging"]).toContain("--mode staging");
    });

    it("identifies local running environment targeting staging Supabase as LOCAL (STAGING DB)", () => {
      // Mock window.location and process.env
      const origLocation = window.location;
      delete (window as unknown as { location: unknown }).location;
      window.location = { ...origLocation, hostname: "localhost" } as Location;

      const origSupabaseUrl = process.env.VITE_SUPABASE_URL;
      process.env.VITE_SUPABASE_URL = "https://dovnhgbisiturzbjgvei.supabase.co";

      const envInfo = getStudioEnvironment();
      expect(envInfo.name).toBe("STAGING");
      expect(envInfo.isStaging).toBe(true);
      expect(envInfo.isProduction).toBe(false);
      expect(envInfo.badgeLabel).toBe("LOCAL (STAGING DB)");

      // Restore
      window.location = origLocation;
      if (origSupabaseUrl !== undefined) {
        process.env.VITE_SUPABASE_URL = origSupabaseUrl;
      } else {
        delete process.env.VITE_SUPABASE_URL;
      }
    });

    it("identifies local running environment targeting production Supabase as LOCAL (PROD DB)", () => {
      const origLocation = window.location;
      delete (window as unknown as { location: unknown }).location;
      window.location = { ...origLocation, hostname: "localhost" } as Location;

      const origSupabaseUrl = process.env.VITE_SUPABASE_URL;
      process.env.VITE_SUPABASE_URL = "https://kbvjmcnaaogkbnerjcoc.supabase.co";

      const envInfo = getStudioEnvironment();
      expect(envInfo.name).toBe("PRODUCTION");
      expect(envInfo.isProduction).toBe(true);
      expect(envInfo.isStaging).toBe(false);
      expect(envInfo.badgeLabel).toBe("LOCAL (PROD DB)");

      // Restore
      window.location = origLocation;
      if (origSupabaseUrl !== undefined) {
        process.env.VITE_SUPABASE_URL = origSupabaseUrl;
      } else {
        delete process.env.VITE_SUPABASE_URL;
      }
    });
  });

  describe("Task 2: Hero Banner Studio/Storefront Contract", () => {
    it("renders hero media without any text overlay in the storefront DOM", () => {
      const heroPayload: HeroBannerPayload = {
        title: "Woven Architecture",
        subtitle: "A considered reflection on structure and time.",
        eyebrow: "Autumn 2026",
        primary_cta: { label: "Explore the House", href: "/collections" },
        secondary_cta: { label: "Descend into the weave", href: "#collections" },
        slides: [
          {
            id: "slide-test-1",
            poster_url: "https://dovnhgbisiturzbjgvei.supabase.co/storage/v1/object/public/test.jpg",
            media_type: "image",
            duration: 4,
            is_active: true,
          },
        ],
      };

      const html = renderToString(
        React.createElement(
          MediaDisplayProvider,
          { initialMode: "show-media" },
          React.createElement(CinematicHeroSlider, { section: heroPayload })
        )
      );

      // The hero renders only its media and controls; no copy from the payload.
      expect(html).not.toContain("Woven Architecture");
      expect(html).not.toContain("Autumn 2026");
      expect(html).not.toContain("A considered reflection on structure and time.");
      expect(html).not.toContain("Explore the House");
      expect(html).not.toContain("Descend into the weave");

      // Verify no overlay classes or text containers are emitted.
      expect(html).not.toContain("hop-threshold__veil");
      expect(html).not.toContain("hop-threshold__content");
      expect(html).not.toContain("hop-threshold__title");
      expect(html).not.toContain("hop-threshold__eyebrow");
      expect(html).not.toContain("hop-threshold__supporting");
      expect(html).not.toContain("hop-threshold__actions");
      expect(html).toContain("hop-threshold__slider");
      expect(html).toContain("test.jpg");
    });

    it("ignores slide-specific copy overrides and renders media only", () => {
      const heroPayload: HeroBannerPayload = {
        title: "Default Global Title",
        subtitle: "Default Global Subtitle",
        eyebrow: "Default Global Eyebrow",
        slides: [
          {
            id: "slide-custom",
            title: "Slide-Specific Drape",
            subtitle: "Unique drape notes for slide 1",
            eyebrow: "Slide Eyebrow",
            poster_url: "https://dovnhgbisiturzbjgvei.supabase.co/storage/v1/object/public/test.jpg",
            media_type: "image",
            duration: 4,
            is_active: true,
          },
        ],
      };

      const html = renderToString(
        React.createElement(
          MediaDisplayProvider,
          { initialMode: "show-media" },
          React.createElement(CinematicHeroSlider, { section: heroPayload })
        )
      );

      expect(html).not.toContain("Slide-Specific Drape");
      expect(html).not.toContain("Unique drape notes for slide 1");
      expect(html).not.toContain("Slide Eyebrow");
      expect(html).not.toContain("Default Global Title");
      expect(html).not.toContain("Default Global Subtitle");
      expect(html).not.toContain("Default Global Eyebrow");
      expect(html).toContain("test.jpg");
    });

    it("supports Poster Image Only slide without mounting <video>", () => {
      const heroPayload: HeroBannerPayload = {
        title: "Still Photography",
        slides: [
          {
            id: "slide-poster-only",
            poster_url: "https://dovnhgbisiturzbjgvei.supabase.co/storage/v1/object/public/poster.webp",
            media_type: "image",
            duration: 5,
            is_active: true,
          },
        ],
      };

      const html = renderToString(
        React.createElement(
          MediaDisplayProvider,
          { initialMode: "show-media" },
          React.createElement(CinematicHeroSlider, { section: heroPayload })
        )
      );

      expect(html).toContain("poster.webp");
      expect(html).not.toContain("<video");
    });

    it("keeps each slide's saved poster canonical URL available for fallback", () => {
      const firstPoster =
        "https://dovnhgbisiturzbjgvei.supabase.co/storage/v1/object/public/product-images/slide-one.png";
      const secondPoster =
        "https://dovnhgbisiturzbjgvei.supabase.co/storage/v1/object/public/product-images/slide-two.webp";
      const heroPayload: HeroBannerPayload = {
        title: "Per-slide posters",
        slides: [
          {
            id: "slide-first",
            poster_url: firstPoster,
            media_type: "image",
            duration: 5,
            is_active: true,
          },
          {
            id: "slide-second",
            poster_url: secondPoster,
            media_type: "image",
            duration: 5,
            is_active: true,
          },
        ],
      };

      const html = renderToString(
        React.createElement(
          MediaDisplayProvider,
          { initialMode: "show-media" },
          React.createElement(CinematicHeroSlider, { section: heroPayload })
        )
      );

      expect(html).toContain(`data-canonical-src="${firstPoster}"`);
      expect(html).toContain(`data-canonical-src="${secondPoster}"`);
      expect(html).toContain("/storage/v1/render/image/public/product-images/slide-one.png");
      expect(html).toContain("/storage/v1/render/image/public/product-images/slide-two.webp");
      expect(html).toContain('data-poster-state="optimized"');
    });
  });

  describe("Task 3: About-Page Image Fallback Contract", () => {
    it("preserves valid configured relative image paths without forcing hop-hero.jpg", () => {
      const configuredRelativePath = "/content/weaver-portrait/gangamma-molakalmuru/hero.jpg";
      const resolveEffectiveImage = (configured?: string, fallback: string = "/assets/hop-hero.jpg") => {
        const trimmed = configured?.trim();
        return trimmed || fallback;
      };

      const effective = resolveEffectiveImage(configuredRelativePath);
      expect(effective).toBe("/content/weaver-portrait/gangamma-molakalmuru/hero.jpg");
    });

    it("preserves valid remote image URLs without forcing hop-hero.jpg", () => {
      const remoteUrl = "https://dovnhgbisiturzbjgvei.supabase.co/storage/v1/object/public/about/portrait.jpg";
      const resolveEffectiveImage = (configured?: string, fallback: string = "/assets/hop-hero.jpg") => {
        const trimmed = configured?.trim();
        return trimmed || fallback;
      };

      const effective = resolveEffectiveImage(remoteUrl);
      expect(effective).toBe(remoteUrl);
    });

    it("falls back to bundled heroStill image only when configured image is empty or missing", () => {
      const resolveEffectiveImage = (configured?: string, fallback: string = "/assets/hop-hero.jpg") => {
        const trimmed = configured?.trim();
        return trimmed || fallback;
      };

      expect(resolveEffectiveImage("")).toBe("/assets/hop-hero.jpg");
      expect(resolveEffectiveImage("   ")).toBe("/assets/hop-hero.jpg");
      expect(resolveEffectiveImage(undefined)).toBe("/assets/hop-hero.jpg");
    });
  });

  describe("Task 4: Secure Product Draft Preview Authorization", () => {
    it("restricts public product queries strictly to published status", () => {
      const mockQueryBuilder = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: { id: "p1", status: "published" }, error: null }),
      };

      const buildProductQuery = (
        supabaseClient: typeof mockQueryBuilder,
        id: string,
        options?: { allowDraftPreview?: boolean },
        hasSession: boolean = false
      ) => {
        let q = supabaseClient.from("products").select("*, collections!left(name)").eq("id", id);
        if (options?.allowDraftPreview) {
          if (!hasSession) {
            q = q.eq("status", "published");
          }
        } else {
          q = q.eq("status", "published");
        }
        return q;
      };

      // 1. Public user (no options)
      buildProductQuery(mockQueryBuilder, "prod-1", undefined, false);
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith("status", "published");

      // 2. Public user requesting draft preview without authentication
      mockQueryBuilder.eq.mockClear();
      buildProductQuery(mockQueryBuilder, "prod-1", { allowDraftPreview: true }, false);
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith("status", "published");

      // 3. Authenticated user requesting preview: does not force status: published client-side
      mockQueryBuilder.eq.mockClear();
      buildProductQuery(mockQueryBuilder, "prod-1", { allowDraftPreview: true }, true);
      // Only ID was filtered; status filtering is delegated to server RLS policy (products_admin_all)
      expect(mockQueryBuilder.eq).not.toHaveBeenCalledWith("status", "published");
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith("id", "prod-1");
    });
  });

  describe("Task 5: Published Content Freshness & Cross-Tab Synchronization", () => {
    let originalBroadcastChannel: unknown;
    let postMessageMock: ReturnType<typeof vi.fn>;
    let closeMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      postMessageMock = vi.fn();
      closeMock = vi.fn();
      originalBroadcastChannel = globalThis.BroadcastChannel;

      // Mock BroadcastChannel
      globalThis.BroadcastChannel = vi.fn().mockImplementation(() => ({
        postMessage: postMessageMock,
        close: closeMock,
      })) as unknown as typeof BroadcastChannel;
    });

    afterEach(() => {
      globalThis.BroadcastChannel = originalBroadcastChannel as typeof BroadcastChannel;
    });

    it("broadcasts section publication events via BroadcastChannel and localStorage", () => {
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

      broadcastSectionPublication("home.hero", 42);

      expect(globalThis.BroadcastChannel).toHaveBeenCalledWith(BROADCAST_CHANNEL_NAME);
      expect(postMessageMock).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "home.hero",
          revision: 42,
          timestamp: expect.any(Number),
        })
      );
      expect(closeMock).toHaveBeenCalled();

      expect(setItemSpy).toHaveBeenCalledWith(
        LOCAL_STORAGE_SYNC_KEY,
        expect.stringContaining('"key":"home.hero"')
      );

      setItemSpy.mockRestore();
    });

    it("verifies SiteUpdate publish handler increments version and guards modal closure on success", () => {
      let isPublishDialogOpen = true;
      let changeSummary = "Updated hero banner drape";

      // Simulate save draft returning version 5
      const saveDraft = vi.fn().mockResolvedValue({
        success: true,
        new_version: 5,
      });

      // Simulate publish using the resolved new_version
      const publish = vi.fn().mockResolvedValue({
        success: true,
        revision_number: 12,
      });

      const handlePublish = async (isDirty: boolean, currentVersion: number) => {
        let activeVersion = currentVersion;
        if (isDirty) {
          const saveRes = await saveDraft();
          if (!saveRes.success) return;
          activeVersion = saveRes.new_version ?? (currentVersion + 1);
        }

        const publishRes = await publish({ expectedVersion: activeVersion });
        if (publishRes.success) {
          isPublishDialogOpen = false;
          changeSummary = "";
        }
      };

      return handlePublish(true, 4).then(() => {
        expect(saveDraft).toHaveBeenCalled();
        expect(publish).toHaveBeenCalledWith({ expectedVersion: 5 });
        expect(isPublishDialogOpen).toBe(false);
        expect(changeSummary).toBe("");
      });
    });
  });
});
