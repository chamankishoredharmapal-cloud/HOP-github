import { describe, it, expect } from "vitest";
import {
  isSupabaseStorageUrl,
  getSupabaseOptimizedUrl,
  getSupabaseSrcSet,
} from "../supabaseImage.ts";

describe("Supabase Image Utility Suite", () => {
  const canonicalUrl =
    "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/product-images/saree-1.jpg";

  it("isSupabaseStorageUrl correctly classifies URLs", () => {
    expect(isSupabaseStorageUrl(canonicalUrl)).toBe(true);
    expect(
      isSupabaseStorageUrl(
        "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/render/image/public/product-images/saree-1.jpg"
      )
    ).toBe(false); // already transformed
    expect(isSupabaseStorageUrl("https://example.com/image.jpg")).toBe(false);
    expect(isSupabaseStorageUrl("/assets/saree.jpg")).toBe(false);
    expect(isSupabaseStorageUrl(null)).toBe(false);
    expect(isSupabaseStorageUrl(undefined)).toBe(false);
    expect(isSupabaseStorageUrl("")).toBe(false);
  });

  it("getSupabaseOptimizedUrl generates deterministic transformed URLs", () => {
    const transformed = getSupabaseOptimizedUrl(canonicalUrl, {
      width: 800,
      quality: 80,
    });

    expect(transformed).toBe(
      "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/render/image/public/product-images/saree-1.jpg?format=webp&quality=80&width=800"
    );
  });

  it("getSupabaseOptimizedUrl enforces strict alphabetical parameter sorting", () => {
    const transformed = getSupabaseOptimizedUrl(canonicalUrl, {
      width: 1200,
      height: 1500,
      resize: "cover",
      quality: 75,
    });

    const parsed = new URL(transformed);
    expect(parsed.search).toBe(
      "?format=webp&height=1500&quality=75&resize=cover&width=1200"
    );
  });

  it("getSupabaseOptimizedUrl defaults to webp format", () => {
    const transformed = getSupabaseOptimizedUrl(canonicalUrl, { width: 480 });
    expect(transformed).toContain("format=webp");
  });

  it("getSupabaseOptimizedUrl passes non-Supabase URLs untouched", () => {
    const external = "https://images.unsplash.com/photo-12345?auto=format";
    expect(getSupabaseOptimizedUrl(external, { width: 800 })).toBe(external);

    const relative = "/optimized/hop-hero/hop-hero-800w.webp";
    expect(getSupabaseOptimizedUrl(relative, { width: 800 })).toBe(relative);
  });

  it("getSupabaseOptimizedUrl handles null/empty/invalid input gracefully", () => {
    expect(getSupabaseOptimizedUrl(null)).toBe("");
    expect(getSupabaseOptimizedUrl(undefined)).toBe("");
    expect(getSupabaseOptimizedUrl("")).toBe("");
    expect(getSupabaseOptimizedUrl("not a valid url")).toBe("not a valid url");
  });

  it("getSupabaseSrcSet generates responsive candidate set", () => {
    const srcset = getSupabaseSrcSet(canonicalUrl, [480, 800, 1200]);
    expect(srcset).toContain("width=480 480w");
    expect(srcset).toContain("width=800 800w");
    expect(srcset).toContain("width=1200 1200w");
    expect(srcset.split(", ").length).toBe(3);
  });

  it("getSupabaseSrcSet returns empty string for non-Supabase URLs", () => {
    expect(getSupabaseSrcSet("/assets/local.jpg", [480, 800])).toBe("");
  });
});