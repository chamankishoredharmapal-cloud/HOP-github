# Phase 7 — Editorial Content Production Manual

**Version:** 1.0
**Status:** Active
**Phase:** 7 — Production Content Creation
**Owner:** Editorial Lead + Claude Code
**Classification:** Internal — House of Padmavati

---

## Table of Contents

1. Introduction & Context
2. Operating Principles
3. Phase 7 Execution Order
4. Page Production Specifications
5. Production Pipeline (Operational)
6. Standard Templates
7. Claude Operating Instructions
8. Progress Tracking Dashboard
9. Quality Gates
10. Git Workflow
11. Continuous Improvement
12. Self-Review

---

## 1. Introduction & Context

### 1.1 What Phase 7 Is

Phase 7 is the execution phase. All architecture, governance, intelligence, and knowledge systems have been built. Phase 7 does not design new systems. Phase 7 produces content.

The systems available to Phase 7:

| System | Location | Purpose |
|--------|----------|---------|
| Editorial Operating System (EOS) | `docs/editorial/README.md` | Brand, voice, vocabulary, emotional architecture, page strategy |
| Editorial Intelligence System (EIS) | `docs/editorial/EDITORIAL_INTELLIGENCE_SYSTEM.md` | Reasoning frameworks, cognition, narrative design, language architecture, revision, scoring |
| Editorial Production System (EPS) | `docs/editorial/EDITORIAL_PRODUCTION_SYSTEM.md` | 12-stage production pipeline, quality gates, templates, approval |
| Knowledge Base | `docs/research/` | 50+ research documents across 13 categories |
| AI Writing Operating System | `docs/editorial/prompts/` | System prompts, writing prompts, editing prompts, review prompts, templates |
| Runtime Content Architecture | `src/content/README.md` | Content types, schemas, block types, image standards |
| Content Compiler | `scripts/compile-content.js` | Validates content, resolves relationships, generates TypeScript indexes |
| Brand System | `docs/BRAND_SYSTEM.md` | Visual identity, colour palette, typography |
| Brand Architecture | `docs/editorial/02-brand-architecture/` | Brand bible, voice bible, messaging pillars, editorial principles |
| Vocabulary System | `docs/editorial/04-vocabulary-system/` | Approved words, forbidden words, preferred verbs, grammar |
| Emotional Architecture | `docs/editorial/07-emotional-architecture/` | Emotional journey, page emotion map |

### 1.2 What This Manual Is

This manual is the single source of truth for all Phase 7 editorial production work. It is designed to be referenced continuously by Claude Code throughout the entire phase.

### 1.3 What This Manual Is Not

- Not a writing guide
- Not a rewrite of the EOS, EIS, or EPS
- Not website copy
- Not a prompt library

### 1.4 How To Use This Manual

```
1. Start a work session → Read §7 (Claude Operating Instructions)
2. Determine next page → Read §3 (Execution Order) + §8 (Progress Dashboard)
3. Load page specification → Read §4 (Page Production Specs) for the page type
4. Execute production pipeline → Read §5 (Production Pipeline)
5. Use templates → Read §6 (Standard Templates)
6. Check quality gates → Read §9 (Quality Gates)
7. Prepare for Git → Read §10 (Git Workflow)
8. Learn from experience → Read §11 (Continuous Improvement)
```

---

## 2. Operating Principles

Every page produced in Phase 7 follows these principles:

### 2.1 Production Principles

| Principle | Rule |
|-----------|------|
| **Research first** | No page is written until all required research is gathered |
| **Strategy before execution** | No page is written without an approved editorial brief |
| **Narrative before prose** | No page is written without a narrative plan |
| **Revision before approval** | Every page passes AI self-review before human review |
| **Gates are mandatory** | No page advances past an unpassed gate |
| **Evidence over claims** | Every claim traces to a verifiable source |
| **Quality over speed** | No deadline justifies skipping a quality gate |
| **Consistency over creativity** | Follow the templates. Innovate within them, not around them |

### 2.2 Content Principles (from EOS)

- Show, Don't Tell
- Specific Over Generic
- Rooted in the Real
- Restrained
- Human-Scale
- Trust Through Transparency

### 2.3 First Principles (from EIS)

- Truth before persuasion
- Meaning before wording
- Narrative before sentences
- Thinking before prompting
- Observation before adjectives
- Specificity before abstraction
- Restraint before embellishment
- Implication before explanation
- Memory before information
- Emotion through evidence
- Luxury through confidence
- Culture through authenticity

---

## 3. Phase 7 Execution Order

### 3.1 Rationale

The execution order is designed to build content from foundation to integration. Each page type is written after its reference dependencies exist.

**Dependency rule:** A page should not be written until every page it references (via link, relationship, or content inclusion) has been written.

**Priority rule:** Pages that establish brand identity and narrative patterns are written first. Utility pages are written last.

### 3.2 Execution Order

```
Phase 1: Foundation (Pages 1-4)
   Establishes brand voice, brand story, and content patterns

Phase 2: Core Commerce (Pages 5-8)
   Builds the commercial content layer

Phase 3: Content Marketing (Pages 9-11)
   Creates supporting editorial content

Phase 4: Integration & Utility (Pages 12-16)
   Completes the experience with utility and marketing content

Phase 5: Quality & Polish (Pages 17-20)
   Final audit and optimization across all pages
```

#### Phase 1: Foundation (Pages 1-4)

| Order | Page Type | Rationale | Dependencies |
|-------|-----------|-----------|--------------|
| 1 | **About** | Establishes HOP's voice, story, identity, and trust narrative. All other pages reference the brand story established here | None |
| 2 | **Collection Landing** | Establishes collection taxonomy and narrative framing. Homepage references this | About |
| 3 | **Collection Detail (first)** | Establishes product grouping narrative. Product Detail references this | Collection Landing |
| 4 | **Product Detail (first 3-5)** | Establishes product narrative template. Most complex content type. Craft and Weaver stories reference products | Collection Detail |

#### Phase 2: Core Commerce (Pages 5-8)

| Order | Page Type | Rationale | Dependencies |
|-------|-----------|-----------|--------------|
| 5 | **Craft Story (first 2)** | Educational content that supports product narratives. Establishes craft voice | Product Detail |
| 6 | **Weaver Story (first 2)** | Human narratives that build trust and connection. Establishes portrait narrative template | Product Detail |
| 7 | **Homepage** | Integrates all content types. Written after products, craft, and weaver content exist to reference | About, Collections, Products, Craft, Weaver |
| 8 | **Collection Detail (remaining)** | Apply established pattern to remaining collections | Collection Landing, Product Detail |

#### Phase 3: Content Marketing (Pages 9-11)

| Order | Page Type | Rationale | Dependencies |
|-------|-----------|-----------|--------------|
| 9 | **Product Detail (remaining)** | Batch remaining products using established template | Collection Detail |
| 10 | **Craft Story (remaining)** | Complete craft content | Product Detail |
| 11 | **Weaver Story (remaining)** | Complete weaver content | Product Detail |

#### Phase 4: Integration & Utility (Pages 12-16)

| Order | Page Type | Rationale | Dependencies |
|-------|-----------|-----------|--------------|
| 12 | **Journal Article (first 3-5)** | Content marketing. References products, craft, weaver stories | Products, Craft, Weaver |
| 13 | **FAQ** | Utility page. Answers questions raised by all previous content | All above |
| 14 | **Policies** | Legal content. Independent of creative content | None |
| 15 | **Email Templates** | Marketing communications. References products and journal | Products, Journal |
| 16 | **Campaign (first)** | Seasonal/featured content. References products, collections | Products, Collections |

#### Phase 5: Quality & Polish (Pages 17-20)

| Order | Page Type | Rationale | Dependencies |
|-------|-----------|-----------|--------------|
| 17 | **Lookbook** | Visual content. References products, collections | Products, Collections |
| 18 | **Landing Pages** | Campaign-specific. Last creative content type | Products, Collections |
| 19 | **SEO Metadata Pass** | Audit and optimize metadata across all pages | All pages published |
| 20 | **Final Editorial Audit** | Comprehensive quality pass across all published content | All pages published |

### 3.3 Page Sequencing Within a Batch

For pages within the same type (e.g., multiple Product Details):

1. Start with the most representative / most complex example
2. Establish the template with the first page
3. Subsequent pages follow the template with content-type-specific variations
4. Each page is completed (through all quality gates) before the next begins

### 3.4 Progress State Definitions

| State | Meaning |
|-------|---------|
| **Not Started** | Page has not been begun |
| **In Research** | Knowledge gathering in progress |
| **In Planning** | Editorial brief + narrative plan in progress |
| **In Drafting** | Content being written |
| **In Review** | AI self-review + human review in progress |
| **In Approval** | Final approval pending |
| **Completed** | Published and post-publication review initiated |
| **Blocked** | Waiting on dependency (another page, SME, approval) |

---

## 4. Page Production Specifications

Each section below defines the complete production specification for a page type. These specifications are templates that apply to every instance of that page type.

---

### 4.1 About Page

| Field | Specification |
|-------|---------------|
| **Purpose** | Tell the HOP origin story. Establish trust, identity, and emotional connection. Make the reader feel she has discovered something authentic |
| **Business Goal** | Convert first-time visitors into brand-aware prospects. Build enough trust to browse products |
| **Reader** | Culturally curious woman, 28-45, discovering HOP for first time. May be Indian diaspora or non-Indian luxury shopper |
| **Reader Intent** | "Who are these people and why should I trust them?" |
| **Customer Journey Stage** | Arrival → Curiosity |
| **Brand Goal** | Establish HOP as a cultural custodian, not a commercial brand |
| **Primary Emotion** | Wonder (at the craft, the women, the tradition) |
| **Secondary Emotion** | Trust (earned through specificity and transparency) |
| **Knowledge Sources** | Brand Bible, Voice Bible, Messaging Pillars, Editorial Principles, Emotional Principles, Weaver research, Craft research |
| **Required EOS Documents** | `brand-bible.md`, `voice-bible.md`, `messaging-pillars.md`, `editorial-principles.md`, `emotional-principles.md`, `emotional-journey.md` |
| **Required EIS Layers** | L1 (Brand Truth), L2 (Anthropology), L3 (Psychology), L4 (Strategy), L5 (Knowledge), L6 (Narrative), L7 (Cognition), L8 (Language) |
| **Narrative Arc** | Portrait arc — the brand revealed through accumulated detail |
| **Scene Structure** | 1. The woman (Padmavati / the weavers) → 2. The place (Molakalmuru / the loom) → 3. The philosophy (Coastal Blossom) → 4. The promise (what HOP guarantees) → 5. The invitation (CTA to collections) |
| **Tone Register** | Sensory (scenes 1-2), Reflective (scene 3), Trust (scene 4), Resolution (scene 5) |
| **Writing Deliverables** | `src/content/house-letters/about-hou/index.md` with body blocks: hero, intro, body (3-5 scenes), closure |
| **SEO Deliverables** | Title ≤ 70 chars, Description ≤ 160 chars, alt text on all images |
| **Accessibility Deliverables** | Grade 7-9 reading level, heading hierarchy, descriptive link text |
| **Review Deliverables** | 12-pass Revision Report (Stage 6), Editorial Review (Stage 7) |
| **Quality Gates** | All 8 gates must pass |
| **Definition of Done** | Content unit passes compiler validation, renders on staging, approved by Editorial Lead + Editor-in-Chief |
| **Approval Requirements** | Editorial Lead + Editor-in-Chief |
| **Git Requirements** | Single commit per content unit. Commit message: `content(about): add About page` |

---

### 4.2 Homepage

| Field | Specification |
|-------|---------------|
| **Purpose** | Create immediate emotional connection. Show what HOP is through what HOP makes |
| **Business Goal** | Drive browsing to collections, products, and journal. Minimize bounce rate |
| **Reader** | First-time or returning visitor. Both need different content on the same page |
| **Reader Intent** | "What is this place? What can I find here?" |
| **Customer Journey Stage** | Arrival (first-time) / Belonging (returning) |
| **Brand Goal** | Demonstrate Quiet Luxury through content, not claims |
| **Primary Emotion** | Wonder (the beauty of the craft) |
| **Secondary Emotion** | Quiet Confidence (this is a brand that knows itself) |
| **Knowledge Sources** | All collections, featured products, journal articles, brand philosophy |
| **Required EOS Documents** | `brand-bible.md`, `voice-bible.md`, `emotional-journey.md`, `page-emotion-map.md`, `page-strategy/README.md` |
| **Required EIS Layers** | L1-L8 (full pipeline) |
| **Narrative Arc** | Journey arc — the reader moves through HOP's world |
| **Scene Structure** | 1. Hero (single powerful image + tagline) → 2. Collections (explore by collection) → 3. Craft (what makes HOP different) → 4. Heirlooms (generational framing) → 5. Journal (latest thinking) → 6. Closure (invitation) |
| **Tone Register** | Sensory (hero, craft), Reflective (heirlooms), Trust (collections), Resolution (closure) |
| **Writing Deliverables** | Homepage content: hero tagline, collection section headlines, craft section, heirloom section, journal section. Content structured for React component consumption (not a single markdown file — requires component-level copy) |
| **Special Note** | The Homepage is NOT a single content unit in `src/content/`. It is a page composed from multiple data sources (collections, products, journal). Deliver copy for each section as structured text files |
| **SEO Deliverables** | Meta title, meta description, structured data (Organization schema) |
| **Accessibility Deliverables** | Alt text for hero and all images, heading hierarchy (h1 = tagline only), descriptive link text |
| **Review Deliverables** | 12-pass Revision Report (Stage 6), Editorial Review (Stage 7), Brand Lead review |
| **Quality Gates** | All 8 gates. Gate 6 requires Brand Lead approval |
| **Definition of Done** | All sections written, approved, and ready for React integration |
| **Approval Requirements** | Editorial Lead + Editor-in-Chief |
| **Git Requirements** | Single commit per deliverable. Commit message: `content(homepage): add homepage content` |

---

### 4.3 Collection Landing

| Field | Specification |
|-------|---------------|
| **Purpose** | Show the breadth of HOP's collections. Help the reader choose where to explore |
| **Business Goal** | Drive browsing to individual collection detail pages |
| **Reader** | Browser who knows what she is looking for or is exploring |
| **Reader Intent** | "What collections does HOP offer?" |
| **Customer Journey Stage** | Curiosity → Wonder |
| **Brand Goal** | Show HOP's range and depth without overwhelming |
| **Primary Emotion** | Curiosity |
| **Secondary Emotion** | Anticipation |
| **Knowledge Sources** | Collection data, emotional architecture |
| **Required EOS Documents** | `emotional-journey.md`, `page-emotion-map.md` |
| **Required EIS Layers** | L1-L8 |
| **Narrative Arc** | Journey arc |
| **Scene Structure** | 1. Intro (what are HOP collections?) → 2. Collection cards (each with name, tagline, hero image) → 3. CTA to explore |
| **Tone Register** | Reflective (intro), Sensory (collection cards) |
| **Writing Deliverables** | Landing page copy: intro paragraph, collection card taglines and descriptions |
| **SEO Deliverables** | Meta title, meta description |
| **Accessibility Deliverables** | Alt text on collection hero images, descriptive link text |
| **Review Deliverables** | 12-pass Revision Report, Editorial Review |
| **Approval Requirements** | Editorial Lead |

---

### 4.4 Collection Detail

| Field | Specification |
|-------|---------------|
| **Purpose** | Tell the story of a collection. Establish the emotional and narrative context for its products |
| **Business Goal** | Drive product discovery within the collection |
| **Reader** | Woman exploring a specific collection |
| **Reader Intent** | "Tell me about this collection. What makes it special?" |
| **Customer Journey Stage** | Curiosity → Wonder → Trust |
| **Brand Goal** | Show curatorial vision |
| **Primary Emotion** | Wonder |
| **Secondary Emotion** | Trust |
| **Knowledge Sources** | Collection data, craft research, emotional architecture |
| **Required EOS Documents** | `voice-bible.md`, `emotional-journey.md`, `page-emotion-map.md` |
| **Required EIS Layers** | L1-L8 |
| **Narrative Arc** | Journey arc — the reader discovers the collection's world |
| **Scene Structure** | 1. Hero (collection hero image + tagline) → 2. The woman this collection is for → 3. The craft behind it → 4. The pieces (product cards) → 5. The invitation |
| **Tone Register** | Sensory (hero, craft), Reflective (the woman), Trust (the pieces), Resolution (invitation) |
| **Writing Deliverables** | `src/content/collections/{slug}/index.md` with frontmatter + body blocks |
| **Frontmatter** | `type: collection`, `name`, `slug`, `status: published`, `tagline`, `hero`, `lookbook`, `seo.title`, `seo.description` |
| **SEO Deliverables** | Title ≤ 70 chars, Description ≤ 160 chars |
| **Accessibility Deliverables** | Alt text on hero and lookbook images, Grade 7-9 reading level |
| **Review Deliverables** | 12-pass Revision Report, Editorial Review |
| **Approval Requirements** | Editorial Lead |

---

### 4.5 Product Detail

| Field | Specification |
|-------|---------------|
| **Purpose** | Tell the story of one saree. Create desire through specificity. Build trust through transparency |
| **Business Goal** | Convert browsing into purchase consideration |
| **Reader** | Woman considering a specific saree purchase |
| **Reader Intent** | "Is this saree right for me? Is it worth the price?" |
| **Customer Journey Stage** | Trust → Desire → Confidence |
| **Brand Goal** | Demonstrate that every saree has a story worth its price |
| **Primary Emotion** | Desire (for the saree itself, not for "owning luxury") |
| **Secondary Emotion** | Confidence (that this is the right choice) |
| **Knowledge Sources** | Product data (from database / Supabase), craft research, weaver research, sensory research |
| **Required EOS Documents** | `voice-bible.md`, `vocabulary-system/approved-words.md`, `vocabulary-system/forbidden-words.md`, `emotional-journey.md` |
| **Required EIS Layers** | L1-L8 (full pipeline). Critical: L7 (Editorial Cognition — Trust, Sensory, Identity questions) |
| **Narrative Arc** | Revelation arc — details revealed progressively to build value perception |
| **Scene Structure** | 1. Hero (product hero image + name) → 2. Sensory introduction (what this saree feels like) → 3. Craft details (technique, material, weaver) → 4. The woman who wears it (identity transformation) → 5. Details (border, body, pallu, colour — system-2 block) → 6. The invitation (CTA) |
| **Tone Register** | Sensory (scenes 1-2), Technical (scene 3), Reflective (scene 4), Trust (scene 5), Resolution (scene 6) |
| **Writing Deliverables** | `src/content/products/{uuid}/index.md` with frontmatter + body blocks |
| **Frontmatter** | `type: product`, `productId` (UUID from database), `status: published`, `hero`, `alt`, `sensoryStory`, `seo.title`, `seo.description` |
| **Body Blocks** | `hero`, `intro`, `body` (2-3 blocks), `pull-quote`, `system-2`, `related`, `closure` |
| **Special Note** | Product stories must reference the weaver's name if available. Must not fabricate any claim about the product. If data is missing from the database, omit the detail rather than invent it |
| **SEO Deliverables** | Title ≤ 70 chars, Description ≤ 160 chars, Product schema structured data |
| **Accessibility Deliverables** | Alt text on hero and all images, Grade 7-9 reading level |
| **Review Deliverables** | 12-pass Revision Report, Editorial Review, Craft Advisor review (if craft-heavy) |
| **Quality Gates** | All 8 gates. Gate 6 required for craft-heavy products |
| **Approval Requirements** | Editorial Lead |
| **Git Requirements** | Single commit per product. Commit message: `content(product): add {product name}` |

---

### 4.6 Journal Article

| Field | Specification |
|-------|---------------|
| **Purpose** | Educate, inspire, and build HOP's authority in craft, culture, and textile knowledge |
| **Business Goal** | Drive organic traffic, establish content authority, support product narratives |
| **Reader** | Woman interested in Indian textiles, craft, culture, fashion with meaning |
| **Reader Intent** | "I want to learn about / be inspired by something related to sarees and Indian craft" |
| **Customer Journey Stage** | Curiosity → Wonder → Trust → Belonging |
| **Brand Goal** | Position HOP as a cultural custodian and knowledge authority |
| **Primary Emotion** | Wonder |
| **Secondary Emotion** | Trust |
| **Knowledge Sources** | Craft research, cultural research, weaver research, textile history |
| **Required EOS Documents** | `voice-bible.md`, `editorial-principles.md`, `emotional-journey.md` |
| **Required EIS Layers** | L1-L8. Critical: L6 (Narrative — Transformation Arc) |
| **Narrative Arc** | Transformation arc — the reader's understanding changes |
| **Scene Structure** | Varies by topic. Typical: 1. Hook (specific moment/object) → 2. Context (why this matters) → 3. Depth (craft/cultural details) → 4. Human element (weaver, place, tradition) → 5. Reflection (what this means) → 6. Closure |
| **Writing Deliverables** | `src/content/journal/{slug}/index.md` with frontmatter + body blocks |
| **Frontmatter** | `type: article`, `title`, `slug`, `published` (date), `status: published`, `author`, `tag`, `dek`, `hero`, `alt`, `seo.title`, `seo.description` |
| **Body Blocks** | `hero`, `intro`, `body` (3-6 blocks), `pull-quote` (1-2), `image` (as needed), `related`, `closure` |
| **SEO Deliverables** | Title ≤ 70 chars, Description ≤ 160 chars, Article schema structured data |
| **Accessibility Deliverables** | Alt text on all images, Grade 7-9 reading level, heading hierarchy |
| **Review Deliverables** | 12-pass Revision Report, Editorial Review, Cultural Advisor review (if cultural topic) |
| **Approval Requirements** | Editorial Lead + Editor-in-Chief |
| **Git Requirements** | Single commit per article. Commit message: `content(journal): add {article title}` |

---

### 4.7 Craft Story

| Field | Specification |
|-------|---------------|
| **Purpose** | Educate readers about specific weaving techniques, materials, and processes |
| **Business Goal** | Build authority and trust through detailed craft knowledge |
| **Reader** | Woman curious about how her saree is made |
| **Reader Intent** | "How is this saree made? What makes it special?" |
| **Customer Journey Stage** | Wonder → Trust |
| **Brand Goal** | Show that HOP knows craft deeply |
| **Primary Emotion** | Wonder |
| **Secondary Emotion** | Trust |
| **Knowledge Sources** | Craft research (weaving techniques, fabric glossary, regional weaves, dye processes) |
| **Required EOS Documents** | `voice-bible.md`, `editorial-principles.md` |
| **Required EIS Layers** | L1-L8. Critical: L5 (Knowledge), L6 (Narrative — Instruction Arc) |
| **Narrative Arc** | Instruction arc — knowledge transferred systematically |
| **Scene Structure** | 1. Hook (a specific saree / weaver) → 2. The technique (what it is) → 3. The process (how it happens) → 4. Why it matters (quality, tradition, uniqueness) → 5. Where to see it (product links) |
| **Writing Deliverables** | `src/content/craft-notes/{slug}/index.md` |
| **Frontmatter** | `type: craft-note`, `title`, `slug`, `published`, `status: published`, `author`, `tag`, `dek`, `hero`, `seo.title`, `seo.description` |
| **Review Deliverables** | 12-pass Revision Report, Editorial Review, Craft Advisor review (required) |
| **Approval Requirements** | Editorial Lead + Craft Advisor |

---

### 4.8 Weaver Story

| Field | Specification |
|-------|---------------|
| **Purpose** | Tell the story of a weaver — her hands, her lineage, her craft |
| **Business Goal** | Build human connection. Demonstrate HOP's commitment to naming and honouring makers |
| **Reader** | Woman who wants to know who made her saree |
| **Reader Intent** | "Who wove this saree? What is her story?" |
| **Customer Journey Stage** | Trust → Belonging |
| **Brand Goal** | Fulfill the promise: "The weaver is named" |
| **Primary Emotion** | Connection |
| **Secondary Emotion** | Trust |
| **Knowledge Sources** | Weaver research, craft research, photography direction, portrait images |
| **Required EOS Documents** | `voice-bible.md`, `editorial-principles.md` |
| **Required EIS Layers** | L1-L8. Critical: L6 (Portrait Arc) |
| **Narrative Arc** | Portrait arc — the weaver revealed through accumulated detail |
| **Scene Structure** | 1. First sight (seeing her at the loom) → 2. Her hands (the craft she practices) → 3. Her lineage (who taught her) → 4. Her life (beyond the loom) → 5. Her work (sarees she has woven) |
| **Writing Deliverables** | `src/content/weaver-portraits/{slug}/index.md` |
| **Frontmatter** | `type: weaver-portrait`, `title`, `slug`, `published`, `status: published`, `author`, `weaverName`, `generation`, `location`, `technique`, `hero`, `alt`, `quote`, `portraits`, `seo.title`, `seo.description` |
| **Review Deliverables** | 12-pass Revision Report, Editorial Review, Craft Advisor review (required) |
| **Approval Requirements** | Editorial Lead + Craft Advisor |

---

### 4.9 FAQ

| Field | Specification |
|-------|---------------|
| **Purpose** | Answer common questions. Reduce purchase friction. Build trust through transparency |
| **Business Goal** | Reduce support inquiries. Increase purchase confidence |
| **Reader** | Woman with specific questions about ordering, shipping, returns, saree care |
| **Reader Intent** | "How does this work? Is it safe? What if I need to return?" |
| **Customer Journey Stage** | Trust → Confidence |
| **Brand Goal** | Demonstrate transparency |
| **Primary Emotion** | Confidence |
| **Secondary Emotion** | Trust |
| **Knowledge Sources** | Policies, customer research (pain points), care research |
| **Required EOS Documents** | `voice-bible.md`, `editorial-principles.md` |
| **Required EIS Layers** | L1-L5, L7-L8. L6 not needed (no narrative arc) |
| **Narrative Arc** | None — question-answer structure |
| **Writing Deliverables** | FAQ content as structured Q&A pairs |
| **Approval Requirements** | Editorial Lead |
| **Quality Gates** | All gates. Gate 6 (Accuracy) is critical |

---

### 4.10 Policies

| Field | Specification |
|-------|---------------|
| **Purpose** | Establish legal and operational terms. Build trust through clear, transparent policies |
| **Business Goal** | Meet legal requirements. Protect HOP and customers |
| **Reader** | Woman reviewing terms before or after purchase |
| **Reader Intent** | "What are the rules? What are my rights?" |
| **Customer Journey Stage** | Confidence |
| **Brand Goal** | Demonstrate transparency and fairness |
| **Primary Emotion** | Confidence |
| **Secondary Emotion** | Trust |
| **Knowledge Sources** | Legal requirements, business operations |
| **Required EOS Documents** | `voice-bible.md` (for tone), `forbidden-words.md` |
| **Required EIS Layers** | L1 (Brand boundaries), L8 (Language, simplified) |
| **Narrative Arc** | None — document structure |
| **Writing Deliverables** | Policy documents in HOP voice |
| **Approval Requirements** | Editorial Lead + Legal (if significant policies) |

---

### 4.11 Email Templates

| Field | Specification |
|-------|---------------|
| **Purpose** | Communicate with customers across the lifecycle: welcome, order confirmation, shipping, nurture |
| **Business Goal** | Drive engagement, repeat visits, and customer retention |
| **Reader** | Existing customer or prospect at specific lifecycle stage |
| **Reader Intent** | Varies by email type |
| **Customer Journey Stage** | Arrival → Belonging → Legacy |
| **Brand Goal** | Extend the editorial experience into email |
| **Primary Emotion** | Varies by email type |
| **Secondary Emotion** | Trust |
| **Knowledge Sources** | Brand voice, emotional journey, product content |
| **Required EOS Documents** | `voice-bible.md`, `emotional-journey.md` |
| **Required EIS Layers** | L1-L8 (simplified — shorter format) |
| **Narrative Arc** | Revelation arc (short form) |
| **Writing Deliverables** | Email copy for each template |
| **Approval Requirements** | Editorial Lead |

---

### 4.12 Campaign

| Field | Specification |
|-------|---------------|
| **Purpose** | Promote a specific collection, season, or event |
| **Business Goal** | Drive traffic and conversions for a specific theme |
| **Reader** | Existing customer or prospect interested in the campaign theme |
| **Reader Intent** | "What is new? What is special?" |
| **Customer Journey Stage** | Desire → Confidence |
| **Brand Goal** | Demonstrate curatorial vision. Show what makes this moment special |
| **Primary Emotion** | Desire |
| **Secondary Emotion** | Anticipation |
| **Knowledge Sources** | Campaign brief, product data, emotional architecture |
| **Required EOS Documents** | `voice-bible.md`, `emotional-journey.md`, `page-emotion-map.md` |
| **Required EIS Layers** | L1-L8 |
| **Narrative Arc** | Transformation arc |
| **Writing Deliverables** | Campaign page content, email copy, social copy |
| **Approval Requirements** | Editorial Lead + Brand Lead + Editor-in-Chief |

---

### 4.13 Lookbook

| Field | Specification |
|-------|---------------|
| **Purpose** | Showcase products visually with minimal but powerful editorial framing |
| **Business Goal** | Drive desire through visual storytelling |
| **Reader** | Woman who wants to see how sarees look when worn |
| **Reader Intent** | "Show me how these sarees look." |
| **Customer Journey Stage** | Desire → Confidence |
| **Brand Goal** | Demonstrate the visual beauty of the craft |
| **Primary Emotion** | Desire |
| **Secondary Emotion** | Wonder |
| **Knowledge Sources** | Photography direction, product data, collection data |
| **Required EOS Documents** | `voice-bible.md` |
| **Required EIS Layers** | L1-L4, L6 (minimal), L8 |
| **Narrative Arc** | Journey arc (visual journey) |
| **Writing Deliverables** | Lookbook section headlines, image captions, brief editorial framing |
| **Approval Requirements** | Editorial Lead |

---

### 4.14 Landing Pages

| Field | Specification |
|-------|---------------|
| **Purpose** | Drive a specific action (signup, purchase, event registration) |
| **Business Goal** | Conversion on a specific metric |
| **Reader** | Targeted audience for the specific campaign |
| **Reader Intent** | Specific to the landing page goal |
| **Customer Journey Stage** | Varies |
| **Brand Goal** | Maintain brand consistency while optimising for conversion |
| **Primary Emotion** | Varies |
| **Secondary Emotion** | Confidence |
| **Knowledge Sources** | Campaign brief, brand voice |
| **Required EOS Documents** | `voice-bible.md`, `editorial-principles.md` |
| **Required EIS Layers** | L1-L8 |
| **Narrative Arc** | Journey arc (short form) |
| **Writing Deliverables** | Landing page copy: headline, subheadline, body, CTA, trust signals |
| **Approval Requirements** | Editorial Lead + Editor-in-Chief |

---

## 5. Production Pipeline (Operational)

This section defines the operational execution of each production stage. Each stage entry is written for Claude Code to execute directly.

---

### Stage 1: Determine Next Page

| Element | Specification |
|---------|---------------|
| **Purpose** | Identify the highest-priority page that is ready to be worked on |
| **Inputs** | Progress Dashboard (§8), Execution Order (§3) |
| **Outputs** | Page name and type selected |
| **Owner** | Claude Code |
| **AI Responsibilities** | Read the Progress Dashboard. Identify the first page with status "Not Started" in execution order. Check that all dependencies are completed. Select page |
| **Human Responsibilities** | None |
| **Quality Gate** | None |
| **Failure Modes** | Selected page has incomplete dependency. Re-selected page already completed |
| **Recovery** | Check dependency matrix in §3.2. If blocked, select next available page |

**Claude instruction:** At the start of every session, read the Progress Dashboard (§8). Execute this stage before any other work.

---

### Stage 2: Load Context

| Element | Specification |
|---------|---------------|
| **Purpose** | Load all context required for the selected page type |
| **Inputs** | Page type (from Stage 1), Page Production Specification (§4) |
| **Outputs** | Complete context load — all required EOS documents known |
| **Owner** | Claude Code |
| **AI Responsibilities** | Load the following context in order: (1) Brand Bible, (2) Voice Bible, (3) Messaging Pillars, (4) Editorial Principles, (5) Emotional Principles, (6) Emotional Journey, (7) Page Emotion Map, (8) Vocabulary System (approved + forbidden), (9) Grammar & Usage, (10) Relevant knowledge base documents for this page type |
| **Human Responsibilities** | None |
| **Quality Gate** | None |
| **Failure Modes** | Missing context document. Outdated context |
| **Recovery** | If a required document is missing, proceed with available context and flag the gap in progress notes |

**Claude instruction:** Load context documents by reading them directly. Do not rely on memory. Read the actual files.

---

### Stage 3: Research & Knowledge Assembly

| Element | Specification |
|---------|---------------|
| **Purpose** | Gather all knowledge required for the page |
| **Inputs** | Page type (§4), Context (§2), Knowledge Base (`docs/research/`) |
| **Outputs** | Knowledge Summary (using template §6.3) |
| **Owner** | Claude Code (retrieval) + Editorial Lead (verification) |
| **AI Responsibilities** | Read all relevant Knowledge Base documents. Extract specific, verifiable facts. Identify knowledge gaps. Produce Knowledge Summary using template §6.3 |
| **Human Responsibilities** | Verify cultural and craft facts. Adjudicate knowledge gaps |
| **Quality Gate** | Gate 1 — Knowledge Complete |
| **Failure Modes** | Critical knowledge gap. Conflicting sources |
| **Recovery** | Flag gaps in Knowledge Summary. Human decides: proceed with flag or pause for research |

---

### Stage 4: Editorial Brief

| Element | Specification |
|---------|---------------|
| **Purpose** | Define the editorial strategy |
| **Inputs** | Page specification (§4), Knowledge Summary (§3), Context (§2) |
| **Outputs** | Editorial Brief (using template §6.1) |
| **Owner** | Claude Code (draft) + Editorial Lead (approve) |
| **AI Responsibilities** | Draft Editorial Brief using template §6.1. Populate all fields from page specification + knowledge + context |
| **Human Responsibilities** | Review and approve Editorial Brief. Verify emotional target, CTA, SEO mandate |
| **Quality Gate** | Gate 3 — Brief Approved |

---

### Stage 5: Narrative Plan

| Element | Specification |
|---------|---------------|
| **Purpose** | Design the narrative architecture |
| **Inputs** | Editorial Brief (§4), Page specification (§4) |
| **Outputs** | Narrative Plan (using template §6.4) |
| **Owner** | Claude Code (design) + Editorial Lead (approve) |
| **AI Responsibilities** | Select arc type. Design scene sequence with purpose, emotion, sensory anchor, tone register, knowledge function per scene. Design identity transformation, curiosity architecture, resolution |
| **Human Responsibilities** | Review and approve Narrative Plan |
| **Quality Gate** | Gate 3 — Brief Approved (reuse — brief and plan approved together) |

---

### Stage 6: Drafting

| Element | Specification |
|---------|---------------|
| **Purpose** | Write the content |
| **Inputs** | Narrative Plan (§5), Editorial Brief (§4), Knowledge Summary (§3), Context (§2), EIS reasoning frameworks |
| **Outputs** | Content Draft (first version) |
| **Owner** | Claude Code |
| **AI Responsibilities** | For each scene in Narrative Plan: (1) Execute EIS Layer 7 (Editorial Cognition — 14-question framework), (2) Execute EIS Layer 8 (Language Architecture — sentence rhythm, sensory density, vocabulary governance, compression). Verify every sentence against Brand Boundary Set and Knowledge Summary |
| **Human Responsibilities** | None |
| **Quality Gate** | None (draft produced) |

**Critical constraints during drafting:**
- Every word must pass the Vocabulary System (forbidden word check)
- Every claim must be traceable to the Knowledge Summary
- Every sentence must serve the Emotional Target
- No fabricated weaver names, places, techniques
- No AI clichés (never: "delve into", "nestled in", "testament to", "in today's world", "elevate your style")

---

### Stage 7: AI Self-Review (12-Pass)

| Element | Specification |
|---------|---------------|
| **Purpose** | Run the 12-pass Revision Intelligence system |
| **Inputs** | Content Draft (§6), Editorial Brief (§4), Knowledge Summary (§3), Brand Boundary Set |
| **Outputs** | Revision Report (using template §6.6) + Revised Draft |
| **Owner** | Claude Code |
| **AI Responsibilities** | Run all 12 passes: Truth Audit, Brand Fidelity, Evidence Audit, Emotional Verification, Narrative Cohesion, Sensory Density, Compression, Sentence Music, Vocabulary Audit, Accessibility, SEO, Cultural Authenticity. For each pass: identify issues, classify by severity (Critical / Important / Minor), auto-fix where possible, document residual issues in Revision Report |
| **Human Responsibilities** | None |
| **Quality Gate** | Gate 4 — Draft Complete (no critical issues remain) |

---

### Stage 8: Human Editorial Review

| Element | Specification |
|---------|---------------|
| **Purpose** | Human editor reads and approves the draft |
| **Inputs** | Revised Draft (§7), Revision Report (§7), Editorial Brief (§4) |
| **Outputs** | Editorial Review (using template §6.7) |
| **Owner** | Editorial Lead (human) |
| **AI Responsibilities** | Present draft + Revision Report to human. Apply any human edits. Re-run AI self-review after changes |
| **Human Responsibilities** | Read the entire draft. Apply editorial judgment: voice, specificity, restraint, cultural accuracy. Approve or request revisions |
| **Quality Gate** | Gate 5 — Human Review Passed |

---

### Stage 9: Subject Matter Review (Conditional)

| Element | Specification |
|---------|---------------|
| **Purpose** | Verify craft, cultural, or technical accuracy |
| **Inputs** | Revised Draft (§8), Knowledge Summary (§3), Source Map |
| **Outputs** | Subject Matter Review |
| **Owner** | Subject Matter Expert (human) |
| **AI Responsibilities** | Prepare draft + Knowledge Summary + Source Map for SME. Present findings clearly |
| **Human Responsibilities** | SME reviews and confirms accuracy |
| **Quality Gate** | Gate 6 — Subject Matter Verified (required for: Craft Story, Weaver Story, craft-heavy Product Detail, culturally-focused Journal Article) |

---

### Stage 10: Quality Verification

| Element | Specification |
|---------|---------------|
| **Purpose** | Compute quality score against content-type threshold |
| **Inputs** | Final Draft, Editorial Brief (§4) |
| **Outputs** | Quality Score Card |
| **Owner** | Claude Code (compute) + Editorial Lead (override) |
| **AI Responsibilities** | Run EIS Layer 10 scoring (15 heuristics). Compute OQI. Check heuristics against minimums. Compare OQI against content-type threshold (§9.2) |
| **Human Responsibilities** | Review score. Override if score conflicts with editorial judgment (with documented reason) |
| **Quality Gate** | Gate 7 — Quality Score Above Threshold |

---

### Stage 11: Approval

| Element | Specification |
|---------|---------------|
| **Purpose** | Final human sign-off |
| **Inputs** | Final Draft, Quality Score Card, Revision Report, Editorial Review, Subject Matter Review (if applicable) |
| **Outputs** | Approval Sheet (using template §6.9) |
| **Owner** | Editorial Lead (or Editor-in-Chief for major pieces) |
| **AI Responsibilities** | Present all artifacts. Confirm all 8 quality gates passed. Produce Approval Sheet |
| **Human Responsibilities** | Final read. Sign approval |
| **Quality Gate** | Gate 8 — Final Approval |

---

### Stage 12: Publication

| Element | Specification |
|---------|---------------|
| **Purpose** | Transform final draft into a production content unit |
| **Inputs** | Final Draft + Approval Sheet |
| **Outputs** | Published Content Unit at `src/content/{type}/{slug}/` |
| **Owner** | Claude Code (content creation) + Developer (deployment) |
| **AI Responsibilities** | Create content directory. Write `index.md` with correct frontmatter + body blocks. Follow Content Architecture (src/content/README.md) for block types. Run Content Compiler. Fix any validation errors |
| **Human Responsibilities** | Approve merge request |
| **Quality Gate** | Gate 8 — Final Approval (reuse) |

**Content unit creation rules:**
- Content directory: `src/content/{type}/{slug}/`
- Main file: `index.md`
- Frontmatter must match schema for the content type
- Body blocks must use valid types from Content Architecture (`hero`, `intro`, `body`, `pull-quote`, `image`, `video`, `system-2`, `related`, `closure`, `divider`, `step`, `gallery`)
- Hero image: `hero.jpg` (must exist or be noted as placeholder)
- Run `npm run content:build` after creation
- Fix all compiler validation errors

---

### Stage 13: Git Preparation

| Element | Specification |
|---------|---------------|
| **Purpose** | Prepare completed content for Git commit |
| **Inputs** | Published content unit (from §12), Approval Sheet |
| **Outputs** | Git-ready content with commit message |
| **Owner** | Claude Code |
| **AI Responsibilities** | Stage the content unit files. Verify no secrets in files. Verify no forbidden words in files. Write commit message following convention (§10) |
| **Human Responsibilities** | Review and approve commit |
| **Quality Gate** | Git Readiness Checklist (§10) |

---

### Stage 14: Update Progress

| Element | Specification |
|---------|---------------|
| **Purpose** | Update the Progress Dashboard |
| **Inputs** | Completed page information |
| **Outputs** | Updated Progress Dashboard (§8) |
| **Owner** | Claude Code |
| **AI Responsibilities** | Update dashboard: mark page as "Completed". Record any lessons learned to Continuous Improvement (§11). Determine next page |
| **Human Responsibilities** | None |
| **Quality Gate** | None |
| **Failure Modes** | Dashboard becomes outdated |
| **Recovery** | Read dashboard at start of every session. Verify accuracy |

---

## 6. Standard Templates

### Template 6.1: Editorial Brief

Use this template for Stage 4. Populate all fields from the page specification and knowledge summary.

```
# Editorial Brief: {Page Name}

## Strategic Mandate
- **Purpose (one sentence):** {Why this page exists}
- **Business Goal:** {Measurable outcome}
- **Brand Goal:** {Brand relationship outcome}

## Emotional Targeting
- **Primary Emotion:** {From page spec}
- **Secondary Emotion:** {From page spec}
- **Customer Journey Stage:** {Arrival | Curiosity | Wonder | Trust | Desire | Confidence | Ownership | Belonging | Legacy}
- **Emotional Arc:** {Start emotion → End emotion}

## Reader
- **Primary Persona:** {From personas research}
- **Reader Intent:** {What she wants}
- **Trust Requirement:** {What trust must be built}

## Content Priorities
1. {First thing reader should see/understand}
2. {Second thing}
3. {Third thing}

## Call to Action
- **Primary CTA:** {Single most important action}
- **Secondary CTA:** {Optional, non-competing}

## SEO Mandate
- **Primary Keyword:** {Target keyword}
- **SEO Intent:** {Informational | Transactional | Navigational}
- **Title Constraint:** {≤ 70 characters}
- **Description Constraint:** {≤ 160 characters}

## Success Criteria
- {How success will be measured}

## Constraints
- **Brand constraints:** {Specific to this page type}
- **Vocabulary focus:** {Words to feature}
- **Tone register:** {Primary tone for this page}

## Version
- **Brief Version:** 1.0
- **Status:** Draft | Approved
- **Approved By:**
- **Approval Date:**
```

---

### Template 6.2: Page Specification

Use this template for the master document tracking all page information. One per page.

```
# Page Specification: {Page Name}

## Identity
- **Page Name:**
- **Route:**
- **Content Type:**

## Purpose & Goals
- **Purpose:**
- **Business Goal:**
- **User Goal:**
- **Reader Intent:**
- **Customer Journey Stage:**
- **Brand Goal:**

## Emotional & Trust
- **Primary Emotion:**
- **Secondary Emotion:**
- **Trust Goal:**
- **Emotional Arc:**

## Reader & Audience
- **Primary Persona:**
- **Reader Identity Model:**
- **Processing Model:**

## Knowledge
- **Knowledge State:** {Reference to Knowledge Summary}
- **Required Research:** {List of documents}

## SEO & Content
- **SEO Intent:**
- **Primary Keyword:**
- **Content Priority:** 1.  2.  3.

## Narrative & CTA
- **Primary Narrative:**
- **Secondary Narrative:**
- **Narrative Architecture:** {Reference to Narrative Plan}
- **Primary CTA:**
- **Secondary CTA:**

## Production
- **Writing Requirements:**
- **Revision Requirements:**
- **Accessibility Notes:**

## Version
- **Version:** 1.0
- **Status:** Draft | Approved | Superseded
- **Approved By:**
- **Approval Date:**
```

---

### Template 6.3: Knowledge Summary

Use this template for Stage 3. Captures all research for a page.

```
# Knowledge Summary: {Page Name}

## Source Documents Consulted
- {path/to/document.md} — {key facts extracted}
- {path/to/document.md} — {key facts extracted}

## Key Facts
| Domain | Fact | Source | Confidence |
|--------|------|--------|------------|
| Craft | {fact} | {source path} | Verified | Single-Source | Inferred |
| Culture | {fact} | {source path} | Verified | Single-Source | Inferred |
| Brand | {fact} | {source path} | Verified | Single-Source | Inferred |
| Product | {fact} | {source path} | Verified | Single-Source | Inferred |
| Weaver | {fact} | {source path} | Verified | Single-Source | Inferred |

## Knowledge Gaps
| Gap | Impact | Action |
|-----|--------|--------|
| {what is not known} | {how it affects content} | {omit | flag | research more} |

## Verification Notes
- {Any cross-referencing results, contradictions found, or notes}
```

---

### Template 6.4: Narrative Plan

Use this template for Stage 5.

```
# Narrative Plan: {Page Name}

## Arc
- **Arc Type:** {Transformation | Revelation | Journey | Portrait | Instruction}
- **Tension Curve:** {Describe how tension rises and falls}

## Scene Sequence
| Scene | Purpose | Emotion | Sensory Anchor | Tone Register | Knowledge Function | Transition |
|-------|---------|---------|----------------|---------------|-------------------|------------|
| 1 | {why this scene exists} | {emotion this scene creates} | {one specific sensory detail} | Sensory / Reflective / Technical / Trust / Resolution | {what reader learns/feels} | {how next scene begins} |
| 2 | | | | | | |
| 3 | | | | | | |

## Identity Transformation
- **From Identity:** {Who the reader is at the start}
- **To Identity:** {Who the reader becomes}

## Resolution Design
- **Central Question Answered:**
- **Emotional Payoff:**
- **Memory Anchor:**
- **Transition to Next Page:**

## Pacing Map
- Scene 1: {Fast | Slow}
- Scene 2: {Fast | Slow}
- Scene 3: {Fast | Slow}

## Version
- **Plan Version:** 1.0
- **Status:** Draft | Approved
- **Approved By:**
```

---

### Template 6.5: Writing Checklist

Use this checklist before and during Stage 6.

```
# Writing Checklist: {Page Name}

## Pre-Writing
- [ ] Editorial Brief approved
- [ ] Narrative Plan approved
- [ ] Knowledge Summary complete
- [ ] All context documents loaded
- [ ] Brand Boundary Set defined
- [ ] Forbidden word list reviewed
- [ ] Target sensory density determined

## During Writing
- [ ] Every scene from Narrative Plan is completed
- [ ] Every sentence passes vocabulary filter
- [ ] Every claim is traceable to Knowledge Summary
- [ ] Sensory anchors present in every scene
- [ ] Compression applied (remove 20% of words)
- [ ] Sentences varied in length and rhythm
- [ ] No AI clichés present
- [ ] No forbidden words present

## Post-Writing
- [ ] Self-review runs without critical errors
- [ ] Word count within expected range
- [ ] Reading level at Grade 7-9
- [ ] All scenes from Narrative Plan present
```

---

### Template 6.6: Revision Report

Use this template for Stage 7.

```
# Revision Report: {Page Name}

## Pass Results
| Pass | Critical | Important | Minor | Auto-Fixed | Residual |
|------|----------|-----------|-------|------------|----------|
| 1. Truth Audit | | | | | |
| 2. Brand Fidelity | | | | | |
| 3. Evidence Audit | | | | | |
| 4. Emotional Verification | | | | | |
| 5. Narrative Cohesion | | | | | |
| 6. Sensory Density | | | | | |
| 7. Compression | | | | | |
| 8. Sentence Music | | | | | |
| 9. Vocabulary Audit | | | | | |
| 10. Accessibility | | | | | |
| 11. SEO | | | | | |
| 12. Cultural Authenticity | | | | | |

## Residual Issues
| # | Pass | Issue | Severity | Action Taken |
|---|------|-------|----------|-------------|
| 1 | | | | |

## Summary
- **Total findings:**
- **Critical:**
- **Important:**
- **Minor:**
- **Auto-fixed:**
- **Residual:**

## Draft Version
- **Before:** 1.0
- **After:** {after revisions}
```

---

### Template 6.7: Editorial Review

Use this template for Stage 8.

```
# Editorial Review: {Page Name}

## Overall Assessment
- **Serves purpose?** Yes / No / Partially
- **Creates intended emotion?** Yes / No / Partially
- **Voice consistent with HOP?** Yes / No / Partially
- **Claims specific enough?** Yes / No / Partially

## Human Editor Findings
| # | Issue | Location | Severity | Action |
|---|-------|----------|----------|--------|
| 1 | | | | |

## AI Revision Report Review
- **Agree with AI severity classifications?** Yes / No
- **Issues AI missed?** Yes / No (list above)
- **AI-flagged issues you disagree with?** Yes / No (list above)

## Decision
- [ ] Approve — advance to next stage
- [ ] Revise — return to AI with instructions
- [ ] Rethink — return to Editorial Brief stage

## Version
- **Reviewed By:**
- **Date:**
```

---

### Template 6.8: Quality Score Card

Use this template for Stage 10.

```
# Quality Score Card: {Page Name}

## Heuristic Scores
| Heuristic | Score | Minimum | Met? |
|-----------|-------|---------|------|
| H1 — Memory Density | | | |
| H2 — Narrative Compression | | | |
| H3 — Emotional Precision | | | |
| H4 — Reader Visualization | | | |
| H5 — Luxury Restraint | | | |
| H6 — Specificity Index | | | |
| H7 — Sensory Authenticity | | | |
| H8 — Identity Signaling | | | |
| H9 — Trust Formation | | | |
| H10 — Originality Index | | | |
| H11 — Sentence Music | | | |
| H12 — Cadence Variation | | | |
| H13 — Cultural Authenticity | | | |
| H14 — AI Detectability | | | |
| H15 — Narrative Cohesion | | | |

## Overall Quality Index
- **OQI:** {weighted average}
- **Threshold:** {per content type}
- **Passed:** Yes / No

## Verdict
- [ ] Pass — advance to approval
- [ ] Fail — return to drafting with recommendations
- [ ] Override — human editorial override (reason:)
```

---

### Template 6.9: Approval Sheet

Use this template for Stage 11.

```
# Approval Sheet: {Page Name}

## Content Identity
- **Page Name:**
- **Route:**
- **Content Type:**
- **Slug:**

## Gate Status
| Gate | Status | Notes |
|------|--------|-------|
| 1. Knowledge Complete | | |
| 2. Spec Approved | | |
| 3. Brief Approved | | |
| 4. Draft Complete | | |
| 5. Human Review Passed | | |
| 6. Subject Matter Verified | | |
| 7. Quality Score Above Threshold | | |
| 8. Final Approval | | |

## Quality Score
- **OQI:**
- **Heuristic minimums met?** Yes / No

## Approvals
| Role | Name | Date |
|------|------|------|
| Editorial Lead | | |
| Editor-in-Chief | | |
| SME (if required) | | |

## Decision
- [ ] Approved for publication
- [ ] Rejected (reason:)
- [ ] Conditional (condition:)

## Version
- **Sheet Version:** 1.0
- **Content Version:**
```

---

### Template 6.10: Completion Report

Use after Stage 14 to document what was completed.

```
# Completion Report: {Page Name}

## Summary
- **Page:** {Name}
- **Type:** {Content type}
- **Route:** {URL}
- **Completed:** {Date}
- **Total pipeline stages executed:** {Number}

## Artifacts Produced
- `src/content/{type}/{slug}/index.md`
- `docs/editorial/production/page-specs/{slug}-spec.md` (if created separately)
- Additional files as needed

## Quality
- **OQI:** {Score}
- **All gates passed:** Yes / No
- **AI self-review findings:** {Summary}
- **Human editorial findings:** {Summary}
- **SME findings:** {Summary} (if applicable)

## Lessons Learned
- {What went well}
- {What could be improved}
- {Reusable patterns identified}

## Next Steps
- {What comes after this page}
```

---

## 7. Claude Operating Instructions

This section contains direct instructions for Claude Code. These instructions govern every Phase 7 work session.

### 7.1 Session Initialization

At the start of every work session:

1. **Read this manual.** Read `docs/editorial/production/PHASE_7_CONTENT_PRODUCTION_MANUAL.md` to recall context.

2. **Read the Progress Dashboard.** Read §8 (Progress Tracking Dashboard). Understand the current state: which pages are completed, in progress, not started, blocked.

3. **Check Git state.** Run `git status` and `git log --oneline -5`. Understand what was last committed and whether there are uncommitted changes.

4. **Determine next task.** Use Stage 1 (Determine Next Page) logic:
   - If a page is "In Drafting" or "In Review" → continue that page
   - If no page is in progress → start the first "Not Started" page in execution order (§3)
   - If a page is "Blocked" → check if the blocker has been resolved

5. **Load page context.** Read the Page Production Specification (§4) for the selected page type. Read the Editorial Brief (if already created). Read any existing drafts or artifacts.

6. **Proceed to the appropriate pipeline stage.** Enter the production pipeline at the stage corresponding to the content's current state.

### 7.2 Mandatory Reading List

The following documents must be read at least once per session. They are the permanent context source:

| Document | Path |
|----------|------|
| This manual | `docs/editorial/production/PHASE_7_CONTENT_PRODUCTION_MANUAL.md` |
| Brand Bible | `docs/editorial/02-brand-architecture/brand-bible.md` |
| Voice Bible | `docs/editorial/02-brand-architecture/voice-bible.md` |
| Editorial Principles | `docs/editorial/02-brand-architecture/editorial-principles.md` |
| Forbidden Words | `docs/editorial/04-vocabulary-system/forbidden-words.md` |
| Approved Words | `docs/editorial/04-vocabulary-system/approved-words.md` |
| Grammar & Usage | `docs/editorial/04-vocabulary-system/grammar-and-usage.md` |
| Emotional Journey | `docs/editorial/07-emotional-architecture/emotional-journey.md` |
| Page Emotion Map | `docs/editorial/07-emotional-architecture/page-emotion-map.md` |
| Content Architecture | `src/content/README.md` |
| Master System Prompt | `docs/editorial/prompts/system/master-system-prompt.md` |
| Writing Principles | `docs/editorial/prompts/system/writing-principles.md` |
| Reasoning Principles | `docs/editorial/prompts/system/reasoning-principles.md` |

### 7.3 Daily Workflow

Within a session, execute work in this order:

```
1. Re-read context (if needed — see §7.1)
2. Determine current page + stage (from dashboard + execution order)
3. Execute the current pipeline stage (§5)
4. If stage blocked → document blocker, move to next available task
5. If stage complete → update progress (§8), determine next stage
6. Produce artifacts for each completed stage (templates §6)
7. If page complete → prepare Git commit (§10), update progress
8. End session report (see §7.5)
```

### 7.4 Rules for Claude

**Do:**
- Read actual files to load context. Never rely on memory or prior session knowledge
- Use the templates in §6 for every deliverable. Consistency is paramount
- Check every word against the Forbidden Words list during drafting
- Verify every factual claim against the Knowledge Summary
- Run all 12 revision passes during self-review
- Update the Progress Dashboard after every completed stage
- Log lessons learned after each completed page

**Do NOT:**
- Skip any pipeline stage for speed
- Fabricate any claim that is not in the Knowledge Summary
- Use AI clichés (delve into, nestled in, testament to, in today's world)
- Use forbidden words (luxury, premium, exquisite, opulent, beautiful, stunning, etc.)
- Write website copy before the Editorial Brief and Narrative Plan are approved
- Proceed past a failed quality gate
- Make assumptions about weaver names, techniques, or cultural facts without source verification

**When uncertain:**
- If uncertain about a fact → omit it rather than fabricate it
- If uncertain about cultural accuracy → flag it for human review
- If uncertain about brand compliance → check against Brand Bible and Forbidden Words
- If uncertain about which stage to execute → check the Progress Dashboard

### 7.5 Session End Protocol

At the end of every session:

1. **Summarize what was accomplished** in a brief message
2. **Update the Progress Dashboard** (§8) with current state
3. **Report the next task** that needs to be done
4. **List any blockers** that need human intervention
5. **Leave uncommitted work** staged and ready (do not commit unless all gates passed)

**End-of-session report format:**

```
## Session Report
- **Pages worked:** {page names}
- **Stages completed:** {stages}
- **Current state:** {pipeline state}
- **Next task:** {next action}
- **Blockers:** {any issues needing human help}
- **Files modified:** {list of files}
```

### 7.6 Error Recovery

| Situation | Action |
|-----------|--------|
| Forbidden word found in draft | Immediately replace. Re-run vocabulary audit pass |
| Conflict between sources | Flag in Knowledge Summary. Use most authoritative source |
| Score below threshold | Return to drafting/revision stage. Do not advance |
| Missing required context | Read the document. If it doesn't exist, proceed with available context and flag gap |
| Compiler validation error | Fix the error (frontmatter, block types, relationships). Re-run until clean |
| Human reviewer disagrees | Apply human feedback. Do not override human editorial judgment |

---

## 8. Progress Tracking Dashboard

This section is updated continuously throughout Phase 7.

### 8.1 Dashboard

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                     PHASE 7 — PRODUCTION DASHBOARD                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Overall Progress: 20 / 20 pages (100%) — 20 in approval                     ║
║ Current Phase: COMPLETE                                                     ║
║ Current Page: None                                                          ║
║ Current Task: Awaiting Human Reviews (Gates 5, 6, 8)                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### 8.2 Page Status Table

| # | Page Type | Execution Order | Status | Pipeline Stage | Blockers | Dependencies |
|---|-----------|----------------|--------|----------------|----------|--------------|
| 1 | About | Phase 1 (1/4) | In Approval | Stage 11 — Gates 5, 8 pending human | Gate 5: Editorial Lead review. Gate 8: EL + EIC sign-off | None |
| 2 | Collection Landing | Phase 1 (2/4) | In Approval | Stage 11 — Gates 5, 8 pending human | Gate 5: Editorial Lead review. Gate 8: EL sign-off | About |
| 3 | Collection Detail (first) | Phase 1 (3/4) | In Approval | Stage 11 — Gates 5, 8 pending human | Gate 5: Editorial Lead review. Gate 8: EL sign-off | Collection Landing |
| 4 | Product Detail (first 3-5) | Phase 1 (4/4) | In Approval | Stage 11 — Gates 5, 8 pending human | Gate 5: Editorial Lead review. Gate 8: EL sign-off | Collection Detail |
| 5 | Craft Story (first 2) | Phase 2 (5/8) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Craft Advisor. Gate 8: EL | Product Detail |
| 6 | Weaver Story (first 2) | Phase 2 (6/8) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Craft Advisor. Gate 8: EL | Product Detail |
| 7 | Homepage | Phase 2 (7/8) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Brand Lead. Gate 8: EL+EIC | About, Collections, Products, Craft, Weaver |
| 8 | Collection Detail (remaining) | Phase 2 (8/8) | In Approval | Stage 11 — Gates 5, 8 pending human | Gate 5: Editorial Lead review. Gate 8: EL sign-off | Collection Landing, Product Detail |
| 9 | Product Detail (remaining) | Phase 3 (9/11) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Craft Advisor. Gate 8: EL sign-off | Collection Detail |
| 10 | Craft Story (remaining) | Phase 3 (10/11) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Craft Advisor. Gate 8: EL sign-off | Product Detail |
| 11 | Weaver Story (remaining) | Phase 3 (11/11) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Craft Advisor. Gate 8: EL sign-off | Product Detail |
| 12 | Journal Article (first 3-5) | Phase 4 (12/16) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Cultural Advisor. Gate 8: EIC | Products, Craft, Weaver |
| 13 | FAQ | Phase 4 (13/16) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Operations. Gate 8: EL | All above |
| 14 | Policies | Phase 4 (14/16) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Legal. Gate 8: EL | None |
| 15 | Email Templates | Phase 4 (15/16) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Eng. Gate 8: EL | Products, Journal |
| 16 | Campaign (first) | Phase 4 (16/16) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Brand Lead. Gate 8: EIC | Products, Collections |
| 17 | Lookbook | Phase 5 (17/20) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Brand Lead. Gate 8: EIC | Products, Collections |
| 18 | Landing Pages | Phase 5 (18/20) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Brand Lead. Gate 8: EL | Products, Collections |
| 19 | SEO Metadata Pass | Phase 5 (19/20) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: SEO. Gate 8: EIC | All pages |
| 20 | Final Editorial Audit | Phase 5 (20/20) | In Approval | Stage 11 — Gates 5, 6, 8 pending | Gate 5: EL. Gate 6: Eng. Gate 8: EIC | All pages |

### 8.3 Pipeline State Definitions

| Status | Meaning | Icon |
|--------|---------|------|
| Not Started | Page has not been begun | ◻ |
| In Research | Stage 3 in progress | 📚 |
| In Planning | Stages 4-5 in progress | 📋 |
| In Drafting | Stage 6 in progress | ✏️ |
| In Review | Stages 7-9 in progress | 🔍 |
| In Approval | Stages 10-11 in progress | ✅ |
| Completed | Published | 📄 |
| Blocked | Cannot proceed | 🚫 |

---

## 9. Quality Gates

### 9.1 Gate Definitions

#### Gate 1 — Knowledge Complete

| Element | Specification |
|---------|---------------|
| **Check** | Every field requiring research has a Knowledge Summary entry. No critical knowledge gaps unaddressed |
| **Pass** | All knowledge domains covered. Gap Report has no critical gaps. Source Map has ≥ 1 source per factual domain |
| **Fail** | Critical knowledge gap exists and is not escalated |
| **Owner** | Claude Code (assembles) + Editorial Lead (verifies) |

#### Gate 2 — Spec Approved

| Element | Specification |
|---------|---------------|
| **Check** | Page Specification populated for all 28 fields |
| **Pass** | All fields complete. Approved by Editorial Lead |
| **Fail** | Missing fields. Purpose not clear |
| **Owner** | Claude Code + Editorial Lead |

#### Gate 3 — Brief Approved

| Element | Specification |
|---------|---------------|
| **Check** | Editorial Brief is complete and approved |
| **Pass** | Emotional target matches page emotion map. Business goal measurable. CTA is one action |
| **Fail** | Conflicting goals. Multiple CTAs. Emotional mismatch |
| **Owner** | Editorial Lead |

#### Gate 4 — Draft Complete

| Element | Specification |
|---------|---------------|
| **Check** | Draft exists. AI self-review passed with no critical issues |
| **Pass** | All scenes from Narrative Plan written. No critical findings in Revision Report |
| **Fail** | Incomplete draft. Critical issue found by AI self-review |
| **Owner** | Claude Code |

#### Gate 5 — Human Review Passed

| Element | Specification |
|---------|---------------|
| **Check** | Human editor has read and approved |
| **Pass** | Editorial Lead signs off |
| **Fail** | Unresolved concern. Brand voice violation. Content does not match brief |
| **Owner** | Editorial Lead |

#### Gate 6 — Subject Matter Verified

| Element | Specification |
|---------|---------------|
| **Check** | All craft/cultural/technical claims confirmed by SME |
| **Pass** | SME confirms accuracy |
| **Fail** | Factual error. Cultural misrepresentation |
| **Owner** | Subject Matter Expert |
| **Applicable** | Craft Stories, Weaver Stories, craft-heavy Products, cultural Journal Articles |

#### Gate 7 — Quality Score Above Threshold

| Element | Specification |
|---------|---------------|
| **Check** | OQI meets content-type threshold. All heuristic minimums met |
| **Pass** | OQI ≥ threshold. No heuristic below minimum |
| **Fail** | OQI below threshold. Single heuristic critically low |
| **Owner** | Claude Code (compute) + Editorial Lead (override) |

#### Gate 8 — Final Approval

| Element | Specification |
|---------|---------------|
| **Check** | All 7 previous gates passed. Final read by Editorial Lead |
| **Pass** | Approval Sheet signed |
| **Fail** | Missing gate pass. Unresolved issue |
| **Owner** | Editorial Lead (or Editor-in-Chief for major pieces) |

### 9.2 OQI Thresholds by Content Type

| Content Type | OQI Threshold | Critical Minimums |
|--------------|---------------|-------------------|
| About | 0.85 | Luxury Restraint = 1.0, Cultural Authenticity ≥ 0.80 |
| Homepage | 0.85 | Emotional Precision ≥ 0.80, Luxury Restraint = 1.0 |
| Collection Landing | 0.80 | Narrative Cohesion ≥ 0.75 |
| Collection Detail | 0.80 | Luxury Restraint ≥ 0.90, Trust Formation ≥ 0.75 |
| Product Detail | 0.85 | Trust Formation ≥ 0.80, Luxury Restraint = 1.0, Specificity ≥ 0.70 |
| Journal Article | 0.80 | Memory Density ≥ 0.75, Cultural Authenticity ≥ 0.80 |
| Craft Story | 0.80 | Specificity ≥ 0.75, Cultural Authenticity ≥ 0.80, Truth = 1.0 |
| Weaver Story | 0.85 | Memory Density ≥ 0.80, Identity Signaling ≥ 0.75 |
| FAQ | 0.70 | Truth = 1.0 (every claim verified) |
| Policies | 0.70 | Truth = 1.0, Luxury Restraint = 1.0 |
| Email | 0.80 | Emotional Precision ≥ 0.75 |
| Campaign | 0.85 | Emotional Precision ≥ 0.80, Luxury Restraint ≥ 0.90 |
| Lookbook | 0.80 | Reader Visualization ≥ 0.75 |
| Landing Page | 0.80 | Narrative Cohesion ≥ 0.75, Luxury Restraint ≥ 0.90 |

---

## 10. Git Workflow

### 10.1 Commit Readiness Checklist

Before any content unit is committed, verify:

```
## Git Readiness Checklist
- [ ] All 8 quality gates passed
- [ ] Approval Sheet signed
- [ ] Content Compiler runs without errors (`npm run content:build`)
- [ ] No forbidden words in any file (run vocabulary scan)
- [ ] No fabricated claims (every claim traces to Knowledge Summary)
- [ ] No secrets, API keys, or credentials in files
- [ ] Only intended files are staged (no unrelated changes)
- [ ] Files follow naming conventions (kebab-case slugs)
- [ ] Frontmatter has `status: published` (or `status: draft` if not ready)
- [ ] Content renders correctly (verify on staging if possible)
```

### 10.2 Commit Message Convention

```
content({type}): {brief description}
```

**Examples:**
- `content(about): add About page`
- `content(product): add Tanjore Silk product story`
- `content(journal): add The Art of the Pallu journal article`
- `content(craft): add Kanchipuram Weaving Technique craft note`
- `content(weaver): add Lakshmi Devi weaver portrait`
- `content(homepage): add homepage hero and collection sections`
- `content(faq): add FAQ page`

**Rules:**
- Type is lowercase, from: about, homepage, product, collection, journal, craft, weaver, faq, policies, email, campaign, lookbook, landing
- Description is present tense, active voice, ≤ 72 characters
- No period at end of message
- Single commit per content unit

### 10.3 Files to Commit per Content Unit

For a full content unit:

```
src/content/{type}/{slug}/index.md
src/content/{type}/{slug}/hero.jpg          (if new)
src/content/{type}/{slug}/images/*.jpg      (if new)
```

For SEO or audit passes:

```
Docs are not committed. Content units are committed.
```

### 10.4 Work in Progress

- Unfinished content units should NOT be committed
- Keep work-in-progress files uncommitted until the unit is complete
- If a session ends mid-unit, leave files uncommitted and update the Progress Dashboard

---

## 11. Continuous Improvement

### 11.1 Post-Page Review

After every completed page, execute this review:

```
## Post-Page Review: {Page Name}

### What Went Well
- {What worked well in the pipeline for this page}

### What Could Be Improved
- {What was slow, error-prone, or unclear}

### Reusable Patterns Identified
- {Patterns that should be used for similar pages}

### Repeated Mistakes (if any)
- {Mistakes that occurred and should be prevented}

### Pipeline Improvements
- {Changes to this manual or templates that would improve future production}
```

### 11.2 Learning Log

Maintain a running log of improvements:

```
## Learning Log

### Page 1: About
- Lesson: {lesson learned}
- Action: {what changed as a result}

### Page 2: Collection Landing
- Lesson: {lesson learned}
- Action: {what changed as a result}
```

### 11.3 Template Evolution

Templates in §6 should evolve based on production experience:

- If a field is never used → remove it
- If a field is always missing → add a default or example
- If the order causes confusion → reorder
- If a new field is consistently needed → add it

Template changes must be documented in the Learning Log and approved by the Editorial Lead.

### 11.4 Quality Trend Tracking

Track OQI scores across completed pages:

```
## Quality Trends
| Page | Content Type | OQI | Date |
|------|-------------|-----|------|
|      |              |     |      |
|      |              |     |      |
```

If OQI trends downward, investigate the cause. If trending upward, identify what is improving and codify it.

---

## 12. Self-Review

### 12.1 What This Manual Provides

1. **Complete session protocol:** Claude knows exactly how to start, work, and end every session
2. **Deterministic page order:** Every page has a defined place in the execution sequence with dependency logic
3. **Per-type specifications:** All 14 content types have complete production specs (purpose, goals, narrative, deliverables, gates, DOD)
4. **Embedded templates:** 10 reusable templates are defined inline — no external template files needed
5. **Quality gate system:** 8 gates with per-content-type OQI thresholds
6. **Progress tracking:** Built-in dashboard that Claude updates continuously
7. **Git workflow:** Commit conventions and readiness checklist
8. **Feedback loop:** Post-page reviews and learning log for continuous improvement

### 12.2 Missing Elements

1. **Content calendar integration:** The manual does not specify how content requests arrive from the calendar. A separate content calendar document should feed the execution order.

2. **Batch production workflow:** When producing multiple related pages (e.g., a collection + its products + email campaign), there is no batch coordination logic. The manual assumes sequential page production.

3. **SME scheduling:** The manual depends on human SME availability for Gates 5, 6, and 8 but does not specify how SME time is scheduled.

4. **Emergency/expedited workflow:** There is no expedited path for urgent content (e.g., a time-sensitive campaign). All content follows the same pipeline.

### 12.3 Improvements to Consider for V2

1. Add a content calendar reference document
2. Add batch production logic with dependency resolution
3. Add an expedited pipeline (reduced gates for time-sensitive, low-risk content)
4. Add more granular status tracking at the individual scene level (not just page level)

### 12.4 Readiness Assessment

| Criterion | Rating | Notes |
|-----------|--------|-------|
| Production-ready | ✓ | All stages, gates, templates, and instructions are defined |
| Claude-operable | ✓ | §7 contains direct instructions for Claude |
| Self-contained | ✓ | References external documents but does not require them to function |
| Repeatable | ✓ | Same inputs always produce the same workflow |
| Auditable | ✓ | Every stage produces structured artifacts |
| Versioned | ✓ | Version field in document metadata |

---

**End of Manual**

**Version:** 1.0
**Status:** Active
**Phase:** 7 — Production Content Creation
**Owner:** Editorial Lead + Claude Code
**Classification:** Internal — House of Padmavati
**Last Updated:** July 2026