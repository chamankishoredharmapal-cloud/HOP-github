import { describe, it, expect } from "vitest";
import { resolveOptimizedVideo, getCollectionVideoVariant } from "@/data/collectionVideos";
import { classifyVideoAspectRatio } from "@/studio/utils/videoValidation";
import {
  HomepageVideoPayloadSchema,
  DEFAULT_HOMEPAGE_VIDEO_PAYLOAD,
  HOMEPAGE_SECTION_KEYS,
  type HomepageVideoPayload,
} from "@/types/siteSections";

describe("HOP Studios — Homepage Video Management & Integration", () => {
  it("includes 'home.video' in HOMEPAGE_SECTION_KEYS between hero and craft", () => {
    expect(HOMEPAGE_SECTION_KEYS).toContain("home.video");
    const heroIdx = HOMEPAGE_SECTION_KEYS.indexOf("home.hero");
    const videoIdx = HOMEPAGE_SECTION_KEYS.indexOf("home.video");
    const craftIdx = HOMEPAGE_SECTION_KEYS.indexOf("home.craft");

    expect(videoIdx).toBeGreaterThan(heroIdx);
    expect(videoIdx).toBeLessThan(craftIdx);
  });

  it("verifies DEFAULT_HOMEPAGE_VIDEO_PAYLOAD baseline configuration", () => {
    expect(DEFAULT_HOMEPAGE_VIDEO_PAYLOAD.is_enabled).toBe(true);
    expect(DEFAULT_HOMEPAGE_VIDEO_PAYLOAD.autoplay).toBe(true);
    expect(DEFAULT_HOMEPAGE_VIDEO_PAYLOAD.loop).toBe(true);
    expect(DEFAULT_HOMEPAGE_VIDEO_PAYLOAD.muted).toBe(true);
    expect(DEFAULT_HOMEPAGE_VIDEO_PAYLOAD.aspect_ratio).toBe("16:9");
  });

  it("resolves standard collection video variants automatically", () => {
    const kalyaniResolved = resolveOptimizedVideo("kalyani");
    expect(kalyaniResolved.src).toContain("KALYANI-720p.mp4");
    expect(kalyaniResolved.mobileSrc).toContain("KALYANI-540p.mp4");
    expect(kalyaniResolved.poster).toContain("KALYANI-poster.webp");

    const viaraResolved = resolveOptimizedVideo("viara");
    expect(viaraResolved.src).toContain("VIARA-720p.mp4");
    expect(viaraResolved.aspectRatio).toBe("16:9");
  });

  it("passes through custom Supabase Storage URLs gracefully", () => {
    const customUrl = "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/custom-123.mp4";
    const resolved = resolveOptimizedVideo(customUrl);
    expect(resolved.src).toBe(customUrl);
    expect(resolved.mobileSrc).toBe(customUrl);
  });

  it("classifies standard 16:9 landscape aspect ratio for desktop video", () => {
    const classification = classifyVideoAspectRatio(1920, 1080);
    expect(classification.isStandard).toBe(true);
    expect(classification.orientation).toBe("landscape");
    expect(classification.standardAspectRatio).toBe("16:9");
    expect(classification.aspectRatioLabel).toContain("16:9 Landscape");
  });

  it("classifies standard 9:16 portrait aspect ratio for mobile video", () => {
    const classification = classifyVideoAspectRatio(1080, 1920);
    expect(classification.isStandard).toBe(true);
    expect(classification.orientation).toBe("portrait");
    expect(classification.standardAspectRatio).toBe("9:16");
    expect(classification.aspectRatioLabel).toContain("9:16 Portrait");
  });

  it("detects non-standard video aspect ratios with informative label", () => {
    const classification = classifyVideoAspectRatio(1000, 1000);
    expect(classification.isStandard).toBe(false);
    expect(classification.orientation).toBe("square");
    expect(classification.standardAspectRatio).toBe("non-standard");
  });
});
