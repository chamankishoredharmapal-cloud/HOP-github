# PROMPT: Field Note
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: generate
# CONTENT TYPE: field-note

## Description

Generates a field note — a travelogue or loom diary from a visit to a weaving cluster, village, or craft fair. Field notes are written in first-person or close-third person and create sensory immersion: the reader should feel they are standing beside the writer, hearing the loom, feeling the morning air. These are not reports. They are dispatches from the real places where cloth is made.

## Context Requirements

**Knowledge Base:**
- `docs/research/craft/weaving-techniques.md` — Technique accuracy for observed processes
- `docs/research/craft/regional-weaves.md` — Geographic and regional authenticity
- `docs/research/craft/loom-geography.md` — Loom types and cluster locations
- `docs/research/craft/dye-processes.md` — Dye documentation accuracy
- `docs/research/culture/textile-history.md` — Cultural and historical context for the place visited
- `docs/research/design-language/coastal-blossom-philosophy.md` — 60% space/breath for pacing

**Editorial System:**
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix for Journal (field notes)
- `docs/editorial/02-brand-architecture/messaging-pillars.md` — Heritage primary, Craft secondary
- `docs/editorial/02-brand-architecture/editorial-principles.md` — Rooted in the real, Show don't tell
- `docs/editorial/04-vocabulary-system/approved-words.md` — Place and sensory vocabulary
- `docs/editorial/04-vocabulary-system/forbidden-words.md` — No promotional language

## Strategic Principles

**Primary pillar:** Heritage — "This cloth carries memory." The field note documents living tradition in a specific place.

**Secondary pillar:** Craft — "Handwoven, not mass-produced." The sensory details of the making process are central.

**Emotional stage:** Wonder → Connection. The reader should marvel at the place and craft, then feel connected to the real world where their saree comes from.

**EOS principles:** Rooted in the real (specific place, date, observations), Show don't tell (sensory immersion), Human-scale (the people, the sounds, the light — not abstract summary), Restrained (let the place speak).

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 4/5
- **Sensory Density:** 5/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 8
- **Forbidden words:** luxury, premium, exquisite, beautiful, stunning, amazing, incredible, shop, buy, sale, discount, exclusive, must-have, elevate, subscribe, sign up, magical, enchanting, picturesque (replace with specific observation)
- **Vocabulary to prefer:** morning, light, warm, dust, loom, hand, thread, colour, dye, sun, shade, sound, rhythm, quiet, still, slow, village, road, air, earth, cotton, silk, wood, oil, tea

## Content Schema

Reference schema: `src/content/_schemas/field-note.yaml`

### Frontmatter Fields

```yaml
type: field-note — required — const: "field-note"
title: string — required — Sentence case
slug: string — required — kebab-case
published: string — required — YYYY-MM-DD format
status: string — required — enum: draft | review | published | archive
author: string — required — Default: "House of Padmavati"
location: string — required — Specific location visited
dateVisited: string — required — Date of the visit, YYYY-MM-DD
hero: string — required — Relative path to hero image
alt: string — optional — Alt text for hero image
collections: array of strings — optional — Related collection slugs
products: array of strings — optional — Related product UUIDs
seo.title: string — required — max 70 chars
seo.description: string — required — max 160 chars
```

### Body Block Sequence

```
1. hero — Hero image with title, location, date visited
2. intro — Arrival — the first sensory impression of the place
3. body — The observations: what was seen, heard, felt, learned
4. pull-quote — A line that captures the spirit of the visit
5. image — At least one editorial image from the field
6. gallery — Travel images — mandatory, at least 2
7. closure — Departure — quiet resolution, what stays with the writer
```

## Input

The user provides:
- **location** (string) — Village/town and state visited
- **dateVisited** (string) — Date in YYYY-MM-DD format
- **observations** (string) — Raw field notes: sensory observations, conversations, process documentation, impressions
- **photoPaths** (array of strings) — Paths to field images

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
{location} · {dateVisited}

---
type: intro
---
{arrival — the first sensory impression — time of day, light, sounds, air}

---
type: body
---
{what was observed — paragraph 1: the place and its rhythm}

{paragraph 2: the people, the work, the craft being made}

{paragraph 3: a specific moment or conversation}

{paragraph 4: reflection — what this place means}

---
type: pull-quote
---
"{a line that captures the spirit of the visit}"

---
type: image
image: {image path}
alt: {descriptive alt text}
---

---
type: gallery
images:
  - {image path 1}
  - {image path 2}
  - {image path 3}
---
{optional caption}

---
type: closure
---
{departure — what stays with the writer, quiet resolution}
```

## Quality Criteria

- First-person or close-third person voice throughout — the reader experiences the visit through the writer's senses.
- Sensory density is 5/5 — at least one sensory detail per paragraph (light, sound, texture, smell, temperature).
- Location and date are specific and accurate, referenced in frontmatter and hero.
- Gallery block contains at least 2 images from the field.
- The note never promotes or sells — it documents and shares.
- Zero forbidden words present.

## Review Prompts to Run After Generation

- `review/sensory-density-check-v1` — Confirms sensory language density meets 5/5 target for field notes.
- `review/consistency-check-v1` — Verifies Heritage pillar alignment and appropriate field note voice.
- `review/forbidden-words-check-v1` — Scans for promotional language that violates the field note format.
