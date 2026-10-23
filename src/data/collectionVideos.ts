// HOP Collection Video Registry & Multi-Resolution Variants
// Standardized Aspect Ratios:
// - 16:9 Landscape (1280x720 720p Desktop / 960x540 540p Mobile)
// - 9:16 Portrait (720x1280 720p Desktop / 540x960 540p Mobile)
// Master 720p H.264 (CRF 23, faststart moov at front, no-audio, SSIM > 0.985)
// Mobile 540p H.264 (CRF 25, faststart moov at front, no-audio, ~70% bandwidth reduction)
// Extracted WebP poster frame matching exact source composition

export interface VideoVariant {
  src: string;
  mobileSrc: string;
  poster: string;
  originalUrl: string;
  aspectRatio: "16:9" | "9:16";
  orientation: "landscape" | "portrait";
}

export const COLLECTION_VIDEO_VARIANTS: Record<string, VideoVariant> = {
  hero: {
    src: "/optimized/videos/HERO-720p.mp4",
    mobileSrc: "/optimized/videos/HERO-540p.mp4",
    poster: "/optimized/videos/HERO-poster.webp",
    originalUrl: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/HERO.mp4",
    aspectRatio: "16:9",
    orientation: "landscape",
  },
  kalyani: {
    src: "/optimized/videos/KALYANI-720p.mp4",
    mobileSrc: "/optimized/videos/KALYANI-540p.mp4",
    poster: "/optimized/videos/KALYANI-poster.webp",
    originalUrl: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/KALYANI+1.mp4",
    aspectRatio: "9:16",
    orientation: "portrait",
  },
  viara: {
    src: "/optimized/videos/VIARA-720p.mp4",
    mobileSrc: "/optimized/videos/VIARA-540p.mp4",
    poster: "/optimized/videos/VIARA-poster.webp",
    originalUrl: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/VIARA3.mp4",
    aspectRatio: "16:9",
    orientation: "landscape",
  },
  arya: {
    src: "/optimized/videos/ARYA-720p.mp4",
    mobileSrc: "/optimized/videos/ARYA-540p.mp4",
    poster: "/optimized/videos/ARYA-poster.webp",
    originalUrl: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/ARYA+.mp4",
    aspectRatio: "16:9",
    orientation: "landscape",
  },
  padma: {
    src: "/optimized/videos/PADMA-720p.mp4",
    mobileSrc: "/optimized/videos/PADMA-540p.mp4",
    poster: "/optimized/videos/PADMA-poster.webp",
    originalUrl: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/PADMA.mp4",
    aspectRatio: "16:9",
    orientation: "landscape",
  },
  yugen: {
    src: "/optimized/videos/SPANDANA-720p.mp4",
    mobileSrc: "/optimized/videos/SPANDANA-540p.mp4",
    poster: "/optimized/videos/SPANDANA-poster.webp",
    originalUrl: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/SPANDANA.mp4",
    aspectRatio: "16:9",
    orientation: "landscape",
  },
  // Slug aliases
  megham: {
    src: "/optimized/videos/ARYA-720p.mp4",
    mobileSrc: "/optimized/videos/ARYA-540p.mp4",
    poster: "/optimized/videos/ARYA-poster.webp",
    originalUrl: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/ARYA+.mp4",
    aspectRatio: "16:9",
    orientation: "landscape",
  },
  "oosi-kattam": {
    src: "/optimized/videos/PADMA-720p.mp4",
    mobileSrc: "/optimized/videos/PADMA-540p.mp4",
    poster: "/optimized/videos/PADMA-poster.webp",
    originalUrl: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/PADMA.mp4",
    aspectRatio: "16:9",
    orientation: "landscape",
  },
  spandana: {
    src: "/optimized/videos/SPANDANA-720p.mp4",
    mobileSrc: "/optimized/videos/SPANDANA-540p.mp4",
    poster: "/optimized/videos/SPANDANA-poster.webp",
    originalUrl: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/SPANDANA.mp4",
    aspectRatio: "16:9",
    orientation: "landscape",
  },
  "designer-wear": {
    src: "/optimized/videos/SPANDANA-720p.mp4",
    mobileSrc: "/optimized/videos/SPANDANA-540p.mp4",
    poster: "/optimized/videos/SPANDANA-poster.webp",
    originalUrl: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/SPANDANA.mp4",
    aspectRatio: "16:9",
    orientation: "landscape",
  },
};

// Canonical backwards-compatible map used throughout the site
export const COLLECTION_VIDEOS: Record<string, string> = {
  hero: COLLECTION_VIDEO_VARIANTS.hero.src,
  kalyani: COLLECTION_VIDEO_VARIANTS.kalyani.src,
  viara: COLLECTION_VIDEO_VARIANTS.viara.src,
  arya: COLLECTION_VIDEO_VARIANTS.arya.src,
  padma: COLLECTION_VIDEO_VARIANTS.padma.src,
  yugen: COLLECTION_VIDEO_VARIANTS.yugen.src,
  megham: COLLECTION_VIDEO_VARIANTS.megham.src,
  "oosi-kattam": COLLECTION_VIDEO_VARIANTS["oosi-kattam"].src,
  spandana: COLLECTION_VIDEO_VARIANTS.spandana.src,
  "designer-wear": COLLECTION_VIDEO_VARIANTS["designer-wear"].src,
};

export function getCollectionVideoVariant(slug?: string): VideoVariant | undefined {
  if (!slug) return undefined;
  return COLLECTION_VIDEO_VARIANTS[slug] || COLLECTION_VIDEO_VARIANTS[slug.toLowerCase()];
}

export function resolveOptimizedVideo(input?: string): VideoVariant {
  if (!input) {
    return {
      src: "",
      mobileSrc: "",
      poster: "",
      originalUrl: "",
      aspectRatio: "16:9",
      orientation: "landscape",
    };
  }
  const lower = input.toLowerCase();

  if (lower.includes("hero")) return COLLECTION_VIDEO_VARIANTS.hero;
  if (lower.includes("kalyani")) return COLLECTION_VIDEO_VARIANTS.kalyani;
  if (lower.includes("viara")) return COLLECTION_VIDEO_VARIANTS.viara;
  if (lower.includes("arya") || lower.includes("megham")) return COLLECTION_VIDEO_VARIANTS.arya;
  if (lower.includes("padma") || lower.includes("oosi")) return COLLECTION_VIDEO_VARIANTS.padma;
  if (lower.includes("spandana") || lower.includes("yugen") || lower.includes("designer")) return COLLECTION_VIDEO_VARIANTS.yugen;

  return {
    src: input,
    mobileSrc: input,
    poster: "",
    originalUrl: input,
    aspectRatio: "16:9",
    orientation: "landscape",
  };
}
