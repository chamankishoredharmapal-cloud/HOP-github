export type ContentStatus = "draft" | "review" | "published" | "archive";

export type JournalTag =
  | "Light" | "Drape" | "Linen" | "Weather" | "Ritual"
  | "House" | "Technique" | "Weaver" | "Place" | "Care" | "Occasion";

export type CraftNoteTag = "Technique" | "Fabric" | "Weave" | "Dye" | "History";

export type GlossaryCategory =
  | "Fabric" | "Weave" | "Technique" | "Tool" | "Tradition" | "Region";

export type HouseLetterOccasion =
  | "Seasonal" | "Milestone" | "Collection Launch" | "Annual";

export type RitualGuideOccasion =
  | "Wedding" | "Festival" | "Office" | "Daily" | "Gift";

export type BlockType =
  | "hero" | "intro" | "body" | "pull-quote" | "image"
  | "video" | "system-2" | "related" | "closure" | "divider"
  | "step" | "gallery";

export interface SEO {
  title: string;
  description: string;
}

export interface HeroBlock {
  type: "hero";
  image: string;
  alt: string;
  caption?: string;
}

export interface IntroBlock {
  type: "intro";
  body: string;
}

export interface BodyBlock {
  type: "body";
  body: string;
}

export interface PullQuoteBlock {
  type: "pull-quote";
  quote: string;
  attribution?: string;
}

export interface ImageBlock {
  type: "image";
  image: string;
  alt: string;
  caption?: string;
  width?: "full" | "wide" | "narrow";
}

export interface VideoBlock {
  type: "video";
  src: string;
  poster: string;
  caption?: string;
}

export interface System2Block {
  type: "system-2";
  title: string;
  body: string;
}

export interface StepBlock {
  type: "step";
  number: number;
  body: string;
}

export interface GalleryBlock {
  type: "gallery";
  images: string[];
}

export interface ClosureBlock {
  type: "closure";
  body: string;
}

export interface DividerBlock {
  type: "divider";
}

export interface RelatedBlock {
  type: "related";
}

export type ContentBlock =
  | HeroBlock | IntroBlock | BodyBlock | PullQuoteBlock
  | ImageBlock | VideoBlock | System2Block | StepBlock
  | GalleryBlock | ClosureBlock | DividerBlock | RelatedBlock;

export interface JournalFrontmatter {
  type: "journal";
  title: string;
  slug: string;
  published: string;
  updated?: string;
  status: ContentStatus;
  author: string;
  tag: JournalTag;
  dek: string;
  readingTime?: number;
  hero: string;
  alt: string;
  seo: SEO;
  ogImage?: string;
  relatedProducts?: string[];
  relatedArticles?: string[];
  glossaryTerms?: string[];
}

export interface JournalArticle extends JournalFrontmatter {
  body: ContentBlock[];
}

export interface CollectionFrontmatter {
  type: "collection";
  name: string;
  slug: string;
  status: ContentStatus;
  tagline: string;
  hero: string;
  filmPoster?: string;
  mood?: string;
  occasion?: string;
  weaverNote?: string;
  lookbook: string[];
  seo: SEO;
  relatedArticles?: string[];
  relatedCraftNotes?: string[];
}

export interface CollectionNarrative extends CollectionFrontmatter {
  body: ContentBlock[];
}

export interface ProductSystem2 {
  weave?: string;
  fabric?: string;
  origin?: string;
  care?: string;
  dispatch?: string;
}

export interface ProductFrontmatter {
  type: "product";
  productId: string;
  status: ContentStatus;
  hero: string;
  alt: string;
  sensoryStory: string;
  wearingContext?: string;
  system2?: ProductSystem2;
  collections?: string[];
  relatedArticles?: string[];
  glossaryTerms?: string[];
  seo: SEO;
}

export interface ProductStory extends ProductFrontmatter {
  body: ContentBlock[];
}

export interface CraftNoteFrontmatter {
  type: "craft-note";
  title: string;
  slug: string;
  published: string;
  updated?: string;
  status: ContentStatus;
  author: string;
  tag: CraftNoteTag;
  dek: string;
  readingTime?: number;
  hero: string;
  alt?: string;
  collections?: string[];
  products?: string[];
  glossaryTerms?: string[];
  seo: SEO;
}

export interface CraftNote extends CraftNoteFrontmatter {
  body: ContentBlock[];
}

export interface WeaverPortraitFrontmatter {
  type: "weaver-portrait";
  title: string;
  slug: string;
  published: string;
  status: ContentStatus;
  author: string;
  weaverName: string;
  generation: number;
  location: string;
  technique: string;
  hero: string;
  alt: string;
  quote: string;
  portraits: string[];
  collections?: string[];
  products?: string[];
  seo: SEO;
}

export interface WeaverPortrait extends WeaverPortraitFrontmatter {
  body: ContentBlock[];
}

export interface FieldNoteFrontmatter {
  type: "field-note";
  title: string;
  slug: string;
  published: string;
  status: ContentStatus;
  author: string;
  location: string;
  dateVisited: string;
  hero: string;
  alt?: string;
  collections?: string[];
  products?: string[];
  seo: SEO;
}

export interface FieldNote extends FieldNoteFrontmatter {
  body: ContentBlock[];
}

export interface HouseLetterFrontmatter {
  type: "house-letter";
  title: string;
  slug: string;
  published: string;
  status: ContentStatus;
  occasion: HouseLetterOccasion;
  hero: string;
  alt?: string;
  signature?: string;
  seo: SEO;
}

export interface HouseLetter extends HouseLetterFrontmatter {
  body: ContentBlock[];
}

export interface RitualGuideFrontmatter {
  type: "ritual-guide";
  title: string;
  slug: string;
  published: string;
  status: ContentStatus;
  occasion: RitualGuideOccasion;
  hero: string;
  alt?: string;
  collections?: string[];
  products?: string[];
  relatedArticles?: string[];
  seo: SEO;
}

export interface RitualGuide extends RitualGuideFrontmatter {
  body: ContentBlock[];
}

export interface GlossaryFrontmatter {
  type: "glossary";
  term: string;
  slug: string;
  pronunciation?: string;
  category: GlossaryCategory;
  definition: string;
  extended?: string;
  relatedTerms?: string[];
  seeAlso?: string[];
}

export interface GlossaryEntry extends GlossaryFrontmatter {
  body?: ContentBlock[];
}

export interface ContentIndexEntry {
  type: string;
  slug: string;
  title: string;
  dek?: string;
  published?: string;
  tags?: string[];
  hero?: string;
}

export interface RelationshipGraph {
  [contentId: string]: {
    relatedProducts: string[];
    relatedArticles: string[];
    relatedCraftNotes: string[];
    relatedCollections: string[];
    glossaryTerms: string[];
  };
}

export interface SearchIndexEntry {
  type: string;
  slug: string;
  title: string;
  dek?: string;
  tags?: string[];
  body?: string;
}
