# PROMPT: House Letter
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: generate
# CONTENT TYPE: house-letter

## Description

Generates a house letter — a brand manifesto, principled announcement, or seasonal letter from House of Padmavati. House letters are direct, warm, and firm. They state the house's position on something that matters: why HOP does not discount, the philosophy of slowness, the meaning of the name, a seasonal reflection. They are signed by the house, not an individual. Every house letter is a declaration of values expressed with conviction and restraint.

## Context Requirements

**Knowledge Base:**
- `docs/research/design-language/coastal-blossom-philosophy.md` — 60-25-10-5 for compositional pacing
- `docs/research/culture/textile-history.md` — Context for heritage-rooted letters
- `docs/research/psychology/system-1-system-2.md` — Emotional principles anchoring

**Editorial System:**
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix for About/Journal (house letters)
- `docs/editorial/02-brand-architecture/messaging-pillars.md` — Pillar varies by letter occasion
- `docs/editorial/02-brand-architecture/editorial-principles.md` — Restrained, Trust through transparency
- `docs/editorial/02-brand-architecture/emotional-principles.md` — Belonging through shared values
- `docs/editorial/04-vocabulary-system/approved-words.md` — Intention and principle vocabulary
- `docs/editorial/04-vocabulary-system/forbidden-words.md` — No marketing or promotional language
- `docs/editorial/04-vocabulary-system/grammar-and-usage.md` — Contractions allowed (warm but firm)

## Strategic Principles

**Primary pillar:** Varies by occasion. Seasonal letters use Quietness. Milestone letters use Heritage. Collection Launch letters use Craft or Intention. Annual letters use Continuance.

**Emotional stage:** Reverence → Belonging. The reader should feel aligned with HOP's principles and welcomed into the house's way of thinking.

**EOS principles:** Restrained (every word earns its place — a house letter is lean), Trust through transparency (state the real reason, not a marketing reason), Human-scale (speaks to one woman, not a crowd).

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 4/5
- **Sensory Density:** 4/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 8
- **Forbidden words:** luxury, premium, exquisite, beautiful, stunning, amazing, incredible, shop, buy, sale, discount, exclusive, must-have, elevate, subscribe, sign up, limited edition, offer, deal
- **Vocabulary to prefer:** quiet, considered, intentional, slow, patient, gentle, hand, weave, thread, house, believe, choose, honour, continue, remember, belong, still, deep, warm

## Content Schema

Reference schema: `src/content/_schemas/house-letter.yaml`

### Frontmatter Fields

```yaml
type: house-letter — required — const: "house-letter"
title: string — required — Sentence case
slug: string — required — kebab-case
published: string — required — YYYY-MM-DD format
status: string — required — enum: draft | review | published | archive
occasion: string — required — enum: Seasonal | Milestone | Collection Launch | Annual
hero: string — required — Relative path to hero image
alt: string — optional — Alt text for hero image
signature: string — required — Default: "— House of Padmavati"
seo.title: string — required — max 70 chars
seo.description: string — required — max 160 chars
```

### Body Block Sequence

```
1. hero — Title and image, establishing the letter's occasion
2. intro — Direct opening statement of principle or position
3. body — The argument: why the house believes this, with warmth and conviction
4. pull-quote — A line that distills the letter's core principle
5. closure — Resolution that thanks the reader and reaffirms the house's commitment
```

## Input

The user provides:
- **occasion** (string) — enum: Seasonal | Milestone | Collection Launch | Annual
- **keyMessage** (string) — The core principle or position the letter expresses
- **toneDirection** (string) — Direction on warmth, firmness, or specific emphasis

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
A letter from the house · {published}

---
type: intro
---
{direct opening — the principle stated plainly}

---
type: body
---
{why the house believes this — paragraph 1}

{what it means in practice — paragraph 2}

{an invitation to the reader — paragraph 3}

---
type: pull-quote
---
"{the letter's core conviction in one line}"

---
type: closure
---
{resolution — thanks the reader, reaffirms the principle}

{signature}
```

## Quality Criteria

- The letter reads as a manifesto, not a marketing piece — principled, not promotional.
- Direct and firm in its convictions but warm in tone — never cold or corporate.
- The closing signature is "— House of Padmavati" (or variation specified in schema).
- Body paragraphs are lean — 2–4 sentences each, every sentence carrying weight.
- No imperatives — suggest, invite, welcome instead of command.
- Zero promotional language about products, collections, or sales.

## Review Prompts to Run After Generation

- `review/consistency-check-v1` — Verifies the letter's pillar alignment matches the occasion.
- `review/forbidden-words-check-v1` — Scans for any forbidden word.
- `review/brand-voice-fidelity-v1` — Evaluates whether the letter sounds like the house, not a generic brand.
