# House of Padmavati — Remaining Phases Roadmap

## Introduction

This document is the master execution roadmap for the remaining implementation phases of the House of Padmavati Editorial Operating System (EOS).

### Current Status

| Phase | Status |
|-------|--------|
| Phase 1 — Brand Architecture, Vocabulary System, Page Strategy, Emotional Architecture | Complete |
| Phase 2 — Knowledge Base | Complete |
| Phase 3 — Runtime Content Architecture | Complete |
| Phase 4 — Content Compiler | Complete |
| Phase 5 — AI Prompt Library | Not started |
| Phase 6 — Journal Migration | Not started |
| Phase 7 — Production Content Creation | Not started |

Phases 1 through 4 have been implemented and validated. Phases 5 through 7 remain. This document governs all remaining implementation work. Every future implementation must follow this roadmap. No phase may be started until its dependent phases are complete. No phase may be skipped.

---

## Overall Execution Order

```
Phase 3 — Runtime Content Architecture ✅
  (src/content/ structure, schemas, relationships, content service)

       │
       ▼

Phase 4 — Content Compiler ✅
  (validates, resolves, indexes content at build time)

       │
       ├──────────────────────────────────────────┐
       ▼                                          ▼

Phase 5 — AI Prompt Library             Phase 6 — Journal Migration
  (prompts use knowledge +                (moves 6 articles into
   produce content for Phase 3)           the Phase 3 structure)

       │                                          │
       └──────────────────┬───────────────────────┘
                          ▼

              Phase 7 — Production Content Creation
           (end-to-end workflow for new content)
```

### Why This Order Must Never Change

1. **Content architecture before compiler.** The compiler compiles whatever structure exists in `src/content/`. The structure must be designed and documented first.

2. **Compiler before prompts.** Prompts generate content files that must conform to the content schemas. The schemas must be finalized before prompts can target them reliably.

3. **Compiler before migration.** Migrating journal articles requires a stable compiler to validate the migrated content and generate the indexes the React app depends on.

4. **Knowledge + compiler + content architecture before production.** Production content creation depends on the knowledge base (for strategic grounding), the content architecture (for structure), the compiler (for validation and indexing), and prompts (for generation).

5. **Prompts before journal migration.** Journal articles can be generated using prompts, ensuring they match the editorial voice and schema requirements from the start.

6. **Phase 5 and Phase 6 can run in parallel** once Phase 3 and Phase 4 are stable. Both depend on completed Phases 3 and 4 but do not depend on each other.

7. **Phase 7 depends on all prior phases.** The production workflow cannot function without prompts (Phase 5), migrated journal content (Phase 6), the compiler (Phase 4), or the content architecture (Phase 3).

---

## Phase 3 — Runtime Content Architecture ✅

**Status:** Complete (July 2026)

### Purpose

Define the permanent structure for all editorial content at House of Padmavati. Every content unit — journal article, collection narrative, product story, craft note, weaver portrait, field note, house letter, ritual guide, and glossary entry — is a structured Markdown file with YAML frontmatter, living in `src/content/`. This structure is the single source of truth that the Content Compiler reads, the React app consumes, and AI prompts target.

### Objectives

- Create a consistent directory structure for all content types under `src/content/`
- Define YAML schema files for every content type (frontmatter fields, types, validation rules)
- Establish a body block system with typed, composable blocks (`hero`, `intro`, `body`, `pull-quote`, `image`, `video`, `system-2`, `step`, `gallery`, `closure`, `divider`, `related`)
- Define relationship rules between content types (articles, products, collections, glossary terms)
- Create example content units for every content type
- Implement TypeScript interfaces and a content service contract for the React app
- Document naming conventions, slug rules, image organization, and metadata standards

### Scope

**Included:**
- All 9 content type directories under `src/content/`
- Schema YAML files for all 9 content types in `src/content/_schemas/`
- At least one example content unit per type (with YAML frontmatter and body blocks)
- TypeScript interfaces in `src/types/content.ts`
- Content service contract in `src/services/contentService.ts`
- Relationship rules between content types
- Slug generation and uniqueness rules
- Image organization and naming standards
- SEO and metadata standards per content type
- README documentation for the content architecture

**Not included:**
- The Content Compiler (Phase 4)
- AI prompt templates (Phase 5)
- Real production content (Phase 7)
- Database integration for product and collection data
- Studio write-mode integration

### Deliverables

**Directories:**
- `src/content/`
- `src/content/_schemas/`
- `src/content/journal/`
- `src/content/collections/`
- `src/content/products/`
- `src/content/craft-notes/`
- `src/content/weaver-portraits/`
- `src/content/field-notes/`
- `src/content/house-letters/`
- `src/content/ritual-guides/`
- `src/content/glossary/`

**Files:**
- `src/content/_schemas/journal.yaml`
- `src/content/_schemas/collection.yaml`
- `src/content/_schemas/product.yaml`
- `src/content/_schemas/craft-note.yaml`
- `src/content/_schemas/weaver-portrait.yaml`
- `src/content/_schemas/field-note.yaml`
- `src/content/_schemas/house-letter.yaml`
- `src/content/_schemas/ritual-guide.yaml`
- `src/content/_schemas/glossary.yaml`
- `src/content/journal/example-slug/index.md` (one example per type)
- `src/types/content.ts`
- `src/services/contentService.ts`
- `src/content/README.md`

### Detailed TODO Checklist

- [x] Create `src/content/` directory with all 9 type subdirectories
- [x] Create `src/content/_schemas/` directory
- [x] Write `journal.yaml` schema with all required and optional fields
- [x] Write `collection.yaml` schema
- [x] Write `product.yaml` schema
- [x] Write `craft-note.yaml` schema
- [x] Write `weaver-portrait.yaml` schema
- [x] Write `field-note.yaml` schema
- [x] Write `house-letter.yaml` schema
- [x] Write `ritual-guide.yaml` schema
- [x] Write `glossary.yaml` schema
- [x] Create one example content unit per type with full frontmatter
- [x] Write body blocks for each example unit (hero, intro, body, pull-quote, closure, etc.)
- [x] Define `ContentBlock` union type in TypeScript
- [x] Define per-content-type frontmatter interfaces
- [x] Define `ContentIndexEntry`, `RelationshipGraph`, `SearchIndexEntry` types
- [x] Implement all content service function signatures
- [x] Document block type registry (12 block types, required fields, rendering)
- [x] Document relationship rules (slug-based, UUID-based, validation severity)
- [x] Document slug rules, UUID strategy, image organization
- [x] Document SEO metadata generation rules
- [x] Write `src/content/README.md`
- [x] Verify TypeScript compiles without errors

### Dependencies

- Phase 2 (Knowledge Base) — content types and editorial frameworks were defined using research insights

### Expected Output

A fully structured `src/content/` directory with 9 content types, 9 schema files, 9 example content units, complete TypeScript interfaces, a content service contract, and comprehensive documentation. The React app can import from `@/types/content` and `@/services/contentService`. The structure is validated by the compiler (Phase 4).

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Schema changes required after compiler is built | Low | Medium | Schemas are versioned in Git. Changes are possible but should be batched. The compiler reads schemas dynamically. |
| Block type registry grows unmanageably | Low | Medium | Keep to the 12 defined block types. Reject new block types unless they serve a distinct rendering purpose. |
| Relationship rules are too complex to validate | Low | Medium | The compiler treats missing slugs/UUIDs as warnings (not errors) except for article references. |

### Validation Checklist

- [x] All 9 content type directories exist under `src/content/`
- [x] Every content type has a schema file at `src/content/_schemas/{type}.yaml`
- [x] At least one example content unit exists per type
- [x] `src/types/content.ts` defines all interfaces and compiles
- [x] `src/services/contentService.ts` defines all function signatures
- [x] The compiler can read and parse every example content unit
- [x] Slug rules, image rules, and metadata rules are documented
- [x] Block type registry is complete and documented

### Definition of Done

Phase 3 is done when `src/content/` exists with all type directories and schema files, TypeScript interfaces for the content service are defined and compile with zero errors, an example content unit exists per type, and the architecture is documented in `src/content/README.md`.

---

## Phase 4 — Content Compiler ✅

**Status:** Complete (July 2026)

### Purpose

Build a Node.js build script that reads the `src/content/` directory tree, validates every content unit against its schema, resolves relationships, generates typed TypeScript index files, copies assets to the public directory, and produces auxiliary files (search index, relationship graph). The compiler runs as part of the build pipeline and as a standalone command.

### Objectives

- Validate all content units against their frontmatter schemas at build time
- Generate typed TypeScript files that the React app can import directly
- Resolve relationship references with error reporting (errors for broken article links, warnings for missing UUIDs)
- Calculate reading time for every content unit
- Generate a search index (title, dek, tags, slug, type, body)
- Generate a relationship graph for related content widgets
- Copy hero images to `public/content/{type}/{slug}/hero.jpg`
- Support incremental builds using MD5 hash manifest
- Report validation errors, warnings, and reference integrity issues
- Fail the build on hard errors (missing required fields, broken internal links)
- Exit code 0 on success, code 1 on hard errors

### Scope

**Included:**
- Node.js ESM build script at `scripts/compile-content.js`
- Content discovery: walks `src/content/{type}/*/index.md` for all 9 types
- YAML frontmatter parsing via `js-yaml`
- Line-based body block parser (`---` delimited)
- Custom schema validation against YAML schema files (required fields, enums, patterns, date format, string length, type checks)
- Image existence validation (hero images, in-body images, gallery images)
- Hero image copying to `public/content/{type}/{slug}/hero.jpg`
- Reading time calculation (word count / 200, overrideable via frontmatter)
- Relationship resolution (articles, craft notes, collections, glossary terms, products)
- Slug uniqueness checking within each content type
- 12 generated TypeScript output files
- MD5 hash manifest for incremental builds
- `npm run content:build` script in package.json

**Not included:**
- Image optimization or transformation (handled by Vite)
- Sitemap generation
- AI prompt integration
- Content creation or editing
- Real-time content watching
- Multi-language content support
- Content scheduling (future dates)

### Deliverables

**Files:**
- `scripts/compile-content.js` (ESM, single-file compiler, ~760 lines)

**Generated files (all in `src/data/__generated__/`):**
- `journal.ts` — typed array of `JournalArticle[]`
- `collections.ts` — typed array of `CollectionNarrative[]`
- `products.ts` — typed array of `ProductStory[]`
- `craft-notes.ts` — typed array of `CraftNote[]`
- `weaver-portraits.ts` — typed array of `WeaverPortrait[]`
- `field-notes.ts` — typed array of `FieldNote[]`
- `house-letters.ts` — typed array of `HouseLetter[]`
- `ritual-guides.ts` — typed array of `RitualGuide[]`
- `glossary.ts` — typed array of `GlossaryEntry[]`
- `content-index.ts` — flat `ContentIndexEntry[]` for search and sitemap
- `relationship-graph.ts` — `RelationshipGraph` map for related content widgets
- `search-index.ts` — `SearchIndexEntry[]` for client-side search
- `.manifest.json` — MD5 hash cache for incremental builds

**Copied assets:**
- `public/content/{type}/{slug}/hero.jpg` for every content unit with a hero image

**Configuration:**
- `npm run content:build` script in `package.json`
- `src/data/__generated__/` entry in `.gitignore`

### Detailed TODO Checklist

- [x] Install `js-yaml` as a dev dependency
- [x] Create `scripts/compile-content.js`
- [x] Implement content discovery (walk `src/content/` tree)
- [x] Implement YAML frontmatter parser
- [x] Implement body block parser (`---` delimited, 12 block types)
- [x] Implement schema validator (required fields, enums, patterns, date format, types)
- [x] Implement image validation (hero + block images)
- [x] Implement reading time calculation
- [x] Implement relationship resolution (articles, craft notes, collections, glossary, products)
- [x] Implement per-content-type TypeScript file generation
- [x] Implement content-index generation
- [x] Implement relationship-graph generation (forward references)
- [x] Implement search-index generation
- [x] Implement hero image copying to `public/content/`
- [x] Implement incremental build support (MD5 hash manifest)
- [x] Implement error reporting with file path, field name, expected value
- [x] Add `npm run content:build` script to `package.json`
- [x] Add `src/data/__generated__/` to `.gitignore`
- [x] Create `src/data/__generated__/` directory with `.gitkeep`
- [x] Verify TypeScript compiles with zero errors (`tsc --noEmit`)
- [x] Create placeholder hero images for example content
- [x] Create stub glossary entries for referenced terms
- [x] Remove broken cross-references from example content
- [x] Verify full build succeeds with zero errors
- [x] Verify incremental build (unchanged files cached, 14ms build time)

### Dependencies

- Phase 3 (Runtime Content Architecture) — the compiler compiles the `src/content/` structure defined in Phase 3

### Expected Output

A Node.js build script that, when run via `npm run content:build`, validates all 11 content units, generates 12 TypeScript files in `src/data/__generated__/`, copies 8 hero images to `public/content/`, and exits with code 0. On invalid content, it reports specific errors with file path, field name, and expected value, and exits with code 1. Incremental builds complete in under 200ms.

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Compiler becomes too complex to maintain | Low | High | Single-file design. No AST transforms. No custom syntax. No complex data transformations. Reject feature creep. |
| Build time degrades as content grows | Low | Medium | Incremental builds via hash manifest. Full build of 100 units targets < 2 seconds. |
| Frontmatter validation misses edge cases | Low | Medium | Test with edge cases: empty optional fields, very long strings, special characters, Unicode. |
| Image copying fails silently | Low | Medium | File existence check before copy. Error reporting on copy failure. |

### Validation Checklist

- [x] `npm run content:build` runs the compiler and exits with code 0 on valid content
- [x] `npm run content:build` exits with code 1 with specific errors on invalid content
- [x] All 12 output files are generated in `src/data/__generated__/`
- [x] Reading time is calculated for journal and craft-note content types
- [x] Relationship graph contains forward references
- [x] Hero images are copied to `public/content/{type}/{slug}/hero.jpg`
- [x] Error messages include file path, field name, and expected value
- [x] Incremental builds only recompile changed content
- [x] Full build of 11 content units completes in 40ms
- [x] TypeScript compiles without errors (`tsc --noEmit` passes)

### Definition of Done

Phase 4 is done when `npm run content:build` validates content, generates all 12 index files, copies assets to `public/content/`, and exits with appropriate code (0 on success, 1 on errors). Incremental builds work via MD5 hash manifest. TypeScript compiles with zero errors.

---

## Phase 5 — AI Prompt Library

**Status:** Not started

### Purpose

Build a versioned, tested, and maintained collection of prompt templates for every content type. Every prompt is designed to produce content that conforms to the Editorial Operating System — the correct content type schema, voice dimensions, vocabulary rules, and editorial framework. Prompts are the interface between strategic intent (what we want to say) and AI execution (how Claude Opus writes it).

### Objectives

- Define a standard prompt template with reusable sections (description, context requirements, strategic principles, brand constraints, content schema, input, output format, example output, review criteria)
- Create generation prompts for all 10 content types and touchpoints (homepage hero, collection narrative, product story, journal article, craft note, weaver portrait, house letter, ritual guide, field note, glossary definition)
- Create SEO metadata prompts (meta title, meta description, OG image alt, JSON-LD structured data)
- Create microcopy prompts (CTA, error state, empty state, checkout label, toast notification)
- Create email copy prompts (welcome, order confirmation, dispatch notification, delivery confirmation, journal notification)
- Create policy copy prompts (shipping policy, returns policy, privacy policy, terms of service)
- Create review prompts that catch violations in known-bad content (consistency check, sensory density check, forbidden words check, System 2 presence check, accessibility check, SEO check, grammar check)
- Create critique prompts for holistic evaluation (narrative pacing, emotional resonance, brand voice fidelity, structural flow)
- Create rewrite prompts for content transformation (for voice, for page type, for email, for social, for accessibility, simplify)
- Create translation prompts (Kannada, Hindi)
- Provide example outputs for every generation prompt so quality is measurable
- Version prompts so changes are tracked and testable
- Establish a prompt review and maintenance lifecycle

### Scope

**Included:**
- `docs/research/prompts/` directory with all category subdirectories
- `_prompt-template.md` defining the standard structure
- 10 generation prompts in `docs/research/prompts/generate/`
- 4 SEO prompts in `docs/research/prompts/seo/`
- 5 microcopy prompts in `docs/research/prompts/microcopy/`
- 5 email prompts in `docs/research/prompts/email/`
- 4 policy prompts in `docs/research/prompts/policies/`
- 7 review prompts in `docs/research/prompts/review/`
- 4 critique prompts in `docs/research/prompts/critique/`
- 6 rewrite prompts in `docs/research/prompts/rewrite/`
- 2 translation prompts in `docs/research/prompts/translation/`
- Example outputs in `docs/research/prompts/examples/`
- Prompt testing methodology documented in README
- Prompt versioning conventions documented
- Prompt review and lifecycle workflow documented

**Not included:**
- Actual content generation for production use (Phase 7)
- Automated prompt test runner (future tooling)
- Integration with an AI API
- Content compiler modifications

### Deliverables

**Directories:**
- `docs/research/prompts/`
- `docs/research/prompts/generate/`
- `docs/research/prompts/seo/`
- `docs/research/prompts/microcopy/`
- `docs/research/prompts/email/`
- `docs/research/prompts/policies/`
- `docs/research/prompts/review/`
- `docs/research/prompts/critique/`
- `docs/research/prompts/rewrite/`
- `docs/research/prompts/translation/`
- `docs/research/prompts/examples/`
- `docs/research/prompts/_archive/`

**Files — Generation (10):**
- `docs/research/prompts/generate/homepage-hero-v1.md`
- `docs/research/prompts/generate/collection-narrative-v1.md`
- `docs/research/prompts/generate/product-story-v1.md`
- `docs/research/prompts/generate/journal-article-v1.md`
- `docs/research/prompts/generate/craft-note-v1.md`
- `docs/research/prompts/generate/weaver-portrait-v1.md`
- `docs/research/prompts/generate/house-letter-v1.md`
- `docs/research/prompts/generate/ritual-guide-v1.md`
- `docs/research/prompts/generate/field-note-v1.md`
- `docs/research/prompts/generate/glossary-definition-v1.md`

**Files — SEO (4):**
- `docs/research/prompts/seo/meta-title-v1.md`
- `docs/research/prompts/seo/meta-description-v1.md`
- `docs/research/prompts/seo/og-image-alt-v1.md`
- `docs/research/prompts/seo/json-ld-v1.md`

**Files — Microcopy (5):**
- `docs/research/prompts/microcopy/cta-v1.md`
- `docs/research/prompts/microcopy/error-state-v1.md`
- `docs/research/prompts/microcopy/empty-state-v1.md`
- `docs/research/prompts/microcopy/checkout-label-v1.md`
- `docs/research/prompts/microcopy/toast-notification-v1.md`

**Files — Email (5):**
- `docs/research/prompts/email/welcome-v1.md`
- `docs/research/prompts/email/order-confirmation-v1.md`
- `docs/research/prompts/email/dispatch-notification-v1.md`
- `docs/research/prompts/email/delivery-confirmation-v1.md`
- `docs/research/prompts/email/journal-notification-v1.md`

**Files — Policy (4):**
- `docs/research/prompts/policies/shipping-policy-v1.md`
- `docs/research/prompts/policies/returns-policy-v1.md`
- `docs/research/prompts/policies/privacy-policy-v1.md`
- `docs/research/prompts/policies/terms-of-service-v1.md`

**Files — Review (7):**
- `docs/research/prompts/review/consistency-check-v1.md`
- `docs/research/prompts/review/sensory-density-check-v1.md`
- `docs/research/prompts/review/forbidden-words-check-v1.md`
- `docs/research/prompts/review/system-2-presence-check-v1.md`
- `docs/research/prompts/review/accessibility-check-v1.md`
- `docs/research/prompts/review/seo-check-v1.md`
- `docs/research/prompts/review/grammar-check-v1.md`

**Files — Critique (4):**
- `docs/research/prompts/critique/narrative-pacing-v1.md`
- `docs/research/prompts/critique/emotional-resonance-v1.md`
- `docs/research/prompts/critique/brand-voice-fidelity-v1.md`
- `docs/research/prompts/critique/structural-flow-v1.md`

**Files — Rewrite (6):**
- `docs/research/prompts/rewrite/for-voice-v1.md`
- `docs/research/prompts/rewrite/for-page-type-v1.md`
- `docs/research/prompts/rewrite/for-email-v1.md`
- `docs/research/prompts/rewrite/for-social-v1.md`
- `docs/research/prompts/rewrite/for-accessibility-v1.md`
- `docs/research/prompts/rewrite/simplify-v1.md`

**Files — Translation (2):**
- `docs/research/prompts/translation/translate-to-kannada-v1.md`
- `docs/research/prompts/translation/translate-to-hindi-v1.md`

**Files — Examples:**
- `docs/research/prompts/examples/homepage-hero-example-v1.md`
- `docs/research/prompts/examples/collection-narrative-example-v1.md`
- `docs/research/prompts/examples/product-story-example-v1.md`
- `docs/research/prompts/examples/journal-article-example-v1.md`
- `docs/research/prompts/examples/craft-note-example-v1.md`

**Documentation:**
- `docs/research/prompts/README.md` — Prompt library index, usage guide, testing methodology, versioning conventions
- `docs/research/prompts/_prompt-template.md` — Base template every prompt follows

### Detailed TODO Checklist

**Phase 5a — Foundation**
- [ ] Create `docs/research/prompts/` directory structure with all category subdirectories
- [ ] Create `docs/research/prompts/_prompt-template.md` defining the standard structure (frontmatter metadata, description, context requirements, strategic principles, brand constraints, content schema, input, output format, example output, review criteria)
- [ ] Create `docs/research/prompts/README.md` with library index, usage guide, testing methodology, versioning conventions, and review lifecycle

**Phase 5b — Generation Prompts (10)**
- [ ] Write `homepage-hero-v1.md` — hero tagline + subtitle generation
- [ ] Write `collection-narrative-v1.md` — full collection story
- [ ] Write `product-story-v1.md` — sensory product description + System 2 accordion
- [ ] Write `journal-article-v1.md` — full journal article with body blocks
- [ ] Write `craft-note-v1.md` — educational explainer
- [ ] Write `weaver-portrait-v1.md` — artisan story with portrait details
- [ ] Write `house-letter-v1.md` — brand letter/announcement
- [ ] Write `ritual-guide-v1.md` — occasion/care guide with step blocks
- [ ] Write `field-note-v1.md` — travelogue/loom diary
- [ ] Write `glossary-definition-v1.md` — term definition with pronunciation

**Phase 5c — Review Prompts (7)**
- [ ] Write `consistency-check-v1.md` — brand voice, vocabulary, tone matrix alignment
- [ ] Write `sensory-density-check-v1.md` — adequate sensory language per content type
- [ ] Write `forbidden-words-check-v1.md` — detect any forbidden word
- [ ] Write `system-2-presence-check-v1.md` — verify trust signal requirements
- [ ] Write `accessibility-check-v1.md` — alt text, reading level, semantic structure
- [ ] Write `seo-check-v1.md` — title length, description length, OG image, JSON-LD
- [ ] Write `grammar-check-v1.md` — grammar, punctuation, Indian English conventions

**Phase 5d — Remaining Prompts (18)**
- [ ] Write SEO prompts: `meta-title-v1.md`, `meta-description-v1.md`, `og-image-alt-v1.md`, `json-ld-v1.md`
- [ ] Write microcopy prompts: `cta-v1.md`, `error-state-v1.md`, `empty-state-v1.md`, `checkout-label-v1.md`, `toast-notification-v1.md`
- [ ] Write email prompts: `welcome-v1.md`, `order-confirmation-v1.md`, `dispatch-notification-v1.md`, `delivery-confirmation-v1.md`, `journal-notification-v1.md`
- [ ] Write policy prompts: `shipping-policy-v1.md`, `returns-policy-v1.md`, `privacy-policy-v1.md`, `terms-of-service-v1.md`

**Phase 5e — Critique + Rewrite + Translation Prompts (12)**
- [ ] Write critique prompts: `narrative-pacing-v1.md`, `emotional-resonance-v1.md`, `brand-voice-fidelity-v1.md`, `structural-flow-v1.md`
- [ ] Write rewrite prompts: `for-voice-v1.md`, `for-page-type-v1.md`, `for-email-v1.md`, `for-social-v1.md`, `for-accessibility-v1.md`, `simplify-v1.md`
- [ ] Write translation prompts: `translate-to-kannada-v1.md`, `translate-to-hindi-v1.md`

**Phase 5f — Examples and Validation**
- [ ] Create example output for homepage hero prompt
- [ ] Create example output for collection narrative prompt
- [ ] Create example output for product story prompt
- [ ] Create example output for journal article prompt
- [ ] Create example output for craft note prompt
- [ ] Test review prompts against known-good content (verify they pass)
- [ ] Test review prompts against known-bad content (verify they detect violations)
- [ ] Test at least one generation prompt end-to-end: brief → generate → review
- [ ] Verify prompt versioning conventions are documented and applied

### Dependencies

- Phase 2 (Knowledge Base) — prompts reference Knowledge Base documents for context, strategic principles, and brand constraints
- Phase 3 (Runtime Content Architecture) — prompts must target the content schemas and body block types defined in Phase 3
- Phase 4 (Content Compiler) — generated content from prompts must pass compiler validation

### Expected Output

A complete prompt library at `docs/research/prompts/` with 38 prompt templates across 9 categories, a standard prompt template, example outputs for generation prompts, and a documented testing and maintenance methodology. Every prompt references the relevant Knowledge Base documents, targets the correct content schema, and includes review criteria.

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI-generated content feels generic despite prompts | Medium | High | Review and critique prompts catch generic language. Sensory density check identifies insufficient specificity. Rewrite-for-voice can transform generic content. |
| Prompts fall out of sync with voice/vocabulary updates | Medium | High | Add prompt review to quarterly editorial audit. When voice bible or vocabulary system is updated, all prompts must be reviewed. |
| AI hallucinates craft or cultural details | High | Critical | Craft Advisor reviews all technical content. Prompts include "do not fabricate" instructions. Factual claims must be traceable. |
| Long prompts exceed AI context window | Medium | Medium | Keep prompt inputs focused. Load Knowledge Base documents as separate context. The prompt itself should be instruction, not encyclopedia. |
| AI model changes affect output quality | Medium | High | Version prompts. Test against known inputs after model updates. Compare outputs. Pin model versions where possible. |

### Validation Checklist

- [ ] `docs/research/prompts/` directory exists with all category subdirectories
- [ ] `_prompt-template.md` defines the standard structure
- [ ] All 38 prompts exist at version v1 in the correct directories
- [ ] Every generation prompt has a corresponding example output
- [ ] Review prompts demonstrably catch violations in known-bad content
- [ ] Prompt testing methodology is documented in the README
- [ ] Prompt versioning conventions are documented
- [ ] At least one generation prompt produces valid content that passes compiler validation

### Definition of Done

Phase 5 is done when all 38 prompts listed in the deliverables exist at v1 in the correct directory, the prompt template is documented, each generation prompt has an example output, review prompts can catch violations in known-bad content, and the testing methodology is documented.

---

## Phase 6 — Journal Migration

**Status:** Not started

### Purpose

Migrate the six hardcoded journal articles from `src/data/journalArticles.ts` into the new runtime content architecture (`src/content/journal/`). This is the first real validation of both the content architecture (Phase 3) and the content compiler (Phase 4). The existing article slugs must be preserved to maintain URLs, search engine rankings, and external links.

### Objectives

- Move all 6 journal articles from the hardcoded array into individual `src/content/journal/{slug}/` directories
- Preserve all existing slugs exactly (no redirects needed)
- Add full body content to every article (the current stubs have no body)
- Add complete frontmatter with SEO metadata, related content references, and glossary terms
- Add hero images to each content unit directory
- Update the React app to consume articles from the content service
- Remove the hardcoded `src/data/journalArticles.ts` after 1 week of production verification
- Ensure zero regressions to the journal index and detail pages

### Scope

**Included:**
- 6 content unit directories under `src/content/journal/` with full frontmatter and body blocks
- Hero image for each article
- SEO metadata (title, description, OG image) in frontmatter
- Related product, article, and glossary references
- Updates to `Journal.tsx` and `JournalDetail.tsx` to use the content service
- Removal of `src/data/journalArticles.ts` (after 1 week production verification)
- Reading time display (new feature from the compiled content)
- Validated against the content compiler

**Not included:**
- Creating new journal articles beyond the 6 existing ones (Phase 7)
- Migrating other content types (collections, products, etc.)
- Rewriting the existing article slugs
- Changing URL patterns

### Deliverables

**Content Units:**
- `src/content/journal/morning-light-reads-weave/index.md` + `hero.jpg`
- `src/content/journal/five-drapes-quiet-wedding/index.md` + `hero.jpg`
- `src/content/journal/linen-art-of-doing-less/index.md` + `hero.jpg`
- `src/content/journal/organza-in-the-rain/index.md` + `hero.jpg`
- `src/content/journal/keepsake-card-jasmine/index.md` + `hero.jpg`
- `src/content/journal/padmavati-name-behind-house/index.md` + `hero.jpg`

**Code Changes:**
- `Journal.tsx` — updated to import from content service instead of hardcoded array
- `JournalDetail.tsx` — updated to import from content service, use compiled reading time, render body blocks
- `src/data/journalArticles.ts` — deleted after 1 week production verification
- Any related imports updated

**Verification:**
- Compiler validates all 6 articles with zero errors
- `/journal` renders all 6 articles
- `/journal/{slug}` renders full article body for each slug
- SEO metadata is correct per article
- Reading time is displayed

### Detailed TODO Checklist

**Phase 6a — Content Writing**
- [ ] Write full body content for `morning-light-reads-weave` using The Essay narrative framework
- [ ] Write full body content for `five-drapes-quiet-wedding` using The Essay framework
- [ ] Write full body content for `linen-art-of-doing-less` using The Essay framework
- [ ] Write full body content for `organza-in-the-rain` using The Essay framework
- [ ] Write full body content for `keepsake-card-jasmine` using The Essay framework
- [ ] Write full body content for `padmavati-name-behind-house` using The Essay framework
- [ ] Add complete frontmatter for each article (type, title, slug, published, status, author, tag, dek, hero, alt, seo, relatedProducts, relatedArticles, glossaryTerms)
- [ ] Add hero image to each content unit directory (migrated from `src/assets/` or new)
- [ ] Add body blocks (hero, intro, body, pull-quote, image, closure) to each article
- [ ] Populate related content references for each article
- [ ] Run compiler and fix any validation errors

**Phase 6b — Code Migration**
- [ ] Update `Journal.tsx` to load articles from content service
- [ ] Update `JournalDetail.tsx` to load article from content service
- [ ] Update `JournalDetail.tsx` to render body blocks from compiled content
- [ ] Add reading time display to article detail view
- [ ] Update `useMetadata` calls to use content service data
- [ ] Update any imports that reference `src/data/journalArticles.ts`
- [ ] Run compiler and verify all 6 articles pass validation
- [ ] Run `npm run build` and verify zero errors
- [ ] Test `/journal` renders all 6 articles
- [ ] Test `/journal/{slug}` renders full article for each of 6 slugs
- [ ] Verify SEO metadata (title tags, meta descriptions) are correct
- [ ] Verify JSON-LD structured data is present and valid
- [ ] Verify hero images load with alt text
- [ ] Verify reading time displays correctly

**Phase 6c — Production Verification**
- [ ] Deploy to production
- [ ] Verify all 6 articles in production for 1 week
- [ ] Monitor for any issues (broken links, missing images, metadata errors)
- [ ] After 1 week with no issues: remove `src/data/journalArticles.ts`
- [ ] Remove any remaining references to the hardcoded array
- [ ] Final `npm run build` verification

### Dependencies

- Phase 3 (Runtime Content Architecture) — provides the content directory structure, schemas, body blocks, and content service
- Phase 4 (Content Compiler) — validates migrated content, generates indexes the React app consumes
- Phase 5 (AI Prompt Library) — can be used to generate article body content, though human writing is also acceptable

### Expected Output

Six fully populated journal content units under `src/content/journal/` with complete frontmatter, body blocks, hero images, and related content references. The React app consumes all 6 articles from the content service. The hardcoded `src/data/journalArticles.ts` is removed after 1 week of production verification. No URLs change. No redirects are needed.

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Migration changes existing URLs | Low | Critical | Slugs are preserved exactly. No redirects needed. Verify every URL before and after. |
| Content quality drop during migration | Medium | High | The hardcoded array is not removed until the new system has been verified in production for one week. Rollback is a single commit revert. |
| Duplicate content from dual systems during transition | Low | Medium | The transition is a cutover — either the old system or the new system serves a given page. Not both. |
| Missing hero images | Medium | Medium | Images from `src/assets/` are migrated into each content unit directory. Compiler validates presence. |

### Validation Checklist

- [ ] All 6 articles exist in `src/content/journal/` with full frontmatter and body content
- [ ] Slugs match the existing hardcoded slugs exactly
- [ ] Compiler validates all 6 articles with zero errors
- [ ] `/journal` loads all 6 articles from the content service
- [ ] `/journal/{slug}` for each article renders full body content
- [ ] SEO metadata is correct per article (title < 70 chars, description < 160 chars)
- [ ] JSON-LD is valid per article
- [ ] Hero images render with alt text
- [ ] Reading time is displayed on article detail
- [ ] `src/data/journalArticles.ts` is removed (after 1 week production verification)
- [ ] Build succeeds with zero errors

### Definition of Done

Phase 6 is done when all 6 articles exist in `src/content/journal/` with full content, the content service serves them, `/journal` and `/journal/{slug}` render correctly, SEO metadata is complete, and `src/data/journalArticles.ts` is removed after 1 week of production verification with zero regressions.

---

## Phase 7 — Production Content Creation

**Status:** Not started

### Purpose

Define the end-to-end workflow for creating, reviewing, publishing, and maintaining content in the Editorial Operating System. This phase does not create content — it defines the process by which all future content is created. It provides the brief template, the review criteria, the approval chain, the publishing process, and the maintenance schedule that turns the EOS from a set of documents into a day-to-day content operation.

### Objectives

- Document a complete 9-stage production workflow (Research → Brief → Prompt Selection → Claude Generation → Human Review → QA → Revision → Approval → Publishing)
- Define a brief template that captures strategic intent, related entities, and prompt selection
- Establish measurable review criteria (not subjective) for every stage
- Define the approval chain for each content type (who approves what)
- Document the content refresh and update workflow
- Define the maintenance schedule (monthly link checks, quarterly audits, annual calendar planning)
- Define the rollback strategy for content that fails post-publish
- Create a content unit definition of done checklist

### Scope

**Included:**
- Production workflow document covering all stages
- Content brief template
- Review criteria per content type (measurable, not subjective)
- Approval chain by content type
- Publishing process (step by step, who does what)
- Content refresh workflow
- Maintenance schedule (monthly, quarterly, annual)
- Content unit definition of done checklist
- Rollback strategy documentation

**Not included:**
- Actual content creation (prompts from Phase 5 are used for this)
- AI prompt test runner (future tooling)
- Analytics integration (future)
- Studio write-mode integration (future)
- Automated content scheduling (future)

### Deliverables

**Files:**
- `docs/editorial/PRODUCTION_WORKFLOW.md` — complete production workflow document

**Documentation sections:**
- 9-stage workflow description (Research → Brief → Prompt Selection → Claude Generation → Human Review → QA → Revision → Approval → Publishing)
- Maintenance workflow (monthly link checks, quarterly audit, annual calendar)
- Content refresh workflow
- Content brief template
- Content unit definition of done checklist
- Approval chain table by content type
- Publishing process (who does what, step by step)
- Rollback strategy

### Detailed TODO Checklist

- [ ] Document the Research stage: gathering Knowledge Base docs, reference content, related entities
- [ ] Define the brief template with fields for content type, slug, title, tag, strategic pillar, target emotion, tone matrix, context, related entities, prompt selection
- [ ] Document the Prompt Selection stage: selecting generation and review prompts from the library before generation begins
- [ ] Document the Claude Generation stage: context loading, prompt execution, AI self-review
- [ ] Document the Human Review stage: check against brief, check voice, check vocabulary, check technical accuracy, check sensory density
- [ ] Document the QA stage: automated review prompts, compile feedback, triage by severity
- [ ] Document the Revision stage: apply fixes by priority, re-run review prompts, verify all critical checks pass
- [ ] Document the Approval stage: final read, sign-off by role, set `status: published`
- [ ] Document the Publishing stage: create content directory, run compiler, verify on staging, merge to main, verify on production
- [ ] Document the Maintenance stage: monthly broken link check, quarterly content audit, quarterly editorial calendar planning
- [ ] Define approval chain per content type (which roles approve journal articles vs microcopy vs policy)
- [ ] Define content refresh workflow (evaluate → brief → generate → review → publish)
- [ ] Define rollback strategy for content that fails post-publish
- [ ] Create content unit definition of done checklist
- [ ] Establish maintenance calendar (recurring events for monthly/quarterly/annual tasks)

### Dependencies

- Phase 5 (AI Prompt Library) — the workflow references specific prompts for generation and review
- Phase 6 (Journal Migration) — the migration validates the workflow with real content before Phase 7 formalizes it

### Expected Output

A comprehensive production workflow document that a new team member can follow to produce content independently. The document covers the complete lifecycle from research through publishing to maintenance, with measurable review criteria, clear approval chains, and a defined maintenance schedule.

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| No dedicated editorial lead | Medium | Critical | The EOS requires a human owner. Document the role explicitly. Assign a named owner. |
| Writers bypass the framework for speed | Medium | Medium | Make the framework the path of least resistance. The brief template scaffolds the structure. A brief is faster to write than a full article from scratch. |
| Governance feels bureaucratic for small pieces | Medium | Medium | Define different workflows for different content types. Microcopy needs a lighter review than a journal article. |
| Quarterly content audit slips | High | Medium | Lightweight audit (check links, update dates, identify gaps). A 2-hour quarterly commitment. Calendar it. |
| Broken cross-references accumulate | Medium | Medium | The compiler validates all cross-references on every build. Broken refs are caught immediately, not accumulated. |

### Validation Checklist

- [ ] Production workflow is documented and understandable by a new team member
- [ ] The workflow covers all 9 stages from Research to Maintenance
- [ ] Content brief template is defined and usable
- [ ] Review criteria are measurable (not subjective)
- [ ] Approval chain is clear for each content type
- [ ] Publishing process is defined (who does what, step by step)
- [ ] Content refresh workflow is documented
- [ ] Maintenance schedule is defined (monthly, quarterly, annual)
- [ ] Content unit definition of done checklist exists
- [ ] Rollback strategy is documented

### Definition of Done

Phase 7 is done when the production workflow is documented, the content maintenance schedule is defined and calendared, and the first content unit has been created end-to-end through the new workflow (from brief through generation through review through publishing).

---

## Master Checklist

This checklist aggregates every actionable TODO from all remaining phases.

### Phase 5 — AI Prompt Library

**Phase 5a — Foundation**
- [ ] Create `docs/research/prompts/` directory structure with all category subdirectories
- [ ] Create `docs/research/prompts/_prompt-template.md`
- [ ] Create `docs/research/prompts/README.md`

**Phase 5b — Generation Prompts (10)**
- [ ] Write `homepage-hero-v1.md`
- [ ] Write `collection-narrative-v1.md`
- [ ] Write `product-story-v1.md`
- [ ] Write `journal-article-v1.md`
- [ ] Write `craft-note-v1.md`
- [ ] Write `weaver-portrait-v1.md`
- [ ] Write `house-letter-v1.md`
- [ ] Write `ritual-guide-v1.md`
- [ ] Write `field-note-v1.md`
- [ ] Write `glossary-definition-v1.md`

**Phase 5c — Review Prompts (7)**
- [ ] Write `consistency-check-v1.md`
- [ ] Write `sensory-density-check-v1.md`
- [ ] Write `forbidden-words-check-v1.md`
- [ ] Write `system-2-presence-check-v1.md`
- [ ] Write `accessibility-check-v1.md`
- [ ] Write `seo-check-v1.md`
- [ ] Write `grammar-check-v1.md`

**Phase 5d — SEO + Microcopy + Email + Policy Prompts (18)**
- [ ] Write `meta-title-v1.md`
- [ ] Write `meta-description-v1.md`
- [ ] Write `og-image-alt-v1.md`
- [ ] Write `json-ld-v1.md`
- [ ] Write `cta-v1.md`
- [ ] Write `error-state-v1.md`
- [ ] Write `empty-state-v1.md`
- [ ] Write `checkout-label-v1.md`
- [ ] Write `toast-notification-v1.md`
- [ ] Write `welcome-v1.md`
- [ ] Write `order-confirmation-v1.md`
- [ ] Write `dispatch-notification-v1.md`
- [ ] Write `delivery-confirmation-v1.md`
- [ ] Write `journal-notification-v1.md`
- [ ] Write `shipping-policy-v1.md`
- [ ] Write `returns-policy-v1.md`
- [ ] Write `privacy-policy-v1.md`
- [ ] Write `terms-of-service-v1.md`

**Phase 5e — Critique + Rewrite + Translation Prompts (12)**
- [ ] Write `narrative-pacing-v1.md`
- [ ] Write `emotional-resonance-v1.md`
- [ ] Write `brand-voice-fidelity-v1.md`
- [ ] Write `structural-flow-v1.md`
- [ ] Write `for-voice-v1.md`
- [ ] Write `for-page-type-v1.md`
- [ ] Write `for-email-v1.md`
- [ ] Write `for-social-v1.md`
- [ ] Write `for-accessibility-v1.md`
- [ ] Write `simplify-v1.md`
- [ ] Write `translate-to-kannada-v1.md`
- [ ] Write `translate-to-hindi-v1.md`

**Phase 5f — Examples and Validation**
- [ ] Create example output for homepage hero prompt
- [ ] Create example output for collection narrative prompt
- [ ] Create example output for product story prompt
- [ ] Create example output for journal article prompt
- [ ] Create example output for craft note prompt
- [ ] Test review prompts against known-good content
- [ ] Test review prompts against known-bad content
- [ ] Test at least one generation prompt end-to-end
- [ ] Verify prompt versioning conventions

### Phase 6 — Journal Migration

**Phase 6a — Content Writing**
- [ ] Write body content for `morning-light-reads-weave`
- [ ] Write body content for `five-drapes-quiet-wedding`
- [ ] Write body content for `linen-art-of-doing-less`
- [ ] Write body content for `organza-in-the-rain`
- [ ] Write body content for `keepsake-card-jasmine`
- [ ] Write body content for `padmavati-name-behind-house`
- [ ] Add complete frontmatter for each article
- [ ] Add hero image to each content unit directory
- [ ] Add body blocks to each article
- [ ] Populate related content references
- [ ] Run compiler and fix validation errors

**Phase 6b — Code Migration**
- [ ] Update `Journal.tsx` to load from content service
- [ ] Update `JournalDetail.tsx` to load from content service
- [ ] Update `JournalDetail.tsx` to render body blocks
- [ ] Add reading time display to article detail
- [ ] Update `useMetadata` calls
- [ ] Update imports referencing `src/data/journalArticles.ts`
- [ ] Run compiler and verify all 6 articles pass
- [ ] Run `npm run build` and verify zero errors
- [ ] Test `/journal` renders all 6 articles
- [ ] Test `/journal/{slug}` renders full article for each slug
- [ ] Verify SEO metadata
- [ ] Verify JSON-LD structured data
- [ ] Verify hero images load with alt text
- [ ] Verify reading time displays correctly

**Phase 6c — Production Verification**
- [ ] Deploy to production
- [ ] Verify all 6 articles in production for 1 week
- [ ] Monitor for issues
- [ ] Remove `src/data/journalArticles.ts` after 1 week
- [ ] Remove remaining hardcoded array references
- [ ] Final `npm run build` verification

### Phase 7 — Production Content Creation

- [ ] Document Research stage
- [ ] Define content brief template
- [ ] Document Prompt Selection stage
- [ ] Document Claude Generation stage
- [ ] Document Human Review stage
- [ ] Document QA stage
- [ ] Document Revision stage
- [ ] Document Approval stage
- [ ] Document Publishing stage
- [ ] Document Maintenance stage
- [ ] Define approval chain per content type
- [ ] Define content refresh workflow
- [ ] Define rollback strategy
- [ ] Create content unit definition of done checklist
- [ ] Establish maintenance calendar

---

## Recommended Git Commit Strategy

### Phase 5 — AI Prompt Library

| Commit | Message | Contents |
|--------|---------|----------|
| 1 | `feat(prompts): add prompt library structure and template` | Directory structure, `_prompt-template.md`, `README.md` |
| 2 | `feat(prompts): add 10 generation prompts at v1` | All `generate/` prompts |
| 3 | `feat(prompts): add 7 review prompts at v1` | All `review/` prompts |
| 4 | `feat(prompts): add SEO, microcopy, email, policy prompts` | 18 prompts across 4 categories |
| 5 | `feat(prompts): add critique, rewrite, translation prompts` | 12 prompts across 3 categories |
| 6 | `feat(prompts): add example outputs and validate prompts` | Example files, test results |

### Phase 6 — Journal Migration

| Commit | Message | Contents |
|--------|---------|----------|
| 1 | `feat(journal): migrate morning-light-reads-weave` | Content unit directory with full frontmatter and body blocks |
| 2 | `feat(journal): migrate five-drapes-quiet-wedding` | Content unit directory |
| 3 | `feat(journal): migrate linen-art-of-doing-less` | Content unit directory |
| 4 | `feat(journal): migrate organza-in-the-rain` | Content unit directory |
| 5 | `feat(journal): migrate keepsake-card-jasmine` | Content unit directory |
| 6 | `feat(journal): migrate padmavati-name-behind-house` | Content unit directory |
| 7 | `refactor(journal): update Journal.tsx to use content service` | React component changes |
| 8 | `refactor(journal): update JournalDetail.tsx to use content service` | React component changes, body block rendering, reading time |
| 9 | `feat(journal): remove hardcoded articles.ts after 1 week verification` | Delete `src/data/journalArticles.ts` and update remaining imports |

### Phase 7 — Production Content Creation

| Commit | Message | Contents |
|--------|---------|----------|
| 1 | `docs(workflow): add production workflow document` | Complete `PRODUCTION_WORKFLOW.md` |

---

## Recommended Review Points

Implementation should stop for manual review before continuing at the following checkpoints:

### Checkpoint CP4 — After Phase 5 Complete

**When:** All prompts exist at v1, example outputs are generated, review prompts are tested.

**Who:** Editorial Lead + Founder

**What:**
- Spot-check 3-5 generation prompts by running them against real inputs
- Verify outputs conform to content schemas (compile with Phase 4 compiler)
- Verify outputs pass review prompts (consistency, sensory density, forbidden words, SEO)
- Confirm prompt versioning conventions are applied correctly
- Confirm prompt testing methodology is documented
- Approve Phase 5 before proceeding to Phase 6 content writing

**Why:** Prompts produce the content that will drive Phases 6 and 7. If prompts produce low-quality or non-conforming content, everything downstream is affected. This checkpoint catches prompt quality issues before content creation begins.

### Checkpoint CP5 — After Phase 6 Content Written, Before Deployment

**When:** All 6 content units are written, the compiler passes, but before the code migration is deployed to production.

**Who:** Editorial Lead + Dev + Founder

**What:**
- Read all 6 articles for voice, accuracy, and emotional resonance
- Verify frontmatter completeness against schemas
- Verify all related content references exist
- Verify SEO metadata is within character limits
- Verify hero images exist and have alt text
- Verify the journal index and detail pages render correctly on staging
- Run `npm run build` and verify zero errors
- Approve Phase 6 for production deployment

**Why:** This is the last point at which content can be edited without affecting production users. Once deployed, the content is live. A thorough review here prevents post-launch fixes.

### Checkpoint CP6 — After Phase 6 One Week Verification

**When:** 1 week after Phase 6 deployment, before removing `src/data/journalArticles.ts`.

**Who:** Dev

**What:**
- Confirm no crash reports, missing content errors, or broken links related to journal articles
- Confirm all 6 articles render in production
- Confirm SEO metadata is being picked up by search engines (check cached pages)
- Confirm hero images load on all devices
- If any issues found: rollback by reverting the Phase 6 deployment commit
- If clean: proceed to remove the hardcoded array

**Why:** The hardcoded array is the safety net. Removing it is the point of no return. A week of production verification ensures the new system is stable.

### Checkpoint CP7 — Full System Review

**When:** After Phase 7 complete.

**Who:** Editorial Lead + Founder + Dev

**What:**
- Review the complete production workflow document
- Walk through a sample content unit end-to-end (brief → generate → review → publish)
- Verify the compiler is part of the build pipeline (CI configuration)
- Verify maintenance schedules are calendared
- Identify any gaps or process improvements
- Plan the next phase of work (if any)

**Why:** This is the final review of the entire Editorial Operating System. All phases are complete. This checkpoint confirms the system is ready for day-to-day production use and identifies any improvements before regular operations begin.

---

**Document version:** 1.0
**Created:** July 2026
**Status:** Planning
**Owner:** Editorial Lead
**Review cycle:** Updated after each phase completion
