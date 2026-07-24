# PROMPT: Collection Narrative
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: generate
# CONTENT TYPE: collection

## Description

Generates the full editorial narrative for a collection — the story that appears on the Collection page and Collection Detail page. A collection is a named woman (Kalyani, Viara, Arya, Padma, Spandana). This prompt creates an emotional connection between the reader and the collection, framing the sarees not as products but as expressions of a character, a mood, and a place.

## Context Requirements

**Knowledge Base:**
- `docs/research/craft/weaving-techniques.md` — Accurate weave and technique references
- `docs/research/craft/regional-weaves.md` — Geographic and regional authenticity
- `docs/research/culture/saree-rituals.md` — Ritual and occasion context
- `docs/research/psychology/system-1-system-2.md` — Alternating engagement pattern
- `docs/research/design-language/coastal-blossom-philosophy.md` — 60-25-10-5 composition

**Editorial System:**
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix for Collections page
- `docs/editorial/02-brand-architecture/messaging-pillars.md` — Heritage primary, Craft secondary
- `docs/editorial/02-brand-architecture/editorial-principles.md` — Rooted in the real, Human-scale
- `docs/editorial/02-brand-architecture/emotional-principles.md` — Curiosity leads to Wonder
- `docs/editorial/04-vocabulary-system/approved-words.md` — Preferred vocabulary
- `docs/editorial/04-vocabulary-system/forbidden-words.md` — Forbidden vocabulary
- `docs/editorial/04-vocabulary-system/grammar-and-usage.md` — Sentence rules

## Strategic Principles

**Primary pillar:** Heritage — "This cloth carries memory." Connect the collection to a tradition, region, and lineage.

**Secondary pillar:** Craft — "Handwoven, not mass-produced." Ground the emotional story in real technique and process.

**Emotional stage:** Curiosity → Wonder. The collection name invites curiosity; the narrative deepens into wonder through craft and heritage details.

**EOS principles:** Specific over generic (name the weaver, the village, the technique), Rooted in the real (every claim traceable), Show don't tell (sensory mood, not abstract mood labels).

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 3/5
- **Sensory Density:** 4/5
- **Technical Depth:** 2/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 8
- **Forbidden words:** luxury, premium, exquisite, beautiful, stunning, gorgeous, amazing, incredible, shop, buy, sale, discount, exclusive, must-have, elevate, wardrobe essential, statement piece
- **Vocabulary to prefer:** quiet, considered, gentle, hand, weave, thread, loom, drape, fold, carry, remember, belong, slow, still, soft, warm, deep, border, pallu, zari, weight, generation, tradition

## Content Schema

Reference schema: `src/content/_schemas/collection.yaml`

### Frontmatter Fields

```yaml
type: collection — required — const: "collection"
name: string — required — Collection name (e.g., Kalyani, Viara)
slug: string — required — URL slug, kebab-case
status: string — required — enum: draft | published | archive
tagline: string — required — max 120 chars, displayed under collection name
hero: string — required — Relative path to hero image
filmPoster: string — optional — Relative path to collection film poster
mood: string — required — Single sentence describing the collection's mood
occasion: string — required — What occasion this collection belongs to
weaverNote: string — optional — Quote or note from the weaver
lookbook: array of strings — optional — Paths to lookbook images
seo.title: string — required — max 70 chars
seo.description: string — required — max 160 chars
relatedArticles: array of strings — optional — Slugs of related journal articles
relatedCraftNotes: array of strings — optional — Slugs of related craft notes
```

### Body Block Sequence

```
1. hero — Full-bleed hero with collection name, tagline, and hero image
2. intro — Mood and occasion setting (1-2 paragraphs)
3. body — The story: who the collection is for, what it carries, the weave details, emotional framing
4. pull-quote — A powerful line from the narrative, set apart typographically
5. image — Editorial image with alt text, reinforcing mood
6. closure — Resolution sentence that leaves the reader in a quiet place
```

## Input

The user provides:
- **collectionName** (string) — The collection's woman name
- **slug** (string) — URL slug in kebab-case
- **weaveDetails** (string) — Weave type, technique, fabric specifics
- **weaverInfo** (string) — Weaver name, generation, location
- **moodKeywords** (array of strings) — 3–5 mood descriptors
- **occasionType** (string) — e.g., Wedding, Festival, Daily, Evening
- **heroImagePath** (string) — Relative path to hero image
- **lookbookPaths** (array of strings, optional) — Paths to lookbook images

## Output Format

Generate a complete markdown file with YAML frontmatter between `---` delimiters, followed by body blocks separated by `---` delimiters.

```markdown
---
{frontmatter fields as YAML}
---

---
type: hero
image: {image path}
---
{collection name}
{tagline}

---
type: intro
---
{mood and occasion, 1-2 paragraphs}

---
type: body
---
{collection story, emotional and sensory, with craft grounding}

---
type: pull-quote
---
"{quote that distills the collection's emotional core}"

---
type: image
image: {image path}
alt: {descriptive alt text}
---

---
type: closure
---
{resolution sentence or short paragraph}
```

## Quality Criteria

- Collection reads as a person, not a product set — the name feels earned.
- Mood is expressed through sensory language, not declared ("a quiet weave that reads silver-grey in shade" not "elegant and sophisticated").
- At least one verifiable craft detail (weave type, technique name, weaver location, loom type).
- WeaverNote is included when weaverInfo is provided — must be in the weaver's voice, not the brand's.
- Tagline is under 120 characters and creates curiosity without explaining the collection fully.
- Zero forbidden words present.

## Review Prompts to Run After Generation

- `review/consistency-check-v1` — Verifies Heritage pillar primacy, tone matrix alignment for Collections page.
- `review/forbidden-words-check-v1` — Scans for any forbidden word in the output.
- `review/narrative-pacing-v1` — Evaluates flow from curiosity to wonder, structural block sequence adherence.
