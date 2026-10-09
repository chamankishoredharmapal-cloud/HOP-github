import { z } from "zod";

export type SectionStatus = "draft" | "published" | "archived";

export interface SiteSectionRecord<T = Record<string, unknown>> {
  key: string;
  page_name: string;
  section_type: string;
  display_name: string;
  version: number;
  draft_payload: T;
  published_payload: T;
  status: SectionStatus;
  has_unpublished_changes: boolean;
  published_at: string | null;
  published_by: string | null;
  updated_at: string;
  updated_by: string | null;
  created_at: string;
}

export interface SiteSectionRevision<T = Record<string, unknown>> {
  id: string;
  section_key: string;
  revision_number: number;
  payload: T;
  change_summary: string | null;
  published_by: string | null;
  created_at: string;
}

export interface PublishedSectionView<T = Record<string, unknown>> {
  key: string;
  page_name: string;
  section_type: string;
  display_name: string;
  published_payload: T;
  published_at: string | null;
}

// Zod Schemas for Client-Side Validation

export const SafeLinkSchema = z.object({
  label: z.string().min(1, "Link label required").max(60),
  href: z
    .string()
    .min(1, "Link destination required")
    .max(250)
    .refine(
      (val) => val.startsWith("/") || val.startsWith("#") || val.startsWith("https://"),
      "Link must be an internal path (/...), anchor (#...), or secure URL (https://)"
    ),
});

export const HeroBannerPayloadSchema = z.object({
  title: z.string().min(1, "Headline required").max(120),
  subtitle: z.string().max(250),
  eyebrow: z.string().max(80).optional(),
  primary_cta: SafeLinkSchema,
  secondary_cta: SafeLinkSchema.optional(),
  video_url: z
    .string()
    .max(500)
    .refine(
      (val) => !val || val.startsWith("/") || val.startsWith("https://"),
      "Video URL must be a relative path (/...) or HTTPS URL (https://)"
    )
    .optional()
    .or(z.literal("")),
  poster_url: z
    .string()
    .max(500)
    .refine(
      (val) => !val || val.startsWith("/") || val.startsWith("https://"),
      "Poster URL must be a relative path (/...) or HTTPS URL (https://)"
    )
    .optional()
    .or(z.literal("")),
  alt_text: z.string().min(1, "Accessibility alt text required").max(250),
});

export const CraftStoryPayloadSchema = z.object({
  title: z.string().min(1, "Headline required").max(120),
  lede: z.string().max(400),
  quote: z.string().max(300),
  attribution: z.string().max(100),
  craft_facts: z.string().max(250),
  image_url: z.string().min(1, "Image URL required"),
  caption: z.string().max(200),
  alt_text: z.string().min(1, "Alt text required").max(250),
  cta: SafeLinkSchema,
});

export const PhilosophyPayloadSchema = z.object({
  title: z.string().min(1, "Headline required").max(120),
  lede: z.string().max(500),
  closing: z.string().max(300).optional(),
});

export const NoteCardItemSchema = z.object({
  label: z.string().min(1).max(60),
  title: z.string().min(1).max(100),
  text: z.string().min(1).max(500),
  link_label: z.string().min(1).max(60),
  href: z.string().min(1).max(250),
});

export const NoteCardsPayloadSchema = z.object({
  heading: z.string().min(1, "Heading required").max(120),
  subheading: z.string().max(300),
  cards: z.array(NoteCardItemSchema).min(1).max(6),
});

export const InvitationPayloadSchema = z.object({
  title: z.string().min(1, "Title required").max(120),
  body: z.string().min(1, "Body required").max(400),
  links: z.array(SafeLinkSchema).min(1).max(5),
});

export type HeroBannerPayload = z.infer<typeof HeroBannerPayloadSchema>;
export type CraftStoryPayload = z.infer<typeof CraftStoryPayloadSchema>;
export type PhilosophyPayload = z.infer<typeof PhilosophyPayloadSchema>;
export type NoteCardsPayload = z.infer<typeof NoteCardsPayloadSchema>;
export type InvitationPayload = z.infer<typeof InvitationPayloadSchema>;

export const HOMEPAGE_SECTION_KEYS = [
  "home.hero",
  "home.craft",
  "home.philosophy",
  "home.ownership",
  "home.invitation",
] as const;

export type HomepageSectionKey = (typeof HOMEPAGE_SECTION_KEYS)[number];

// Grounded fallback payloads matching approved source copy
export const DEFAULT_HERO_PAYLOAD: HeroBannerPayload = {
  title: "Saree. Time. You.",
  subtitle: "Five ways of wearing tradition — considered deeply, chosen quietly.",
  eyebrow: "House of Padmavati",
  primary_cta: { label: "Enter the House", href: "/collections" },
  secondary_cta: { label: "Descend into the house", href: "#collections" },
  alt_text: "House of Padmavati collection film",
};

export const DEFAULT_CRAFT_PAYLOAD: CraftStoryPayload = {
  title: "Detail is part of the design.",
  lede: "Before a saree reaches the wardrobe, it passes through a series of considered decisions.",
  quote: "The border is the signature. Without it, the saree is a stranger.",
  attribution: "Gangamma",
  craft_facts: "Molakalmuru, Karnataka · Temple border weaving · Fourth generation",
  image_url: "/content/weaver-portrait/gangamma-molakalmuru/hero.jpg",
  caption: "Gangamma at her pit loom · Molakalmuru · 6:30 AM",
  alt_text: "Gangamma at her pit loom, morning light from the window behind her",
  cta: { label: "Meet the makers", href: "/journal/gangamma-molakalmuru" },
};

export const DEFAULT_PHILOSOPHY_PAYLOAD: PhilosophyPayload = {
  title: "A House, Not a Shop.",
  lede: "We make room for the intelligence of considered making, the patience of cloth and the woman who chooses what to carry.",
  closing: "Not a season. Not a trend. A relationship with what lasts.",
};

export const DEFAULT_OWNERSHIP_PAYLOAD: NoteCardsPayload = {
  heading: "Wear it slowly. Keep it long.",
  subheading: "A first drape, a simple ritual, a lifetime of care. Ownership is part of the beauty.",
  cards: [
    {
      label: "The hand",
      title: "A body in motion.",
      text: "A saree holds the decisions behind it. The tension of the thread, the balance of the border and the patience of its making all remain in the cloth.",
      link_label: "Read the pit loom",
      href: "/journal/the-pit-loom",
    },
    {
      label: "The keeping",
      title: "Meaning over excess.",
      text: "We design for the women who will inherit these drapes. Care, repair and a long life are part of the pleasure of choosing well.",
      link_label: "Explore saree care",
      href: "/customer-care",
    },
    {
      label: "The giving",
      title: "A considered gesture.",
      text: "Some arrivals are meant to be witnessed. The house keeps the language of gifting quiet, personal and human.",
      link_label: "Begin a gift",
      href: "/gift",
    },
  ],
};

export const DEFAULT_INVITATION_PAYLOAD: InvitationPayload = {
  title: "Come in quietly. Choose slowly.",
  body: "There is no rush here. Explore the collections, or begin a conversation with the house.",
  links: [
    { label: "Explore Collections", href: "/collections" },
    { label: "House Letters", href: "/journal" },
    { label: "Contact / Conversation", href: "/customer-care" },
  ],
};
