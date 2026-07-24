# AI Prompt Library

## Overview

This directory contains the complete AI prompt library for House of Padmavati. Every prompt is designed to produce content that conforms to the Editorial Operating System — the correct content type schema, voice dimensions, vocabulary rules, and editorial framework.

**Total prompts:** 38 across 9 categories
**Current version:** v1 (July 2026)
**Target model:** Claude Opus
**Library owner:** Editorial Lead

## Directory Structure

```
prompts/
├── _prompt-template.md       # Base template every prompt follows
├── README.md                 # This file — library index, usage, conventions
│
├── generate/                 # 10 content generation prompts
├── seo/                      # 4 SEO metadata generation prompts
├── microcopy/                # 5 microcopy prompts
├── email/                    # 5 email copy prompts
├── policies/                 # 4 policy copy prompts
├── review/                   # 7 content review prompts
├── critique/                 # 4 content critique prompts
├── rewrite/                  # 6 content rewrite prompts
├── translation/              # 2 translation prompts
│
├── examples/                 # Example outputs for generation prompts
└── _archive/                 # Deprecated/previous prompt versions
```

## Prompt Index

### Generation (10)

| Prompt | Produces | Input Required |
|--------|----------|----------------|
| `homepage-hero-v1` | Hero tagline + subtitle | Collection name, mood keywords |
| `collection-narrative-v1` | Full collection story | Collection name, slug, weave details, weaver info |
| `product-story-v1` | Sensory product description + System 2 | Product name, fabric, weave, colour, price tier |
| `journal-article-v1` | Full journal article with body blocks | Title, tag, dek, brief, related references |
| `craft-note-v1` | Educational explainer | Technique name, brief description |
| `weaver-portrait-v1` | Artisan story | Weaver name, location, generation, technique, interview notes |
| `house-letter-v1` | Brand letter | Occasion, key message, tone direction |
| `ritual-guide-v1` | Occasion/care guide | Occasion type, collection, audience |
| `field-note-v1` | Travelogue/loom diary | Location, date, observations |
| `glossary-definition-v1` | Term definition | Term, category, brief |

### SEO (4)

| Prompt | Produces | Input Required |
|--------|----------|----------------|
| `meta-title-v1` | SEO title | Content type, primary keyword, title |
| `meta-description-v1` | SEO description | Content body or summary |
| `og-image-alt-v1` | Alt text for OG image | Image description, content context |
| `json-ld-v1` | JSON-LD structured data | Content type, all metadata |

### Microcopy (5)

| Prompt | Produces | Input Required |
|--------|----------|----------------|
| `cta-v1` | CTA text | Page, action, tone direction |
| `error-state-v1` | Error message | Component, error type, context |
| `empty-state-v1` | Empty state text | Component, context |
| `checkout-label-v1` | Form label | Field, context |
| `toast-notification-v1` | Toast message | Action, item name, context |

### Email (5)

| Prompt | Produces | Input Required |
|--------|----------|----------------|
| `welcome-v1` | Welcome email | Subscriber context |
| `order-confirmation-v1` | Order confirmation | Order details, product names |
| `dispatch-notification-v1` | Dispatch notification | Tracking info, product names |
| `delivery-confirmation-v1` | Delivery confirmation | Order details |
| `journal-notification-v1` | Journal notification | Article title, dek, slug |

### Policies (4)

| Prompt | Produces | Input Required |
|--------|----------|----------------|
| `shipping-policy-v1` | Shipping policy | Shipping details |
| `returns-policy-v1` | Returns policy | Return window, conditions |
| `privacy-policy-v1` | Privacy policy | Data collection details |
| `terms-of-service-v1` | Terms of service | Business terms |

### Review (7)

| Prompt | Checks For |
|--------|------------|
| `consistency-check-v1` | Brand voice, vocabulary, tone matrix alignment |
| `sensory-density-check-v1` | Adequate sensory language per content type |
| `forbidden-words-check-v1` | Any forbidden word present |
| `system-2-presence-check-v1` | Required trust signals present |
| `accessibility-check-v1` | Alt text, reading level, semantic structure |
| `seo-check-v1` | Title length, description length, OG image, JSON-LD |
| `grammar-check-v1` | Grammar, punctuation, Indian English conventions |

### Critique (4)

| Prompt | Evaluates |
|--------|-----------|
| `narrative-pacing-v1` | Flow, rhythm, reader engagement |
| `emotional-resonance-v1` | Emotional impact, connection |
| `brand-voice-fidelity-v1` | How closely content matches HOP voice |
| `structural-flow-v1` | Content schema adherence, block sequence |

### Rewrite (6)

| Prompt | Transforms |
|--------|------------|
| `for-voice-v1` | Any text → HOP voice |
| `for-page-type-v1` | One page type → another |
| `for-email-v1` | Web → email format |
| `for-social-v1` | Web → social media caption |
| `for-accessibility-v1` | Original → accessible (simpler language) |
| `simplify-v1` | Complex → simple reading level |

### Translation (2)

| Prompt | Language | Preserves |
|--------|----------|-----------|
| `translate-to-kannada-v1` | Kannada | Tone, sensory density, reading level |
| `translate-to-hindi-v1` | Hindi | Tone, sensory density, reading level |

## Usage Guide

### Before Running Any Prompt

1. **Load context.** Gather the relevant Knowledge Base documents and editorial system documents listed in the prompt's "Context Requirements" section.
2. **Prepare input.** Fill in the required input fields (collection name, product UUID, article brief, etc.).
3. **Select review prompts.** Choose the review prompts you will run after generation. This must be done before generation to avoid confirmation bias.

### Running a Generation Prompt

1. Load the context documents and prompt into the AI session
2. Provide the input specified in the prompt's "Input" section
3. Run the prompt
4. Review the output against the prompt's "Quality Criteria"
5. Run the selected review prompts against the output
6. Revise if any quality criteria or review checks fail

### Running a Review Prompt

1. Provide the content to review (the full content unit, not just excerpts)
2. Run the prompt
3. Review the output — each check produces a pass/fail result with specific violations
4. Fix all critical violations before publishing

### Running a Critique Prompt

1. Provide the content to critique
2. Run the prompt
3. Review the output — each critique produces a score and specific feedback
4. Use the feedback to guide revisions

### Running a Rewrite Prompt

1. Provide the original content
2. Specify the target format (voice, page type, email, social, etc.)
3. Run the prompt
4. Review the output against the target format's requirements

### Running a Translation Prompt

1. Provide the original content in English
2. Specify the target language (Kannada or Hindi)
3. Run the prompt
4. Have a native speaker review the translation for accuracy and tone preservation

## Prompt Versioning

| Convention | Rule |
|------------|------|
| Version numbering | `v1`, `v2`, `v3` — incremented on any change to the prompt body |
| File naming | `{name}-{version}.md` — e.g., `product-story-v2.md` |
| Version history | Previous versions are moved to `_archive/`, never deleted |
| Version reference | Every generated output records the prompt version used |
| Breaking changes | Version increment required for: schema change, tone matrix change, new forbidden words, structural output change |

## Prompt Testing Methodology

| Test | Method | Pass Criteria |
|------|--------|---------------|
| Schema completeness | Run prompt against known input, verify output has all required frontmatter fields | All fields present |
| Voice adherence | Run output through consistency-check and forbidden-words-check | Zero violations |
| Sensory density | Count sensory words per 100 words | Meets target for content type |
| Reading level | Automated readability score | Matches target for page type |
| Forbidden word presence | Grep against output | Zero matches |
| Review prompt reliability | Feed known-good and known-bad content | Correctly identifies issues |

## Prompt Review and Lifecycle

| Stage | Action | Owner |
|-------|--------|-------|
| Create | Write prompt using template, include example output | Editorial Lead |
| Test | Run against 3 different inputs, verify all outputs | Editorial Lead |
| Review | Editor checks for strategic alignment and schema accuracy | Editor-in-Chief |
| Release | Set status to active, merge to main | Editorial Lead |
| Use | Reference prompt from content brief, record version used | Content creators |
| Review (quarterly) | Check prompts against current vocabulary and voice docs, update if needed | Editorial Lead |
| Deprecate | Move to `_archive/` when superseded | Editorial Lead |

## Related Documentation

- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix and voice dimensions
- `docs/editorial/02-brand-architecture/brand-bible.md` — Brand identity, purpose, values
- `docs/editorial/02-brand-architecture/messaging-pillars.md` — Five messaging pillars
- `docs/editorial/02-brand-architecture/editorial-principles.md` — Six editorial principles
- `docs/editorial/04-vocabulary-system/` — Approved words, forbidden words, grammar
- `docs/editorial/07-emotional-architecture/` — Emotional journey and page emotion map
- `src/content/_schemas/` — Content type schemas
- `docs/editorial/REMAINING_PHASES_ROADMAP.md` — Phase 5 implementation roadmap

---

**Last updated:** July 2026
**Version:** 1.0
