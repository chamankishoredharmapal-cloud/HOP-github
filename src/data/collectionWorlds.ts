/** Collection Worlds — ONE HOUSE, FIVE WORLDS (Objective 03)
 * Controlled variation, not five templates. Each world defines:
 * - emotional territory + temperature
 * - accent (honest, not decorative)
 * - photographic behavior
 * - material story anchor
 * - editorial vocabulary
 * Debt flagged where product/editorial data missing.
 */

export type CollectionWorld = {
  slug: string;
  name: string;
  emotion: string;
  temperature: string;
  accent: string; // HEX
  accentName: string;
  photo: string;
  material: string;
  vocabulary: string;
  device: string;
  debt?: string;
};

export const COLLECTION_WORLDS: Record<string, CollectionWorld> = {
  kalyani: {
    slug: "kalyani",
    name: "Kalyani",
    emotion: "To be worn, folded, and passed on.",
    temperature: "warm, low light — evening, oil-lamp, stone",
    accent: "#8B1E2D",
    accentName: "Alta Crimson",
    photo: "natural-light portrait, stone/temple shadow, zari in half-light — depth, not glamour",
    material: "Pattu, zari weight — Molakalmuru / Kanchipuram",
    vocabulary: "temple, vow, heirloom, threshold",
    device: "ink-register option: dark ground chapter, selvedge in crimson/sand",
  },
  viara: {
    slug: "viara",
    name: "Viara",
    emotion: "Not the centre of attention. The centre of gravity.",
    temperature: "cool-warm dusk — soft, diffused, after-sunset",
    accent: "#CFA9A2",
    accentName: "Sakura Dust",
    photo: "window light, sheer drape, stillness, shallow depth — presence, not pose",
    material: "light silk, fluid drape",
    vocabulary: "evening, hush, presence, after-light",
    device: "sakura rule: hairline in Sakura Dust, generous negative space",
  },
  arya: {
    slug: "arya",
    name: "Arya",
    emotion: "Silk that remembers how to work.",
    temperature: "neutral daylight — contemporary, architectural",
    accent: "#5D817E",
    accentName: "Coastal Teal",
    photo: "architectural framing, contemporary interior, functional drape — modern living",
    material: "resilient weave, minimal zari",
    vocabulary: "contemporary, structure, day, design",
    device: "peacock rule: teal accent once, editorial grid, asymmetry",
  },
  padma: {
    slug: "padma",
    name: "Padma",
    emotion: "Fine checks, drawn on the loom.",
    temperature: "stone, precise — gallery light, hard shadow",
    accent: "#9A3B26",
    accentName: "Oxide Earth",
    photo: "geometric crop, macro, loom-wood texture, hard light — textile as architecture",
    material: "checked weave, loom-drawn grid",
    vocabulary: "geometry, structure, loom, grid",
    device: "oxide rule + stone ground tint, tight crop",
  },
  yugen: {
    slug: "yugen",
    name: "YŪGEN",
    emotion: "Colour that doesn't sit quietly.",
    temperature: "chromatic tension — controlled, not festive",
    accent: "#D99A2B",
    accentName: "Marigold",
    photo: "chromatic tension, unexpected color pairing, expressive drape — experimental, never costume",
    material: "experimental colour, expressive drape",
    vocabulary: "experimental, color, expression, pulse",
    device: "marigold accent disciplined: one chromatic moment per viewport",
  },
};

const ALIAS: Record<string, string> = {
  megham: "arya",
  "oosi-kattam": "padma",
  "designer-wear": "yugen",
  spandana: "yugen",
};

/** Legacy slugs that now resolve to a canonical collection slug. */
export const CANONICAL_COLLECTION_SLUGS: Record<string, string> = {
  spandana: "yugen",
  "designer-wear": "yugen",
};

/**
 * Database slugs to try (in order) when the canonical slug has no row yet.
 * Lets the canonical room render the legacy row until the rename migration
 * has renamed it. No duplicate collection is created.
 */
export const LEGACY_COLLECTION_SLUGS: Record<string, string[]> = {
  yugen: ["spandana", "designer-wear"],
};

export const getCanonicalCollectionSlug = (slug?: string | null): string | null => {
  const key = (slug ?? "").toLowerCase();
  return CANONICAL_COLLECTION_SLUGS[key] ?? null;
};

/**
 * Canonical room slug for a database record slug. Renamed collections
 * resolve to their canonical slug so links, chapter classes, and film
 * lookups follow the canonical identity before and after migration.
 */
export const getCollectionRoomSlug = (recordSlug?: string | null): string => {
  return getWorld(recordSlug)?.slug ?? (recordSlug ?? "");
};

/**
 * Canonical display name for a database record. Renamed collections render
 * the canonical world name even while the database row still carries the
 * legacy name. All other collections render the database name.
 */
export const getCollectionDisplayName = (
  recordSlug?: string | null,
  recordName?: string | null
): string => {
  const world = getWorld(recordSlug);
  if (world?.slug === "yugen") return world.name;
  return recordName || world?.name || "";
};

export const getWorld = (slug?: string | null): CollectionWorld | undefined => {
  const key = (slug ?? "").toLowerCase();
  const canonical = ALIAS[key] ?? key;
  return COLLECTION_WORLDS[canonical];
};
