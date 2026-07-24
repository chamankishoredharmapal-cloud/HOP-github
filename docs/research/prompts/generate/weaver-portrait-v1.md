# PROMPT: Weaver Portrait
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: generate
# CONTENT TYPE: weaver-portrait

## Description

Generates an artisan portrait — a biographical story about a weaver, her craft, and her lineage. This is not a profile (facts about a person). It is a portrait (a human-scale story that makes the reader feel they have met this woman). The weaver's own voice must be present through direct quotes. The portrait must inspire reverence for the maker and connection between the reader and the hands that weave.

## Context Requirements

**Knowledge Base:**
- `docs/research/craft/weaving-techniques.md` — Accurate technique references for the weaver's specialty
- `docs/research/craft/regional-weaves.md` — Geographic and regional authenticity for the weaver's location
- `docs/research/craft/loom-geography.md` — Loom context for the weaver's cluster
- `docs/research/culture/textile-history.md` — Generational and historical context
- `docs/research/customers/decision-journey.md` — Trust and connection through human stories

**Editorial System:**
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix for Journal (weaver portraits)
- `docs/editorial/02-brand-architecture/messaging-pillars.md` — Heritage primary, Craft secondary
- `docs/editorial/02-brand-architecture/editorial-principles.md` — Rooted in the real, Human-scale
- `docs/editorial/04-vocabulary-system/approved-words.md` — Human and place vocabulary
- `docs/editorial/04-vocabulary-system/forbidden-words.md` — No generic praise for the weaver

## Strategic Principles

**Primary pillar:** Heritage — "This cloth carries memory." The weaver is the living connection to generations of craft.

**Secondary pillar:** Craft — "Handwoven, not mass-produced." The portrait details the weaver's technique, hours, and skill.

**Emotional stage:** Reverence → Connection. The reader should feel deep respect for the weaver and a personal connection to the human behind the cloth.

**EOS principles:** Rooted in the real (real name, real place, real technique), Human-scale (one woman, not a demographic), Show don't tell (show her hands, her workspace, her rhythm), Restrained (let her words carry the weight).

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 4/5
- **Sensory Density:** 4/5
- **Technical Depth:** 2/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 8
- **Forbidden words:** luxury, premium, exquisite, beautiful, stunning, amazing, incredible, shop, buy, sale, discount, exclusive, artisan (used generically — name the weaver instead), craftsman, skilled artisan
- **Vocabulary to prefer:** hand, loom, weave, thread, generation, mother, grandmother, daughter, teaches, learned, village, morning, day, hour, rhythm, patience, tradition, continues, remembers, hands

## Content Schema

Reference schema: `src/content/_schemas/weaver-portrait.yaml`

### Frontmatter Fields

```yaml
type: weaver-portrait — required — const: "weaver-portrait"
title: string — required — Sentence case
slug: string — required — kebab-case
published: string — required — YYYY-MM-DD format
status: string — required — enum: draft | review | published | archive
author: string — required — Default: "House of Padmavati"
weaverName: string — required — Full name
generation: integer — required — Generations the family has been weaving
location: string — required — Village/town and state
technique: string — required — Primary weaving technique
hero: string — required — Relative path to hero image
alt: string — optional — Alt text for hero image
quote: string — required — A direct quote from the weaver
portraits: array of strings — optional — Paths to portrait images
collections: array of strings — optional — Collection slugs the weaver contributes to
products: array of strings — optional — Product UUIDs the weaver wove
seo.title: string — required — max 70 chars
seo.description: string — required — max 160 chars
```

### Body Block Sequence

```
1. hero — Full-bleed hero portrait with weaver name and technique
2. intro — Who she is — entering her space, the first impression
3. body — Her story: how she learned, her generation, her technique, her day
4. pull-quote — Her own words, set apart — mandatory, from interview notes
5. gallery — Portrait images — mandatory, at least 2 images
6. closure — What her work means — quiet resolution
```

## Input

The user provides:
- **weaverName** (string) — Full name
- **location** (string) — Village/town and state
- **generation** (integer) — Generations the family has been weaving
- **technique** (string) — Primary weave technique
- **interviewNotes** (string) — Raw interview notes, quotes, observations from the field visit
- **portraitPaths** (array of strings, optional) — Image paths for portraits

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
# {weaverName}
{technique} · {generation} generations · {location}

---
type: intro
---
{entering her space — sensory first impression}

---
type: body
---
{how she learned — generational context}

{her technique — what she weaves, how she weaves it}

{her day — the rhythm of her work}

{what it means — her relationship to the craft}

---
type: pull-quote
---
"{her own words — a direct quote from the interview notes}"

---
type: gallery
images:
  - {image path 1}
  - {image path 2}
---
{optional caption for the gallery}

---
type: closure
---
{quiet resolution — what her hands continue}
```

## Quality Criteria

- The portrait feels human-scale — the reader should feel they have met this woman.
- At least one direct quote from the weaver in her own voice, placed in the pull-quote block.
- Generational context is present — how she learned, from whom, how long the family has woven.
- Technique is named and described accurately, referenced against the craft KB.
- Gallery block contains at least 2 portrait images with descriptive paths.
- Zero generic language about "artisans" or "craftspeople" — this is one specific woman.

## Review Prompts to Run After Generation

- `review/consistency-check-v1` — Verifies Heritage pillar alignment, weaver portrait voice.
- `review/forbidden-words-check-v1` — Scans for generic artisan language or forbidden words.
- `review/brand-voice-fidelity-v1` — Evaluates whether the portrait sounds like HOP or like a generic brand story.
