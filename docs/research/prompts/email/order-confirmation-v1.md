# PROMPT: Order Confirmation Email Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: email
# CONTENT TYPE: email

## Description

Generates a warm, celebratory order confirmation email. At HOP, order confirmation is a ceremony, not a transaction receipt. The email should evoke the feeling of having chosen something meaningful — the saree is now being prepared with care, wrapped in jasmine paper, and will soon be on its way.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for order confirmation)
- docs/editorial/07-emotional-architecture/page-emotion-map.md (order confirmation: Joy + Anticipation)
- docs/editorial/04-vocabulary-system/forbidden-words.md
- docs/editorial/04-vocabulary-system/preferred-verbs-nouns.md (transaction → belonging)

## Strategic Principles

This email moves the woman from Ownership (she has chosen) to Belonging (she is now part of the house). The confirmation is a gratitude moment — thank her for choosing, describe the care that goes into preparing her package, set anticipation for what arrives. Primary pillar: Intention. Secondary: Continuance.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 4/5
- **Sensory Density:** 2/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Reading Level:** Grade 7
- **Forbidden words:** transaction, receipt, invoice, customer, purchased, bought, deal, offer, sale
- **Maximum subject line length:** 50 characters
- **Maximum preheader length:** 100 characters

## Input

- Order number
- Product names (list of sarees/items ordered)
- Estimated dispatch date
- Customer name

## Output Format

```
Subject: {warm, ≤50 chars — "Your order is being wrapped."}
Preheader: {warm, ≤100 chars}

Greeting: {personal greeting}

Body paragraph 1: Thank her for choosing HOP — frame the order as an intentional choice, not a transaction
Body paragraph 2: Describe what happens next — the saree is being wrapped in jasmine paper, a keepsake card is being written, the package is being prepared with care
Body paragraph 3: Dispatch timing — honest and warm

Order summary:
{Product name} — {quantity if >1}

Closing: Warm anticipation
Signature: — House of Padmavati
```

## Quality Criteria

- Subject line ≤ 50 characters
- Preheader ≤ 100 characters
- Feels like a ceremony, not a receipt
- Describes the packaging experience (jasmine paper, cotton ribbon, keepsake card)
- No transactional language
- No forbidden words
- No exclamation marks
- Warmth is 4/5

## Review Prompts to Run After Generation

- `consistency-check-v1` — validates voice alignment
- `forbidden-words-check-v1` — checks for any forbidden word
