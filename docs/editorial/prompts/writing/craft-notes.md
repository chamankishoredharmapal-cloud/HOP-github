# Writing: Craft Notes

**Purpose:** Generate educational content about handloom techniques, materials, and processes.

**When to use:** Creating a craft note that teaches the reader about a specific weave, fabric, technique, or material.

**When NOT to use:** For journal articles (use `writing/journal.md`). For weaver profiles (use the general journal principles until a dedicated weaver-portrait prompt is written).

---

## Objective

Explain a craft concept clearly and beautifully. The reader should understand the technique better after reading — not because of technical jargon, but because of clear, sensory explanation. Craft notes serve the Wonder and Trust emotional stages.

## Audience

Women who want to understand what makes handwoven sarees different. They are curious about craft but not experts. The note should make them feel more knowledgeable without making them feel lectured.

## Tone

| Dimension | Target |
|-----------|--------|
| Formality | 3/5 |
| Warmth | 3/5 |
| Sensory Density | 4/5 |
| Technical Depth | 3/5 (higher than journal — craft notes teach) |
| Urgency | 0/5 |
| Imperative Force | 1/5 |

**Reading level:** Grade 9
**Reading time:** 5-8 minutes

## Structure

### Frontmatter

```yaml
type: craft-note
title: "{title, sentence case}"
slug: "{kebab-case-slug}"
published: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
status: draft
author: "House of Padmavati"
tag: "{Technique | Fabric | Weave | Dye | History}"
dek: "{≤160 chars}"
readingTime: {integer}
hero: ./hero.jpg
alt: "{descriptive alt text}"
collections:
  - "{slug}"
products:
  - "{uuid}"
glossaryTerms:
  - "{slug}"
seo:
  title: "{title} — House of Padmavati"
  description: "{≤160 chars}"
```

### Body Blocks

```
hero → intro → body (2-4) → image → body → pull-quote → system-2 → closure
```

### Block Details

**hero:** Image of the technique, material, or process in action.

**intro:** Opens with a sensory observation that frames why this craft detail matters. Not "zari is a metallic thread" but "zari is the metallic thread that turns a woven saree into something that catches light."

**body:** Explains the concept. Alternates between technical clarity and sensory observation. Each block covers one aspect.

**image:** Visual illustration of a specific point in the explanation.

**pull-quote:** A memorable line that the reader will remember: "Real zari softens with age. Imitation zari stiffens."

**system-2:** Practical reference information — identification tips, comparison tables, care advice.

**closure:** Reframes the technique or material in terms of what it means for the woman who wears it.

## Required Context

- The technique, material, or process to explain
- Specific, accurate technical information (no fabrication)
- Visual reference (how it looks, how to identify it)
- Connection to HOP collections or products where relevant

## Required References

- `src/content/_schemas/craft-note.yaml` (frontmatter schema)
- `docs/research/craft/` (relevant craft knowledge documents)
- `docs/editorial/02-brand-architecture/messaging-pillars.md` (Craft pillar)

## Formatting

- Technical terms are defined on first use
- No jargon without explanation
- Comparisons between real and imitation (when applicable) are factual, not judgmental
- System-2 block can include bullet points, comparison tables, or step-by-step guides

## Acceptance Criteria

- [ ] Technical accuracy verified — no fabricated facts
- [ ] Intro frames the craft detail in sensory terms before explaining it
- [ ] At least one comparison or contrast that helps the reader understand
- [ ] System-2 block provides practical, actionable information
- [ ] Closure connects the craft detail to the woman who will wear it
- [ ] Glossaries terms are referenced in frontmatter
- [ ] Zero exaggerated claims about "ancient secrets" or "lost arts"

## Example Output

See `src/content/craft-notes/understanding-zari/index.md` for a reference implementation.

## Failure Cases

| Failure | Symptom | Correction |
|---------|---------|------------|
| Dry textbook | "Zari is defined as a metallic thread used in decorative weaving." | Open with sensory framing: "Zari is the metallic thread that turns a woven saree into something that catches light." |
| Exaggerated claims | "Ancient weavers possessed secret knowledge lost to modern industry." | Stay factual. Real zari vs imitation is remarkable enough without exaggeration. |
| No practical value | Explains theory without application | Add system-2 block with identification tips or care advice. |
| Marketing framing | "Our sarees use only the finest zari." | Remove. Focus on teaching, not selling. |

---

**Cross-reference:** `src/content/_schemas/craft-note.yaml`, `writing/journal.md` (for less technical articles), `writing/seo-copy.md` (craft note SEO metadata)