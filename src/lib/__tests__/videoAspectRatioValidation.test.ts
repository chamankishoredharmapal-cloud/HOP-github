import { describe, it, expect } from "vitest";
import { classifyVideoAspectRatio } from "@/studio/utils/videoValidation";
import { COLLECTION_VIDEO_VARIANTS, resolveOptimizedVideo } from "@/data/collectionVideos";

describe("Video Aspect Ratio Standardization (16:9 / 9:16)", () => {
  describe("classifyVideoAspectRatio", () => {
    it("correctly identifies 16:9 landscape resolutions", () => {
      const resolutions = [
        { w: 1920, h: 1080 },
        { w: 1280, h: 720 },
        { w: 960, h: 540 },
        { w: 3840, h: 2160 },
      ];

      for (const { w, h } of resolutions) {
        const result = classifyVideoAspectRatio(w, h);
        expect(result.orientation).toBe("landscape");
        expect(result.standardAspectRatio).toBe("16:9");
        expect(result.isStandard).toBe(true);
        expect(result.aspectRatioLabel).toContain("16:9 Landscape");
      }
    });

    it("correctly identifies 9:16 portrait resolutions", () => {
      const resolutions = [
        { w: 1080, h: 1920 },
        { w: 720, h: 1280 },
        { w: 540, h: 960 },
        { w: 2160, h: 3840 },
      ];

      for (const { w, h } of resolutions) {
        const result = classifyVideoAspectRatio(w, h);
        expect(result.orientation).toBe("portrait");
        expect(result.standardAspectRatio).toBe("9:16");
        expect(result.isStandard).toBe(true);
        expect(result.aspectRatioLabel).toContain("9:16 Portrait");
      }
    });

    it("flags non-standard aspect ratios for review without crashing", () => {
      const nonStandard = [
        { w: 1000, h: 1000, orientation: "square" },
        { w: 1024, h: 768, orientation: "landscape" }, // 4:3
        { w: 800, h: 1000, orientation: "portrait" },  // 4:5
      ];

      for (const { w, h, orientation } of nonStandard) {
        const result = classifyVideoAspectRatio(w, h);
        expect(result.orientation).toBe(orientation);
        expect(result.standardAspectRatio).toBe("non-standard");
        expect(result.isStandard).toBe(false);
        expect(result.aspectRatioLabel).toContain("Non-standard");
      }
    });
  });

  describe("COLLECTION_VIDEO_VARIANTS aspect ratio registry", () => {
    it("ensures all registered collection films declare standard aspect ratio & orientation", () => {
      const collectionKeys = ["hero", "kalyani", "viara", "arya", "padma", "yugen"];

      for (const key of collectionKeys) {
        const variant = COLLECTION_VIDEO_VARIANTS[key];
        expect(variant).toBeDefined();
        expect(["16:9", "9:16"]).toContain(variant.aspectRatio);
        expect(["landscape", "portrait"]).toContain(variant.orientation);

        if (key === "kalyani") {
          expect(variant.aspectRatio).toBe("9:16");
          expect(variant.orientation).toBe("portrait");
        } else {
          expect(variant.aspectRatio).toBe("16:9");
          expect(variant.orientation).toBe("landscape");
        }
      }
    });

    it("resolves optimized video variants preserving aspect ratio metadata", () => {
      const hero = resolveOptimizedVideo("hero");
      expect(hero.aspectRatio).toBe("16:9");
      expect(hero.orientation).toBe("landscape");

      const kalyani = resolveOptimizedVideo("kalyani");
      expect(kalyani.aspectRatio).toBe("9:16");
      expect(kalyani.orientation).toBe("portrait");
    });
  });
});
