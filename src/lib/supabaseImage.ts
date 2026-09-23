/**
 * House of Padmavati (HOP) — Supabase Storage Image Optimization Utility
 *
 * Provides deterministic, presentation-layer image transformation URLs and responsive
 * candidate sets for dynamic assets served from Supabase Storage.
 *
 * Invariants:
 * 1. Stateless & pure — zero side-effects on data models or canonical URLs.
 * 2. Format: 'webp' default for runtime transformation rollout.
 * 3. Deterministic query parameter ordering (alphabetical) for cache stability.
 * 4. Pass-through for non-Supabase URLs or unparseable URLs.
 * 5. One-shot fallback safe: client error handling falls back directly to canonical URL.
 */

export interface SupabaseTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'origin';
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * Validates whether a given URL string points to a Supabase Storage public object.
 */
export function isSupabaseStorageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  return (
    (url.includes('.supabase.co/storage/v1/object/public/') ||
      url.includes('.supabase.in/storage/v1/object/public/')) &&
    !url.includes('/storage/v1/render/image/public/')
  );
}

/**
 * Transforms a canonical Supabase storage object URL into an optimized transformation URL.
 * If the URL is not a valid Supabase storage URL or already transformed, returns the original URL.
 */
export function getSupabaseOptimizedUrl(
  url: string | null | undefined,
  options: SupabaseTransformOptions = {}
): string {
  if (!url || typeof url !== 'string') return '';
  if (!isSupabaseStorageUrl(url)) return url;

  try {
    const parsed = new URL(url);

    // Replace /storage/v1/object/public/ with /storage/v1/render/image/public/
    parsed.pathname = parsed.pathname.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );

    // Apply transformation parameters with strict alphabetical ordering
    // Default format is webp
    const format = options.format || 'webp';
    const quality = options.quality ?? 80;

    // Use URLSearchParams to set and sort parameters
    const params = new URLSearchParams(parsed.search);

    if (format !== 'origin') {
      params.set('format', format);
    }
    if (options.height && options.height > 0) {
      params.set('height', Math.round(options.height).toString());
    }
    params.set('quality', quality.toString());
    if (options.resize) {
      params.set('resize', options.resize);
    }
    if (options.width && options.width > 0) {
      params.set('width', Math.round(options.width).toString());
    }

    // Sort keys alphabetically for cache determinism
    params.sort();

    parsed.search = params.toString();
    return parsed.toString();
  } catch {
    // If URL parsing fails, return raw url
    return url;
  }
}

/**
 * Generates a responsive srcset string with deterministic Supabase transformation URLs
 * for a specified list of candidate widths.
 */
export function getSupabaseSrcSet(
  url: string | null | undefined,
  widths: number[],
  options: Omit<SupabaseTransformOptions, 'width'> = {}
): string {
  if (!url || typeof url !== 'string' || !widths || widths.length === 0) return '';
  if (!isSupabaseStorageUrl(url)) return '';

  return widths
    .filter((w) => w > 0)
    .sort((a, b) => a - b)
    .map((w) => `${getSupabaseOptimizedUrl(url, { ...options, width: w })} ${w}w`)
    .join(', ');
}
