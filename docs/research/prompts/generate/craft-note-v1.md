# PROMPT: Craft Note
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: generate
# CONTENT TYPE: craft-note

## Description

Generates an educational explainer about a handloom technique, material, or process. Craft notes are the accessible scholarship of HOP — technical enough to inform a knowledgeable reader, warm enough to engage a curious one. They explain the how and why behind the weave, building the reader's craft vocabulary and deepening her appreciation.

## Context Requirements

**Knowledge Base:**
- `docs/research/craft/weaving-techniques.md` — Primary technique reference — must be consulted for accuracy
- `docs/research/craft/fabric-glossary.md` — Fabric, fibre, and material definitions
- `docs/research/craft/regional-weaves.md` — Geographic context for technique origins
- `docs/research/craft/loom-geography.md` — Loom type distribution and relevance
- `docs/research/craft/zari-history.md` — Zari specifics when relevant
- `docs/research/craft/dye-processes.md` — Dye and colour technique references
- `docs/research/psychology/system-1-system-2.md` — Alternating engagement for educational content

**Editorial System:**
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix for Journal (craft notes)
- `docs/editorial/02-brand-architecture/messaging-pillars.md` — Craft primary, Heritage secondary
- `docs/editorial/02-brand-architecture/editorial-principles.md` — Specific over generic, Rooted in the real
- `docs/editorial/04-vocabulary-system/approved-words.md` — Craft vocabulary (loom, weave, thread, tension, warp, weft)
- `docs/editorial/04-vocabulary-system/forbidden-words.md` — No marketing inflation of craft

## Strategic Principles

**Primary pillar:** Craft — "Handwoven, not mass-produced." The entire note is an exercise in craft appreciation. Every sentence should increase the reader's understanding of how cloth is made.

**Secondary pillar:** Heritage — "This cloth carries memory." Technique exists within a lineage; note the generational and regional context.

**Emotional stage:** Wonder → Respect. The reader should marvel at the complexity of handweaving and develop deep respect for the maker.

**EOS principles:** Show don't tell (describe the process vividly), Specific over generic (name the technique, the tool, the step), Rooted in the real (traceable to real weaving communities), Human-scale (the weaver's hands, not abstract process diagrams).

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 3/5
- **Sensory Density:** 4/5
- **Technical Depth:** 2/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 8
- **Forbidden words:** luxury, premium, exquisite, beautiful, stunning, amazing, incredible, shop, buy, exclusive, must-have, elevate, subscribe, sign up
- **Vocabulary to prefer:** hand, loom, weave, thread, warp, weft, shuttle, tension, rhythm, pit loom, jacquard, dobby, border, pallu, zari, silk, cotton, dye, resist, pattern, generation, tradition, technique

## Content Schema

Reference schema: `src/content/_schemas/craft-note.yaml`

### Frontmatter Fields

```yaml
type: craft-note — required — const: "craft-note"
title: string — required — Sentence case
slug: string — required — kebab-case
published: string — required — YYYY-MM-DD format
updated: string — optional — YYYY-MM-DD format
status: string — required — enum: draft | review | published | archive
author: string — required — Default: "House of Padmavati"
tag: string — required — enum: Technique | Fabric | Weave | Dye | History
dek: string — required — max 160 chars
readingTime: integer — required — minimum 1
hero: string — required — Relative path to hero image
alt: string — optional — Alt text for hero image
collections: array of strings — optional — Related collection slugs
products: array of strings — optional — Related product UUIDs
glossaryTerms: array of strings — optional — Glossary term slugs referenced
seo.title: string — required — max 70 chars
seo.description: string — required — max 160 chars
```

### Body Block Sequence

```
1. hero — Hero image with title, tag, reading time
2. intro — Accessible opening that frames why this technique matters
3. body — Explanation: what it is, how it works, where it comes from, what it produces
4. pull-quote — A memorable line that captures the essence — mandatory
5. image — Visual reference of the technique or material — mandatory
6. system-2 (optional) — Technical specifications or further reading
7. closure — Quiet resolution that connects the technique back to the reader
```

## Input

The user provides:
- **techniqueName** (string) — The craft technique or material to explain
- **brief** (string) — 2–3 sentences describing the technique, its significance, and what the note should cover
- **tag** (string) — from enum: Technique | Fabric | Weave | Dye | History

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
{opening that gives the reader a reason to care about this technique}

---
type: body
---
{what it is — clear, accessible definition}

{how it works — the process, step by sensory step}

{where it comes from — regional and generational context}

{what it produces — how the cloth behaves}

---
type: pull-quote
---
"{line that captures the technique's significance}"

---
type: image
image: {image path}
alt: {descriptive alt text}
---

---
type: closure
---
{connects back to the reader — this is what you feel when you wear it}
```

## Quality Criteria

- Technique is explained accessibly — a non-expert reader should understand it after one reading.
- At least one verifiable fact about the technique's origin, history, or process.
- Sensory language present — describe what the technique looks like, sounds like, produces in the cloth.
- No marketing framing — the note educates, never sells.
- At least one pull-quote and one image block present.
- Glossary terms identified and listed in frontmatter for cross-linking.

## Review Prompts to Run After Generation

- `review/consistency-check-v1` — Verifies Craft pillar alignment, technical accuracy.
- `review/sensory-density-check-v1` — Confirms sensory language is present in the educational narrative.
- `review/grammar-check-v1` — Checks for correct Indian English spelling (saree, colour, metre, etc.).
