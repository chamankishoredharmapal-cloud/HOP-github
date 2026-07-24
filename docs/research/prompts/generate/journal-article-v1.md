# PROMPT: Journal Article
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: generate
# CONTENT TYPE: journal

## Description

Generates a full journal article for the House of Padmavati journal. Journal articles are the primary editorial content type — they explore light, drape, ritual, technique, place, and the philosophy of slow making. This prompt produces a complete article using The Essay framework: a sensory, reflective piece that educates and connects, never promotes.

## Context Requirements

**Knowledge Base:**
- `docs/research/craft/weaving-techniques.md` — Technique accuracy for articles tagged Technique
- `docs/research/culture/saree-rituals.md` — Ritual and generational context for Ritual and Occasion tags
- `docs/research/culture/textile-history.md` — Historical depth for Heritage framing
- `docs/research/culture/festival-calendar.md` — Season and timing references
- `docs/research/craft/fabric-glossary.md` — Material accuracy for Fabric and Linen tags
- `docs/research/craft/zari-history.md` — Specificity for articles referencing zari
- `docs/research/psychology/system-1-system-2.md` — Alternating engagement
- `docs/research/design-language/coastal-blossom-philosophy.md` — 60-25-10-5 composition for pacing

**Editorial System:**
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix for Journal Article
- `docs/editorial/02-brand-architecture/messaging-pillars.md` — Heritage primary, Craft secondary
- `docs/editorial/02-brand-architecture/editorial-principles.md` — All six principles apply
- `docs/editorial/02-brand-architecture/emotional-principles.md` — Insight → Connection
- `docs/editorial/04-vocabulary-system/approved-words.md` — Preferred vocabulary
- `docs/editorial/04-vocabulary-system/forbidden-words.md` — Forbidden vocabulary
- `docs/editorial/04-vocabulary-system/grammar-and-usage.md` — Sentence rules, Indian English

## Strategic Principles

**Primary pillar:** Heritage — "This cloth carries memory." Every article connects the reader to tradition, lineage, or cultural depth.

**Secondary pillar:** Craft — "Handwoven, not mass-produced." Technical and material details enrich the narrative without dominating it.

**Emotional stage:** Insight → Connection. The reader should learn something genuine (insight) and feel aligned with HOP's values (connection).

**EOS principles:** Show don't tell (sensory language), Specific over generic (real places, names, techniques), Rooted in the real (every claim traceable), Restrained (no promotional language), Human-scale (writes for one reader), Trust through transparency (sources named).

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 4/5
- **Sensory Density:** 5/5
- **Technical Depth:** 2/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 9
- **Forbidden words:** luxury, premium, exquisite, beautiful, stunning, gorgeous, amazing, incredible, shop, buy, sale, discount, exclusive, must-have, elevate, subscribe, sign up, limited edition
- **Vocabulary to prefer:** quiet, still, gentle, slow, soft, warm, deep, hand, weave, thread, loom, drape, fold, carry, remember, belong, held, light, morning, evening, season, generation, passed, continues

## Content Schema

Reference schema: `src/content/_schemas/journal.yaml`

### Frontmatter Fields

```yaml
type: journal — required — const: "journal"
title: string — required — Sentence case
slug: string — required — kebab-case
published: string — required — YYYY-MM-DD format
updated: string — optional — YYYY-MM-DD format
status: string — required — enum: draft | review | published | archive
author: string — required — Default: "House of Padmavati"
tag: string — required — enum: Light | Drape | Linen | Weather | Ritual | House | Technique | Weaver | Place | Care | Occasion
dek: string — required — max 160 chars, subtitle for index cards and meta
readingTime: integer — required — minimum 1
hero: string — required — Relative path to hero image
alt: string — optional — Alt text for hero image
seo.title: string — required — max 70 chars
seo.description: string — required — max 160 chars
ogImage: string — optional — Path to OG image, defaults to hero
relatedProducts: array of UUIDs — optional — Related product UUIDs
relatedArticles: array of strings — optional — Related article slugs
glossaryTerms: array of strings — optional — Glossary term slugs
```

### Body Block Sequence

```
1. hero — Full-bleed hero image with title, tag, reading time
2. intro — Opening paragraph(s) that establish place, time, sensory context
3. body — At least 4 body paragraphs developing the article's theme
4. pull-quote — A line from the body set apart typographically — mandatory
5. image — Editorial image with alt text — mandatory, at least one
6. system-2 (optional) — Accordion block for technical details or sourcing
7. closure — Resolution paragraph that leaves the reader in a quiet place
```

## Input

The user provides:
- **title** (string) — Article title, sentence case
- **tag** (string) — Controlled vocabulary tag from the enum
- **dek** (string) — max 160 chars, subtitle/summary
- **brief** (string) — 2–4 paragraphs describing the article's angle, key points, desired emotion
- **relatedReferences** (array of strings, optional) — Specific articles, research docs, or sources to incorporate

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
# {title}
{tag} · {readingTime} min read
{dek}

---
type: intro
---
{opening that places the reader in a specific sensory moment}

---
type: body
---
{paragraph 1 — establishes theme}

{paragraph 2 — develops with sensory detail}

{paragraph 3 — deepens with craft or heritage insight}

{paragraph 4 — resolves or turns toward closure}

---
type: pull-quote
---
"{line from the article that distills its emotional core}"

---
type: image
image: {image path}
alt: {descriptive alt text}
---

---
type: closure
---
{resolution — a sentence or short paragraph that leaves the reader still}
```

## Quality Criteria

- At least 4 body paragraphs, each developing a single idea with sensory richness.
- At least one pull-quote block present, drawn from article body.
- At least one image block present with descriptive alt text.
- Sensory Density 5/5 — at least one sentence per body paragraph that engages touch, sight, weight, light, or sound.
- Zero promotional language — the article must never feel like it is selling anything.
- Tagline (dek) is under 160 characters and creates curiosity without clickbait structure.
- Reading time corresponds to word count (200–250 words per minute).

## Review Prompts to Run After Generation

- `review/consistency-check-v1` — Verifies brand voice, vocabulary, tone matrix alignment for Journal Article.
- `review/sensory-density-check-v1` — Confirms sensory language density across all body paragraphs.
- `review/narrative-pacing-v1` — Evaluates flow from insight to connection, structural block sequence.
