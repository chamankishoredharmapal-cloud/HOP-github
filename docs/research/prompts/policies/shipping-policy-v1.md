# PROMPT: Shipping Policy Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: policies
# CONTENT TYPE: policy

## Description

Generates a clear, transparent shipping policy in HOP's voice. The policy must be readable and warm enough to not feel corporate, while being clear and specific enough to be legally sound. Plain English throughout — no legalese, no CYA language, no hidden caveats.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for policies)
- docs/editorial/02-brand-architecture/editorial-principles.md (trust through transparency)
- docs/editorial/04-vocabulary-system/forbidden-words.md

## Strategic Principles

A shipping policy is a trust document. By being transparent about every aspect of shipping — timelines, costs, packaging, customs, damage — HOP demonstrates that it has nothing to hide. A clear policy reduces anxiety and builds confidence. Primary pillar: Quietness (honesty that creates calm). Secondary: Intention.

## Brand Constraints

- **Formality:** 4/5
- **Warmth:** 2/5
- **Sensory Density:** 1/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Reading Level:** Grade 9
- **Forbidden words:** customer, consumer, shall, hereby, herein, pursuant, whereas, party (legal terms)
- **Required sections:** introduction, domestic shipping, international shipping, timelines, packaging, tracking, costs, customs/duties, delivery attempts, damage/loss

## Input

- Domestic shipping carriers
- International shipping carriers (if applicable)
- Domestic shipping timeline (business days)
- International shipping timeline (business days)
- Domestic shipping cost structure
- International shipping cost structure
- Countries served (or "worldwide" with exceptions)
- Packaging description (muslin, jasmine paper, cotton ribbon, etc.)
- Free shipping threshold (if any)
- Insurance and tracking details

## Output Format

```
# Shipping Policy

{Introduction — 1-2 sentences on HOP's approach to shipping: careful, transparent, reliable.}

## Domestic Shipping
{Clear details on domestic carriers, timelines, costs, and process.}

## International Shipping
{Clear details on international shipping, timelines, costs, and customs.}

## Packaging
{How sarees are packed — muslin, jasmine paper, cotton ribbon, box. This is a trust detail.}

## Tracking
{When tracking is sent, how to use it.}

## Shipping Costs
{Transparent cost structure. If free shipping exists, state the threshold clearly.}

## Customs and Duties
{International — who pays, estimated amounts, process. Transparent and specific.}

## Delivery Attempts
{What happens if no one is home, how redelivery works.}

## Damaged or Lost Shipments
{What to do, how HOP handles it. Fair and transparent.}
```

## Quality Criteria

- Information is specific and accurate (no vague timelines)
- Plain English — no legalese
- Warm enough to not feel corporate, clear enough to be trust-building
- No hidden fees or caveats
- No forbidden words
- Every claim is verifiable
- Packaging section is specific (describe the actual packaging, not generic "secure packaging")

## Review Prompts to Run After Generation

- `grammar-check-v1` — validates grammar and spelling
