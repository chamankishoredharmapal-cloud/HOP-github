import type {
  JournalArticle,
  CollectionNarrative,
  ProductStory,
  CraftNote,
  WeaverPortrait,
  FieldNote,
  HouseLetter,
  RitualGuide,
  GlossaryEntry,
  ContentIndexEntry,
  RelationshipGraph,
} from "@/types/content";

const generatedModules = {
  journal: () => import("@/data/__generated__/journal"),
  collections: () => import("@/data/__generated__/collections"),
  products: () => import("@/data/__generated__/products"),
  "craft-notes": () => import("@/data/__generated__/craft-notes"),
  "weaver-portraits": () => import("@/data/__generated__/weaver-portraits"),
  "field-notes": () => import("@/data/__generated__/field-notes"),
  "house-letters": () => import("@/data/__generated__/house-letters"),
  "ritual-guides": () => import("@/data/__generated__/ritual-guides"),
  glossary: () => import("@/data/__generated__/glossary"),
};

async function loadModule<T>(type: string): Promise<{ default: T }> {
  const key = type as keyof typeof generatedModules;
  if (!(key in generatedModules)) {
    throw new Error(`Unknown content type: ${type}`);
  }
  return generatedModules[key]() as Promise<{ default: T }>;
}

export async function getJournalArticles(): Promise<JournalArticle[]> {
  const mod = await loadModule<JournalArticle[]>("journal");
  return mod.default;
}

export async function getJournalArticle(
  slug: string
): Promise<JournalArticle | null> {
  const articles = await getJournalArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function getCollectionNarrative(
  slug: string
): Promise<CollectionNarrative | null> {
  const mod = await loadModule<CollectionNarrative[]>("collections");
  return mod.default.find((c) => c.slug === slug) ?? null;
}

export async function getProductStory(
  productId: string
): Promise<ProductStory | null> {
  const mod = await loadModule<ProductStory[]>("products");
  return mod.default.find((p) => p.productId === productId) ?? null;
}

export async function getCraftNotes(): Promise<CraftNote[]> {
  const mod = await loadModule<CraftNote[]>("craft-notes");
  return mod.default;
}

export async function getCraftNote(slug: string): Promise<CraftNote | null> {
  const notes = await getCraftNotes();
  return notes.find((n) => n.slug === slug) ?? null;
}

export async function getWeaverPortraits(): Promise<WeaverPortrait[]> {
  const mod = await loadModule<WeaverPortrait[]>("weaver-portraits");
  return mod.default;
}

export async function getWeaverPortrait(
  slug: string
): Promise<WeaverPortrait | null> {
  const portraits = await getWeaverPortraits();
  return portraits.find((p) => p.slug === slug) ?? null;
}

export async function getFieldNotes(): Promise<FieldNote[]> {
  const mod = await loadModule<FieldNote[]>("field-notes");
  return mod.default;
}

export async function getFieldNote(slug: string): Promise<FieldNote | null> {
  const notes = await getFieldNotes();
  return notes.find((n) => n.slug === slug) ?? null;
}

export async function getHouseLetters(): Promise<HouseLetter[]> {
  const mod = await loadModule<HouseLetter[]>("house-letters");
  return mod.default;
}

export async function getHouseLetter(slug: string): Promise<HouseLetter | null> {
  const letters = await getHouseLetters();
  return letters.find((l) => l.slug === slug) ?? null;
}

export async function getRitualGuides(): Promise<RitualGuide[]> {
  const mod = await loadModule<RitualGuide[]>("ritual-guides");
  return mod.default;
}

export async function getRitualGuide(slug: string): Promise<RitualGuide | null> {
  const guides = await getRitualGuides();
  return guides.find((g) => g.slug === slug) ?? null;
}

export async function getGlossaryEntries(): Promise<GlossaryEntry[]> {
  const mod = await loadModule<GlossaryEntry[]>("glossary");
  return mod.default;
}

export async function getGlossaryEntry(slug: string): Promise<GlossaryEntry | null> {
  const entries = await getGlossaryEntries();
  return entries.find((e) => e.slug === slug) ?? null;
}

export async function getRelatedContent(
  type: string,
  slug: string
): Promise<{
  relatedProducts: string[];
  relatedArticles: string[];
  relatedCraftNotes: string[];
  relatedCollections: string[];
  glossaryTerms: string[];
}> {
  const mod = await import("@/data/__generated__/relationship-graph");
  const graph = mod.default as RelationshipGraph;
  const contentId = `${type}/${slug}`;
  return graph[contentId] ?? {
    relatedProducts: [],
    relatedArticles: [],
    relatedCraftNotes: [],
    relatedCollections: [],
    glossaryTerms: [],
  };
}

export async function getContentIndex(): Promise<ContentIndexEntry[]> {
  const mod = await import("@/data/__generated__/content-index");
  return mod.default;
}
