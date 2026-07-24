# PROMPT: Delivery Confirmation Email Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: email
# CONTENT TYPE: email

## Description

Generates the warmest, most emotional HOP email — the delivery confirmation. This email welcomes the woman into the house. The saree has arrived. She now belongs. The tone is deeply personal, grateful, and warm — the closest HOP gets to celebration.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for order confirmation — highest warmth)
- docs/editorial/07-emotional-architecture/page-emotion-map.md (delivery confirmation: Joy + Belonging)
- docs/editorial/07-emotional-architecture/emotional-journey.md (Belonging stage)
- docs/editorial/04-vocabulary-system/approved-words.md (belongs, carried, quiet, gentle)

## Strategic Principles

This is the emotional peak of the transactional email sequence. The woman has received her saree — now she needs to feel that she has joined something larger. The email invites her to be part of the house, not as a customer but as a member. Primary pillar: Continuance. Secondary: Intention.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 5/5 (the warmest HOP communication)
- **Sensory Density:** 3/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Reading Level:** Grade 7
- **Forbidden words:** customer, feedback, review, rate, survey, transaction

## Input

- Product names
- Order number
- Customer name

## Output Format

```
Subject: {warm, emotional, ≤50 chars — "Welcome to the quiet house."}
Preheader: {warm, ≤100 chars}

Greeting: {personal greeting — warm}

Body paragraph 1: Welcome her to the house — she now belongs. Frame this as a beginning, not an end.
Body paragraph 2: Describe what she holds — the saree, the keepsake card, the jasmine paper wrap. Honour the objects.
Body paragraph 3: Invitation, not a review request — "If you ever want to write to us about your saree, we would love to hear."

Closing: Deeply warm
Signature: — House of Padmavati
```

## Quality Criteria

- Subject line ≤ 50 characters
- Preheader ≤ 100 characters
- Warmth is 5/5 — the warmest HOP email
- No review requests, no surveys, no feedback forms
- Invitation is genuine and personal
- No corporate language
- No forbidden words
- No exclamation marks — warmth comes from words, not punctuation

## Review Prompts to Run After Generation

- `consistency-check-v1` — validates voice alignment
- `forbidden-words-check-v1` — checks for any forbidden word
