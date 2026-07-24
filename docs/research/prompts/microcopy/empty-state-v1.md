# PROMPT: Empty State Text Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: microcopy
# CONTENT TYPE: microcopy

## Description

Generates warm, inviting empty state text for any HOP component. An empty state at HOP is not a dead end — it is an invitation. It frames absence as possibility, not lack. No guilt, no pressure, no "your cart is empty" shaming.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for microcopy)
- docs/editorial/04-vocabulary-system/forbidden-words.md

## Strategic Principles

An empty state is a moment of quiet. Instead of filling it with pressure (abandoned cart emails before she has left, urgency to add items), fill it with a gentle invitation. The emptiness itself is part of the HOP experience — space to breathe, to choose later, to return when ready.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 3/5
- **Sensory Density:** 1/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 6
- **Forbidden patterns:** guilt ("your cart is empty"), urgency ("don't miss out"), corporate emptiness ("no items"), negative framing ("you haven't added anything yet"), exclamation marks

## Input

- Component name (cart, wishlist, orders, search results, addresses, saved items)
- Context (what the user was doing or where they came from)
- User state (new visitor, returning customer, first order — if known)

## Output Format

```
Heading: {warm, inviting heading — 2-5 words, no guilt}
Body: {1-2 sentences framing the absence as possibility}
CTA: {optional gentle invitation to browse — title case, no punctuation}
```

## Quality Criteria

- No guilt or shame ("your cart is empty" is forbidden — "your bag is resting" is acceptable)
- Frames absence as possibility and space
- Offers a gentle invitation to the next step
- Warm, personal tone
- No urgency or pressure
- No forbidden words
- No exclamation marks

## Component-Specific Guidelines

| Component | Approach | Example Heading |
|---|---|---|
| Cart | Frame as "resting" not "empty" | "Your bag is resting." |
| Wishlist | Frame as future possibility | "A quiet space for future choices." |
| Orders | Frame as before the first | "Your first order awaits." |
| Search Results | Gentle redirect | "No sarees matched that search." |
| Addresses | Practical, helpful | "Add an address for delivery." |
| Saved Items | Patient, no pressure | "Saved for another day." |

## Review Prompts to Run After Generation

- `consistency-check-v1` — validates voice alignment
- `forbidden-words-check-v1` — checks for any forbidden word
