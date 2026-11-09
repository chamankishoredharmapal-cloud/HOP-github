import {
  getSupabaseOptimizedUrl,
  getSupabaseSrcSet,
  isSupabaseStorageUrl,
} from "@/lib/supabaseImage";

export const HERO_POSTER_WIDTHS = [640, 1024, 1600, 2560] as const;

export interface HeroPosterSources {
  src: string;
  srcSet?: string;
  canonical: string;
  canRetryCanonical: boolean;
}

export function getHeroPosterSources(
  rawPoster: string,
  useCanonical = false,
): HeroPosterSources {
  const canonical = rawPoster?.trim() ?? "";

  if (!canonical) {
    return { src: "", canonical: "", canRetryCanonical: false };
  }

  if (useCanonical || !isSupabaseStorageUrl(canonical)) {
    return { src: canonical, canonical, canRetryCanonical: false };
  }

  return {
    src: getSupabaseOptimizedUrl(canonical, { width: 1600 }),
    srcSet: getSupabaseSrcSet(canonical, [...HERO_POSTER_WIDTHS]) || undefined,
    canonical,
    canRetryCanonical: true,
  };
}
