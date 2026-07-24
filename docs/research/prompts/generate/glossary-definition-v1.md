# PROMPT: Glossary Definition
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: generate
# CONTENT TYPE: glossary

## Description

Generates a single glossary entry for a textile term. Glossary entries are authoritative, precise, and complete — the final reference for a term's meaning within the House of Padmavati editorial system. Each entry includes a concise definition, optional extended explanation (etymology, cultural context, usage notes), IPA pronunciation, related terms, and see-also references. The tone is warm enough to read comfortably, precise enough to cite with confidence.

## Context Requirements

**Knowledge Base:**
- `docs/research/craft/weaving-techniques.md` — Technique definitions for Weave and Technique categories
- `docs/research/craft/fabric-glossary.md` — Fabric definitions for Fabric category
- `docs/research/craft/regional-weaves.md` — Geographic context for Region category
- `docs/research/craft/loom-geography.md` — Tool definitions for Tool category
- `docs/research/craft/zari-history.md` — Zari-specific terminology
- `docs/research/craft/dye-processes.md` — Dye-related term definitions
- `docs/research/culture/textile-history.md` — Cultural context for Tradition category

**Editorial System:**
- `docs/editorial/04-vocabulary-system/approved-words.md` — Approved vocabulary for definitions
- `docs/editorial/04-vocabulary-system/forbidden-words.md` — Forbidden vocabulary
- `docs/editorial/02-brand-architecture/voice-bible.md` — Voice dimensions: warm precision
- `docs/editorial/02-brand-architecture/editorial-principles.md` — Specific over generic, Rooted in the real, Restrained

## Strategic Principles

**Primary pillar:** Craft — "Handwoven, not mass-produced." Every definition serves the reader's understanding of handloom craft.

**Secondary pillar:** Heritage — "This cloth carries memory." Cultural and historical context enrich the definition.

**Emotional stage:** Trust → Understanding. The reader should trust the definition as authoritative and leave with genuine understanding.

**EOS principles:** Specific over generic (precise technical language), Rooted in the real (traceable to weaving practice), Restrained (each definition is one term, one meaning, no tangents).

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 3/5
- **Sensory Density:** 2/5
- **Technical Depth:** 3/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 9
- **Forbidden words:** luxury, premium, exquisite, beautiful, stunning, gorgeous, amazing, incredible, shop, buy, exclusive, must-have, elevate, subscribe, sign up
- **Vocabulary to prefer:** hand, loom, weave, thread, warp, weft, shuttle, shuttle, pit loom, jacquard, dobby, tension, rhythm, pattern, structure, fibre, yarn, dye, resist, border, pallu, zari, silk, cotton, region, tradition, technique

## Content Schema

Reference schema: `src/content/_schemas/glossary.yaml`

### Frontmatter Fields

```yaml
type: glossary — required — const: "glossary"
term: string — required — The term being defined, capitalised
slug: string — required — kebab-case
pronunciation: string — optional — IPA pronunciation guide
category: string — required — enum: Fabric | Weave | Technique | Tool | Tradition | Region
definition: string — required — Concise 1–3 sentence definition
extended: string — optional — Deeper explanation (markdown): etymology, cultural context, usage notes
relatedTerms: array of strings — optional — Slugs of related glossary terms
seeAlso: array of strings — optional — Slugs of articles or collections for further reading
```

No body blocks — glossary is a single-page content type. The entire entry is contained in the frontmatter.

## Input

The user provides:
- **term** (string) — The term to define (capitalised)
- **category** (string) — enum: Fabric | Weave | Technique | Tool | Tradition | Region
- **brief** (string) — 1–2 sentences describing what the term means and what the definition should cover

## Output Format

Generate a complete markdown file with YAML frontmatter between `---` delimiters. No body blocks.

```markdown
---
type: glossary
term: {Term}
slug: {kebab-case-slug}
pronunciation: "/{IPA}/"
category: {category}
definition: >
  {1-3 sentence concise definition}
extended: >
  {optional deeper explanation in markdown format}
relatedTerms:
  - {related term slug 1}
  - {related term slug 2}
seeAlso:
  - {article or collection slug 1}
  - {article or collection slug 2}
---
```

## Quality Criteria

- Definition is precise, complete, and 1–3 sentences — the reader should understand the term clearly after one reading.
- Pronunciation is in IPA notation and phonetically accurate.
- Category matches the term accurately based on the controlled vocabulary.
- Extended section (when provided) includes genuine depth: etymology, cultural context, or usage notes from actual weaving practice.
- Related terms and see-also references are specific and accurate — linked by actual relationship, not vague association.
- No forbidden words present — definitions are authoritative, not promotional.

## Review Prompts to Run After Generation

- `review/consistency-check-v1` — Verifies Craft pillar alignment, appropriate technical depth for glossary.
- `review/forbidden-words-check-v1` — Scans for any forbidden word in the definition.
- `review/grammar-check-v1` — Confirms correct Indian English spelling and punctuation conventions.
