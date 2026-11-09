import { afterEach, describe, expect, it, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { CinematicHeroSlider } from "@/components/hop/CinematicHeroSlider";
import { MediaDisplayProvider } from "@/contexts/MediaDisplayContext";
import type { HeroBannerPayload } from "@/types/siteSections";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const uploadedPoster =
  "https://dovnhgbisiturzbjgvei.supabase.co/storage/v1/object/public/product-images/d31d9bdc-1975-4acd-acb2-c1b90857e0ea/fb796cf4-f082-43f8-a42e-74d16c0de503.png";

const heroPayload: HeroBannerPayload = {
  title: "Hero fallback",
  slides: [
    {
      id: "slide-kalyani",
      title: "Woven For Permanence",
      poster_url: uploadedPoster,
      media_type: "image",
      duration: 5,
      is_active: true,
    },
  ],
};

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(async () => {
  if (root) {
    await act(async () => root?.unmount());
    root = null;
  }
  container?.remove();
  container = null;
  vi.restoreAllMocks();
});

describe("Hero poster browser fallback", () => {
  it("retries the exact saved URL after the optimized image errors", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root?.render(
        React.createElement(
          MediaDisplayProvider,
          { initialMode: "show-media" },
          React.createElement(CinematicHeroSlider, { section: heroPayload }),
        ),
      );
    });

    const image = container.querySelector<HTMLImageElement>(
      ".hop-threshold__slide--active img.hop-threshold__slide-poster",
    );
    expect(image).not.toBeNull();
    expect(image?.getAttribute("src")).toContain("/storage/v1/render/image/public/");
    expect(image?.getAttribute("data-canonical-src")).toBe(uploadedPoster);
    expect(image?.getAttribute("data-poster-state")).toBe("optimized");

    await act(async () => {
      image?.dispatchEvent(new Event("error", { bubbles: true }));
    });

    const retriedImage = container.querySelector<HTMLImageElement>(
      ".hop-threshold__slide--active img.hop-threshold__slide-poster",
    );
    expect(retriedImage).toBe(image);
    expect(retriedImage?.getAttribute("src")).toBe(uploadedPoster);
    expect(retriedImage?.getAttribute("srcset")).toBeNull();
    expect(retriedImage?.getAttribute("data-poster-state")).toBe("canonical");
    expect(warn).toHaveBeenCalledWith(
      "Hero poster optimization failed; retrying the saved storage URL.",
      expect.objectContaining({
        slide: "slide-kalyani",
        savedUrl: uploadedPoster,
      }),
    );
  });
});
