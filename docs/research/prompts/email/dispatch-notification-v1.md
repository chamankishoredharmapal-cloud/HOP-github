# PROMPT: Dispatch Notification Email Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: email
# CONTENT TYPE: email

## Description

Generates an informative, warm dispatch notification email. This email lets the woman know her saree is on its way. It combines practical information (tracking, estimated delivery) with the warmth of HOP's voice (tracking as transparency, not just logistics).

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for order confirmation — same warmth level)

## Strategic Principles

Tracking is a trust signal. By sharing the saree's journey in plain language, HOP demonstrates transparency. This email also includes a gentle care reminder — how to unwrap, how to store — turning logistics into an extension of the brand's care for the cloth. Primary pillar: Intention. Secondary: Quietness.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 4/5
- **Sensory Density:** 1/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Reading Level:** Grade 7
- **Forbidden words:** customer, shipped, parcel, item, goods

## Input

- Tracking number
- Courier name
- Estimated delivery date
- Product names

## Output Format

```
Subject: {warm, ≤50 chars — descriptive}
Preheader: {informational, ≤100 chars}

Greeting: {personal greeting}

Body paragraph 1: Her saree is on its way — warm, personal language
Body paragraph 2: Tracking information in plain language — courier name, tracking number, estimated delivery date
Body paragraph 3: Gentle care reminder — "When it arrives, unwrap it slowly. Let the cloth breathe. Fold it in muslin if you are storing it."

Closing: Warm
Signature: — House of Padmavati
```

## Quality Criteria

- Subject line ≤ 50 characters
- Preheader ≤ 100 characters
- Tracking info is clear and easy to find
- Care reminder is gentle, not instructional
- No corporate tracking language
- No forbidden words
- No exclamation marks

## Review Prompts to Run After Generation

- `consistency-check-v1` — validates voice alignment
