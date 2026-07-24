# Writing: Journal

**Purpose:** Generate journal articles — the primary editorial content type for House of Padmavati.

**When to use:** Creating a new journal article or refreshing an existing one.

**When NOT to use:** For craft-educational content (use `writing/craft-notes.md`). For weaver profiles (use `writing/weaver-portraits.md` which will be added when weaver-portraits writing guidance is needed — for now use this document's general principles).

---

## Objective

Create a piece of long-form editorial content that deepens the reader's relationship with HOP's world. Journal articles are gifts to the reader — they serve Trust, Belonging, and Contemplation, not conversion.

## Audience

Women who have chosen to spend time with HOP. They may never buy. The journal is for them regardless. They value reading, reflection, and learning about craft and culture.

## Tone

| Dimension | Target |
|-----------|--------|
| Formality | 3/5 |
| Warmth | 4/5 |
| Sensory Density | 5/5 |
| Technical Depth | 2/5 |
| Urgency | 0/5 |
| Imperative Force | 1/5 |

**Reading level:** Grade 9
**Reading time:** 4-8 minutes (800-1600 words)

## Structure

### Frontmatter

```yaml
type: journal
title: "{title, sentence case}"
slug: "{kebab-case-slug}"
published: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
status: draft
author: "House of Padmavati"
tag: "{Light | Drape | Linen | Weather | Ritual | House | Technique | Weaver | Place | Care | Occasion}"
dek: "{≤160 chars}"
readingTime: {integer}
hero: ./hero.jpg
alt: "{descriptive alt text}"
seo:
  title: "{title} — House of Padmavati"
  description: "{≤160 chars}"
ogImage: ./hero.jpg
relatedProducts:
  - "{uuid}"
relatedArticles:
  - "{slug}"
glossaryTerms:
  - "{slug}"
```

### Body Blocks

```
hero → intro → body (2-4) → pull-quote → body → image → body → closure
```

### Block Details

**hero:** Atmospheric hero image with caption that locates the reader in time and place.

**intro:** Opens with a specific moment, observation, or object. Establishes the sensory world. 2-4 sentences. Never opens with a question or general statement.

**body:** Narrative prose. Alternates between sensory observation and reflective insight. Each body block is 2-4 paragraphs. Each paragraph is 2-4 sentences.

**pull-quote:** A single line that crystallises the article's insight. Placed at a natural pause in the narrative.

**image:** In-body image that illustrates a specific detail mentioned in the text.

**closure:** Resolves the article's theme. Returns to the opening image or idea but with deepened meaning. The last line should stay with the reader.

## Article Types

### The Observation (tag: Light, Drape, Weather, Ritual)
A single observation explored in depth. "How morning light reads a weave." Sensory, meditative, specific.

### The Explainer (tag: Technique, Place, Care)
Explains a practice or tradition. Rooted in the real — a specific weaver, village, or technique.

### The Reflection (tag: House, Weaver, Occasion)
A meditation on a theme. More abstract but grounded in sensory specifics.

## Required Context

- Article title or theme
- Tag from controlled vocabulary
- Any specific weaver names, places, or techniques to include
- Related products or glossary terms
- Reference to an existing HOP article or collection if connecting to one

## Required References

- `src/content/_schemas/journal.yaml` (frontmatter schema)
- `docs/editorial/07-emotional-architecture/emotional-journey.md` (Trust, Belonging stages)
- `docs/editorial/02-brand-architecture/messaging-pillars.md` (Heritage, Craft pillars)
- `system/writing-principles.md` (sentence and paragraph construction)

## Formatting

- Sentence case for title (with period at end)
- Dek is a genuine summary, not a hook — it tells the reader what the article is about
- Body blocks use markdown paragraphs within the block
- No subheadings within body blocks (the block type is the heading)
- No CTAs, no "read more," no related articles at the end

## Acceptance Criteria

- [ ] Title is sentence case with a period at the end
- [ ] Dek is ≤160 characters and accurately summarises the article
- [ ] Intro opens with a specific moment or observation
- [ ] At least one sensory anchor per 100 words
- [ ] At least one reference to a real weaver, place, or technique
- [ ] Pull-quote is quotable — a line someone would share
- [ ] Closure resolves and resonates — the last line stays with the reader
- [ ] Zero forbidden words
- [ ] No question openings, no question closings
- [ ] No explicit brand messaging ("we believe," "our mission")

## Example Output

See `src/content/journal/morning-light-reads-weave/index.md` for a reference implementation.

## Failure Cases

| Failure | Symptom | Correction |
|---------|---------|------------|
| Generic essay opening | "In today's fast-paced world, handloom offers a connection to tradition." | Remove. Open with a specific sensory moment: "The zari catches the morning light at 5:47 AM." |
| Marketing tone | "Discover the beauty of handwoven sarees." | Replace with genuine observation: "The weaver adjusts the tension twice an hour. The rhythm is patient." |
| No human element | Abstract discussion of craft without a named weaver | Include a specific person — Gangamma, her grandmother, a named dyer. |
| AI clichés | "Delve into," "testament to," "in a world where" | Remove all AI-generated filler. Every word must be chosen, not generated by pattern. |

---

**Cross-reference:** `src/content/_schemas/journal.yaml`, `writing/craft-notes.md` (for educational content), `writing/seo-copy.md` (journal SEO metadata)