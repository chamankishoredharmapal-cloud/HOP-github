const DESCRIPTORS: Record<string, string> = {
  kalyani: "Timeless. Sacred. Enduring.",
  viara: "Elegant. Effortless. Refined.",
  arya: "Bold. Structured. Powerful.",
  padma: "Rooted. Authentic. Graceful.",
  spandana: "Expressive. Fearless. Original.",
};

const SLUG_ALIASES: Record<string, string> = {
  megham: "arya",
  "oosi-kattam": "padma",
  "designer-wear": "spandana",
};

export const getCollectionDescriptor = (name?: string | null, slug?: string | null): string => {
  const byName = DESCRIPTORS[(name ?? "").trim().toLowerCase()];
  if (byName) return byName;
  const slugKey = (slug ?? "").toLowerCase();
  const canonical = SLUG_ALIASES[slugKey] ?? slugKey;
  return DESCRIPTORS[canonical] ?? "";
};
