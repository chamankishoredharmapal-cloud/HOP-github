# Editorial Operating System — Index

Quick navigation to every document in the Editorial Operating System.

## Brand Architecture (`02-brand-architecture/`)

| Document | Purpose | Key Sections |
|----------|---------|--------------|
| `brand-bible.md` | Identity, purpose, vision, values, personality, audience, promises | Brand Territories, The Coastal Blossom Philosophy, Audience Profiles, Brand Promises |
| `voice-bible.md` | Tone matrix, voice dimensions, sentence architecture rules | Tone Matrix by Page, Voice Characteristics, Sentence Architecture, Paragraph Rules |
| `messaging-pillars.md` | Five messaging pillars with core message, emotional outcome, page primacy | Heritage, Craft, Quietness, Continuance, Intention |
| `editorial-principles.md` | Six editorial principles with definitions and enforcement | Show Don't Tell, Specific Over Generic, Rooted in the Real, Restrained, Human-Scale, Trust Through Transparency |
| `emotional-principles.md` | Eight emotional principles for designing customer experiences | Arrival, Curiosity, Wonder, Trust, Desire, Confidence, Belonging, Legacy |

## Vocabulary System (`04-vocabulary-system/`)

| Document | Purpose | Key Sections |
|----------|---------|--------------|
| `approved-words.md` | Approved words by category with rationale | Luxury, Craft, Emotion, Time, Color, Human, Place |
| `forbidden-words.md` | Complete forbidden word list with replacements and rationale | Luxury Clichés, Urgency Words, Marketing Language, Generic Praise |
| `preferred-verbs-nouns.md` | Verb and noun substitution tables | Transaction → Belonging, Commerce → Curation, Generic → Specific |
| `grammar-and-usage.md` | Grammar rules with examples | Punctuation, Capitalization, Spelling (Indian English), Formatting |

## Content Architecture (`src/content/`)

| Document | Purpose |
|----------|---------|
| `README.md` | Runtime content architecture — directory structure, frontmatter schemas, body block types, relationship rules |
| `../scripts/compile-content.js` | Content Compiler (Phase 4) — Node.js build script, validates, resolves, indexes content |
| `_schemas/*.yaml` | YAML schema files for all 9 content types (journal, collection, product, craft-note, weaver-portrait, field-note, house-letter, ritual-guide, glossary) |
| Example content units | One per content type at `src/content/{type}/{slug}/index.md` |

## Page Strategy (`06-page-strategy/`)

| Document | Purpose |
|----------|---------|
| `README.md` | Page strategy framework — how every page will be documented with purpose, goals, emotions, CTAs, and content priority |

## Emotional Architecture (`07-emotional-architecture/`)

| Document | Purpose | Key Sections |
|----------|---------|--------------|
| `emotional-journey.md` | Full emotional arc from Arrival to Legacy | Eight emotional stages with triggers, System 1/System 2 activation, and page mappings |
| `page-emotion-map.md` | Table mapping every page to primary emotion, secondary emotion, and emotional purpose | All 15 storefront pages with detailed emotional intent |

## How to Find What You Need

**I need to understand the content types and structure:** → `src/content/README.md`

**I need to understand HOP's identity:** → `brand-bible.md`

**I need to check if a word is allowed:** → `forbidden-words.md` + `approved-words.md`

**I need to know the tone for a specific page:** → `voice-bible.md` (Tone Matrix section)

**I need to write a new page:** → `page-strategy/README.md` + `emotional-journey.md` + `voice-bible.md`

**I need to review my writing for consistency:** → `editorial-principles.md` + `grammar-and-usage.md` + `forbidden-words.md`

**I need to design an emotional experience:** → `emotional-principles.md` + `emotional-journey.md` + `page-emotion-map.md`

**I need to explain the EOS to someone new:** → `README.md` (this directory)

---

**Last updated:** July 2026
