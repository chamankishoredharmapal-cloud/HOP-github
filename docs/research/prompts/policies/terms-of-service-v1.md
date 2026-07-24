# PROMPT: Terms of Service Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: policies
# CONTENT TYPE: policy

## Description

Generates clear, fair terms of service in HOP's voice. The terms are written to be read and understood — not to hide behind. They cover the legal and business relationship between HOP and its customers in plain language, with fairness and transparency as the guiding principles.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for policies)
- docs/editorial/02-brand-architecture/editorial-principles.md (trust through transparency)
- docs/editorial/04-vocabulary-system/forbidden-words.md

## Strategic Principles

Terms of service at HOP are a trust document, not a legal shield. They state clearly what the relationship is: HOP sells handwoven sarees, carefully described, honestly priced, and delivered with care. They protect HOP's intellectual property (the brand, the writing, the photography) and establish fair boundaries for use. Primary pillar: Quietness. Secondary: Intention.

## Brand Constraints

- **Formality:** 4/5
- **Warmth:** 2/5
- **Sensory Density:** 1/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Reading Level:** Grade 9
- **Forbidden words:** shall, hereby, herein, pursuant, whereas, party (as legal term), indemnify (use "responsible for" instead), force majeure (use plain language instead)
- **Required sections:** introduction, acceptance, products and pricing, orders and payments, shipping and delivery, returns and refunds, intellectual property, user conduct, disclaimer, limitation of liability, governing law, changes, contact

## Input

- Business name: House of Padmavati
- Registered address (if applicable)
- Governing law jurisdiction (India)
- Product categories sold (handwoven sarees, accessories)
- Payment methods accepted
- Pricing currency (INR)
- Intellectual property details (brand name, photography, writing, design)
- User conduct (basic guidelines for using the website)

## Output Format

```
# Terms of Service

{Introduction — what these terms cover, in plain language.}

## Acceptance
{Using the site means accepting these terms. Clear and simple.}

## Products and Pricing
{How products are described, pricing accuracy, changes.}

## Orders and Payment
{Order process, payment methods, order acceptance.}

## Shipping and Delivery
{Summary — reference the shipping policy for details.}

## Returns and Refunds
{Summary — reference the returns policy for details.}

## Intellectual Property
{What HOP owns, how users may use it.}

## User Conduct
{Basic guidelines for using the website.}

## Disclaimer
{Necessary legal disclaimer — written in plain language.}

## Limitation of Liability
{Fair limitation — not a blanket waiver.}

## Governing Law
{Jurisdiction and dispute resolution.}

## Changes to These Terms
{How users are notified of changes.}

## Contact
{How to reach HOP with questions about these terms.}
```

## Quality Criteria

- Plain English throughout — no legalese
- Fair and balanced — not a one-sided document
- Specific where possible (not vague or ambiguous)
- No forbidden words
- No "blame the customer" framing
- Readable by someone without legal training
- All promises made in marketing (free shipping, returns, etc.) are reflected accurately here

## Review Prompts to Run After Generation

- `grammar-check-v1` — validates grammar and spelling
