# PROMPT: Ritual Guide
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: generate
# CONTENT TYPE: ritual-guide

## Description

Generates an occasion or care guide that helps the reader navigate a specific saree ritual — choosing a saree for a wedding, dressing for a festival, wearing a saree to the office, caring for a handwoven drape, or giving a saree as a gift. Ritual guides are practical and warm: they inform without instructing, guide without commanding. They position HOP as a knowledgeable companion, not a sales channel.

## Context Requirements

**Knowledge Base:**
- `docs/research/culture/saree-rituals.md` — Core ritual and occasion references
- `docs/research/culture/wedding-traditions.md` — Wedding-specific context
- `docs/research/culture/festival-calendar.md` — Festival timing and significance
- `docs/research/customers/persona-primary.md` — Primary buyer's decision context
- `docs/research/customers/decision-journey.md` — Evaluation and purchase stage needs

**Editorial System:**
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix for Journal (ritual guides)
- `docs/editorial/02-brand-architecture/messaging-pillars.md` — Intention primary, Continuance secondary
- `docs/editorial/02-brand-architecture/editorial-principles.md` — Human-scale, Show don't tell
- `docs/editorial/04-vocabulary-system/approved-words.md` — Occasion and care vocabulary
- `docs/editorial/04-vocabulary-system/forbidden-words.md` — No urgency, no imperative force

## Strategic Principles

**Primary pillar:** Intention — "Every detail is a choice." The guide helps the reader make considered decisions about occasion, drape, and care.

**Secondary pillar:** Continuance — "Made to outlive its first wearer." Care rituals are framed as preservation, not maintenance.

**Emotional stage:** Confidence → Satisfaction. The reader should feel equipped to choose or care for her saree and satisfied in her knowledge.

**EOS principles:** Show don't tell (describe the occasion vividly), Specific over generic (name the ritual, the step, the reason), Human-scale (speaks to one woman preparing for one occasion).

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 4/5
- **Sensory Density:** 3/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 7
- **Forbidden words:** luxury, premium, exquisite, beautiful, stunning, amazing, incredible, shop, buy, sale, discount, exclusive, must-have, elevate, subscribe, sign up, limited edition, must, should (use gentle suggestions instead)
- **Vocabulary to prefer:** quiet, considered, gentle, choose, fold, drape, wrap, store, care, ceremony, ritual, tradition, occasion, season, morning, evening, warm, soft, belong

## Content Schema

Reference schema: `src/content/_schemas/ritual-guide.yaml`

### Frontmatter Fields

```yaml
type: ritual-guide — required — const: "ritual-guide"
title: string — required — Sentence case
slug: string — required — kebab-case
published: string — required — YYYY-MM-DD format
status: string — required — enum: draft | review | published | archive
occasion: string — required — enum: Wedding | Festival | Office | Daily | Gift
hero: string — required — Relative path to hero image
alt: string — optional — Alt text for hero image
collections: array of strings — optional — Related collection slugs
products: array of strings — optional — Related product UUIDs
relatedArticles: array of strings — optional — Related article slugs
seo.title: string — required — max 70 chars
seo.description: string — required — max 160 chars
```

### Body Block Sequence

```
1. hero — Hero image with title and occasion
2. intro — Why this occasion matters — sets the emotional context
3. body — Step blocks: numbered procedural guidance (at least 3 steps)
4. pull-quote — A line that captures the spirit of the ritual
5. image — Editorial image showing the occasion or care action
6. closure — Quiet resolution — what this ritual means
```

## Input

The user provides:
- **occasion** (string) — enum: Wedding | Festival | Office | Daily | Gift
- **collection** (string, optional) — Collection slug to reference
- **audience** (string) — Description of the intended reader (e.g., "a first-time saree buyer for a wedding", "a woman looking to care for her heirloom sarees")

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
{occasion} guide

---
type: intro
---
{why this occasion matters — emotional and cultural context, 1-2 paragraphs}

---
type: body
---
{expanded context on the occasion or practice}

---
type: step
number: 1
---
{first step — what to do, with warmth and specificity}

---
type: step
number: 2
---
{second step}

---
type: step
number: 3
---
{third step}

--- (more steps as needed, minimum 3)

---
type: pull-quote
---
"{a line that captures the spirit of this ritual}"

---
type: image
image: {image path}
alt: {descriptive alt text}
---

---
type: closure
---
{what this ritual means — resolution that leaves the reader with quiet confidence}
```

## Quality Criteria

- At least 3 step blocks present with sequential numbering for procedural guides.
- Each step is framed as a gentle suggestion, not a command — "consider" not "must", "you might" not "you should".
- Occasion context is culturally grounded and specific (not "special occasions" generically).
- Reading level Grade 7 — accessible, clear, warm.
- Sensory density is 3/5 — enough to set mood, not so dense it obscures the practical guidance.
- Zero forbidden words present.

## Review Prompts to Run After Generation

- `review/consistency-check-v1` — Verifies Intention pillar alignment, appropriate warmth for ritual guides.
- `review/forbidden-words-check-v1` — Scans for imperative language or forbidden words.
- `review/accessibility-check-v1` — Confirms reading level and semantic structure of step blocks.
