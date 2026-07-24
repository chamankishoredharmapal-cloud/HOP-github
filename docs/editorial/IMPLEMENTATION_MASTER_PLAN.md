# Editorial Operating System — Master Implementation Plan

**Version:** 1.0
**Status:** Planning
**Owner:** Editorial Lead
**Last updated:** July 2026

---

## 1. Executive Summary

### 1.1 Purpose

This document is the canonical implementation blueprint for the remaining six phases of the House of Padmavati Editorial Operating System. Phase 1 (Brand Architecture, Vocabulary System, Page Strategy Framework, Emotional Architecture) is complete. This plan covers everything needed to make the EOS operational — from foundational research through runtime content infrastructure to production publishing workflows.

### 1.2 What Has Been Built

Phase 1 established the editorial foundation:

- Brand identity, purpose, vision, values, personality, audience, promises
- Measurable voice matrix with page-specific tone targets and sentence architecture rules
- Five messaging pillars with core messages, emotional outcomes, and page primacy
- Six editorial principles with enforcement criteria
- Eight emotional principles with design implications
- Approved and forbidden vocabulary with rationale, substitution tables, and grammar rules
- Emotional journey architecture with nine stages, triggers, and System 1/System 2 activation
- Page-level emotion mapping for all 22 storefront pages, 7 account pages, and 5 email touchpoints

### 1.3 What Remains

| Phase | Scope | Dependency |
|-------|-------|------------|
| **Phase 2** | Knowledge Base — research, psychology, craft, customer data | None — foundational |
| **Phase 3** | Runtime Content Architecture — `src/content/` structure, schemas, relationships | Phase 2 (content types must be defined) |
| **Phase 4** | Content Compiler — Node.js build script that validates, resolves, and indexes content | Phase 3 (compiler compiles Phase 3's content) ✅ |
| **Phase 5** | AI Prompt Library — versioned, tested prompt templates for every content type | Phase 2 (prompts reference knowledge), Phase 3 (prompts generate Phase 3 content) |
| **Phase 6** | Journal Migration — move 6 hardcoded articles into the new content system | Phase 3 + Phase 4 (target structure and compiler must exist) |
| **Phase 7** | Production Content — end-to-end creation workflow for new content | All prior phases |

### 1.4 Design Principles for Implementation

| Principle | Implication |
|-----------|-------------|
| **Incremental over big-bang** | Each phase produces a working, testable outcome. No phase depends on an unbuilt future phase. |
| **Validation before adoption** | Every new system is validated with real content before the old system is removed. |
| **Single source of truth** | Content lives in `src/content/` or the database — never both for the same data. |
| **Backward compatibility** | Existing features continue to work during and after migration. No regressions. |
| **Compiler-first** | The content compiler is the keystone of the runtime architecture. It must be built, tested, and stable before content migration begins. |
| **Prompt-test-repeat** | Prompts are code. They are versioned, tested against known inputs, and reviewed before release. |

---

## 2. Overall Dependency Map

```
Phase 2: Knowledge Base ✅
  (foundational research and reference material)
        │
        ▼
Phase 3: Runtime Content Architecture ✅
  (src/content/ structure, schemas, relationships)
        │
        ▼
Phase 4: Content Compiler ✅
  (validates, resolves, indexes content at build time)
        │
        ├──────────────────────────────────────┐
        ▼                                      ▼
Phase 5: AI Prompt Library           Phase 6: Journal Migration
  (prompts use knowledge +             (moves 6 articles into
   produce content for Phase 3)        the Phase 3 structure)
        │                                      │
        └──────────────────┬───────────────────┘
                           ▼
              Phase 7: Production Content
           (end-to-end workflow for new content)
```

### Why This Order Exists

1. **Knowledge before design.** You cannot design content types, write prompts, or create production content without understanding the craft, the customer, the psychology, and the competitive landscape. Phase 2 is the foundation of everything that follows.

2. **Content architecture before compiler.** The compiler compiles whatever structure exists in `src/content/`. The structure must be designed and documented first.

3. **Compiler before migration.** Migrating the 6 journal articles requires a stable compiler to validate the migrated content and generate the indexes the React app depends on.

4. **Compiler before prompts.** Prompts generate content files that must conform to the content schemas. The schemas must be finalized before prompts can target them reliably.

5. **Knowledge + compiler + content architecture before production.** Production content creation depends on the knowledge base (for strategic grounding), the content architecture (for structure), the compiler (for validation and indexing), and prompts (for generation).

---

## 3. Phase 2 — Knowledge Base

### 3.1 Purpose

The Knowledge Base is the permanent research infrastructure for House of Padmavati. It organizes every source of strategic, empirical, and domain knowledge that informs content decisions. It ensures that every AI session, every editorial brief, and every content review starts from the same body of knowledge — not from scratch.

### 3.2 Objectives

- Centralize all research into a consistent, cross-referenced directory
- Establish standards for citing sources, extracting principles, and connecting research to editorial decisions
- Enable Claude Opus and future AI collaborators to load relevant context from a single location
- Provide a versioned, maintained repository that survives team changes
- Cover every domain that influences HOP's content: psychology, craft, culture, UX, competitors, visual language

### 3.3 Architecture

The Knowledge Base lives at `docs/research/`. Every document is a flat Markdown file within a category subdirectory. Documents follow a standard frontmatter template and cross-reference each other through explicit `Related` sections.

```
docs/research/
├── README.md                           # Knowledge base index + usage guide
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
├── prompts/                            # Knowledge base dedicated to prompt architecture (Phase 5)
│   └── README.md                       # Placeholder — prompts will live here after Phase 5
│
└── future-research/                    # Topics identified for future investigation
    └── README.md                       # List of research gaps to be filled
```

### 3.4 Document Template

Every Knowledge Base document follows this structure:

```markdown
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

### Principle 2: {name}

...

## Application to HOP

{How this knowledge translates into specific content rules, frameworks, or guardrails}

## Sources

{List of sources with URLs where applicable — books, papers, articles, interviews}

## Cross-References

{Which other Knowledge Base documents connect to this one}
{Which editorial documents (brand bible, voice bible, vocabulary) use this knowledge}
```

### 3.5 Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Directory | `kebab-case` (single word or hyphenated) | `customer-research/`, not `Customer Research/` |
| File | `kebab-case.md` | `system-1-system-2.md` |
| Title within file | Sentence case | `System 1 and System 2` |
| Internal anchors | `## Title` (GitHub auto-generates anchors) | |

### 3.6 Frontmatter Standards

Every Knowledge Base document includes YAML frontmatter:

```yaml
---
title: System 1 and System 2
type: research
category: psychology
status: active
created: 2026-07-24
updated: 2026-07-24
owner: Editorial Lead
sources:
  - "Kahneman, D. (2011). Thinking, Fast and Slow."
  - "Citation 2"
tags:
  - behavioral-economics
  - dual-process
  - system-1
  - system-2
related:
  - docs/research/psychology/loss-aversion.md
  - docs/research/psychology/mental-accounting.md
  - docs/editorial/02-brand-architecture/editorial-principles.md
---
```

### 3.7 Cross-Linking Standards

- Every document includes a `Related` section at the bottom listing all connected Knowledge Base documents and editorial documents.
- Links are relative from `docs/` root: `docs/research/psychology/loss-aversion.md`
- When a principle is extracted from research and applied in an editorial document, the editorial document links back to the research.

### 3.8 Versioning

- Each document has `created` and `updated` dates in frontmatter.
- Significant content changes (new principles, corrected facts) update the `updated` date.
- The `status` field tracks: `active`, `needs-review`, `deprecated`, `archived`.
- Full history is preserved through Git — no in-document changelogs.

### 3.9 Citation Standards

| Source Type | Citation Format | Example |
|-------------|----------------|---------|
| Book | Author. (Year). *Title.* Publisher. | Kahneman, D. (2011). *Thinking, Fast and Slow.* Farrar, Straus and Giroux. |
| Academic paper | Author. (Year). "Title." *Journal,* Volume(Issue), Pages. | |
| Article/Web | Author. (Year). "Title." Publication. URL | |
| Internal research | Source. (Year). "Title." Internal document. | |
| Expert interview | Name, Title. (Date). Personal interview. | |

### 3.10 Review Workflow

1. **Create draft** — Write the document following the template standards.
2. **Peer review** — At least one other team member reviews for accuracy and clarity.
3. **Editorial review** — Editorial Lead checks alignment with brand voice and editorial principles.
4. **Publish** — Set `status: active`, merge to main.
5. **Scheduled review** — Every 6 months, the owner reviews for currency.

### 3.11 Maintenance Workflow

| Frequency | Action | Owner |
|-----------|--------|-------|
| Monthly | Check for broken cross-references | Editorial Lead |
| Quarterly | Review new research sources, add if relevant | Editorial Lead |
| Semi-annually | Full audit of all documents: update outdated content, deprecate irrelevant content | Editorial Lead + Founder |
| Per topic event | When a new competitor emerges, a new technique is learned, or a customer insight is validated | Anyone |

### 3.12 Acceptance Criteria

- [ ] All directories listed in 3.3 exist with a `README.md` or placeholder document
- [ ] Every document has complete frontmatter
- [ ] Every document follows the template structure
- [ ] Cross-references between related documents are populated
- [ ] Citation standards are applied correctly in every document
- [ ] Review workflow is documented in the Knowledge Base README
- [ ] A `future-research/README.md` identifies known gaps

### 3.13 Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Knowledge base becomes a graveyard — written once, never read | Medium | Integrate Knowledge Base reference into the content creation workflow. Every prompt template includes a "load relevant context from" step. |
| Documents are too academic, not actionable | High | Every principle must include an "Editorial implication" and "Example" section. If a document has no editorial implication, it does not belong in the Knowledge Base. |
| Cross-references become stale as files move | Low | Use relative paths from `docs/`. Renames are rare. A monthly link check script catches broken refs. |

### 3.14 Deliverables

- `docs/research/` directory with all category subdirectories
- Every document listed in 3.3, written to standard
- `docs/research/README.md` with index, usage guide, and review workflow
- `docs/research/future-research/README.md` with list of gaps

---

## 4. Phase 3 — Runtime Content Architecture

### 4.1 Purpose

The Runtime Content Architecture defines how content lives on disk, how it is structured, how it relates to other content, and how it is consumed by the React application. It is the bridge between the editorial system (docs/) and the runtime (React components consuming content).

### 4.2 Objectives

- Define the `src/content/` directory structure for all content types
- Define frontmatter schemas for every content type
- Define block types for rich body content
- Define relationship rules between content types (articles → products, collections → articles, etc.)
- Define image and video organization standards
- Define slug generation and UUID conventions
- Define SEO and metadata standards per content type
- Define how the React application will consume content (the content service contract)
- Define how the Studio will read from and write to the content system

### 4.3 Content Directory Structure

```
src/content/
├── _schemas/                          # JSON Schema or YAML schema files for validation
│   ├── journal.yaml
│   ├── collection.yaml
│   ├── product.yaml
│   ├── craft-note.yaml
│   ├── weaver-portrait.yaml
│   ├── field-note.yaml
│   ├── house-letter.yaml
│   ├── ritual-guide.yaml
│   └── glossary.yaml
│
├── journal/                           # Journal articles
│   ├── morning-light-reads-weave/
│   │   ├── index.md                   # Content + frontmatter
│   │   ├── hero.jpg                   # 1600×900, WebP primary + JPEG fallback
│   │   └── images/                    # In-body images
│   │       ├── 01-weaver-hands.jpg
│   │       └── 02-morning-light.jpg
│   ├── five-drapes-quiet-wedding/
│   │   └── ...
│   └── ...
│
├── collections/                      # Extended collection narratives
│   ├── kalyani/
│   │   ├── index.md
│   │   ├── hero.jpg
│   │   ├── film-poster.jpg
│   │   └── lookbook/
│   │       ├── 01-full-drape.jpg
│   │       ├── 02-detail-border.jpg
│   │       └── 03-environmental.jpg
│   ├── viara/
│   │   └── ...
│   └── ...
│
├── products/                         # Extended product stories
│   ├── {product-uuid}/
│   │   ├── index.md
│   │   └── images/
│   │       ├── 01-hero.jpg
│   │       ├── 02-detail-weave.jpg
│   │       └── 03-on-body.jpg
│   └── ...
│
├── craft-notes/                      # Educational content
│   ├── understanding-zari/
│   │   ├── index.md
│   │   └── images/
│   │       ├── 01-zari-spinning.jpg
│   │       └── 02-zari-compare.jpg
│   ├── the-ilkal-drape/
│   │   └── ...
│   └── ...
│
├── weaver-portraits/                 # Artisan stories
│   ├── gangamma-molakalmuru/
│   │   ├── index.md
│   │   └── portraits/
│   │       ├── 01-gangamma-at-loom.jpg
│   │       ├── 02-closeup-hands.jpg
│   │       └── 03-village-scene.jpg
│   └── ...
│
├── field-notes/                      # Travel/loom diaries
│   ├── a-day-in-molakalmuru/
│   │   ├── index.md
│   │   └── images/
│   │       ├── 01-road-to-village.jpg
│   │       └── 02-weaving-shed.jpg
│   └── ...
│
├── house-letters/                    # Brand manifestos
│   ├── why-we-dont-discount/
│   │   ├── index.md
│   │   └── hero.jpg
│   └── ...
│
├── ritual-guides/                    # Occasion and care guides
│   ├── how-to-drape-an-ilkal/
│   │   ├── index.md
│   │   └── images/
│   │       ├── 01-step-one.jpg
│   │       ├── 02-step-two.jpg
│   │       └── 03-step-three.jpg
│   └── ...
│
└── glossary/                        # A–Z textile terminology
    ├── index.md                     # Master glossary with all entries
    ├── zari.md                      # Individual entry (optional, can be single file)
    ├── pattu.md
    ├── ilkal.md
    └── ...
```

### 4.4 Content Unit Structure

Every content unit is a directory containing:

| File | Required | Purpose |
|------|----------|---------|
| `index.md` | Yes | Markdown body content with YAML frontmatter |
| `hero.jpg` | Yes (articles, collections, letters) | Hero/social sharing image, 1600×900 |
| `images/` | No | In-body images, named `01-{descriptive}.jpg`, `02-{descriptive}.jpg` |

### 4.5 Frontmatter Schemas by Content Type

#### Journal

```yaml
---
type: journal
title: "How morning light reads a weave."
slug: morning-light-reads-weave
published: 2025-06-12
updated: 2025-06-12
status: published          # draft | review | published | archive
author: "House of Padmavati"
tag: Light                 # Light | Drape | Linen | Weather | Ritual | House | Technique | Weaver | Place | Care | Occasion
dek: "On the soft hour between five and seven, when zari forgets to shine."
readingTime: 4             # integer minutes, generated by compiler but can be overridden
hero: ./hero.jpg
alt: "A saree draped by a window, morning light catching the zari"
seo:
  title: "How morning light reads a weave. — House of Padmavati"
  description: "On the soft hour between five and seven, when zari forgets to shine."
ogImage: ./hero.jpg
relatedProducts:            # UUIDs from products table
  - "a1b2c3d4-e5f6-..."
  - "b2c3d4e5-f6a7-..."
relatedArticles:            # Slugs of other journal articles
  - "five-drapes-quiet-wedding"
  - "linen-art-of-doing-less"
glossaryTerms:              # Slugs from glossary
  - zari
  - pattu
---
```

#### Collection (Extended Narrative)

```yaml
---
type: collection
name: "Kalyani"
slug: kalyani
status: published
tagline: "Wedding Elegance · Heritage Luxury"
hero: ./hero.jpg
filmPoster: ./film-poster.jpg
mood: "Warm gold and deep teal, the light of late afternoon before a winter ceremony."
occasion: "This collection belongs to weddings — the ones where the whole family gathers after years."
weaverNote: "Gangamma says this border is the one her grandmother taught her."
lookbook:
  - ./lookbook/01-full-drape.jpg
  - ./lookbook/02-detail-border.jpg
  - ./lookbook/03-environmental.jpg
seo:
  title: "Kalyani Collection — House of Padmavati"
  description: "Wedding Elegance · Heritage Luxury. The Kalyani collection belongs to winter weddings where the light fades by five."
relatedArticles:
  - "five-drapes-quiet-wedding"
relatedCraftNotes:
  - "understanding-zari"
---
```

#### Craft Note

```yaml
---
type: craft-note
title: "Understanding zari"
slug: understanding-zari
published: 2025-07-01
updated: 2025-07-01
status: published
author: "House of Padmavati"
tag: Technique              # Technique | Fabric | Weave | Dye | History
dek: "What zari is, how it is made, and why real zari behaves differently from imitation."
readingTime: 6
hero: ./hero.jpg
alt: "Close-up of hand-spun zari thread catching light"
collections:                # Collection slugs this craft note relates to
  - kalyani
  - viara
products:                   # Product UUIDs
  - "a1b2c3d4-e5f6-..."
glossaryTerms:
  - zari
seo:
  title: "Understanding zari — House of Padmavati"
  description: "What zari is, how it is made, and why real zari behaves differently from imitation."
---
```

#### Weaver Portrait

```yaml
---
type: weaver-portrait
title: "Gangamma of Molakalmuru"
slug: gangamma-molakalmuru
published: 2025-08-15
status: published
author: "House of Padmavati"
weaverName: "Gangamma"
generation: 4               # 4th generation weaver
location: "Molakalmuru, Karnataka"
technique: "Temple border weaving"
hero: ./portraits/01-gangamma-at-loom.jpg
alt: "Gangamma at her pit loom, morning light from the window behind her"
quote: "The border is the signature. Without it, the saree is a stranger."
portraits:
  - ./portraits/01-gangamma-at-loom.jpg
  - ./portraits/02-closeup-hands.jpg
  - ./portraits/03-village-scene.jpg
collections:
  - kalyani
products:
  - "a1b2c3d4-e5f6-..."
seo:
  title: "Gangamma of Molakalmuru — House of Padmavati"
  description: "A portrait of Gangamma, a fourth-generation temple border weaver from Molakalmuru, Karnataka."
---
```

#### Field Note

```yaml
---
type: field-note
title: "A day in Molakalmuru"
slug: a-day-in-molakalmuru
published: 2025-09-01
status: published
author: "House of Padmavati"
location: "Molakalmuru, Karnataka"
dateVisited: 2025-08-20
hero: ./images/01-road-to-village.jpg
alt: "The road to Molakalmuru at dawn"
collections:
  - kalyani
products:
  - "a1b2c3d4-e5f6-..."
seo:
  title: "A day in Molakalmuru — House of Padmavati"
  description: "Field notes from a visit to the weaving cluster of Molakalmuru, Karnataka."
---
```

#### House Letter

```yaml
---
type: house-letter
title: "Why we don't discount"
slug: why-we-dont-discount
published: 2025-10-01
status: published
occasion: "Brand Milestone"  # Seasonal | Milestone | Collection Launch | Annual
hero: ./hero.jpg
alt: "A saree folded in muslin, waiting"
signature: "— House of Padmavati"
seo:
  title: "Why we don't discount — House of Padmavati"
  description: "A letter on why House of Padmavati does not run sales, offer discounts, or create urgency."
---
```

#### Ritual Guide

```yaml
---
type: ritual-guide
title: "How to drape an Ilkal"
slug: how-to-drape-an-ilkal
published: 2025-11-01
status: published
occasion: "Daily"           # Wedding | Festival | Office | Daily | Gift
hero: ./images/01-step-one.jpg
alt: "Beginning the Ilkal drape — the tope-teni pallu positioned over the shoulder"
collections:
  - viara
products:
  - "a1b2c3d4-e5f6-..."
relatedArticles:
  - "the-ilkal-drape"
seo:
  title: "How to drape an Ilkal — House of Padmavati"
  description: "A gentle guide to draping the Ilkal saree, with its distinctive tope-teni pallu."
---
```

#### Glossary

```yaml
---
type: glossary
term: "Zari"
slug: zari
pronunciation: "/ˈzɑːri/"
category: "Material"        # Fabric | Weave | Technique | Tool | Tradition | Region
definition: "A metallic thread traditionally made of fine silver or gold wire wrapped around a silk core, used in Indian handloom weaving to create decorative patterns and borders."
extended: ""                # Optional deeper explanation (markdown)
relatedTerms:
  - pattu
  - molakalmuru
seeAlso:
  - "understanding-zari"    # Article slug
  - "kalyani"               # Collection slug
---
```

### 4.6 Body Block Types

Body content in `index.md` uses a block-based format with `---` delimiters:

```markdown
---
type: hero
image: ./hero.jpg
alt: "A saree draped by a window, morning light catching the zari"
caption: "Morning light in Pondicherry, 5:47 AM"
---

---
type: intro
---
The opening paragraph. Sets the scene, establishes mood, draws the reader in.
System 1: sensory, emotional, immediate.

---
type: body
---
The middle section. Can contain multiple body blocks with optional subheadings.
System 1 + System 2 alternating:
  - Sensory description of weave, colour, light
  - Craft detail or historical context
  - Human element (weaver, ritual, place)

---
type: pull-quote
quote: "A pull quote that crystallizes the article's soul."
attribution: "— House of Padmavati"
---

---
type: image
image: ./images/01-weaver-hands.jpg
alt: "A weaver's hands adjusting tension on the loom"
caption: "The weaver adjusts the tension twice an hour."
width: full                 # full | wide | narrow
---

---
type: system-2
title: "The Weave"          # Title for the accordion trigger
---
Logical, factual content for the careful buyer:
  - Weave specifications
  - Fabric composition
  - Origin details
  - Care instructions
These blocks feed the accordion UI on product and article pages.

---
type: closure
---
Closing paragraph. Returns to emotion. Leaves the reader with a quiet feeling.
System 1: resonance, longing, satisfaction.
```

**Block type registry:**

| Block Type | Required Fields | Used In | Renders As |
|------------|----------------|---------|------------|
| `hero` | `image`, `alt` | All types | Full-bleed hero image with caption |
| `intro` | Body text | Articles, Notes, Letters | Large leading paragraph |
| `body` | Body text | All types | Standard prose with optional subheadings |
| `pull-quote` | `quote` | All types | Centered, italic, serif |
| `image` | `image`, `alt` | All types | In-body image with caption |
| `video` | `src`, `poster` | Notes, Portraits | Embedded video player |
| `system-2` | `title`, body text | Products, Craft Notes | Accordion-triggered technical details |
| `related` | (auto-generated) | All types | Linked cards |
| `closure` | Body text | All types | Signature paragraph |
| `divider` | (none) | All types | Decorative `—` section break |
| `step` | `number`, body text | Ritual Guides | Numbered step |
| `gallery` | `images[]` | Portraits, Field Notes | Image grid |

### 4.7 Relationship Rules

| Relationship | Declared In | Resolved By | Validation |
|-------------|-------------|-------------|------------|
| Article → Products | `relatedProducts` (UUID array) | Compiler checks UUID exists in products table | Warning if UUID not found |
| Article → Articles | `relatedArticles` (slug array) | Compiler checks slug exists in journal/ | Error if slug not found |
| Article → Glossary | `glossaryTerms` (slug array) | Compiler checks slug exists in glossary/ | Warning if slug not found |
| Craft Note → Collections | `collections` (slug array) | Compiler checks slug exists in DB | Warning if slug not found |
| Craft Note → Products | `products` (UUID array) | Compiler checks UUID exists in products table | Warning if UUID not found |
| Weaver Portrait → Collections | `collections` (slug array) | Same as above | Warning |
| Weaver Portrait → Products | `products` (UUID array) | Same as above | Warning |
| Field Note → Collections | `collections` (slug array) | Same as above | Warning |
| Field Note → Products | `products` (UUID array) | Same as above | Warning |
| Ritual Guide → Collections | `collections` (slug array) | Same as above | Warning |
| Ritual Guide → Products | `products` (UUID array) | Same as above | Warning |

### 4.8 Slug Rules

- All slugs are kebab-case: lowercase letters, hyphens between words, no special characters
- Generated from the title by: lowercase → remove punctuation → replace spaces with hyphens → collapse consecutive hyphens → trim leading/trailing hyphens
- Slugs must be unique within their content type
- Slugs should be stable — changing a slug breaks links. Prefer to keep the slug and update the title.

### 4.9 UUID Strategy

- Products are identified by their database UUID (v4). This UUID appears in frontmatter `relatedProducts` fields.
- Collections are identified by their database slug. This is human-readable and stable.
- Content types (journal, craft-notes, etc.) are identified by their file-slug (derived from directory name).

### 4.10 Image Organization

| Image Type | Location | Naming | Format | Max Size |
|------------|----------|--------|--------|----------|
| Hero | `{content-unit}/hero.jpg` | `hero.jpg` | WebP + JPEG fallback | 1600×900, <200KB |
| In-body | `{content-unit}/images/` | `01-{descriptive}.jpg` | WebP + JPEG fallback | 1200px wide, <150KB |
| Lookbook | `{content-unit}/lookbook/` | `01-{descriptive}.jpg` | WebP + JPEG fallback | 2000px wide, <300KB |
| Portrait | `{content-unit}/portraits/` | `01-{descriptive}.jpg` | WebP + JPEG fallback | 2000px wide, <300KB |

All images require `alt` text in the frontmatter or block that references them.

### 4.11 Video Organization

- Collection films live in Supabase Storage (`HOP-films` bucket)
- Videos are referenced by URL in the collection's database record (`hero_video_url`)
- The hardcoded map in `src/data/collectionVideos.ts` will be replaced by direct DB queries in a future sprint
- Content articles reference videos via the `video` block type with a `src` URL

### 4.12 SEO and Metadata

Every content unit generates:

- `<title>` — from frontmatter `seo.title`
- `<meta name="description">` — from frontmatter `seo.description`
- `<meta property="og:title">` — same as title
- `<meta property="og:description">` — same as description
- `<meta property="og:image">` — from frontmatter `ogImage` or `hero`
- `<meta property="og:type">` — `article` for journal, `website` for others
- `<link rel="canonical">` — `https://houseofpadmavati.com/{type}/{slug}`
- JSON-LD structured data — appropriate schema per type: `Article`, `Product`, `BreadcrumbList`, `CollectionPage`

### 4.13 Content Service Contract (React Consumption)

The React application consumes content through a service that exports typed functions:

```typescript
// src/services/contentService.ts

// Journal
getJournalArticles(): Promise<JournalArticle[]>
getJournalArticle(slug: string): Promise<JournalArticle | null>

// Collections (extends DB data with extended narrative)
getCollectionNarrative(slug: string): Promise<CollectionNarrative | null>

// Products (extends DB data with extended story)
getProductStory(productId: string): Promise<ProductStory | null>

// Craft Notes
getCraftNotes(): Promise<CraftNote[]>
getCraftNote(slug: string): Promise<CraftNote | null>

// Weaver Portraits
getWeaverPortraits(): Promise<WeaverPortrait[]>
getWeaverPortrait(slug: string): Promise<WeaverPortrait | null>

// Field Notes
getFieldNotes(): Promise<FieldNote[]>
getFieldNote(slug: string): Promise<FieldNote | null>

// House Letters
getHouseLetters(): Promise<HouseLetter[]>
getHouseLetter(slug: string): Promise<HouseLetter | null>

// Ritual Guides
getRitualGuides(): Promise<RitualGuide[]>
getRitualGuide(slug: string): Promise<RitualGuide | null>

// Glossary
getGlossaryEntries(): Promise<GlossaryEntry[]>
getGlossaryEntry(slug: string): Promise<GlossaryEntry | null>

// Related Content (returns unified related items for any content unit)
getRelatedContent(type: string, slug: string): Promise<RelatedContent[]>

// Content Index (flat list of all content for search and sitemap)
getContentIndex(): Promise<ContentIndexEntry[]>
```

All service functions import from generated content index files (see Phase 4).

### 4.14 Studio Integration

The Studio will interact with the content system in two modes:

1. **Read mode** — Journal, craft notes, and other editorial content are displayed in the Studio for reference. The Studio reads from the compiled content index, same as the storefront.

2. **Write mode** — Product and collection editorial content (story, sensory_story, etc.) is edited through the Studio forms and stored in the database. The `src/content/products/` and `src/content/collections/` extended narratives are managed as markdown files (outside the Studio, committed via Git).

Long-term, the Studio may gain the ability to edit markdown content directly. Phase 3 does not require this.

### 4.15 Implementation Order Within Phase 3

1. Create `src/content/` directory structure (all type folders + `_schemas/`)
2. Write schema YAML files for all content types
3. Create one example content unit per type (with placeholder body content)
4. Write the content service TypeScript interfaces
5. Verify the structure is valid and navigable by the compiler (Phase 4)
6. Write `src/content/README.md` explaining the structure

### 4.16 Acceptance Criteria

- [ ] All content type directories exist under `src/content/`
- [ ] Every content type has a schema file at `src/content/_schemas/{type}.yaml`
- [ ] At least one example content unit exists per type
- [ ] Slug generation rules are documented
- [ ] Image naming and organization rules are documented
- [ ] The content service TypeScript interfaces are defined and type-checked
- [ ] Relationship rules between content types are documented
- [ ] SEO metadata rules are documented per content type

---

## 5. Phase 4 — Content Compiler ✅

**Status:** Complete (July 2026)

### 5.1 Purpose

The Content Compiler is a Node.js script that reads the `src/content/` directory tree, validates every content unit against its schema, resolves relationships, generates typed TypeScript index files, copies assets to the public directory, and produces any auxiliary files (sitemap entries, search index, relationship graph). It runs as part of the build pipeline and as a standalone command for development.

### 5.2 Objectives

- Validate all content units against their frontmatter schemas at build time
- Generate typed TypeScript files that the React app can import directly
- Resolve relationship references (relatedProducts, relatedArticles, etc.) with error reporting
- Calculate reading time for every content unit
- Generate a search index (title, dek, tags, slug, type)
- Generate a relationship graph for related content widgets
- Copy hero images to `public/content/{type}/{slug}/hero.jpg`
- Generate sitemap entries for all published content
- Report validation errors, warnings, and reference integrity issues
- Support incremental builds (only recompile changed content)
- Fail the build on hard errors (missing required fields, broken internal links)

### 5.3 Architecture

```
Input:                                   Output:
src/content/                             src/data/__generated__/
├── journal/                             ├── journal.ts
│   ├── my-article/                      ├── collections.ts
│   │   ├── index.md                     ├── craft-notes.ts
│   │   └── hero.jpg                     ├── glossary.ts
│   └── ...                              ├── content-index.ts
├── collections/                         ├── relationship-graph.ts
├── products/                            └── search-index.ts
├── craft-notes/
├── weaver-portraits/                    public/content/
├── field-notes/                         └── {type}/{slug}/
├── house-letters/                           └── hero.jpg
├── ritual-guides/
└── glossary/
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                    Content Compiler                          │
│                                                              │
│  1. Walk src/content/ tree                                   │
│  2. For each index.md:                                       │
│     a. Parse YAML frontmatter                                │
│     b. Validate against schema (ajv or similar)              │
│     c. Parse body blocks (--- delimited)                     │
│     d. Resolve relationships (lookup UUIDs, slugs)           │
│     e. Calculate reading time                                │
│     f. Generate typed TS export                              │
│     g. Copy hero images to public/                           │
│  3. Generate content-index.ts (all content, flat)            │
│  4. Generate search-index.ts (title, dek, tags, type)        │
│  5. Generate relationship-graph.ts (for related widgets)     │
│  6. Report: errors, warnings, summary                        │
│  7. Exit code 1 on hard errors                               │
└──────────────────────────────────────────────────────────────┘
```

### 5.4 Inputs

- `src/content/` — the entire content tree
- `src/content/_schemas/` — YAML schema files for validation
- Environment variables (none required — paths are relative)

### 5.5 Outputs

All generated files land in `src/data/__generated__/` (gitignored):

| Output File | Contents | Used By |
|-------------|----------|---------|
| `journal.ts` | Typed array of all published journal articles with full body blocks | `contentService.ts`, `Journal.tsx`, `JournalDetail.tsx` |
| `collections.ts` | Typed array of collection narratives keyed by slug | `contentService.ts`, collection page extended content |
| `products.ts` | Typed array of extended product stories keyed by UUID | `contentService.ts` |
| `craft-notes.ts` | Typed array of craft notes | `contentService.ts` |
| `weaver-portraits.ts` | Typed array of weaver portraits | `contentService.ts` |
| `field-notes.ts` | Typed array of field notes | `contentService.ts` |
| `house-letters.ts` | Typed array of house letters | `contentService.ts` |
| `ritual-guides.ts` | Typed array of ritual guides | `contentService.ts` |
| `glossary.ts` | Typed array of glossary entries, keyed by slug | `contentService.ts` |
| `content-index.ts` | Unified flat array of all content: `{ type, slug, title, dek, published, tags }` | `contentService.getContentIndex()`, sitemap generation |
| `relationship-graph.ts` | Map of `{ contentId → { relatedProducts, relatedArticles, relatedCraftNotes, ... }}` | Related content widgets |
| `search-index.ts` | Lightweight array of `{ type, slug, title, dek, tags, body }` for client-side search | Search feature |

### 5.6 Validation Rules

| Rule | Severity | Breaks Build? |
|------|----------|---------------|
| Missing required frontmatter field | Error | Yes |
| Invalid enum value (tag, type, status) | Error | Yes |
| Broken internal slug reference (relatedArticles) | Error | Yes |
| Broken UUID reference (relatedProducts) | Warning | No |
| Missing hero image when required | Error | Yes |
| Missing alt text on image | Warning | No |
| Empty body blocks | Warning | No |
| Duplicate slug within content type | Error | Yes |
| Invalid date format | Error | Yes |
| SEO title > 70 characters | Warning | No |
| SEO description > 160 characters | Warning | No |

### 5.7 Reading Time Calculation

```
words = countWords(body)
readingTime = max(1, Math.ceil(words / 200))
```

200 words per minute is the standard for editorial content. The result is an integer stored in the frontmatter. If the frontmatter provides an explicit `readingTime`, it overrides the calculation.

### 5.8 Slug Generation

Same logic as documented in 4.8 — provided as a shared utility function used by both the compiler and any content creation tooling.

### 5.9 Related Content Resolution

For each content unit, the compiler:

1. Reads `relatedProducts` → looks up each UUID in the product service (DB query or cached index)
2. Reads `relatedArticles` → looks up each slug in the compiled journal index
3. Reads `glossaryTerms` → looks up each slug in the compiled glossary index
4. Reads `collections` → looks up each slug in the DB collections index
5. Generates a bidirectional relationship graph: if A references B, then B's related section includes A

The relationship graph is written to `relationship-graph.ts` for runtime use by the related content widgets.

### 5.10 Image Optimization

The compiler copies hero images to `public/content/{type}/{slug}/hero.jpg`. Production image optimization (WebP conversion, responsive sizes) is handled by the build tool (Vite) or a separate image pipeline — the compiler does not transform images.

### 5.11 Error Handling

| Scenario | Behavior |
|----------|----------|
| Valid content | Success — file is included in output |
| Schema validation error | Error message with file path, field name, and expected value. Build fails. |
| Broken slug reference | Error message: "Related article 'missing-slug' not found" in file X. Build fails. |
| Missing hero image | Error message. Build fails. |
| Missing in-body image | Error message. Build fails. |
| Broken UUID reference | Warning message only. Build succeeds. |
| Empty content directory | Warning. Empty array is generated for that type. |

### 5.12 Incremental Builds

The compiler uses file modification timestamps to determine which content units have changed. Only changed units are recompiled. The `content-index.ts`, `relationship-graph.ts`, and `search-index.ts` are always regenerated because they aggregate across all content.

Implementation approach: store a hash manifest at `src/data/__generated__/.manifest.json` mapping each content unit path to its file hash. On each run, compare current hashes to the manifest. Only recompile units whose hash has changed.

### 5.13 Performance Considerations

- `src/content/` is expected to remain small (< 500 content units even at scale)
- Full compilation of 100 content units should complete in < 2 seconds
- Incremental compilation of 1 changed unit should complete in < 200ms
- The compiler is not run in the browser — it is a build-time tool only

### 5.14 Testing

| Test | Scope | Method |
|------|-------|--------|
| Schema validation | Unit | Feed valid and invalid frontmatter, verify error reporting |
| Slug generation | Unit | Feed titles, verify output matches expected slug |
| Reading time | Unit | Feed known word counts, verify calculated time |
| Relationship resolution | Integration | Set up 3 content units with cross-references, verify graph |
| Image copying | Integration | Verify hero image lands at correct public/ path |
| Incremental build | Integration | Change one file, verify only that file is recompiled |
| Full build | Integration | Run on a content directory with all types, verify all outputs |

### 5.15 Future Extensibility

| Future Need | How the Compiler Supports It |
|-------------|------------------------------|
| Multi-language content | Add `locale` to frontmatter. Compiler groups content by `(slug, locale)` pair. |
| Content scheduling | Add `scheduled` date to frontmatter. Compiler filters content with future dates from published output. |
| Custom block types | Block type registry is extensible — add a new type to the block parser and a React component renders it. |
| CMS sync | The compiler remains the compilation engine. A sync script pulls from the CMS into `src/content/`, then the compiler runs as before. |

### 5.16 Acceptance Criteria

- [x] `npm run content:build` runs the compiler and exits with code 0 on valid content
- [x] `npm run content:build` exits with code 1 and reports specific errors on invalid content
- [x] All output files listed in 5.5 are generated in `src/data/__generated__/`
- [x] Reading time is calculated and included in content exports (journal, craft-notes)
- [x] Relationship graph contains forward references
- [x] Hero images are copied to `public/content/{type}/{slug}/hero.jpg`
- [x] Error messages include file path, field name, and expected value
- [x] Incremental builds only recompile changed content (MD5 hash manifest)
- [x] Full build of 11 content units completes in 40ms
- [x] TypeScript compiles without errors (`tsc --noEmit` passes)

---

## 6. Phase 5 — AI Prompt Library

### 6.1 Purpose

The AI Prompt Library is a versioned, tested, and maintained collection of prompt templates. Every prompt is designed to produce content that conforms to the Editorial Operating System — the correct content type schema, voice dimensions, vocabulary rules, and editorial framework. Prompts are the interface between strategic intent (what we want to say) and AI execution (how Claude Opus writes it).

### 6.2 Objectives

- Define a standard prompt template with reusable sections
- Create prompts for every content type (generate, review, critique, rewrite)
- Create prompts for SEO metadata, microcopy, and emails
- Version prompts so changes are tracked and testable
- Provide example outputs for every prompt so quality is measurable
- Establish a prompt review and maintenance lifecycle

### 6.3 Prompt Directory Structure

```
docs/research/prompts/
├── README.md                           # Prompt library index + usage guide
├── _prompt-template.md                 # Base template every prompt follows
│
├── generate/                           # Content generation prompts
│   ├── homepage-hero-v1.md
│   ├── collection-narrative-v1.md
│   ├── product-story-v1.md
│   ├── journal-article-v1.md
│   ├── craft-note-v1.md
│   ├── weaver-portrait-v1.md
│   ├── house-letter-v1.md
│   ├── ritual-guide-v1.md
│   ├── field-note-v1.md
│   └── glossary-definition-v1.md
│
├── seo/                                # Metadata generation prompts
│   ├── meta-title-v1.md
│   ├── meta-description-v1.md
│   ├── og-image-alt-v1.md
│   └── json-ld-v1.md
│
├── microcopy/                          # Microcopy prompts
│   ├── cta-v1.md
│   ├── error-state-v1.md
│   ├── empty-state-v1.md
│   ├── checkout-label-v1.md
│   └── toast-notification-v1.md
│
├── email/                              # Email copy prompts
│   ├── welcome-v1.md
│   ├── order-confirmation-v1.md
│   ├── dispatch-notification-v1.md
│   ├── delivery-confirmation-v1.md
│   └── journal-notification-v1.md
│
├── policies/                           # Policy copy prompts
│   ├── shipping-policy-v1.md
│   ├── returns-policy-v1.md
│   ├── privacy-policy-v1.md
│   └── terms-of-service-v1.md
│
├── review/                             # Content review prompts
│   ├── consistency-check-v1.md
│   ├── sensory-density-check-v1.md
│   ├── forbidden-words-check-v1.md
│   ├── system-2-presence-check-v1.md
│   ├── accessibility-check-v1.md
│   ├── seo-check-v1.md
│   └── grammar-check-v1.md
│
├── critique/                           # Content critique prompts
│   ├── narrative-pacing-v1.md
│   ├── emotional-resonance-v1.md
│   ├── brand-voice-fidelity-v1.md
│   └── structural-flow-v1.md
│
├── rewrite/                            # Content rewrite prompts
│   ├── for-voice-v1.md
│   ├── for-page-type-v1.md
│   ├── for-email-v1.md
│   ├── for-social-v1.md
│   ├── for-accessibility-v1.md
│   └── simplify-v1.md
│
├── translation/                        # Translation prompts
│   ├── translate-to-kannada-v1.md
│   └── translate-to-hindi-v1.md
│
└── examples/                           # Example prompt outputs
    ├── homepage-hero-example-v1.md
    ├── collection-narrative-example-v1.md
    ├── product-story-example-v1.md
    ├── journal-article-example-v1.md
    └── craft-note-example-v1.md
```

### 6.4 Prompt Template

Every prompt follows this exact structure:

```markdown
# PROMPT: {Name}
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: {generate | seo | microcopy | email | policies | review | critique | rewrite | translation}
# CONTENT TYPE: {journal | collection | product | craft-note | ...}

## Description

{2-3 sentences explaining what this prompt does and when to use it}

## Context Requirements

{Which Knowledge Base documents must be loaded before running this prompt}
{Which editorial system documents must be referenced}

## Strategic Principles

{Which playbook principles apply to this content}
{Which messaging pillars are primary}

## Brand Constraints

- {Tone matrix dimensions for this content type}
- {Forbidden words to avoid}
- {Voice dimensions to emphasize}

## Content Schema

{The frontmatter schema this prompt must populate}
{The body block sequence it must follow}

## Input

{What the user provides — collection name, product UUID, article brief, etc.}

## Output Format

{Full output structure with placeholders}
{Frontmatter as YAML}
{Body blocks as markdown}

## Example Output

{Link to example file in docs/research/prompts/examples/}

## Review Criteria

- {Check 1: sensory density target}
- {Check 2: forbidden words}
- {Check 3: System 1 + System 2 balance}
- {Check 4: schema completeness}
- {Check 5: voice matrix alignment}
```

### 6.5 Prompt Versioning

| Convention | Rule |
|------------|------|
| Version numbering | `v1`, `v2`, `v3` — incremented on any change to the prompt body |
| File naming | `{name}-{version}.md` — `product-story-v2.md` |
| Version history | Previous versions are not deleted. They are moved to a `_archive/` subdirectory. |
| Version reference | Every generated output records the prompt version used to create it in a comment |
| Breaking changes | A version increment is required for: schema change, tone matrix change, new forbidden words, structural output change |

### 6.6 Prompt Testing

| Test | Method | Pass Criteria |
|------|--------|---------------|
| Schema completeness | Run prompt against known input, verify output has all required frontmatter fields | All fields present |
| Voice adherence | Run output through the review prompts (consistency-check, forbidden-words-check) | Zero violations |
| Sensory density target | Count sensory words per 100 words | Meets target for content type |
| Reading level | Automated readability score | Matches target for page type |
| Forbidden word presence | grep against output | Zero matches |
| Review prompt reliability | Feed known-good and known-bad content to review prompts | Correctly identifies issues |

### 6.7 Prompt Review and Lifecycle

| Stage | Action | Owner |
|-------|--------|-------|
| **Create** | Write prompt using template, include example output | Editorial Lead |
| **Test** | Run against 3 different inputs, verify all outputs | Editorial Lead |
| **Review** | Editor checks for strategic alignment and schema accuracy | Editor-in-Chief |
| **Release** | Set status to active, merge to main | Editorial Lead |
| **Use** | Reference prompt from content brief, record version used | Content creators |
| **Review (quarterly)** | Check prompts against current vocabulary and voice docs, update if needed | Editorial Lead |
| **Deprecate** | Move to `_archive/` when superseded or no longer needed | Editorial Lead |

### 6.8 Prompt Categories

#### Generation (10 prompts)

Generate new content from a brief. These are the primary prompts used in the production workflow.

| Prompt | Produces | Input |
|--------|----------|-------|
| `homepage-hero-v1` | Hero tagline + subtitle | Collection name, mood keywords |
| `collection-narrative-v1` | Full collection story (intro, body, mood, occasion) | Collection name, slug, weave details, weaver info |
| `product-story-v1` | Sensory product description + System 2 accordion | Product name, fabric, weave, colour, price tier |
| `journal-article-v1` | Full journal article with body blocks | Title, tag, dek, brief, related content references |
| `craft-note-v1` | Educational explainer | Technique name, brief description |
| `weaver-portrait-v1` | Artisan story | Weaver name, location, generation, technique, interview notes |
| `house-letter-v1` | Brand letter | Occasion, key message, tone direction |
| `ritual-guide-v1` | Occasion guide | Occasion type, collection, target audience |
| `field-note-v1` | Travelogue | Location, date, observations, photos |
| `glossary-definition-v1` | Term definition | Term, category, brief |

#### SEO (4 prompts)

Generate or optimize metadata.

| Prompt | Produces | Input |
|--------|----------|-------|
| `meta-title-v1` | SEO title | Content type, primary keyword, title |
| `meta-description-v1` | SEO description | Content body or summary |
| `og-image-alt-v1` | Alt text for OG image | Image description, content context |
| `json-ld-v1` | JSON-LD structured data | Content type, all metadata |

#### Microcopy (5 prompts)

Generate UI copy for specific components.

| Prompt | Produces | Input |
|--------|----------|-------|
| `cta-v1` | CTA text | Page, action, tone direction |
| `error-state-v1` | Error message | Component, error type, context |
| `empty-state-v1` | Empty state text | Component, context |
| `checkout-label-v1` | Form label | Field, context |
| `toast-notification-v1` | Toast message | Action, item name, context |

#### Email (5 prompts)

Generate email copy.

| Prompt | Produces | Input |
|--------|----------|-------|
| `welcome-v1` | Welcome email | Subscriber context |
| `order-confirmation-v1` | Order confirmation email | Order details, product names |
| `dispatch-notification-v1` | Dispatch notification | Tracking info, product names |
| `delivery-confirmation-v1` | Delivery confirmation | Order details |
| `journal-notification-v1` | Journal notification | Article title, dek, slug |

#### Policies (4 prompts)

Generate policy copy in brand voice.

| Prompt | Produces | Input |
|--------|----------|-------|
| `shipping-policy-v1` | Shipping policy | Shipping details |
| `returns-policy-v1` | Returns policy | Return window, conditions |
| `privacy-policy-v1` | Privacy policy | Data collection details |
| `terms-of-service-v1` | Terms of service | Business terms |

#### Review (7 prompts)

Review existing content for specific criteria.

| Prompt | Checks For | Pass/Fail |
|--------|------------|-----------|
| `consistency-check-v1` | Brand voice, vocabulary, tone matrix alignment | Score 1-5 per dimension |
| `sensory-density-check-v1` | Adequate sensory language | Count per 100 words, pass/fail per type target |
| `forbidden-words-check-v1` | Any forbidden word present | List of violations |
| `system-2-presence-check-v1` | System 2 trust signals present | Boolean per required element |
| `accessibility-check-v1` | Alt text, reading level, semantic structure | Pass/fail per criterion |
| `seo-check-v1` | Title length, description length, OG image, JSON-LD | Pass/fail per criterion |
| `grammar-check-v1` | Grammar, punctuation, Indian English | List of violations |

#### Critique (4 prompts)

Evaluate content quality holistically.

| Prompt | Evaluates | Output |
|--------|-----------|--------|
| `narrative-pacing-v1` | Flow, rhythm, reader engagement | Score + specific feedback |
| `emotional-resonance-v1` | Emotional impact, connection | Score + specific feedback |
| `brand-voice-fidelity-v1` | How closely the content matches HOP voice | Score + specific feedback |
| `structural-flow-v1` | Content schema adherence, block sequence | Score + specific feedback |

#### Rewrite (6 prompts)

Transform existing content for different contexts.

| Prompt | Transforms | From → To |
|--------|------------|-----------|
| `for-voice-v1` | Any text | Original → HOP voice |
| `for-page-type-v1` | Content | One page type → another page type |
| `for-email-v1` | Copy | Web → email format |
| `for-social-v1` | Copy | Web → social media caption |
| `for-accessibility-v1` | Text | Original → accessible (simpler language, alt text) |
| `simplify-v1` | Text | Complex → simple reading level |

#### Translation (2 prompts)

Translate content while preserving brand voice.

| Prompt | Language | Preserves |
|--------|----------|-----------|
| `translate-to-kannada-v1` | Kannada | Tone, sensory density, reading level equivalent |
| `translate-to-hindi-v1` | Hindi | Same |

### 6.9 Future Prompt Strategy

| Need | Approach |
|------|----------|
| New content type | Create generate prompt + review prompt + example output |
| Voice system update | Update all affected prompts to v2. Archive v1. |
| New forbidden word | Add to all generation prompts. Update review prompts. |
| New AI model | Test all prompts against new model. Compare outputs. Update prompts if needed. |
| Automated prompt testing | Create a test runner that feeds standardized inputs to all prompts and checks outputs against schemas. |

### 6.10 Acceptance Criteria

- [ ] `docs/research/prompts/` directory exists with all category subdirectories
- [ ] `_prompt-template.md` defines the standard structure
- [ ] Every prompt listed in 6.8 exists at version v1
- [ ] Every prompt has a corresponding `examples/` file at version v1
- [ ] Review prompts demonstrably catch violations in known-bad content
- [ ] Prompt testing methodology is documented in the README
- [ ] Prompt versioning conventions are documented

---

## 7. Phase 6 — Journal Migration

### 7.1 Purpose

Migrate the six hardcoded journal articles from `src/data/journalArticles.ts` into the new runtime content architecture (`src/content/journal/`). This is the first real validation of both the content architecture (Phase 3) and the content compiler (Phase 4).

### 7.2 Current State

```typescript
// src/data/journalArticles.ts (current — 6 stubs)
export interface JournalArticle {
  slug: string;
  title: string;
  tag: string;
  img: string;
  dek: string;
}
```

The articles have no body content, no body blocks, no related content, no glossary references, no SEO metadata beyond what is hardcoded in the pages.

### 7.3 Target State

```
src/content/journal/
├── morning-light-reads-weave/
│   ├── index.md              # Full frontmatter + body blocks + System 2
│   └── hero.jpg
├── five-drapes-quiet-wedding/
│   ├── index.md
│   └── hero.jpg
├── linen-art-of-doing-less/
│   ├── index.md
│   └── hero.jpg
├── organza-in-the-rain/
│   ├── index.md
│   └── hero.jpg
├── keepsake-card-jasmine/
│   ├── index.md
│   └── hero.jpg
└── padmavati-name-behind-house/
    ├── index.md
    └── hero.jpg
```

### 7.4 Migration Strategy

1. **Preserve existing slugs.** Every migrated article keeps its current slug. This preserves existing URLs, search engine rankings, and any external links.

2. **Preserve existing SEO metadata.** The current `useMetadata` calls in the Journal and JournalDetail pages are preserved until the migration is verified. The generated metadata from the new system replaces them only after validation.

3. **Preserve existing asset references.** Images currently imported from `src/assets/` are copied into each content unit's directory as the hero image.

4. **Add body content.** Each article receives full body content written using the Journal content schema and The Essay narrative framework. This is new content creation (the current articles have no body).

5. **Add related content references.** Each article receives `relatedProducts`, `relatedArticles`, and `glossaryTerms` as appropriate.

6. **Add SEO metadata.** Each article receives `seo.title`, `seo.description`, and `ogImage` in frontmatter.

7. **Image migration.** Article images move from `src/assets/` to `src/content/journal/{slug}/hero.jpg`. Import paths in components are updated accordingly.

### 7.5 Content Mapping

| Current Slug | Preserved? | New Body Content Needed? | Image Source | Related Products? |
|-------------|------------|--------------------------|--------------|-------------------|
| `morning-light-reads-weave` | Yes | Yes | `src/assets/hop-fabric.jpg` | At discretion |
| `five-drapes-quiet-wedding` | Yes | Yes | `src/assets/hop-collection-pattu.jpg` | Yes (wedding collections) |
| `linen-art-of-doing-less` | Yes | Yes | `src/assets/hop-collection-linen.jpg` | Yes (linen products) |
| `organza-in-the-rain` | Yes | Yes | `src/assets/hop-collection-organza.jpg` | Yes (organza products) |
| `keepsake-card-jasmine` | Yes | Yes | `src/assets/hop-gift.jpg` | At discretion |
| `padmavati-name-behind-house` | Yes | Yes | `src/assets/hop-hero.jpg` | At discretion |

### 7.6 Slug Preservation

The current slugs are generated by a `slugify()` function in `journalArticles.ts`. Each slug must be verified to match the target slug in the new content unit's directory name. If there is a discrepancy, the existing slug wins (to preserve URLs).

Current slugs:
- `how-morning-light-reads-a-weave` → `morning-light-reads-weave` (from slugify)
- `five-drapes-for-a-quiet-wedding` → `five-drapes-quiet-wedding`
- `linen-and-the-art-of-doing-less` → `linen-art-of-doing-less`
- `organza-in-the-rain` → `organza-in-the-rain`
- `a-keepsake-card-printed-in-jasmine` → `keepsake-card-jasmine`
- `padmavati-the-name-behind-the-house` → `padmavati-name-behind-house`

### 7.7 SEO Preservation

During migration:
1. The existing `JournalDetail.tsx` page reads from both sources — the hardcoded array (for backward compatibility) and the new content service (when available)
2. `useMetadata` continues to use the hardcoded fallback until the content service is verified
3. After verification, `JournalDetail.tsx` switches entirely to the content service
4. The hardcoded `src/data/journalArticles.ts` is removed

### 7.8 Internal Links

- Journal index → article links use `/journal/{slug}` — unchanged
- Cross-article links within migrated articles use the same pattern
- Any links to journal articles from other pages (homepage preview, related content) use the same pattern
- No redirects are needed because slugs are preserved

### 7.9 Redirects

No redirects are required. Slugs are preserved. URLs do not change.

### 7.10 Validation

After migration:

1. `/journal` loads all 6 articles from the content service — matches the current list
2. `/journal/{slug}` for each of 6 slugs loads the full article with body content
3. Metadata (title, description, OG image) matches or improves on the current implementation
4. JSON-LD structured data is present and valid for each article
5. Images render correctly
6. Related content links work (if populated)
7. Reading time is displayed (new feature)
8. Tags are displayed correctly

### 7.11 Testing

| Test | Method | Pass Criteria |
|------|--------|---------------|
| Journal index | Load `/journal`, count articles | 6 articles, same slugs as before |
| Journal detail | Load each `/journal/{slug}` | Article renders with body content |
| Metadata | Inspect `<title>` and `<meta>` tags | Correct per article |
| JSON-LD | Validate with Schema.org validator | Valid Article schema |
| Image rendering | Visual check | Hero image loads, alt text present |
| Backward compatibility | Load old URLs | No 404s, same slugs work |
| Build | `npm run build` | Succeeds with no errors |

### 7.12 Rollback Strategy

If the migration causes issues:

1. Revert `src/content/journal/` to previous commit
2. Revert `Journal.tsx` and `JournalDetail.tsx` to use `src/data/journalArticles.ts`
3. Revert any content service changes
4. The site returns to its pre-migration state with zero downtime

The hardcoded `src/data/journalArticles.ts` is not deleted until the new system has been verified in production for at least one week.

### 7.13 Acceptance Criteria

- [ ] All 6 articles exist in `src/content/journal/` with full frontmatter and body content
- [ ] Slugs match the existing hardcoded slugs
- [ ] `/journal` loads all 6 articles from the content service
- [ ] `/journal/{slug}` for each article renders full body content
- [ ] Metadata is correct per article
- [ ] JSON-LD is valid per article
- [ ] Images render with alt text
- [ ] Reading time is displayed
- [ ] `src/data/journalArticles.ts` is removed (after 1 week production verification)
- [ ] Build succeeds with zero errors
- [ ] Rollback procedure is documented and tested

---

## 8. Phase 7 — Production Content

### 8.1 Purpose

Define the end-to-end workflow for creating, reviewing, publishing, and maintaining content in the Editorial Operating System. This phase does not create content — it defines the process by which all future content is created.

### 8.2 Production Workflow

```
RESEARCH
  │
  ▼
BRIEF
  │
  ▼
PROMPT SELECTION
  │
  ▼
CLAUDE GENERATION
  │
  ▼
HUMAN REVIEW
  │
  ▼
QA
  │
  ▼
REVISION
  │
  ▼
APPROVAL
  │
  ▼
PUBLISHING
  │
  ▼
MAINTENANCE
```

### 8.3 Stage Details

#### Research

| Action | Owner | Duration | Output |
|--------|-------|----------|--------|
| Gather relevant Knowledge Base documents | Editorial Lead | 30 min | List of docs to load into AI context |
| Gather reference content (competitor examples, inspiration) | Editorial Lead | 30 min | Reference links |
| Identify related products, collections, and existing content | Editorial Lead | 15 min | List of UUIDs and slugs |
| Load context into AI session | AI | 5 min | Context window populated |

**Deliverable:** A brief document containing:
- Content type and target slug
- List of Knowledge Base documents to load
- List of related entities (products, collections, articles)
- Any specific strategic direction (pillar to emphasize, emotion to target)

#### Brief

| Action | Owner | Duration | Output |
|--------|-------|----------|--------|
| Write content brief using standard template | Editorial Lead | 30 min | Brief document |
| Submit brief for approval (if major piece) | Editor-in-Chief | 15 min | Approved brief |

**Brief template:**

```markdown
## Content Brief

**Type:** {journal | craft-note | weaver-portrait | ...}
**Slug:** {proposed slug}
**Title:** {working title}
**Tag:** {controlled vocabulary tag}
**Strategic pillar:** {primary pillar from messaging-pillars.md}
**Target emotion:** {primary emotion from emotional-journey.md}
**Tone matrix:** {formality, warmth, sensory density, technical depth — per voice-bible.md}

## Context

{What this piece is about, why it matters now, what it should achieve}

## Related Entities

- Products: {UUIDs}
- Collections: {slugs}
- Articles: {slugs}
- Glossary: {terms}

## Additional Direction

{Any specific requests, reference content, or constraints}

## Prompt

{prompt name and version to use}
```

#### Prompt Selection

| Action | Owner | Duration | Output |
|--------|-------|----------|--------|
| Select generation prompt from library | Editorial Lead | 5 min | Prompt name + version |
| Select review prompts for post-generation QA | Editorial Lead | 5 min | Prompt names + versions |

**Rule:** The generation prompt and review prompts are specified in the brief before generation begins. This prevents selecting review prompts that match the flaws in a generated output.

#### Claude Generation

| Action | Owner | Duration | Output |
|--------|-------|----------|--------|
| Load context (brief + Knowledge Base docs + reference content) | AI | Automated | Context window populated |
| Execute generation prompt | AI | 2-10 min | Draft content file |
| Self-review against the brief | AI | Automated | Confirmation or request for clarification |

**Output:** A complete content unit `index.md` with frontmatter and body blocks, ready for human review.

#### Human Review

| Action | Owner | Duration | Output |
|--------|-------|----------|--------|
| Read the generated content | Editorial Lead | 15 min per 1000 words | Notes |
| Check against the brief — does it deliver what was requested? | Editorial Lead | 5 min | Yes/No |
| Check voice — does it sound like HOP? | Editorial Lead | 10 min | Notes |
| Check vocabulary — any forbidden words? | Editorial Lead + review prompts | 5 min | List of violations |
| Check technical accuracy — are the craft details correct? | Craft Advisor | 10 min | Corrections |
| Check sensory density — does it meet the target? | Editorial Lead + review prompt | 5 min | Score |

**Deliverable:** Reviewed content with revision notes.

#### QA

| Action | Owner | Duration | Output |
|--------|-------|----------|--------|
| Run automated review prompts (consistency, forbidden words, sensory density, SEO, grammar) | AI | 2 min | Scorecard |
| Compile all review feedback | Editorial Lead | 10 min | Consolidated revision list |
| Triage: critical (must fix), important (should fix), nice-to-have (optional) | Editorial Lead | 5 min | Prioritized list |

#### Revision

| Action | Owner | Duration | Output |
|--------|-------|----------|--------|
| Apply critical fixes | Editorial Lead or AI (via rewrite prompt) | 30 min | Revision 1 |
| Apply important fixes | Editorial Lead or AI | 30 min | Revision 2 |
| Apply nice-to-have fixes | Editorial Lead | 15 min | Revision 3 |
| Re-run review prompts on revised content | AI | 2 min | Updated scorecard |

**Rule:** After revision, the content must pass all critical checks. If it does not, another revision cycle begins.

#### Approval

| Action | Owner | Duration | Output |
|--------|-------|----------|--------|
| Final read of revised content | Editorial Lead | 10 min | Sign-off or additional revision request |
| Final approval (for major pieces: journal, house letter, collection narrative) | Editor-in-Chief | 10 min | Sign-off |
| Set `status: published` in frontmatter | Editorial Lead | 1 min | Ready for publishing |

#### Publishing

| Action | Owner | Duration | Output |
|--------|-------|----------|--------|
| Create content directory in `src/content/{type}/{slug}/` | Editorial Lead or Dev | 5 min | Directory with index.md + images |
| Run content compiler | Dev or CI | 10 sec | Generated indexes |
| Verify on staging | Editorial Lead | 10 min | Visual verification |
| Merge to main | Dev or Editorial Lead | 2 min | Production deploy |
| Verify on production | Editorial Lead | 10 min | Visual verification |
| Update related content references if needed | Editorial Lead | 5 min | Updated frontmatter |

#### Maintenance

| Action | Owner | Frequency | Output |
|--------|-------|-----------|--------|
| Check for broken internal links | Editorial Lead + script | Monthly | List of broken refs |
| Update `updated` date if content is refreshed | Editorial Lead | As needed | Updated frontmatter |
| Archive outdated content (set `status: archive`) | Editorial Lead | As needed | Archived content |
| Full content audit | Editorial Lead + Founder | Quarterly | Audit report |
| Plan editorial calendar | Editorial Lead + Founder | Quarterly | Calendar for next 3 months |

### 8.4 Content Refresh Workflow

When refreshing existing content (not creating new):

1. **Evaluate** — Is the content outdated? Incorrect? Underperforming?
2. **Brief** — Define what needs to change and why
3. **Generate** — Use the rewrite-for-voice or rewrite-for-page-type prompt
4. **Review** — Same review process as new content
5. **Publish** — Update the `updated` date in frontmatter, merge

### 8.5 Analytics Integration (Future)

When analytics are available, the maintenance workflow includes:

- Identify content with low engagement (short reading time, high bounce rate)
- Identify content with high engagement (long reading time, many related-content clicks)
- Use high-engagement patterns to inform future content briefs
- Refresh or replace low-engagement content

### 8.6 Acceptance Criteria

- [ ] Production workflow is documented and understandable by a new team member
- [ ] The workflow covers all content types
- [ ] Brief template is defined and usable
- [ ] Review criteria are measurable (not subjective)
- [ ] The approval chain is clear for each content type
- [ ] The publishing process is defined (who does what, step by step)
- [ ] The maintenance schedule is defined

---

## 9. Risks

### 9.1 Technical Risks

| Risk | Phase | Likelihood | Impact | Mitigation |
|------|-------|------------|--------|------------|
| Content compiler becomes too complex to maintain | Phase 4 | Medium | High | Keep compiler simple — markdown parser + frontmatter validator. Do not add AST transforms, custom syntax, or complex data transformations. Reject feature creep. |
| Build time degrades as content grows | Phase 4 | Low | Medium | Incremental builds limit recompilation to changed files. Full build of 100 units should take < 2 seconds. If it exceeds 5 seconds, optimize. |
| Image repository size grows unbounded | Phase 3 | Medium | Medium | Git LFS for content images. Establish max image dimensions and file sizes. Regular cleanup of unused assets. |
| Relationship graph becomes stale when content is deleted | Phase 4 | Low | Medium | The compiler regenerates the full graph on every build. Deleted content is automatically removed. |
| Frontmatter validation misses edge cases | Phase 4 | Medium | Medium | Test with edge cases: empty optional fields, very long strings, special characters, Unicode. |

### 9.2 Editorial Risks

| Risk | Phase | Likelihood | Impact | Mitigation |
|------|-------|------------|--------|------------|
| AI-generated content feels generic despite prompts | Phase 5, 7 | Medium | High | The review and critique prompts are designed to catch generic language. Sensory density check identifies insufficient specificity. The rewrite-for-voice prompt can transform generic content. |
| Prompts fall out of sync with voice/vocabulary updates | Phase 5 | Medium | High | Add prompt review to the quarterly editorial audit. When the voice bible or vocabulary system is updated, all prompts must be reviewed. |
| Writers bypass the framework for speed | Phase 7 | Medium | Medium | Make the framework the path of least resistance. The content generator script scaffolds the correct structure. A brief is faster to write than a full article from scratch. |
| Content briefs become repetitive or formulaic | Phase 7 | Medium | Low | The brief template is a starting point, not a cage. Briefs can (and should) include creative direction. The editorial calendar ensures variety across content types. |

### 9.3 Organizational Risks

| Risk | Phase | Likelihood | Impact | Mitigation |
|------|-------|------------|--------|------------|
| No dedicated editorial lead | All | Medium | Critical | The Editorial Operating System requires a human owner. Without one, the system will not be maintained. Document the role explicitly. |
| Knowledge base is created but never read | Phase 2 | High | Medium | Integrate Knowledge Base loading into the content creation workflow. The brief template requires the creator to list which KB docs were loaded. |
| Governance feels bureaucratic for small pieces | Phase 7 | Medium | Medium | Define different workflows for different content types. A microcopy prompt needs a lighter review than a journal article. |

### 9.4 AI Risks

| Risk | Phase | Likelihood | Impact | Mitigation |
|------|-------|------------|--------|------------|
| AI model changes affect output quality | Phase 5 | Medium | High | Version prompts. Test against known inputs after model updates. Compare outputs. Pin model versions where possible. |
| AI hallucinates craft or cultural details | Phase 5, 7 | High | Critical | The Craft Advisor reviews all technical content. Prompts include "do not fabricate" instructions and source requirements. Factual claims must be traceable. |
| Long prompts exceed context window | Phase 5 | Medium | Medium | Keep prompt inputs focused. Load Knowledge Base documents separately as context. The prompt itself should be instruction, not encyclopedia. |

### 9.5 Performance Risks

| Risk | Phase | Likelihood | Impact | Mitigation |
|------|-------|------------|--------|------------|
| Generated content index is too large for the React bundle | Phase 4 | Low | Medium | Generated files are TypeScript, tree-shaken by Vite. The content index is a flat array — small by design. If it grows beyond 500KB, implement lazy loading by content type. |
| Hero images slow page load | Phase 3 | Medium | Medium | Images are optimized at source (max 200KB for hero). Vite handles WebP conversion. The content service lazy-loads below-the-fold content. |

### 9.6 SEO Risks

| Risk | Phase | Likelihood | Impact | Mitigation |
|------|-------|------------|--------|------------|
| Migration changes existing URLs | Phase 6 | Low | Critical | Slugs are preserved during migration. Redirects are not needed. Verify every URL before and after. |
| Content quality drop during migration | Phase 6 | Medium | High | The hardcoded array is not removed until the new system has been verified in production for one week. Rollback is a single commit revert. |
| Duplicate content from dual systems during transition | Phase 6 | Low | Medium | The transition is a cutover — either the old system or the new system serves a given page. Not both. |

### 9.7 Maintenance Risks

| Risk | Phase | Likelihood | Impact | Mitigation |
|------|-------|------------|--------|------------|
| No one owns content maintenance | Phase 7 | High | High | Define the Editorial Lead role explicitly in Phase 1 governance documents. Assign a named owner. |
| Quarterly content audit slips | Phase 7 | High | Medium | The audit is lightweight (check links, update dates, identify gaps). A 2-hour quarterly commitment. Calendar it. |
| Broken cross-references accumulate | Phase 2, 3 | Medium | Medium | The compiler validates all cross-references on every build. Broken refs are caught immediately, not accumulated. |

---

## 10. Milestones

### 10.1 Milestone Table

| # | Milestone | Phase | Deliverables | Dependencies | Estimated Effort | Review Checkpoint |
|---|-----------|-------|-------------|--------------|------------------|-------------------|
| M1 | Knowledge Base structure created | Phase 2 | `docs/research/` directory with all subdirectories, README with usage guide | None | 2 days | All category directories exist. README documents the structure and workflow. |
| M2 | Psychology research documented | Phase 2 | 6 psychology documents (system 1/2, mental accounting, loss aversion, costly signaling, choice architecture, endowment effect) | M1 | 3 days | All documents follow the template. Each has editorial implications. |
| M3 | Competitor research documented | Phase 2 | 7 competitor documents (Sabyasachi, Raw Mango, Aesop, Loro Piana, The Row, Kinfolk, Cereal) | M1 | 3 days | Each document has actionable editorial takeaways. |
| M4 | Craft + Culture research documented | Phase 2 | 6 craft documents + 4 culture documents | M1 | 4 days | Technical accuracy verified by Craft Advisor. |
| M5 | Customer + UX research documented | Phase 2 | 5 customer documents + 4 UX documents | M1 | 3 days | Personas are specific and differentiated. UX findings are actionable. |
| M6 | Visual + Design language documented | Phase 2 | 3 photography/video documents + 3 design language documents | M1 | 2 days | Photography direction is specific enough for a photographer to execute. |
| M7 | Knowledge Base review cycle established | Phase 2 | Review workflow, maintenance schedule, cross-reference links populated | M2-M6 | 1 day | Cross-references exist in all documents. Review dates are set. |
| M8 | Runtime content structure created | Phase 3 | `src/content/` with all type directories, schema files, example content units | None | 3 days | All directories and schemas exist. CI validates structure. |
| M9 | Content schemas documented (frontmatter + blocks) | Phase 3 | Schema YAML files for all 9 content types. Block type registry documented. | M8 | 2 days | Each schema includes all fields, types, required/optional, and validation rules. |
| M10 | Content service interfaces defined | Phase 3 | TypeScript interfaces and service function signatures | M8 | 1 day | TypeScript compiles without errors. |
| M11 ✅ | Content compiler built | Phase 4 | Node.js script, `npm run content:build`, all outputs listed in 5.5 | M8, M9 | 5 days | Full build of 11 content units in 40ms. All validations work. |
| M12 ✅ | Compiler incremental build + testing | Phase 4 | Incremental build logic (MD5 hash manifest) | M11 | 2 days | Incremental build of 11 unchanged units in 14ms. Manifest stores hashes. |
| M13 | Generation prompts created (10 prompts) | Phase 5 | `docs/research/prompts/generate/` with all 10 prompts + example outputs | M2-M6 | 5 days | Every prompt produces valid content for its schema. Example outputs exist. |
| M14 | Review prompts created (7 prompts) | Phase 5 | `docs/research/prompts/review/` with all 7 prompts | M13 | 3 days | Review prompts correctly identify known-good and known-bad content. |
| M15 | SEO + Microcopy + Email + Policy prompts | Phase 5 | All remaining prompts (18 total) with examples | M13 | 5 days | All prompts produce valid output per their schema. |
| M16 | Critique + Rewrite + Translation prompts | Phase 5 | All 12 prompts with examples | M13 | 3 days | Rewrite prompts transform content correctly. Translation prompts preserve voice. |
| M17 | Journal content written (6 articles) | Phase 6 | 6 complete journal content units in `src/content/journal/` | M11, M13 | 5 days | Every article has full body content, frontmatter, SEO metadata, related refs. |
| M18 | Journal migration deployed | Phase 6 | Journal pages use content service, hardcoded array replaced | M17, M10 | 1 day | All 6 articles render correctly in production. 1 week stability verification. |
| M19 | Hardcoded array removed | Phase 6 | `src/data/journalArticles.ts` deleted | M18 (1 week) | < 1 day | No references to the old file remain in the codebase. |
| M20 | Production workflow documented | Phase 7 | Workflow document covering all 10 stages (Research → Maintenance) | M13-M16 | 2 days | A new team member can follow the workflow to produce content independently. |
| M21 | Content maintenance schedule established | Phase 7 | Monthly, quarterly, and annual maintenance tasks defined and calendared | M20 | 1 day | Calendar events exist for all recurring maintenance tasks. |

### 10.2 Estimated Total Effort

| Phase | Estimated Effort (person-days) |
|-------|-------------------------------|
| Phase 2 — Knowledge Base | 18 |
| Phase 3 — Runtime Content Architecture | 6 |
| Phase 4 — Content Compiler ✅ | 7 |
| Phase 5 — AI Prompt Library | 16 |
| Phase 6 — Journal Migration | 6 |
| Phase 7 — Production Content | 3 |
| **Total** | **56** |

### 10.3 Review Checkpoints

| Checkpoint | When | Who | What |
|------------|------|-----|------|
| CP1 | After M7 (Knowledge Base complete) | Founder + Editorial Lead | Review all research docs. Verify completeness. Identify gaps. |
| CP2 | After M9 (Content schemas complete) | Editorial Lead + Dev | Review all schemas. Verify they match the editorial frameworks. |
| CP3 | After M12 (Compiler complete) | Dev + Editorial Lead | Compiler test suite passes. Full build succeeds. |
| CP4 | After M16 (All prompts complete) | Editorial Lead + Founder | Spot-check prompts by generating sample content. Review outputs. |
| CP5 | After M18 (Journal migration deployed) | All | Verify all 6 articles in production. Confirm no regressions. |
| CP6 | After M21 (Full system operational) | All | Full system review. Identify any gaps. Plan next phase. |

---

## 11. Definition of Done

### 11.1 Phase Completion Criteria

| Phase | Done When |
|-------|-----------|
| **Phase 2 — Knowledge Base** | All documents listed in 3.3 exist, follow the template, have complete frontmatter, and cross-references are populated. The README documents usage and maintenance workflows. |
| **Phase 3 — Runtime Content Architecture** | `src/content/` exists with all type directories and schema files. TypeScript interfaces for the content service are defined and compile. An example content unit exists per type. |
| **Phase 4 — Content Compiler** ✅ | `npm run content:build` validates content, generates all index files, copies assets, and exits with appropriate code. Incremental builds work. TypeScript compiles. |
| **Phase 5 — AI Prompt Library** | All prompts listed in 6.8 exist at v1 in the correct directory. Each has an example output. The prompt template is documented. Testing methodology is documented. |
| **Phase 6 — Journal Migration** | All 6 articles exist in `src/content/journal/` with full content. The content service serves them. `src/data/journalArticles.ts` is removed (after 1 week production verification). |
| **Phase 7 — Production Content** | The production workflow is documented. The content maintenance schedule is defined and calendared. The first content unit has been created end-to-end through the new workflow. |

### 11.2 Content Unit Definition of Done

A single content unit is done when:

- [ ] `src/content/{type}/{slug}/index.md` exists with complete frontmatter and body blocks
- [ ] All required frontmatter fields are populated
- [ ] Body blocks follow the correct sequence for the content type's framework
- [ ] Hero image exists at `{content-unit}/hero.jpg` with alt text
- [ ] All in-body images exist with alt text
- [ ] Related content references point to existing entities
- [ ] SEO metadata is present and within character limits
- [ ] The content compiler validates the unit without errors
- [ ] The unit renders correctly in the staging environment
- [ ] A human reviewer has approved the content

### 11.3 System Definition of Done

The entire Editorial Operating System is done when:

- [ ] All 7 phases are complete and accepted
- [ ] Content can be created end-to-end: brief → generate → review → publish
- [ ] The content compiler runs as part of the build pipeline
- [ ] AI prompts are available for all content types
- [ ] The knowledge base is populated and cross-referenced
- [ ] Journal articles are migrated and serving from the new system
- [ ] The production workflow is documented and usable by a new team member
- [ ] Maintenance schedules are established and calendared

---

## 12. Final Recommendation

### 12.1 Implementation Order

The phases should be implemented in strict dependency order:

```
Phase 2 (Knowledge Base)
  → Phase 3 (Runtime Content Architecture)
    → Phase 4 (Content Compiler)
      → Phase 5 (AI Prompt Library)
        → Phase 6 (Journal Migration)
          → Phase 7 (Production Content)
```

### 12.2 Parallelization Opportunities

Within phases, some work can proceed in parallel:

| Phase | Parallel Workstreams |
|-------|---------------------|
| Phase 2 | Psychology (M2), Competitors (M3), Craft+Culture (M4), Customer+UX (M5), Visual Language (M6) — can be written simultaneously by different authors |
| Phase 3 | Content structure (M8) and schemas (M9) must be sequential. Service interfaces (M10) can be parallel with schemas |
| Phase 4 | Compiler build (M11) and incremental builds (M12) are sequential |
| Phase 5 | Generation prompts (M13) must come first. Review (M14) and remaining (M15) can be parallel with each other after M13. Critique + Rewrite + Translation (M16) can be parallel with M15 |
| Phase 6 | Content writing (M17) can begin as soon as Phase 3 and 4 are stable. Deployment (M18) and cleanup (M19) are sequential |
| Phase 7 | Workflow documentation (M20) and maintenance schedule (M21) can be parallel |

### 12.3 Key Recommendation

**Build the content compiler (Phase 4) as early as possible after Phase 3 is stable.** The compiler is the keystone of the entire runtime system. Without it:
- Content cannot be validated
- Content cannot be indexed
- Content cannot be consumed by the React app
- Journal cannot be migrated
- Production workflow cannot begin

A working compiler with even one content type validated is more valuable than a full Phase 2 with a hundred research documents. Prioritize the compiler.

### 12.4 First Action

The next step after this plan is approved is to implement Phase 2 — the Knowledge Base. Begin by creating the `docs/research/` directory structure and writing the psychology documents (System 1/System 2, mental accounting, loss aversion), which are the strategic foundation for all subsequent work.

---

**This document is the canonical implementation blueprint. All future implementation work must reference this plan. Changes to the plan require approval from the Editorial Lead and must be documented as amendments.**

**Version:** 1.0
**Last updated:** July 2026
**Status:** Approved
**Owner:** Editorial Lead
**Review cycle:** Quarterly (or when any phase is completed)
