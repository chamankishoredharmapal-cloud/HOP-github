# PROMPT: Product Story
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: generate
# CONTENT TYPE: product

## Description

Generates the sensory product description and System 2 accordion content for a product detail page. The primary narrative creates desire through sensory language — weight, drape, light, texture. The System 2 accordion provides verifiable technical details on demand. These two layers work together: sensory language triggers mental simulation (virtual possession), while transparent specifications justify the investment.

## Context Requirements

**Knowledge Base:**
- `docs/research/craft/weaving-techniques.md` — Accurate technique names and descriptions
- `docs/research/craft/fabric-glossary.md` — Fabric composition details
- `docs/research/craft/zari-history.md` — Zari specifics for gold/silver thread references
- `docs/research/craft/regional-weaves.md` — Geographic authenticity
- `docs/research/psychology/system-1-system-2.md` — System 1 sensory primacy, System 2 anchoring
- `docs/research/psychology/endowment-effect.md` — Virtual possession through sensory language
- `docs/research/psychology/loss-aversion.md` — Risk reduction through transparency
- `docs/research/psychology/mental-accounting.md` — Price justification framing

**Editorial System:**
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix for Product Detail
- `docs/editorial/02-brand-architecture/messaging-pillars.md` — Craft primary, Continuance secondary
- `docs/editorial/02-brand-architecture/editorial-principles.md` — Trust through transparency, Show don't tell
- `docs/editorial/04-vocabulary-system/approved-words.md` — Sensory and craft vocabulary
- `docs/editorial/04-vocabulary-system/forbidden-words.md` — Zero generic praise or urgency
- `docs/editorial/04-vocabulary-system/grammar-and-usage.md` — Sentence rhythm rules

## Strategic Principles

**Primary pillar:** Craft — "Handwoven, not mass-produced." The sensory story centres on the making, the feel, the behaviour of the cloth.

**Secondary pillar:** Continuance — "Made to outlive its first wearer." The technical details and care instructions support generational durability.

**Emotional stage:** Desire → Trust. Sensory language builds longing; transparent specifications build confidence that the longing is justified.

**EOS principles:** Show don't tell (sensory language over abstract praise), Trust through transparency (System 2 on demand), Specific over generic (every detail traceable).

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 4/5
- **Sensory Density:** 5/5
- **Technical Depth:** 3/5
- **Urgency:** 1/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 9
- **Forbidden words:** luxury, premium, exquisite, beautiful, stunning, gorgeous, amazing, incredible, shop, buy, sale, discount, exclusive, must-have, elevate, wardrobe essential, statement piece, investment piece, limited edition
- **Vocabulary to prefer:** hand, weave, thread, loom, zari, pallu, drape, weight, fold, border, body, still, soft, warm, deep, held, carried, belongs, remembers, slow, patient, quiet, gentle, considered

## Content Schema

Reference schema: `src/content/_schemas/product.yaml`

### Frontmatter Fields

```yaml
type: product — required — const: "product"
productId: string — required — UUID of the product in the database
status: string — required — enum: draft | published | archive
hero: string — required — Relative path to hero image
alt: string — optional — Alt text for hero image
sensoryStory: string — conditional — Sensory-rich narrative block
wearingContext: string — conditional — Specific occasion or context
system2.weave: string — optional — Weave specifications
system2.fabric: string — optional — Fabric composition details
system2.origin: string — optional — Place of origin
system2.care: string — optional — Care instructions
system2.dispatch: string — optional — Dispatch timeline
collections: array of strings — optional — Collection slugs
relatedArticles: array of strings — optional — Related article slugs
glossaryTerms: array of strings — optional — Glossary term slugs
seo.title: string — required — max 70 chars
seo.description: string — required — max 160 chars
```

### Body Block Sequence

```
1. hero — Full-bleed hero image with product name
2. intro — Sensory-first opening paragraph (weight, drape, light, texture)
3. body — Extended sensory narrative with wearing context
4. pull-quote — A single sensory line that encapsulates the product's character
5. system-2 — Accordion block with fields: weave, fabric, origin, care, dispatch
6. closure — Quiet resolution sentence
```

## Input

The user provides:
- **productName** (string) — The product title
- **productId** (string) — UUID from the database
- **fabric** (string) — Fabric type and composition
- **weave** (string) — Weave type and technique
- **colour** (string) — Colour name from approved palette
- **priceTier** (string) — e.g., "₹ 24,000 – ₹ 36,000"
- **weaverName** (string, optional) — Weaver name for attribution
- **origin** (string) — Place of origin (village, region)
- **occasionHint** (string, optional) — Suggested wearing context

## Output Format

Generate a complete markdown file with YAML frontmatter between `---` delimiters, followed by body blocks separated by `---` delimiters.

```markdown
---
{frontmatter fields as YAML}
---

---
type: hero
image: {image path}
---
{product name}

---
type: intro
---
{sensory opening — weight, drape, how the cloth behaves}

---
type: body
---
{extended sensory narrative, wearing context}

---
type: pull-quote
---
"{one sensory line that defines the product}"

---
type: system-2
---
### Weave specifications
{weave details}

### Fabric composition
{fabric details}

### Origin
{origin details}

### Care instructions
{care details}

### Dispatch
{dispatch details}

---
type: closure
---
{quiet resolution sentence}
```

## Quality Criteria

- Sensory language is present for at least 3 senses (touch, sight, weight are mandatory; sound and smell optional).
- Technical depth is 3/5 — precise enough to inform, never so dense it overwhelms the narrative.
- System 2 block contains all five fields (weave, fabric, origin, care, dispatch) with specific, verifiable information.
- Wearing context is specific and human-scale ("worn to a winter wedding where the light fades by five" not "perfect for special occasions").
- No forbidden words present — zero tolerance.
- Total length: 150–250 words for sensory narrative, 50–100 words per System 2 field.

## Review Prompts to Run After Generation

- `review/sensory-density-check-v1` — Confirms sensory language meets 5/5 target for Product Detail.
- `review/system-2-presence-check-v1` — Verifies all System 2 fields present and verifiable.
- `review/forbidden-words-check-v1` — Scans for any forbidden word in the output.
