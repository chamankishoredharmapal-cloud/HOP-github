# Writing: SEO Copy

**Purpose:** Generate SEO metadata — titles, descriptions, OG image alt text, and structured data notes for every content type.

**When to use:** After writing body content, generate the corresponding SEO metadata. Also used when refreshing SEO for existing content.

**When NOT to use:** For body content generation (use the relevant `writing/` document). SEO copy is a supplement to body content, not a replacement.

---

## Objective

Generate metadata that is optimised for search engines without sacrificing HOP's voice or integrity. SEO titles and descriptions must read as HOP copy, not keyword-stuffed marketing.

## Audience

Two audiences simultaneously:
1. **Search engines** — needs clear topical signals and keyword relevance
2. **Human searchers** — needs to compel a click without being clickbait

## Tone

| Metadata Type | Voice Rules |
|---------------|-------------|
| SEO Title | Informational, specific, includes brand name. ≤70 chars. |
| SEO Description | Summary in HOP voice. ≤160 chars. Reads as a complete sentence. |
| OG Image Alt | Descriptive of the image. Functional, not poetic. |

## Structure

### SEO Title Pattern

```
{Content-specific title} — House of Padmavati
```

Examples:
- "Understanding zari — House of Padmavati"
- "How morning light reads a weave. — House of Padmavati"
- "Mulberry Silk Temple Border Saree — Coastal Teal — House of Padmavati"

### SEO Description Pattern

A complete sentence or two that accurately describes the content in HOP voice. Not a hook — a summary.

Examples:
- "What zari is, how it is made, and why real zari behaves differently from imitation."
- "On the soft hour between five and seven, when zari forgets to shine."
- "A Mulberry silk temple border saree from Molakalmuru, handwoven with hand-spun zari. Reads as teal in shadow and jade in sunlight."

### OG Image Alt

Describe what is visible in the image. Functional, not poetic.

Example: "A mulberry silk saree in coastal teal draped by a window, afternoon light catching the zari border."

## Required Context

- Content type (journal, product, collection, etc.)
- Content title and primary topic
- One or two key phrases the content should rank for
- Hero image description

## Required References

- The relevant `writing/` document for the content type
- `docs/editorial/04-vocabulary-system/forbidden-words.md` (never use SEO clichés in metadata)

## Formatting

- SEO title: ≤70 characters (hard limit)
- SEO description: ≤160 characters (hard limit)
- OG image alt: ≤125 characters
- No keyword stuffing — write for humans first
- No ALL CAPS in titles
- No exclamation marks in any metadata

## Acceptance Criteria

- [ ] Title ≤70 characters
- [ ] Description ≤160 characters
- [ ] Title includes brand name ("— House of Padmavati")
- [ ] Description is a coherent sentence or two, not a fragment list
- [ ] No keyword stuffing — reads naturally
- [ ] OG alt text describes what is visible in the image
- [ ] Zero forbidden words

## Failure Cases

| Failure | Symptom | Correction |
|---------|---------|------------|
| Keyword stuffing | "Buy silk saree online India handloom pure silk saree wedding" | Write a coherent sentence: "A handwoven Mulberry silk saree from Molakalmuru, with real zari and a temple border." |
| Clickbait title | "You won't believe what makes this saree special" | Be specific: "Understanding zari — House of Padmavati" |
| Title too long | "How morning light reads a weave and why the soft hour between five and seven is when zari reveals itself to the patient observer — House of Padmavati" (87 chars) | Condense: "How morning light reads a weave. — House of Padmavati" |
| Description duplicates title | Title and description are identical | Use description to add context the title does not cover. |

---

**Cross-reference:** `docs/research/seo/` (SEO research), each `writing/` document (content-type-specific guidance)