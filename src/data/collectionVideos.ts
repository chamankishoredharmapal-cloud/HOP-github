// CDN/cache guidance for these Supabase Storage URLs:
// In the Supabase Dashboard → Storage → HOP-films bucket:
//   - Set Bucket Caching: max-age=31536000, public
//   - Enable CDN (Supabase partners with CDN71)
//   - This ensures videos are cached at the edge after first load,
//     reducing bandwidth and improving LCP for repeat visitors.
export const COLLECTION_VIDEOS: Record<string, string> = {
  hero: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/HERO.mp4",
  kalyani: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/KALYANI+1.mp4",
  viara: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/VIARA3.mp4",
  arya: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/ARYA+.mp4",
  padma: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/PADMA.mp4",
  spandana: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/SPANDANA.mp4",
  // Route-slug aliases: collection routes use these slugs while the
  // canonical film keys above use collection names. Aliases ensure
  // detail-page heroes resolve to a film instead of silently falling back.
  megham: "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/ARYA+.mp4",
  "oosi-kattam": "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/PADMA.mp4",
  "designer-wear": "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/SPANDANA.mp4",
};
