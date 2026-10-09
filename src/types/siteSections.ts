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
  video_url: z.string().url().optional(),
  poster_url: z.string().url().optional(),
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
