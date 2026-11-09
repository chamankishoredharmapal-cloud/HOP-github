import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  MediaDisplayProvider,
  DEFAULT_MEDIA_DISPLAY_MODE,
  MEDIA_DISPLAY_MODE_STORAGE_KEY,
  MEDIA_DISPLAY_MODE_EVENT,
  persistMediaDisplayMode,
  getStoredMediaDisplayMode,
} from "@/contexts/MediaDisplayContext";
import { MediaSurface, MediaImage } from "@/components/ui/MediaSurface";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Film } from "@/components/hop/Film";
import { CinematicHeroSlider } from "@/components/hop/CinematicHeroSlider";

describe("HOP Structure-Only Mode & Media Visibility Controls", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("defaults initial mode to 'show-media' for normal storefront rendering", () => {
    expect(DEFAULT_MEDIA_DISPLAY_MODE).toBe("show-media");
  });

  it("MediaImage renders a neutral structural surface in structure-only mode without <img> tag", () => {
    const html = renderToString(
      React.createElement(
        MediaDisplayProvider,
        { initialMode: "structure-only" },
        React.createElement(MediaImage, {
          src: "/test-image.jpg",
          alt: "Silk Saree",
          className: "test-class",
        })
      )
    );

    // Verifies neutral surface is rendered
    expect(html).toContain('role="presentation"');
    expect(html).toContain("bg-jasmine-deep/35");
    // Strictly zero <img> elements rendered
    expect(html).not.toContain("<img");
    expect(html).not.toContain("/test-image.jpg");
  });

  it("MediaImage renders standard <img> tag when mode is 'show-media'", () => {
    const html = renderToString(
      React.createElement(
        MediaDisplayProvider,
        { initialMode: "show-media" },
        React.createElement(MediaImage, {
          src: "/test-image.jpg",
          alt: "Silk Saree",
          className: "test-img-class",
        })
      )
    );

    expect(html).toContain("<img");
    expect(html).toContain('src="/test-image.jpg"');
    expect(html).toContain('alt="Silk Saree"');
  });

  it("MediaSurface renders container preserving aspect ratio without media", () => {
    const html = renderToString(
      React.createElement(
        MediaDisplayProvider,
        { initialMode: "structure-only" },
        React.createElement(MediaSurface, {
          aspectRatio: "16/9",
          className: "hero-placeholder",
        })
      )
    );

    expect(html).toContain("aspect-ratio:16/9");
    expect(html).toContain("hero-placeholder");
    expect(html).toContain("bg-jasmine-deep/35");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<video");
  });

  it("PhotoPlaceholder renders neutral structural frame without <img> in structure-only mode", () => {
    const html = renderToString(
      React.createElement(
        MediaDisplayProvider,
        { initialMode: "structure-only" },
        React.createElement(PhotoPlaceholder, {
          src: "/living-saree.jpg",
          alt: "Living Saree",
          ratio: "16:9",
        })
      )
    );

    expect(html).toContain("aspect-[16/9]");
    expect(html).toContain("bg-jasmine-deep/35");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<picture");
  });

  it("Film renders neutral structural frame without mounting <video> or poster <img> in structure-only mode", () => {
    const html = renderToString(
      React.createElement(
        MediaDisplayProvider,
        { initialMode: "structure-only" },
        React.createElement(Film, {
          src: "/kalyani.mp4",
          poster: "/kalyani-poster.jpg",
          alt: "Kalyani Film",
          isCinematic: true,
        })
      )
    );

    expect(html).toContain("rounded-2xl");
    expect(html).toContain("bg-jasmine-deep/35");
    expect(html).not.toContain("<video");
    expect(html).not.toContain("<source");
    expect(html).not.toContain("<img");
  });

  it("CinematicHeroSlider renders neutral structural slides without <video> or <img> in structure-only mode", () => {
    const testSection = {
      id: "hero-test",
      type: "hero" as const,
      enabled: true,
      order: 1,
      slides: [
        {
          id: "slide-1",
          title: "Kalyani",
          tagline: "The Royal Weave",
          video_url: "/hero-kalyani.mp4",
          image_url: "/hero-kalyani.jpg",
          enabled: true,
        },
      ],
    };

    const html = renderToString(
      React.createElement(
        MediaDisplayProvider,
        { initialMode: "structure-only" },
        React.createElement(CinematicHeroSlider, {
          section: testSection,
        })
      )
    );

    expect(html).toContain("hop-threshold__slide");
    expect(html).toContain("hop-threshold__slide-poster-layer");
    // Strictly zero video elements and zero images
    expect(html).not.toContain("<video");
    expect(html).not.toContain("<img");
    // Confirms no collection marketing text overlay is placed on structural surface
    expect(html).not.toContain("The Royal Weave");
  });

  it("persists media display mode to localStorage and root document attribute", () => {
    persistMediaDisplayMode("show-media");
    expect(localStorage.getItem(MEDIA_DISPLAY_MODE_STORAGE_KEY)).toBe("show-media");
    expect(document.documentElement.getAttribute("data-media-mode")).toBe("show-media");

    persistMediaDisplayMode("structure-only");
    expect(localStorage.getItem(MEDIA_DISPLAY_MODE_STORAGE_KEY)).toBe("structure-only");
    expect(document.documentElement.getAttribute("data-media-mode")).toBe("structure-only");
  });

  it("dispatches custom event on mode persistence for instant cross-component synchronization", () => {
    let capturedMode: string | null = null;
    const listener = (e: Event) => {
      capturedMode = (e as CustomEvent).detail;
    };
    window.addEventListener(MEDIA_DISPLAY_MODE_EVENT, listener);

    persistMediaDisplayMode("show-media");
    expect(capturedMode).toBe("show-media");

    window.removeEventListener(MEDIA_DISPLAY_MODE_EVENT, listener);
  });

  it("getStoredMediaDisplayMode returns stored mode or falls back to 'show-media'", () => {
    localStorage.clear();
    expect(getStoredMediaDisplayMode()).toBe("show-media");

    localStorage.setItem(MEDIA_DISPLAY_MODE_STORAGE_KEY, "show-media");
    expect(getStoredMediaDisplayMode()).toBe("show-media");

    localStorage.setItem(MEDIA_DISPLAY_MODE_STORAGE_KEY, "structure-only");
    expect(getStoredMediaDisplayMode()).toBe("structure-only");
  });
});
