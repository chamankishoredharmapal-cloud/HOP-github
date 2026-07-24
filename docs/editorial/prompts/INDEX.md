# AI Writing Operating System — Index

## Foundation

| Document | Purpose |
|----------|---------|
| `README.md` | System overview, architecture, principles |
| `INDEX.md` | This file — quick navigation |
| `loading-order.md` | Recommended context loading sequence |
| `usage-guide.md` | How to apply the system to writing, editing, and review tasks |

## System (Permanent Editorial Brain)

| Document | Purpose |
|----------|---------|
| `system/master-system-prompt.md` | Complete identity, voice, values, constraints — the one prompt to teach AI who HOP is |
| `system/brand-context.md` | Brand identity summary for AI context window |
| `system/editorial-context.md` | Editorial governance summary for AI context window |
| `system/writing-principles.md` | HOP-specific writing rules and reasoning framework |
| `system/reasoning-principles.md` | How AI should think before writing HOP content |
| `system/output-format.md` | Standard output formatting for all content types |

## Writing (Content Generation)

| Document | Content Type |
|----------|-------------|
| `writing/homepage.md` | Homepage hero, taglines, section copy |
| `writing/collections.md` | Collection narratives |
| `writing/product-pages.md` | Product stories with sensory description |
| `writing/journal.md` | Journal articles |
| `writing/about.md` | About / Our Story |
| `writing/craft-notes.md` | Educational craft content |
| `writing/glossary.md` | Glossary definitions |
| `writing/ritual-guides.md` | Occasion and care guides |
| `writing/emails.md` | Email copy (welcome, order, dispatch, journal, etc.) |
| `writing/seo-copy.md` | SEO metadata (titles, descriptions, OG data) |
| `writing/microcopy.md` | UI microcopy (labels, errors, empty states) |
| `writing/CTAs.md` | Call-to-action copy |

## Editing (Transformation)

| Document | Task |
|----------|------|
| `editing/rewrite.md` | Rewrite existing text in HOP voice |
| `editing/proofread.md` | Grammar, punctuation, spelling correction |
| `editing/expand.md` | Elaborate content without padding |
| `editing/shorten.md` | Condense content without losing essence |
| `editing/luxury-tone.md` | Refine for luxury register |
| `editing/clarity.md` | Improve readability and comprehension |
| `editing/consistency.md` | Enforce brand consistency across content |

## Review (Quality Assurance)

| Document | Focus |
|----------|-------|
| `review/quality-checklist.md` | Comprehensive quality review across all dimensions |
| `review/fact-checking.md` | Verify factual claims are traceable and accurate |
| `review/hallucination-prevention.md` | Detect and eliminate fabricated content |
| `review/brand-review.md` | Brand voice, identity, and vocabulary fidelity |
| `review/seo-review.md` | SEO metadata compliance |
| `review/accessibility-review.md` | Accessibility standards compliance |

## Templates (Session Setup)

| Document | Use |
|----------|-----|
| `templates/writing-template.md` | Standard structure for writing requests |
| `templates/editing-template.md` | Standard structure for editing requests |
| `templates/review-template.md` | Standard structure for review requests |
| `templates/context-loader.md` | Checklist for loading context before a session |
| `templates/session-bootstrap.md` | Complete session setup — paste to begin any session |

## Quick Reference

**I need to teach an AI who HOP is:** `system/master-system-prompt.md`

**I need to write a journal article:** `templates/context-loader.md` + `system/master-system-prompt.md` + `writing/journal.md`

**I need to edit existing copy:** `templates/context-loader.md` + `system/master-system-prompt.md` + the relevant `editing/` document

**I need to review content for brand consistency:** `templates/review-template.md` + `system/brand-context.md` + `review/brand-review.md`

**I need to start a new AI session:** `templates/session-bootstrap.md`