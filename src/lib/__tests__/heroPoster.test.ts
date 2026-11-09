import { describe, expect, it } from "vitest";
import { getHeroPosterSources } from "@/lib/heroPoster";

const uploadedPoster =
  "https://dovnhgbisiturzbjgvei.supabase.co/storage/v1/object/public/product-images/d31d9bdc-1975-4acd-acb2-c1b90857e0ea/fb796cf4-f082-43f8-a42e-74d16c0de503.png";
const secondUploadedPoster =
  "https://dovnhgbisiturzbjgvei.supabase.co/storage/v1/object/public/product-images/collection/second-slide.webp";

describe("Hero poster source resolution", () => {
  it("keeps the saved canonical URL while offering the optimized candidate", () => {
    const sources = getHeroPosterSources(uploadedPoster);

    expect(sources.canonical).toBe(uploadedPoster);
    expect(sources.src).toContain(
      "/storage/v1/render/image/public/product-images/d31d9bdc-1975-4acd-acb2-c1b90857e0ea/fb796cf4-f082-43f8-a42e-74d16c0de503.png",
    );
    expect(sources.src).toContain("format=webp");
    expect(sources.srcSet).toContain("640w");
    expect(sources.srcSet).toContain("2560w");
    expect(sources.canRetryCanonical).toBe(true);
  });

  it("uses the exact saved URL and drops srcSet when canonical retry is required", () => {
    const sources = getHeroPosterSources(uploadedPoster, true);

    expect(sources.src).toBe(uploadedPoster);
    expect(sources.canonical).toBe(uploadedPoster);
    expect(sources.srcSet).toBeUndefined();
    expect(sources.canRetryCanonical).toBe(false);
  });

  it("resolves a separate canonical reference for each slide", () => {
    const first = getHeroPosterSources(uploadedPoster, true);
    const second = getHeroPosterSources(secondUploadedPoster, true);

    expect(first.src).toBe(uploadedPoster);
    expect(second.src).toBe(secondUploadedPoster);
    expect(first.src).not.toBe(second.src);
  });

  it("passes through relative and non-Supabase posters unchanged", () => {
    const relative = getHeroPosterSources("/optimized/videos/kalyani-poster.webp");
    const external = getHeroPosterSources("https://cdn.example.com/hero.jpg");

    expect(relative).toEqual({
      src: "/optimized/videos/kalyani-poster.webp",
      canonical: "/optimized/videos/kalyani-poster.webp",
      canRetryCanonical: false,
    });
    expect(external.src).toBe("https://cdn.example.com/hero.jpg");
    expect(external.canRetryCanonical).toBe(false);
  });

  it("returns an explicit empty source for a missing reference", () => {
    expect(getHeroPosterSources("")).toEqual({
      src: "",
      canonical: "",
      canRetryCanonical: false,
    });
  });
});
