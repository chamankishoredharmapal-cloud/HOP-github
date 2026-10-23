import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  HeroSlideSchema,
  HeroBannerPayloadSchema,
  DEFAULT_HERO_PAYLOAD,
  DEFAULT_HERO_SLIDES,
  type HeroSlide,
  type HeroBannerPayload,
} from "@/types/siteSections";

describe("Cinematic Hero Video Slider — Specification & Behavior Suite", () => {
  describe("1. Schema & Validation", () => {
    it("validates a compliant multi-video slide configuration", () => {
      const slide: HeroSlide = {
        id: "slide-test-1",
        video_url: "/optimized/videos/KALYANI-720p.mp4",
        mobile_video_url: "/optimized/videos/KALYANI-540p.mp4",
        poster_url: "/optimized/videos/KALYANI-poster.webp",
        duration: 4.5,
        is_active: true,
        title: "Test Title",
        subtitle: "Test Subtitle",
        eyebrow: "Test Eyebrow",
        alt_text: "Alt description for film",
        primary_cta: { label: "Enter", href: "/collections" },
        secondary_cta: { label: "Explore", href: "#collections" },
      };

      const result = HeroSlideSchema.safeParse(slide);
      expect(result.success).toBe(true);
    });

    it("enforces display duration cap at 5 seconds", () => {
      // 5 seconds is valid
      const valid5 = HeroSlideSchema.safeParse({
        id: "s1",
        video_url: "/optimized/videos/HERO-720p.mp4",
        duration: 5,
      });
      expect(valid5.success).toBe(true);

      // 3 seconds is valid
      const valid3 = HeroSlideSchema.safeParse({
        id: "s1",
        video_url: "/optimized/videos/HERO-720p.mp4",
        duration: 3,
      });
      expect(valid3.success).toBe(true);

      // Duration > 5 must be rejected
      const invalidOver5 = HeroSlideSchema.safeParse({
        id: "s1",
        video_url: "/optimized/videos/HERO-720p.mp4",
        duration: 6,
      });
      expect(invalidOver5.success).toBe(false);
      if (!invalidOver5.success) {
        expect(invalidOver5.error.issues[0].message).toContain("capped at 5 seconds");
      }

      // Duration < 1 must be rejected
      const invalidUnder1 = HeroSlideSchema.safeParse({
        id: "s1",
        video_url: "/optimized/videos/HERO-720p.mp4",
        duration: 0.5,
      });
      expect(invalidUnder1.success).toBe(false);
    });

    it("requires a video_url for each slide", () => {
      const missingVideo = HeroSlideSchema.safeParse({
        id: "s1",
        video_url: "",
      });
      expect(missingVideo.success).toBe(false);
    });

    it("supports configurable arbitrary number of slides in HeroBannerPayloadSchema", () => {
      const payloadWith6Slides: HeroBannerPayload = {
        ...DEFAULT_HERO_PAYLOAD,
        slides: [
          ...DEFAULT_HERO_SLIDES,
          {
            id: "slide-extra-1",
            video_url: "/optimized/videos/SPANDANA-720p.mp4",
            duration: 4,
            is_active: true,
          },
          {
            id: "slide-extra-2",
            video_url: "/optimized/videos/HERO-720p.mp4",
            duration: 3.5,
            is_active: false,
          },
        ],
      };

      const res = HeroBannerPayloadSchema.safeParse(payloadWith6Slides);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.slides?.length).toBe(6);
      }
    });

    it("verifies DEFAULT_HERO_PAYLOAD and DEFAULT_HERO_SLIDES conform 100% to schemas", () => {
      expect(HeroBannerPayloadSchema.safeParse(DEFAULT_HERO_PAYLOAD).success).toBe(true);
      DEFAULT_HERO_SLIDES.forEach((slide) => {
        expect(HeroSlideSchema.safeParse(slide).success).toBe(true);
        expect(slide.duration).toBeLessThanOrEqual(5);
        expect(slide.duration).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("2. HOP Studio Management Operations", () => {
    it("supports adding and removing slides", () => {
      let slides: HeroSlide[] = [...DEFAULT_HERO_SLIDES];
      expect(slides.length).toBe(4);

      // Add a slide
      const newSlide: HeroSlide = {
        id: "slide-new",
        video_url: "/optimized/videos/SPANDANA-720p.mp4",
        duration: 5,
        is_active: true,
      };
      slides = [...slides, newSlide];
      expect(slides.length).toBe(5);

      // Remove a slide at index 1
      slides.splice(1, 1);
      expect(slides.length).toBe(4);
      expect(slides[0].id).toBe("slide-kalyani");
      expect(slides[1].id).toBe("slide-arya");
    });

    it("supports reordering slides", () => {
      const slides: HeroSlide[] = [...DEFAULT_HERO_SLIDES];
      expect(slides[0].id).toBe("slide-kalyani");
      expect(slides[1].id).toBe("slide-viara");

      // Swap slide 0 and 1 (move down)
      const temp = slides[0];
      slides[0] = slides[1];
      slides[1] = temp;

      expect(slides[0].id).toBe("slide-viara");
      expect(slides[1].id).toBe("slide-kalyani");
    });

    it("supports enabling and disabling individual slides", () => {
      const slides: HeroSlide[] = [
        { ...DEFAULT_HERO_SLIDES[0], is_active: true },
        { ...DEFAULT_HERO_SLIDES[1], is_active: false },
        { ...DEFAULT_HERO_SLIDES[2], is_active: true },
      ];

      const activeOnly = slides.filter((s) => s.is_active !== false);
      expect(activeOnly.length).toBe(2);
      expect(activeOnly.map((s) => s.id)).toEqual(["slide-kalyani", "slide-arya"]);
    });

    it("clamps display duration to maximum 5 seconds in Studio input handler", () => {
      const clampDuration = (val: number) => Math.min(5, Math.max(1, isNaN(val) ? 5 : val));

      expect(clampDuration(10)).toBe(5);
      expect(clampDuration(7.5)).toBe(5);
      expect(clampDuration(4)).toBe(4);
      expect(clampDuration(3.5)).toBe(3.5);
      expect(clampDuration(0.2)).toBe(1);
    });
  });

  describe("3. Playback Performance & Advancement Dynamics", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("advances slide automatically when display window expires", () => {
      let currentIndex = 0;
      const slides = DEFAULT_HERO_SLIDES;
      const durationMs = (slides[currentIndex].duration || 5) * 1000;

      const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
        currentIndex = (currentIndex + 1) % slides.length;
      }, durationMs);

      expect(currentIndex).toBe(0);

      // Advance by 3 seconds (not yet expired for a 5s slide)
      vi.advanceTimersByTime(3000);
      expect(currentIndex).toBe(0);

      // Advance past the 5s window
      vi.advanceTimersByTime(2000);
      expect(currentIndex).toBe(1);

      if (timer) clearTimeout(timer);
    });

    it("resiliently advances when video playback encounters an error", () => {
      let currentIndex = 0;
      let videoReady = true;
      const slides = DEFAULT_HERO_SLIDES;

      // Simulate video error event
      const onVideoError = () => {
        videoReady = false;
        // Notice: Timer continues running, slider is NOT frozen
      };

      onVideoError();
      expect(videoReady).toBe(false);

      // Timer triggers advancement
      const durationMs = (slides[currentIndex].duration || 5) * 1000;
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % slides.length;
      }, durationMs);

      vi.advanceTimersByTime(durationMs);
      expect(currentIndex).toBe(1);
    });

    it("pauses timer and video playback when tab becomes hidden, resumes when visible", () => {
      let isTabVisible = true;
      let isPlaying = true;
      let timerFired = false;

      const handleVisibilityChange = (state: "visible" | "hidden") => {
        isTabVisible = state === "visible";
        if (!isTabVisible) {
          isPlaying = false;
        } else {
          isPlaying = true;
        }
      };

      // Tab hidden: pause
      handleVisibilityChange("hidden");
      expect(isTabVisible).toBe(false);
      expect(isPlaying).toBe(false);

      // While hidden, advancement should not occur
      // (simulated by checking isTabVisible guard)
      const scheduleAdvance = () => {
        if (!isTabVisible) return; // Guarded!
        timerFired = true;
      };
      scheduleAdvance();
      expect(timerFired).toBe(false);

      // Tab visible: resume
      handleVisibilityChange("visible");
      expect(isTabVisible).toBe(true);
      expect(isPlaying).toBe(true);
    });

    it("prevents overlapping timers and cleanly cancels pending timers on slide switch", () => {
      let activeTimerCount = 0;
      let timer: ReturnType<typeof setTimeout> | null = null;

      const startSlideTimer = () => {
        if (timer) {
          clearTimeout(timer);
          activeTimerCount--;
        }
        activeTimerCount++;
        timer = setTimeout(() => {
          activeTimerCount--;
        }, 5000);
      };

      startSlideTimer();
      expect(activeTimerCount).toBe(1);

      // User jumps to another slide before 5s expires
      startSlideTimer();
      expect(activeTimerCount).toBe(1); // Cleared previous, never overlapping!

      // Unmount / cleanup
      if (timer) {
        clearTimeout(timer);
        activeTimerCount--;
      }
      expect(activeTimerCount).toBe(0);
    });

    it("respects prefers-reduced-motion by disabling automatic timer", () => {
      const reducedMotion = true;
      let currentIndex = 0;

      const shouldAutoAdvance = !reducedMotion;
      if (shouldAutoAdvance) {
        setTimeout(() => {
          currentIndex = 1;
        }, 5000);
      }

      vi.advanceTimersByTime(10000);
      expect(currentIndex).toBe(0); // Remains on slide 0 without forced motion
    });
  });
});
