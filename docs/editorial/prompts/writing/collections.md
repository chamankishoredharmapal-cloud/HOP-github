# Writing: Collections

**Purpose:** Generate collection narratives — the extended editorial story for a collection of sarees.

**When to use:** Creating or updating a collection narrative (e.g., Kalyani, Viara).

**When NOT to use:** For individual product stories within a collection (use `writing/product-pages.md`). For the database collection record (this is the editorial narrative only).

---

## Objective

Create a sensory, atmospheric narrative that establishes the collection's character, mood, and emotional territory. The collection narrative is a world the reader enters — not a product listing.

## Audience

Women who have seen the collection name and tagline and want to know more. They are in the Curiosity → Wonder emotional stage. They are not yet ready to buy; they are ready to be drawn in.

## Tone

| Dimension | Target |
|-----------|--------|
| Formality | 3/5 |
| Warmth | 3/5 |
| Sensory Density | 4/5 |
| Technical Depth | 2/5 |
| Urgency | 0/5 |
| Imperative Force | 1/5 |

**Reading level:** Grade 8

## Structure

### Frontmatter

```yaml
type: collection
name: "{Collection Name}"
slug: "{slug}"
status: draft
tagline: "{Short tagline, ≤120 chars}"
hero: ./hero.jpg
filmPoster: ./film-poster.jpg
mood: "A single sentence describing the collection's atmosphere."
occasion: "What occasion this collection belongs to."
weaverNote: "A quote or note from the weaver."
lookbook:
  - ./lookbook/01-full-drape.jpg
  - ./lookbook/02-detail-border.jpg
seo:
  title: "{Collection Name} Collection — House of Padmavati"
  description: "{≤160 chars}"
```

### Body Blocks

```
hero → intro → body (2-3) → image → body → system-2 → closure
```

### Block Details

**hero:** Full-bleed collection hero image with atmospheric caption.

**intro:** Opens with the collection's emotional territory. Explains what the collection is named after and why. Not a definition — an invitation.

**body:** Sensory description of the collection's aesthetic: palette, weave character, mood. Alternates between what the collection looks like and what it feels like to wear.

**image:** Lookbook image with descriptive caption.

**system-2:** Technical details in accordion format: weave specifications, fabric composition, origin, care, dispatch.

**closure:** Returns to emotion. Frames the collection as something that will be remembered, not just worn.

## Required Context

- Collection name and its meaning or inspiration
- Weave type, fabric, and technique
- Weaver name and region
- Colour palette
- Occasion or mood
- Lookbook images available

## Required References

- `src/content/_schemas/collection.yaml` (frontmatter schema)
- `docs/editorial/07-emotional-architecture/emotional-journey.md` (Curiosity, Wonder stages)
- `docs/editorial/02-brand-architecture/messaging-pillars.md` (Heritage, Craft pillars)

## Formatting

- Follow body block sequence exactly
- Frontmatter as YAML
- Body blocks as `---` delimited YAML + markdown
- Sensory density: 4/5 minimum

## Acceptance Criteria

- [ ] Collection name is never explained literally — its meaning is conveyed through atmosphere
- [ ] At least one sentence references the weaver or weaving tradition
- [ ] Colour is described using the brand palette (Coastal Teal, Golden Sand, etc.)
- [ ] The occasion or mood is specific, not generic
- [ ] At least one body block describes how the sarees in this collection feel when worn
- [ ] System-2 block contains verifiable technical specifications
- [ ] Closure sentence frames the collection as an heirloom or memory
- [ ] Zero forbidden words

## Example Output

See `src/content/collections/kalyani/index.md` for a reference implementation.

## Failure Cases

| Failure | Symptom | Correction |
|---------|---------|------------|
| Generic collection intro | "The Kalyani collection is a range of wedding sarees." | Replace with atmospheric opening. "Kalyani is not named after a place or a technique. She is named after the feeling of a winter wedding..." |
| Missing weaver connection | No mention of the weaver or region | Add weaver name, village, and generational context in at least one body block. |
| Technical over narrative | Opening with weave specifications | Lead with sensory experience. Move technical details to system-2. |
| Forbidden colour words | "Blue-green sarees with gold borders" | Use brand palette: "Coastal Teal with hand-spun zari in Golden Sand." |

---

**Cross-reference:** `src/content/_schemas/collection.yaml`, `writing/product-pages.md` (for products within collections), `writing/seo-copy.md` (collection SEO metadata)