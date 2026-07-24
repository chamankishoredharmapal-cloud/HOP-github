# PROMPT: Error State Text Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: microcopy
# CONTENT TYPE: microcopy

## Description

Generates warm, reassuring error messages for any HOP component. Error states at HOP never blame the user, never feel cold, and always offer a clear next step. The goal is to turn a moment of friction into a moment of trust.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for microcopy)
- docs/editorial/04-vocabulary-system/forbidden-words.md
- docs/editorial/02-brand-architecture/editorial-principles.md (human-scale, trust through transparency)

## Strategic Principles

An error is a trust moment. How HOP handles it tells the user more about the brand than any marketing copy. Errors must be: transparent ("this happened"), reassuring ("we will help"), actionable ("here's what to do"). Never corporate, never robotic, never blaming.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 3/5
- **Sensory Density:** 1/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 6
- **Forbidden patterns:** blaming the user ("you didn't", "you entered wrong", "your mistake"), corporate language ("an error has occurred"), exclamation marks, urgency

## Input

- Component name (checkout, cart, product page, account, search, etc.)
- Error type (404, network failure, validation error, empty result, server error, payment declined, authentication required)
- Context (what the user was doing when the error occurred)
- Optional: specific details (item name, field name, error code for internal use)

## Output Format

```
Heading: {short, warm heading — 2-5 words}
Body: {1-2 sentences explaining what happened and reassuring the user}
CTA: {optional — a gentle next step, one sentence}
```

## Quality Criteria

- Does not blame the user
- Explains the problem in plain language
- Offers a clear next step
- Warm but not saccharine
- No exclamation marks
- No corporate or robotic language
- No technical jargon (unless preceded by plain-language explanation)
- No forbidden words

## Error-Specific Guidelines

| Error Type | Approach | Example Body |
|---|---|---|
| 404 | Gentle, redirect to familiar ground | "This page does not exist. Perhaps begin at the collections." |
| Network failure | Transparent, reassuring | "The connection faltered. Your bag is safe — come back when you are ready." |
| Validation error | Specific, helpful | "This field needs a ten-digit Indian phone number starting with 6, 7, 8, or 9." |
| Empty result | Invitation, not dead end | "No sarees matched that search. Perhaps browse the full collection instead." |
| Payment declined | Private, helpful | "The bank did not approve the transaction. Your card details have not been charged." |
| Server error | Honest, apologetic without groveling | "Something went wrong on our side. We are looking into it." |

## Review Prompts to Run After Generation

- `consistency-check-v1` — validates voice alignment
- `forbidden-words-check-v1` — checks for any forbidden word
