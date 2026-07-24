# PROMPT: Checkout Label Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: microcopy
# CONTENT TYPE: microcopy

## Description

Generates warm, clear form labels and helper text for the checkout flow. At HOP, checkout is a ceremony, not a transaction. Every label and instruction should feel personal and intentional — as if a real person is guiding the woman through the process.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for microcopy, warmth)
- docs/editorial/04-vocabulary-system/forbidden-words.md
- docs/editorial/02-brand-architecture/messaging-pillars.md (Intention pillar — checkout)

## Strategic Principles

Checkout is the most vulnerable moment in the customer journey. Every label, every instruction, every error message must reduce friction and increase confidence. The language should feel like a warm shop assistant guiding her through, not a cold form processing data.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 3/5
- **Sensory Density:** 1/5
- **Technical Depth:** 1/5
- **Urgency:** 1/5 (slight — this is a transactional flow)
- **Imperative Force:** 1/5 (gentle guidance, not commands)
- **Reading Level:** Grade 6
- **Forbidden patterns:** corporate language ("primary shipping address"), possessive form without "your" ("email address"), exclamation marks

## Input

- Field name (email, phone, name, address line 1, address line 2, city, state, pincode, country, notes, gift message, coupon code, card number, expiry, CVV, name on card, billing address same as shipping)
- Context (page in checkout: shipping, payment, review)

## Output Format

For each field, provide:
```
Label: {warm, personal label — use "your"}
Placeholder: {optional — if helpful, a warm example}
Helper: {optional — 1 sentence of reassurance or guidance, if needed}
```

## Standard Labels

| Field Name | Label | Helper |
|---|---|---|
| email | Your email | "Your order confirmation will arrive here." |
| phone | Your phone number | "For delivery coordination only." |
| name | Your name | — |
| address line 1 | Your address | "Where should your saree travel to?" |
| address line 2 | Landmark (optional) | — |
| city | Your city | — |
| state | Your state | — |
| pincode | PIN code | — |
| country | Your country | — |
| notes | A note for us (optional) | "Tell us if this is a gift, a specific occasion, or anything we should know." |
| gift message | Your message | "Handwritten on Ink Charcoal cardstock and tucked inside." |
| coupon code | (do not include) | HOP does not use coupons or discount codes — this field does not exist |

## Quality Criteria

- Label uses "your" (not "the" or no possessive)
- Format is title case for labels
- Helper text is warm and reassuring, not instructional
- No forbidden words
- No exclamation marks
- No corporate or transactional language
- No jargon

## Review Prompts to Run After Generation

- `consistency-check-v1` — validates voice alignment
