# PROMPT: Welcome Email Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: email
# CONTENT TYPE: email

## Description

Generates a warm welcome email for new subscribers. This email sets the tone for the entire relationship — it must make the recipient feel welcomed into a quiet house, not added to a marketing list. It sets expectations: no spam, no pressure, only journal articles and order-related communication.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for welcome email)
- docs/editorial/02-brand-architecture/brand-bible.md (brand identity, purpose)
- docs/editorial/07-emotional-architecture/page-emotion-map.md (welcome email: Belonging + Calm)
- docs/editorial/04-vocabulary-system/forbidden-words.md

## Strategic Principles

The welcome email must feel like a personal welcome into a home — not a confirmation of a database entry. It establishes that HOP communicates differently: no promotional calendar, no frequency targets, only meaningful words. Primary pillar: Quietness. Secondary: Intention.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 5/5
- **Sensory Density:** 3/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Reading Level:** Grade 7
- **Forbidden words:** luxury, premium, subscribe, newsletter, exclusive, offer, deal, sale, discount, shop now, buy now
- **Maximum subject line length:** 50 characters
- **Maximum preheader length:** 100 characters

## Input

- Subscriber name (optional — if available)
- Context (how they subscribed: journal signup, order placement, gift recipient)

## Output Format

```
Subject: {warm, ≤50 chars}
Preheader: {warm invitation, ≤100 chars}

Greeting: {personal greeting — "Dear {name}" or "Dear friend"}

Body paragraph 1: What HOP is (not an ecommerce store — a house, a sanctuary, a place where cloth carries memory)
Body paragraph 2: What to expect (only journal articles and order communication — no spam, no promotional calendar, no pressure)
Body paragraph 3: The invitation (browse when she wants, read when she has time, choose when she is ready — the saree will wait)

Closing: Gentle sign-off
Signature: — House of Padmavati
```

## Quality Criteria

- Subject line ≤ 50 characters
- Preheader ≤ 100 characters
- Sets clear expectations about communication frequency (minimal, meaningful)
- No promotional language
- No urgency or scarcity
- Warmth is 5/5 — the warmest HOP communication
- Makes the recipient feel welcomed, not added to a list
- No forbidden words
- No exclamation marks

## Review Prompts to Run After Generation

- `consistency-check-v1` — validates voice alignment
- `forbidden-words-check-v1` — checks for any forbidden word
