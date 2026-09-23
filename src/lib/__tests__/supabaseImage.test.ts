import test from "node:test";
import assert from "node:assert/strict";
import {
  isSupabaseStorageUrl,
  getSupabaseOptimizedUrl,
  getSupabaseSrcSet,
} from "../supabaseImage.ts";

test("Supabase Image Utility Suite", async (t) => {
  const canonicalUrl =
    "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/product-images/saree-1.jpg";

  await t.test("isSupabaseStorageUrl correctly classifies URLs", () => {
    assert.equal(isSupabaseStorageUrl(canonicalUrl), true);
    assert.equal(
      isSupabaseStorageUrl(
        "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/render/image/public/product-images/saree-1.jpg"
      ),
      false // already transformed
    );
    assert.equal(isSupabaseStorageUrl("https://example.com/image.jpg"), false);
    assert.equal(isSupabaseStorageUrl("/assets/saree.jpg"), false);
    assert.equal(isSupabaseStorageUrl(null), false);
    assert.equal(isSupabaseStorageUrl(undefined), false);
    assert.equal(isSupabaseStorageUrl(""), false);
  });

  await t.test("getSupabaseOptimizedUrl generates deterministic transformed URLs", () => {
    const transformed = getSupabaseOptimizedUrl(canonicalUrl, {
      width: 800,
      quality: 80,
    });

    assert.equal(
      transformed,
      "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/render/image/public/product-images/saree-1.jpg?format=webp&quality=80&width=800"
    );
  });

  await t.test("getSupabaseOptimizedUrl enforces strict alphabetical parameter sorting", () => {
    const transformed = getSupabaseOptimizedUrl(canonicalUrl, {
      width: 1200,
      height: 1500,
      resize: "cover",
      quality: 75,
    });

    const parsed = new URL(transformed);
    assert.equal(
      parsed.search,
      "?format=webp&height=1500&quality=75&resize=cover&width=1200"
    );
  });

  await t.test("getSupabaseOptimizedUrl defaults to webp format", () => {
    const transformed = getSupabaseOptimizedUrl(canonicalUrl, { width: 480 });
    assert.ok(transformed.includes("format=webp"));
  });

  await t.test("getSupabaseOptimizedUrl passes non-Supabase URLs untouched", () => {
    const external = "https://images.unsplash.com/photo-12345?auto=format";
    assert.equal(getSupabaseOptimizedUrl(external, { width: 800 }), external);

    const relative = "/optimized/hop-hero/hop-hero-800w.webp";
    assert.equal(getSupabaseOptimizedUrl(relative, { width: 800 }), relative);
  });

  await t.test("getSupabaseOptimizedUrl handles null/empty/invalid input gracefully", () => {
    assert.equal(getSupabaseOptimizedUrl(null), "");
    assert.equal(getSupabaseOptimizedUrl(undefined), "");
    assert.equal(getSupabaseOptimizedUrl(""), "");
    assert.equal(getSupabaseOptimizedUrl("not a valid url"), "not a valid url");
  });

  await t.test("getSupabaseSrcSet generates responsive candidate set", () => {
    const srcset = getSupabaseSrcSet(canonicalUrl, [480, 800, 1200]);
    assert.ok(srcset.includes("width=480 480w"));
    assert.ok(srcset.includes("width=800 800w"));
    assert.ok(srcset.includes("width=1200 1200w"));
    assert.equal(srcset.split(", ").length, 3);
  });

  await t.test("getSupabaseSrcSet returns empty string for non-Supabase URLs", () => {
    assert.equal(getSupabaseSrcSet("/assets/local.jpg", [480, 800]), "");
  });
});
