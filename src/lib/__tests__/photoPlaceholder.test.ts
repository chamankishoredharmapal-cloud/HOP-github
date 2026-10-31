import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { LivingSareeSection } from "@/components/hop/LivingSareeSection";

describe("HOP Phase 1: Photo Placeholder & Aspect Ratio Standardization", () => {
  it("defaults to 16:9 landscape aspect ratio and reserves the frame", () => {
    const html = renderToString(
      React.createElement(PhotoPlaceholder, {
        src: "/test-image.jpg",
        alt: "Test Saree Photograph",
      })
    );

    // Aspect ratio container check: aspect-[16/9] class and inline aspect-ratio style
    expect(html).toContain("aspect-[16/9]");
    expect(html).toContain("aspect-ratio:16 / 9");
    // Full image preservation via object-contain without cropping
    expect(html).toContain("object-contain");
    expect(html).toContain("max-w-full");
    expect(html).toContain("max-h-full");
    // Ensure 2:3 crop is NOT applied by default
    expect(html).not.toContain("aspect-[2/3]");
  });

  it("permits 2:3 crop ONLY when explicitly configured for mobile feed thumbnail", () => {
    const html = renderToString(
      React.createElement(PhotoPlaceholder, {
        src: "/test-thumbnail.jpg",
        alt: "Feed Thumbnail",
        ratio: "2:3",
      })
    );

    expect(html).toContain("aspect-[2/3]");
    expect(html).toContain("aspect-ratio:2 / 3");
    expect(html).toContain("object-cover");
  });

  it("renders intentional, accessible missing-image state without fake video or blank frames", () => {
    const html = renderToString(
      React.createElement(PhotoPlaceholder, {
        src: null,
        alt: "Missing Silk Drape",
        fallbackText: "Photograph being prepared",
      })
    );

    // Accessible container
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Missing Silk Drape"');
    // Brand signature
    expect(html).toContain("House of Padmavati");
    expect(html).toContain("Photograph being prepared");

    // Zero fake video elements, zero play buttons, zero video frames
    expect(html).not.toContain("<video");
    expect(html).not.toContain("<source");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("play");
  });

  it("LivingSareeSection renders standardized PhotoPlaceholder adhering to site-wide policy", () => {
    const html = renderToString(
      React.createElement(LivingSareeSection, {
        poster: "/content/photography/living-saree-sample.jpg",
        alt: "Living Saree visual study photograph",
        isEnabled: true,
      })
    );

    expect(html).toContain("hop-living-saree");
    expect(html).toContain("aspect-[16/9]");
    expect(html).toContain("object-contain");
    expect(html).toContain('src="/content/photography/living-saree-sample.jpg"');
    // No video playback
    expect(html).not.toContain("<video");
  });

  it("LivingSareeSection returns null when disabled to prevent blank gaps", () => {
    const html = renderToString(
      React.createElement(LivingSareeSection, {
        isEnabled: false,
      })
    );

    expect(html).toBe("");
  });

  it("ensures collection photo placeholders render without visible collection names or overlay text", () => {
    const html = renderToString(
      React.createElement(
        "article",
        { className: "hop-collection-film-chapter hop-collection-film-chapter--kalyani" },
        React.createElement(
          "a",
          { href: "/collections/kalyani", className: "hop-collection-film", "aria-label": "Enter the Kalyani collection" },
          React.createElement(PhotoPlaceholder, {
            src: "/optimized/videos/KALYANI-poster.webp",
            alt: "Kalyani — collection film",
            ratio: "16:9",
          })
        )
      )
    );

    // Visible collection names must NOT appear in visible placeholder DOM
    expect(html).not.toContain("hop-collection-film__name");
    expect(html).not.toContain("hop-collection-film__identity");
    expect(html).not.toContain("hop-collection-film__emotion");
    expect(html).not.toContain("hop-collection-film__mark");
    // Accessible aria-label and href are preserved
    expect(html).toContain('aria-label="Enter the Kalyani collection"');
    expect(html).toContain('href="/collections/kalyani"');
  });
});
