# Writing: Ritual Guides

**Purpose:** Generate occasion and care guides — content that helps a woman wear, drape, or care for her saree.

**When to use:** Creating a ritual guide for a specific occasion (wedding, festival, office) or care practice (draping, storage, cleaning).

**When NOT to use:** For product-specific descriptions (use `writing/product-pages.md`). For general educational content (use `writing/craft-notes.md`).

---

## Objective

Provide practical, beautiful guidance for a specific saree ritual. The guide must be genuinely useful — the reader should be able to follow it. But it must also be a pleasure to read.

## Audience

A woman who owns or is considering a saree for a specific occasion. She wants to know how to wear it, what to expect, and how to care for it.

## Tone

| Dimension | Target |
|-----------|--------|
| Formality | 2/5 |
| Warmth | 4/5 |
| Sensory Density | 3/5 |
| Technical Depth | 3/5 (practical instructions need clarity) |
| Urgency | 0/5 |
| Imperative Force | 2/5 (slightly higher — instructions need direction) |

**Reading level:** Grade 7

## Structure

### Frontmatter

```yaml
type: ritual-guide
title: "{title, sentence case}"
slug: "{kebab-case-slug}"
published: {YYYY-MM-DD}
status: draft
occasion: "{Wedding | Festival | Office | Daily | Gift}"
hero: ./hero.jpg
alt: "{descriptive alt text}"
collections:
  - "{slug}"
products:
  - "{uuid}"
relatedArticles:
  - "{slug}"
seo:
  title: "{title} — House of Padmavati"
  description: "{≤160 chars}"
```

### Body Blocks

```
hero → intro → {step blocks} → closure
```

### Block Details

**hero:** Demonstrative image of the saree being draped or displayed.

**intro:** Explains what makes this ritual or saree type distinctive. Warm, welcoming, specific.

**step:** Numbered steps (1, 2, 3...). Each step is 2-4 sentences. One action per step. Includes the rationale for the action, not just the action itself.

**closure:** Encourages patience and practice. Frames the ritual as something to enjoy, not something to master.

## Required Context

- The occasion or saree type being addressed
- Specific draping, care, or ritual instructions
- Any cultural context that informs the practice
- Related collections or products

## Required References

- `src/content/_schemas/ritual-guide.yaml` (frontmatter schema)
- `docs/research/culture/` (cultural context for rituals)
- `docs/editorial/07-emotional-architecture/emotional-journey.md` (Belonging stage)

## Formatting

- Steps are numbered, not bulleted
- Each step includes the reason, not just the instruction
- Instructions use gentle imperatives: "Begin by," "Adjust the," "Check the" — never "Do this," "You must"
- No jargon without explanation

## Acceptance Criteria

- [ ] Steps are actionable — a reader could follow them
- [ ] Each step explains why, not just how
- [ ] The guide respects the reader's time and skill level
- [ ] Cultural context is accurate and respectful
- [ ] No fabricated traditions or rituals
- [ ] Closure encourages, not commands

## Example Output

See `src/content/ritual-guides/how-to-drape-an-ilkal/index.md` for a reference implementation.

## Failure Cases

| Failure | Symptom | Correction |
|---------|---------|------------|
| Bossy instructions | "Do this first. Then do that." | Replace with gentle guidance: "Begin by tucking the plain end. Let the pleats fall forward." |
| No rationale | "Fold the pallu in seven pleats." | Add why: "Seven pleats allows the fabric to fall evenly. More than nine adds bulk at the waist." |
| Cultural inaccuracy | Misrepresenting a draping tradition | Verify with craft resources. Omit if uncertain. |
| Too technical | Using drape terminology without explanation | Define terms on first use: "The tope-teni joint — where the separate pallu attaches to the body." |

---

**Cross-reference:** `src/content/_schemas/ritual-guide.yaml`, `writing/craft-notes.md` (related educational content), `writing/seo-copy.md` (ritual guide SEO metadata)