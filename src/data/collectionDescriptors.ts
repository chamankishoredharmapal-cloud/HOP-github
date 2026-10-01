// Generic triplet descriptors retired per intelligent collection-card rewrite.
// The distinct editorial line for each collection now lives in
// collectionWorlds.ts `emotion` (rendered on all card surfaces).
// Returning "" keeps existing conditional renders hidden with no layout change.
const DESCRIPTORS: Record<string, string> = {};

const SLUG_ALIASES: Record<string, string> = {
  megham: "arya",
  "oosi-kattam": "padma",
  "designer-wear": "yugen",
  spandana: "yugen",
};

export const getCollectionDescriptor = (name?: string | null, slug?: string | null): string => {
  const byName = DESCRIPTORS[(name ?? "").trim().toLowerCase()];
  if (byName) return byName;
  const slugKey = (slug ?? "").toLowerCase();
  const canonical = SLUG_ALIASES[slugKey] ?? slugKey;
  return DESCRIPTORS[canonical] ?? "";
};
