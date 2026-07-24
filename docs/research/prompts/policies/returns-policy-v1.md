# PROMPT: Returns Policy Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: policies
# CONTENT TYPE: policy

## Description

Generates a clear, fair returns policy in HOP's voice. The policy frames returns as a natural part of finding the right saree — not as a failure or a favour. The tone is helpful and transparent, never defensive or restrictive.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for policies)
- docs/editorial/02-brand-architecture/editorial-principles.md (trust through transparency)
- docs/editorial/04-vocabulary-system/forbidden-words.md

## Strategic Principles

Returns policies are trust documents. The most common fear in premium saree buying is "what if I don't love it?" A generous, clear, easy-to-follow returns policy removes this fear. Frame returns as part of the journey to finding the right saree, not as an exception. Primary pillar: Quietness. Secondary: Intention.

## Brand Constraints

- **Formality:** 4/5
- **Warmth:** 2/5
- **Sensory Density:** 1/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Reading Level:** Grade 9
- **Forbidden words:** customer, consumer, shall, hereby, herein, pursuant, strict no returns, final sale, no exceptions, restocking fee
- **Required sections:** introduction, return window, conditions, how to initiate, what happens next, refund timeline, exchanges, non-returnable items, questions

## Input

- Return window (number of days)
- Condition requirements (unworn, tags attached, etc.)
- Who pays return shipping
- Refund timeline (business days after receipt)
- Whether exchanges are offered
- Non-returnable items (if any — custom orders, sale items if applicable, etc.)
- Contact method for initiating returns (email address)

## Output Format

```
# Returns Policy

{Introduction — 1-2 sentences on HOP's philosophy: we want you to love your saree. If it is not the right one, we will help.}

## Return Window
{Clear timeline, starting from delivery date.}

## Conditions for Return
{What is required for a return — unworn, original packaging, etc. Clear and fair.}

## How to Initiate a Return
{Step-by-step, plain language.}

## What Happens Next
{Process after the return is initiated.}

## Refund Timeline
{Specific number of business days.}

## Exchanges
{If offered, how exchanges work.}

## Non-Returnable Items
{List specific exclusions, if any.}

## Questions
{How to contact with questions. Warm closing.}
```

## Quality Criteria

- Frame is helpful, not restrictive
- Specific timelines, not vague ("within X days" not "within a reasonable time")
- Plain English
- No forbidden words
- No corporate or defensive language
- No "strict no returns" framing

## Review Prompts to Run After Generation

- `grammar-check-v1` — validates grammar and spelling
