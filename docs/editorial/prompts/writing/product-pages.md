# Writing: Product Pages

**Purpose:** Generate product stories — the sensory editorial narrative that accompanies each product.

**When to use:** Creating or updating a product's editorial story (sensory description, wearing context, closure).

**When NOT to use:** For the database product record (SKU, price, inventory). For collection-level narratives (use `writing/collections.md`).

---

## Objective

Create virtual possession through sensory language. The reader should be able to imagine the weight of the saree, the way it catches the light, the sound of the fabric settling. This is the Desire stage — the reader begins to own the saree in her imagination before any transaction.

## Audience

A woman who has clicked through from a collection or search. She is interested. She needs to be moved from curiosity to desire. She is also rational — she will check specifications before deciding.

## Tone

| Dimension | Target |
|-----------|--------|
| Formality | 3/5 |
| Warmth | 4/5 |
| Sensory Density | 5/5 |
| Technical Depth | 3/5 (available on demand in accordion) |
| Urgency | 1/5 (functional only — dispatch timing) |
| Imperative Force | 1/5 |

**Reading level:** Grade 9

## Structure

### Frontmatter

```yaml
type: product
productId: "{uuid}"
status: draft
hero: ./hero.jpg
alt: "{descriptive alt text}"
sensoryStory: "Complete sensory description in 2-3 sentences."
wearingContext: "Specific occasion or context for wearing this saree."
system2:
  weave: "{weave specifications}"
  fabric: "{fabric composition}"
  origin: "{place of origin}"
  care: "{care instructions}"
  dispatch: "{dispatch timeline}"
collections:
  - "{slug}"
relatedArticles:
  - "{slug}"
glossaryTerms:
  - "{slug}"
seo:
  title: "{≤70 chars}"
  description: "{≤160 chars}"
```

### Body Blocks

```
hero → intro → body (1-2) → pull-quote → body → system-2 → closure
```

### Block Details

**hero:** Product hero image — the saree in natural light, on a body or draped.

**intro:** Opens with a sensory moment. Not "this saree is" but "this saree reads as..." or "there is a moment when..."

**body:** Alternates between sensory description (how it looks, feels, moves) and craft detail (weave, border, zari). Colour must use brand palette. At least one sentence per relevant sense.

**pull-quote:** A line that crystallises the product's character. Often from the sensoryStory or a memorable phrase.

**system-2:** Accordion block with weave specifications, fabric composition, origin, care, dispatch, weaver name.

**closure:** Returns to the woman who will wear this saree. Frames it as something that will be remembered.

## Required Context

- Product UUID (for frontmatter)
- Product name, colour, weave type, fabric
- Weaver name and village
- Collection association
- Hero image description
- Sensory notes (how the fabric feels, moves, catches light)

## Required References

- `src/content/_schemas/product.yaml` (frontmatter schema)
- `docs/editorial/07-emotional-architecture/emotional-journey.md` (Desire stage)
- `docs/editorial/02-brand-architecture/messaging-pillars.md` (Craft, Continuance pillars)
- `docs/editorial/04-vocabulary-system/approved-words.md` (colour names, fabric vocabulary)

## Formatting

- Sensory density: 5/5 (highest of any content type)
- Lead with sensory story, not specifications
- Technical details in system-2 accordion only
- Colour described using brand palette
- No comparisons to other products
- No "you might also like"

## Acceptance Criteria

- [ ] sensoryStory captures how the saree looks, feels, moves, and catches light
- [ ] wearingContext is a specific occasion, not a generic one
- [ ] Every sentence serves the Desire emotional stage
- [ ] Brand palette colours are used for all colour references
- [ ] Weaver is named or attributed
- [ ] System-2 block is complete and verifiable
- [ ] No forbidden words, no generic praise
- [ ] Closure is weaver-focused or woman-focused, not product-focused

## Example Output

See `src/content/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890/index.md` for a reference implementation.

## Failure Cases

| Failure | Symptom | Correction |
|---------|---------|------------|
| Specification list | "5.5 meters, 12-momme silk, hand-spun zari" as the opening | Lead with sensory description. Move specs to system-2. |
| Generic wearing context | "Perfect for weddings and special occasions" | Replace with specific context: "She wore this to her niece's wedding — the one where the whole family gathered after years." |
| Colour not in brand palette | "A beautiful blue-green saree" | Use "Coastal Teal" with sensory description of how it reads in different light. |
| No sensory anchor | "This saree is made from high-quality silk." | Replace with: "The fabric settles at the hip with a weight that says 'I am here.'" |

---

**Cross-reference:** `src/content/_schemas/product.yaml`, `writing/collections.md` (if product and collection are created together), `writing/seo-copy.md` (product SEO metadata)