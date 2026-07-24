# PROMPT: Homepage Hero
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: generate
# CONTENT TYPE: homepage

## Description

Generates the hero tagline and subtitle for the HOP homepage. Used when a new collection launches or the homepage hero needs refreshing. The output must create the feeling of arrival — calm, quiet, no demands — while hinting at the collection's character.

## Context Requirements

**Knowledge Base:**
- `docs/research/psychology/system-1-system-2.md` — System 1 hook and System 2 anchor structure
- `docs/research/customers/decision-journey.md` — Discovery stage requirements
- `docs/research/design-language/coastal-blossom-philosophy.md` — 60% space/breath ratio

**Editorial System:**
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix for Homepage
- `docs/editorial/02-brand-architecture/messaging-pillars.md` — Quietness pillar primacy
- `docs/editorial/02-brand-architecture/editorial-principles.md` — Show don't tell, Restrained
- `docs/editorial/07-emotional-architecture/emotional-journey.md` — Arrival → Curiosity stage
- `docs/editorial/04-vocabulary-system/forbidden-words.md` — Zero urgency vocabulary
- `docs/editorial/04-vocabulary-system/approved-words.md` — Preferred vocabulary set

## Strategic Principles

**Primary pillar:** Quietness — "No noise. Only the cloth." The hero is the first thing the reader encounters; it must feel like entering a silent room.

**Emotional stage:** Arrival (Calm) → Curiosity. The reader should feel relief at the absence of noise, then gentle fascination that invites scrolling.

**EOS principles:** Restrained (every word earns its place), Show don't tell (sensory language over abstract praise), Human-scale (speaks to one woman, not a demographic).

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 4/5
- **Sensory Density:** 5/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 8
- **Forbidden words:** luxury, premium, beautiful, stunning, exquisite, shop, buy, sale, discount, exclusive, must-have, elevate, wardrobe essential, amazing, incredible, hurry, limited edition, subscribe, sign up, shop now, buy now
- **Vocabulary to prefer:** quiet, still, gentle, slow, calm, breath, space, silence, rest, hand, weave, thread, drape, fold, carry, remember, belong, soft, warm, deep

## Content Schema

No schema file — homepage hero is a standalone content element. Output format is a structured markdown block.

### Output Fields

- `tagline` (string, required) — Short, poetic phrase (3–8 words). Sentence case. No period.
- `subtitle` (string, required) — 1–2 sentences beneath the tagline. Expands without explaining fully.
- `system1Hook` (string, required) — A single sensory sentence for the System 1 mind. Triggers feeling before thought.
- `system2Anchor` (string, required) — A verifiable fact for the System 2 mind. What makes the collection real.
- `cta` (string, optional) — Gentle invitation to scroll or browse. Must have zero imperative force.

## Input

The user provides:
- **collectionName** (string) — Name of the current featured collection (e.g., Kalyani, Viara, Arya)
- **moodKeywords** (array of strings) — 3–5 mood descriptors (e.g., ["coastal", "dawn", "quiet celebration"])
- **collectionTagline** (string, optional) — Existing tagline or directional note

## Output Format

Generate a structured markdown block:

```markdown
## Hero

**tagline:** {tagline}

**subtitle:** {subtitle}

**system1Hook:** {sensory sentence}

**system2Anchor:** {verifiable fact}

**cta:** {gentle invitation}
```

No YAML frontmatter required. No body blocks. This content is embedded directly into the homepage layout.

## Quality Criteria

- Tagline is 3–8 words, poetic but not obscure, uses sentence case.
- Subtitle is 1–2 sentences (max 40 words), expands curiosity without satisfying it.
- System 1 hook triggers a sensory or emotional response — the reader feels something.
- System 2 anchor is a specific, verifiable claim about the collection or craft.
- No imperatives, no urgency language, no exclamation marks, no questions.
- Zero forbidden words present.

## Review Prompts to Run After Generation

- `review/consistency-check-v1` — Verifies brand voice, vocabulary, and tone matrix alignment for Homepage hero.
- `review/forbidden-words-check-v1` — Scans for any forbidden word in the output.
- `review/sensory-density-check-v1` — Confirms Sensory Density meets 5/5 target for hero content.
