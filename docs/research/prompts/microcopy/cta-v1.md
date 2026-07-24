# PROMPT: CTA Text Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: microcopy
# CONTENT TYPE: microcopy

## Description

Generates gentle, warm CTA text for any page or component. CTAs at HOP are suggestions, not commands. They invite rather than demand. One primary CTA per page, one optional secondary CTA that never competes with the primary.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix, imperative rules)
- docs/editorial/04-vocabulary-system/preferred-verbs-nouns.md (transaction → belonging substitutions)
- docs/editorial/04-vocabulary-system/forbidden-words.md

## Strategic Principles

CTAs must feel like invitations from a trusted friend, not commands from a sales script. Replace transactional language with relational language. The CTA is the last thing the reader sees before deciding — it must carry no pressure.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 3/5
- **Sensory Density:** 1/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5 (gentle suggestion only)
- **Reading Level:** Grade 6
- **Forbidden verbs:** shop, buy, purchase, grab, hurry, get, act, start (as imperative)
- **Preferred verbs:** browse, explore, begin, continue, complete, choose, carry, discover, welcome
- **Format:** Title case, short (2-5 words), no punctuation at end

## Input

- Page type (homepage, collection, product, cart, checkout, confirmation, journal, gift, account, care)
- Action the user should take (view collection, read article, complete purchase, add to bag, etc.)
- Tone direction (warm, practical, celebratory — default: warm)
- Context (any specific details that should inform the CTA)

## Output Format

Primary CTA + optional secondary CTA (only if the page has two distinct user paths).

```
Primary: {CTA text}
Secondary: {CTA text} (only if applicable)
Rationale: {1-2 sentences explaining the choice}
```

## Quality Criteria

- Primary CTA uses a gentle verb (not an imperative command)
- Primary CTA is one per page
- Secondary CTA does not compete with primary
- No urgency or scarcity language
- No forbidden words
- Title case, 2-5 words, no punctuation
- Feels like an invitation, not a directive

## Page-Specific CTA Guidelines

| Page | Primary Action | Example CTA |
|------|---------------|-------------|
| Homepage | Scroll / explore | No CTA — only scrolling |
| Collection | View collection | "Browse the collection" |
| Product | Add to bag | "Choose this weave" |
| Cart | Proceed | "Continue" |
| Checkout | Complete order | "Complete your order" |
| Confirmation | Return to browsing | "Return to the house" |
| Journal | Read article | "Read the full article" |
| Gift | Configure gift | "Begin your gift" |
| Customer Care | Contact | "Write to us" |

## Review Prompts to Run After Generation

- `consistency-check-v1` — validates voice alignment
- `forbidden-words-check-v1` — checks for any forbidden word
