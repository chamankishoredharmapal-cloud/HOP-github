/**
 * OptimizedImage — Phase 3 POC Component
 *
 * Renders a <picture> element with AVIF → WebP → original fallback,
 * driven by the Phase 2 pipeline manifest.
 *
 * Architecture:
 *   1. Looks up the source asset in the media manifest
 *   2. Builds srcset for AVIF and WebP derivatives
 *   3. Renders semantic <picture> with format negotiation
 *   4. Falls back to original asset if no derivatives found
 *   5. Sets explicit width/height for CLS prevention
 *   6. Supports priority loading for LCP-critical images
 *
 * The browser performs format negotiation — no JavaScript detection needed.
 */

import {
  resolveAsset,
  buildSrcSet,
  type MediaAssetEntry,
} from "@/lib/mediaManifest";

export interface OptimizedImageProps {
  /**
   * The source asset path (relative to project root).
   * Example: "src/assets/hero-image.png"
   *
   * If the asset is found in the manifest, optimized derivatives are served.
   * If not found, the fallbackSrc is used directly.
   */
  assetPath: string;

  /**
   * The original import URL from Vite's asset pipeline.
   * Used as the <img> fallback src for browsers that don't support AVIF/WebP.
   */
  fallbackSrc: string;

  /** Required alt text for accessibility */
  alt: string;

  /**
   * The `sizes` attribute for responsive delivery.
   * Must match the actual rendered size of the image in the layout.
   * Example: "min(92vw, 1680px)" or "(max-width: 768px) 100vw, 50vw"
   */
  sizes: string;

  /**
   * Whether this image is above-the-fold / LCP-critical.
   * When true, sets loading="eager", fetchpriority="high", decoding="async".
   * When false (default), sets loading="lazy", decoding="async".
   */
  priority?: boolean;

  /** Optional CSS class name applied to the <picture> wrapper */
  className?: string;

  /** Optional CSS class name applied to the inner <img> element */
  imgClassName?: string;
}

export const OptimizedImage = ({
  assetPath,
  fallbackSrc,
  alt,
  sizes,
  priority = false,
  className,
  imgClassName,
}: OptimizedImageProps) => {
  const asset: MediaAssetEntry | undefined = resolveAsset(assetPath);

  // If no manifest entry exists, render a plain <img> with the original asset
  if (!asset) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={imgClassName}
      />
    );
  }

  const avifSrcSet = buildSrcSet(asset, "avif");
  const webpSrcSet = buildSrcSet(asset, "webp");

  return (
    <picture className={className}>
      {avifSrcSet && (
        <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      )}
      {webpSrcSet && (
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      )}
      <img
        src={fallbackSrc}
        alt={alt}
        width={asset.sourceWidth}
        height={asset.sourceHeight}
        loading={priority ? "eager" : "lazy"}
        // lowercase fetchpriority: React 18 warns on the camelCase prop and drops it;
        // spread bypasses JSX excess-prop checks while emitting valid HTML.
        {...(priority ? { fetchpriority: "high" } : {})}
        decoding="async"
        className={imgClassName}
      />
    </picture>
  );
};
