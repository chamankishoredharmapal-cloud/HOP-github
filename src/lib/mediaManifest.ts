/**
 * Media Manifest Resolver — Phase 3 POC
 *
 * Deterministic lookup: source path → available optimized derivatives.
 *
 * Architecture:
 *   source + target context + required width → appropriate derivative
 *
 * This is a static, build-time-safe manifest. It does NOT introduce global
 * state or side effects. It reads from the Phase 2 pipeline manifest and
 * maps source assets to their public-accessible derivative paths.
 *
 * POC scope: Only 3 assets are registered. Application-wide integration
 * requires CTO authorization.
 */

export interface DerivativeEntry {
  /** Public URL path relative to site root (served from /public/) */
  path: string;
  /** Image format: "avif" | "webp" */
  format: "avif" | "webp";
  /** Derivative width in pixels */
  width: number;
  /** Derivative height in pixels */
  height: number;
  /** File size in bytes */
  sizeBytes: number;
}

export interface MediaAssetEntry {
  /** Original source path relative to project root */
  sourcePath: string;
  /** Original source dimensions */
  sourceWidth: number;
  sourceHeight: number;
  /** Pipeline profile used for this asset */
  profile: string;
  /** Available optimized derivatives */
  derivatives: DerivativeEntry[];
}

/**
 * POC Media Manifest — Phase 3
 *
 * Contains only the three authorized POC assets:
 *   A. hero-image.png (hero profile)
 *   B. organic-earring.png (product profile)
 *   C. hop-fabric.jpg (editorial profile)
 *
 * Derivative data sourced from: tools/media-pipeline/output/manifest.json
 * Derivative files served from: public/optimized/<asset-name>/
 */
const POC_MANIFEST: Record<string, MediaAssetEntry> = {
  // POC A — Hero
  "src/assets/hero-image.png": {
    sourcePath: "src/assets/hero-image.png",
    sourceWidth: 1824,
    sourceHeight: 1216,
    profile: "hero",
    derivatives: [
      { path: "/optimized/hero-image/hero-image-1824w.avif", format: "avif", width: 1824, height: 1216, sizeBytes: 161374 },
      { path: "/optimized/hero-image/hero-image-1824w.webp", format: "webp", width: 1824, height: 1216, sizeBytes: 123222 },
      { path: "/optimized/hero-image/hero-image-1600w.avif", format: "avif", width: 1600, height: 1067, sizeBytes: 122847 },
      { path: "/optimized/hero-image/hero-image-1600w.webp", format: "webp", width: 1600, height: 1067, sizeBytes: 95328 },
      { path: "/optimized/hero-image/hero-image-1200w.avif", format: "avif", width: 1200, height: 800, sizeBytes: 72382 },
      { path: "/optimized/hero-image/hero-image-1200w.webp", format: "webp", width: 1200, height: 800, sizeBytes: 56552 },
    ],
  },

  // POC B — Product
  "src/assets/organic-earring.png": {
    sourcePath: "src/assets/organic-earring.png",
    sourceWidth: 1024,
    sourceHeight: 1024,
    profile: "product",
    derivatives: [
      { path: "/optimized/organic-earring/organic-earring-1024w.avif", format: "avif", width: 1024, height: 1024, sizeBytes: 140758 },
      { path: "/optimized/organic-earring/organic-earring-1024w.webp", format: "webp", width: 1024, height: 1024, sizeBytes: 102364 },
      { path: "/optimized/organic-earring/organic-earring-800w.avif", format: "avif", width: 800, height: 800, sizeBytes: 94164 },
      { path: "/optimized/organic-earring/organic-earring-800w.webp", format: "webp", width: 800, height: 800, sizeBytes: 66952 },
      { path: "/optimized/organic-earring/organic-earring-480w.avif", format: "avif", width: 480, height: 480, sizeBytes: 41378 },
      { path: "/optimized/organic-earring/organic-earring-480w.webp", format: "webp", width: 480, height: 480, sizeBytes: 27854 },
    ],
  },

  // POC C — Editorial
  "src/assets/hop-fabric.jpg": {
    sourcePath: "src/assets/hop-fabric.jpg",
    sourceWidth: 1080,
    sourceHeight: 1920,
    profile: "editorial",
    derivatives: [
      { path: "/optimized/hop-fabric/hop-fabric-1080w.avif", format: "avif", width: 1080, height: 1920, sizeBytes: 216403 },
      { path: "/optimized/hop-fabric/hop-fabric-1080w.webp", format: "webp", width: 1080, height: 1920, sizeBytes: 247234 },
      { path: "/optimized/hop-fabric/hop-fabric-768w.avif", format: "avif", width: 768, height: 1365, sizeBytes: 147577 },
      { path: "/optimized/hop-fabric/hop-fabric-768w.webp", format: "webp", width: 768, height: 1365, sizeBytes: 170704 },
    ],
  },

  // Pattern 1 — Static ESM & Catalog Assets
  "src/assets/hop-collection-pattu.jpg": {
    sourcePath: "src/assets/hop-collection-pattu.jpg",
    sourceWidth: 1080,
    sourceHeight: 1920,
    profile: "collection",
    derivatives: [
      { path: "/optimized/hop-collection-pattu/hop-collection-pattu-1080w.avif", format: "avif", width: 1080, height: 1920, sizeBytes: 152058 },
      { path: "/optimized/hop-collection-pattu/hop-collection-pattu-1080w.webp", format: "webp", width: 1080, height: 1920, sizeBytes: 153000 },
      { path: "/optimized/hop-collection-pattu/hop-collection-pattu-768w.avif", format: "avif", width: 768, height: 1365, sizeBytes: 99205 },
      { path: "/optimized/hop-collection-pattu/hop-collection-pattu-768w.webp", format: "webp", width: 768, height: 1365, sizeBytes: 104722 },
    ],
  },
  "src/assets/hop-hero.jpg": {
    sourcePath: "src/assets/hop-hero.jpg",
    sourceWidth: 1920,
    sourceHeight: 1080,
    profile: "hero",
    derivatives: [
      { path: "/optimized/hop-hero/hop-hero-1920w.avif", format: "avif", width: 1920, height: 1080, sizeBytes: 70737 },
      { path: "/optimized/hop-hero/hop-hero-1920w.webp", format: "webp", width: 1920, height: 1080, sizeBytes: 62892 },
      { path: "/optimized/hop-hero/hop-hero-1600w.avif", format: "avif", width: 1600, height: 900, sizeBytes: 54803 },
      { path: "/optimized/hop-hero/hop-hero-1600w.webp", format: "webp", width: 1600, height: 900, sizeBytes: 47384 },
      { path: "/optimized/hop-hero/hop-hero-1200w.avif", format: "avif", width: 1200, height: 675, sizeBytes: 36648 },
      { path: "/optimized/hop-hero/hop-hero-1200w.webp", format: "webp", width: 1200, height: 675, sizeBytes: 30798 },
    ],
  },
  "src/assets/hop-collection-linen.jpg": {
    sourcePath: "src/assets/hop-collection-linen.jpg",
    sourceWidth: 1080,
    sourceHeight: 1920,
    profile: "collection",
    derivatives: [
      { path: "/optimized/hop-collection-linen/hop-collection-linen-1080w.avif", format: "avif", width: 1080, height: 1920, sizeBytes: 51636 },
      { path: "/optimized/hop-collection-linen/hop-collection-linen-1080w.webp", format: "webp", width: 1080, height: 1920, sizeBytes: 49874 },
      { path: "/optimized/hop-collection-linen/hop-collection-linen-768w.avif", format: "avif", width: 768, height: 1365, sizeBytes: 29526 },
      { path: "/optimized/hop-collection-linen/hop-collection-linen-768w.webp", format: "webp", width: 768, height: 1365, sizeBytes: 31336 },
    ],
  },
  "src/assets/hop-collection-organza.jpg": {
    sourcePath: "src/assets/hop-collection-organza.jpg",
    sourceWidth: 1080,
    sourceHeight: 1920,
    profile: "collection",
    derivatives: [
      { path: "/optimized/hop-collection-organza/hop-collection-organza-1080w.avif", format: "avif", width: 1080, height: 1920, sizeBytes: 53880 },
      { path: "/optimized/hop-collection-organza/hop-collection-organza-1080w.webp", format: "webp", width: 1080, height: 1920, sizeBytes: 55234 },
      { path: "/optimized/hop-collection-organza/hop-collection-organza-768w.avif", format: "avif", width: 768, height: 1365, sizeBytes: 31639 },
      { path: "/optimized/hop-collection-organza/hop-collection-organza-768w.webp", format: "webp", width: 768, height: 1365, sizeBytes: 35418 },
    ],
  },
  "src/assets/hop-gift.jpg": {
    sourcePath: "src/assets/hop-gift.jpg",
    sourceWidth: 1920,
    sourceHeight: 1080,
    profile: "general",
    derivatives: [
      { path: "/optimized/hop-gift/hop-gift-1920w.avif", format: "avif", width: 1920, height: 1080, sizeBytes: 111801 },
      { path: "/optimized/hop-gift/hop-gift-1920w.webp", format: "webp", width: 1920, height: 1080, sizeBytes: 114340 },
      { path: "/optimized/hop-gift/hop-gift-1200w.avif", format: "avif", width: 1200, height: 675, sizeBytes: 44970 },
      { path: "/optimized/hop-gift/hop-gift-1200w.webp", format: "webp", width: 1200, height: 675, sizeBytes: 43064 },
      { path: "/optimized/hop-gift/hop-gift-768w.avif", format: "avif", width: 768, height: 432, sizeBytes: 17552 },
      { path: "/optimized/hop-gift/hop-gift-768w.webp", format: "webp", width: 768, height: 432, sizeBytes: 16738 },
      { path: "/optimized/hop-gift/hop-gift-480w.avif", format: "avif", width: 480, height: 270, sizeBytes: 8584 },
      { path: "/optimized/hop-gift/hop-gift-480w.webp", format: "webp", width: 480, height: 270, sizeBytes: 8262 },
    ],
  },
};

/**
 * Resolve a source asset path to its manifest entry.
 * Returns undefined if the asset has no optimized derivatives.
 */
export function resolveAsset(sourcePath: string): MediaAssetEntry | undefined {
  return POC_MANIFEST[sourcePath];
}

/**
 * Build an srcset string for a given format from a media asset entry.
 */
export function buildSrcSet(
  asset: MediaAssetEntry,
  format: "avif" | "webp"
): string {
  return asset.derivatives
    .filter((d) => d.format === format)
    .sort((a, b) => a.width - b.width)
    .map((d) => `${d.path} ${d.width}w`)
    .join(", ");
}

/**
 * Get the largest derivative for a given format (used as the default src).
 */
export function getLargestDerivative(
  asset: MediaAssetEntry,
  format: "avif" | "webp"
): DerivativeEntry | undefined {
  return asset.derivatives
    .filter((d) => d.format === format)
    .sort((a, b) => b.width - a.width)[0];
}
