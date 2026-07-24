# Knowledge Base

**Owner:** Editorial Lead
**Last updated:** July 2026
**Status:** Active

---

## Purpose

The Knowledge Base is the permanent research infrastructure for House of Padmavati. It organizes every source of strategic, empirical, and domain knowledge that informs content decisions. Every AI session, every editorial brief, and every content review draws from this body of knowledge.

## How to Use This Knowledge Base

### For AI Collaborators (Claude Opus)

When beginning a content generation or review task:

1. Identify the relevant category or categories from the index below
2. Load the corresponding documents into context
3. Also load the relevant editorial system documents (cross-referenced in each research doc)

### For Editorial Lead

When writing a content brief or conducting a review:

1. Reference the relevant research documents for strategic grounding
2. Cite specific principles in the brief to align AI generation
3. After publication, check cross-references remain accurate

### Quick Reference

| If you are writing... | Load these research docs |
|-----------------------|--------------------------|
| A journal article | Psychology (System 1/2), Craft (relevant weave/fabric), Customer personas |
| A product story | Psychology (endowment effect, mental accounting), Craft (fabric, weave), Design language |
| A collection narrative | Psychology (choice architecture), Culture (wedding traditions, rituals), Competitors |
| A craft note | Craft (weaving techniques, fabric glossary), Culture (textile history) |
| A weaver portrait | Craft (regional weaves, loom geography), Customers (personas) |
| A house letter | Brand strategy (positioning, brand territories), Customer personas |
| A ritual guide | Culture (saree rituals, wedding traditions, festival calendar) |
| SEO metadata | SEO (keyword strategy, structured data) |
| Email copy | Psychology (mental accounting), Customers (decision journey) |
| Policy page | UX (trust signals, checkout friction) |

## Directory Structure

```
docs/research/
├── README.md                           # This file — index + usage guide
│
├── brand-strategy/                     # Strategic positioning documentation
│   ├── positioning.md                  # HOP's market position, differentiation, white space
│   ├── target-audience.md              # Primary, secondary, tertiary audience profiles
│   ├── differentiation.md              # What makes HOP different from every competitor
│   └── brand-territories.md            # Quiet Luxury, Cultural Custodianship, Slow Making, etc.
│
├── psychology/                         # Behavioral economics + consumer psychology
│   ├── system-1-system-2.md            # Dual-process theory, implications for content structure
│   ├── mental-accounting.md            # How customers categorize spending, how to frame purchases
│   ├── loss-aversion.md                # Risk sensitivity in premium purchases, transparency as mitigation
│   ├── costly-signaling.md             # How sarees function as social signals, conspicuous vs subtle
│   ├── choice-architecture.md          # Decision fatigue, curated discovery, compromise effect
│   └── endowment-effect.md             # Virtual possession through sensory language
│
├── competitors/                        # Competitive analysis
│   ├── sabyasachi.md                   # Heritage nostalgia, exclusivity, retail experience
│   ├── raw-mango.md                    # Minimalist handloom, documentary-style campaigns
│   ├── aesop.md                        # Cross-industry: verbal identity, sensory retail writing
│   ├── loro-piana.md                   # Cross-industry: quiet luxury, material authority
│   ├── the-row.md                      # Cross-industry: restraint, absence of branding
│   ├── kinfolk.md                      # Cross-industry: editorial aesthetics, slowness
│   └── cereal-magazine.md              # Cross-industry: travel + culture editorial voice
│
├── craft/                              # Handloom and textile knowledge
│   ├── weaving-techniques.md           # Pit loom, jacquard, dobby, resist dye, ikat
│   ├── fabric-glossary.md              # Mulberry silk, tussar, cotton, linen, organza, blends
│   ├── regional-weaves.md              # Ilkal, Molakalmuru, Patteda Anchu, Mysore Silk, Udupi cotton
│   ├── zari-history.md                 # Origins of zari, hand-spun vs machine, real vs imitation
│   ├── dye-processes.md                # Natural dyes, chemical dyes, colour fastness
│   └── loom-geography.md               # Map of weaving clusters in Karnataka and Tamil Nadu
│
├── culture/                            # Cultural context for the saree
│   ├── saree-rituals.md                # The saree in Indian life: daily, ceremonial, generational
│   ├── wedding-traditions.md           # Regional wedding saree customs across South India
│   ├── textile-history.md              # History of Indian handloom from Indus Valley to present
│   └── festival-calendar.md            # Key festivals and seasons relevant to saree purchase
│
├── customers/                          # Audience research
│   ├── persona-primary.md              # The discerning woman who chooses well
│   ├── persona-secondary.md            # The intentional gift giver
│   ├── persona-tertiary.md             # The curious visitor who may never buy
│   ├── decision-journey.md             # Cognitive path from awareness to purchase to loyalty
│   └── pain-points.md                  # Identified friction points in premium saree buying
│
├── ux/                                 # User experience research
│   ├── reading-behavior.md             # How users read editorial content on screens
│   ├── checkout-friction.md            # Common abandonment points in premium checkout
│   ├── mobile-content-consumption.md   # How mobile users consume editorial content
│   └── trust-signals.md                # Which trust signals matter most to premium buyers
│
├── seo/                                # Search optimization knowledge
│   ├── keyword-strategy.md             # Primary and long-tail keywords by content type
│   ├── content-topics.md               # Topic clusters, pillar pages, content gaps
│   └── structured-data.md              # JSON-LD schemas by page type
│
├── visual-language/                    # Photography and video direction
│   ├── photography-direction.md        # Editorial photography principles, lighting, composition
│   ├── video-direction.md              # Cinematic video principles, pacing, colour grading
│   └── image-standards.md              # Technical specs: resolution, format, alt text, optimization
│
├── design-language/                    # Writing about design intent
│   ├── coastal-blossom-philosophy.md   # The 60-25-10-5 ratio and its implications
│   ├── negative-space.md               # Why white space is a content strategy, not a design choice
│   └── typology-of-restraint.md        # Design principles of reduction and curation
│
├── prompts/                            # Prompt library (Phase 5 — placeholder)
│   └── README.md                       # Placeholder — prompts will live here after Phase 5
│
└── future-research/                    # Topics identified for future investigation
    └── README.md                       # List of research gaps to be filled
```

## Document Template

Every Knowledge Base document follows this structure:

```markdown
---
title: {Title}
type: research
category: {category}
status: active
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
owner: Editorial Lead
sources:
  - "Source citation"
tags:
  - {tag}
related:
  - {relative path}
---

# Title

## Source Attribution

- **Author/Origin:** {who created this knowledge}
- **Date:** {when it was added or last updated}
- **Related documents:** {links to other Knowledge Base docs}

## Executive Summary

{2-3 sentences explaining what this document contains and why it matters for editorial decisions}

## Key Principles

### Principle 1: {name}

{Explanation of the principle}

**Editorial implication:** {how this principle affects content decisions}

**Example:** {concrete example of the principle in action in HOP content}

## Application to HOP

{How this knowledge translates into specific content rules, frameworks, or guardrails}

## Sources

{List of sources with URLs where applicable}

## Cross-References

{Which other Knowledge Base documents connect to this one}
{Which editorial documents use this knowledge}
```

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Directory | `kebab-case` | `customer-research/` |
| File | `kebab-case.md` | `system-1-system-2.md` |
| Title within file | Sentence case | `System 1 and System 2` |
| Internal anchors | `## Title` (GitHub auto-generates) | |

## Frontmatter Standards

Every document includes YAML frontmatter with: `title`, `type`, `category`, `status`, `created`, `updated`, `owner`, `sources`, `tags`, and `related`.

## Cross-Linking Standards

- Every document includes a `Related` section at the bottom with all connected docs
- Links are relative from `docs/` root: `docs/research/psychology/loss-aversion.md`
- Editorial documents link back to research documents that informed them

## Versioning

- Each document has `created` and `updated` dates in frontmatter
- Significant content changes update the `updated` date
- `status` field tracks: `active`, `needs-review`, `deprecated`, `archived`
- Full history is preserved through Git

## Citation Standards

| Source Type | Citation Format |
|-------------|----------------|
| Book | Author. (Year). *Title.* Publisher. |
| Academic paper | Author. (Year). "Title." *Journal,* Volume(Issue), Pages. |
| Article/Web | Author. (Year). "Title." Publication. URL |
| Internal research | Source. (Year). "Title." Internal document. |
| Expert interview | Name, Title. (Date). Personal interview. |

## Review Workflow

1. **Create draft** — Write the document following the template standards
2. **Peer review** — At least one other team member reviews for accuracy and clarity
3. **Editorial review** — Editorial Lead checks alignment with brand voice and editorial principles
4. **Publish** — Set `status: active`, merge to main
5. **Scheduled review** — Every 6 months, the owner reviews for currency

## Maintenance Workflow

| Frequency | Action | Owner |
|-----------|--------|-------|
| Monthly | Check for broken cross-references | Editorial Lead |
| Quarterly | Review new research sources, add if relevant | Editorial Lead |
| Semi-annually | Full audit: update outdated content, deprecate irrelevant content | Editorial Lead + Founder |
| Per topic event | New competitor, new technique, validated customer insight | Anyone |

---

**Cross-reference:** `docs/editorial/README.md`, `docs/editorial/INDEX.md`, all `docs/editorial/02-brand-architecture/` documents
