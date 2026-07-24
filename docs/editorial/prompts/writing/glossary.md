# Writing: Glossary

**Purpose:** Generate glossary definitions for textile terminology used across HOP content.

**When to use:** Creating a new glossary entry (zari, pattu, ilkal, etc.).

**When NOT to use:** For extended educational content (use `writing/craft-notes.md`). Glossary entries are concise definitions, not articles.

---

## Objective

Define a handloom term clearly, accurately, and beautifully. The definition must be correct enough for an expert and clear enough for a newcomer.

## Audience

Anyone reading HOP content who encounters an unfamiliar term. Glossary entries are reference material — the reader arrives with a question and leaves with an answer.

## Tone

| Dimension | Target |
|-----------|--------|
| Formality | 3/5 |
| Warmth | 2/5 (informational, not emotional) |
| Sensory Density | 2/5 (functional description) |
| Technical Depth | 3/5 (accurate and complete) |
| Urgency | 0/5 |

**Reading level:** Grade 8

## Structure

### Frontmatter

```yaml
type: glossary
term: "{Term}"
slug: "{kebab-case-slug}"
pronunciation: "/{IPA}/"
category: "{Fabric | Weave | Technique | Tool | Tradition | Region}"
definition: "{1-3 sentence definition}"
extended: "{Optional deeper explanation in markdown}"
relatedTerms:
  - "{slug}"
seeAlso:
  - "{slug}"
```

### Body

The file contains the frontmatter only. The `definition` field is the primary content. The `extended` field is optional for deeper explanation.

## Required Context

- The term itself
- Its category
- Accurate definition (verified, not fabricated)
- IPA pronunciation guide (if known)
- Related terms for cross-referencing

## Required References

- `src/content/_schemas/glossary.yaml` (frontmatter schema)
- `docs/research/craft/` (for technical accuracy)

## Formatting

- Definition is 1-3 complete sentences
- Pronunciation in IPA within forward slashes
- Extended field is plain markdown (paragraphs, not blocks)
- No sensory language required (this is reference, not editorial)

## Acceptance Criteria

- [ ] Definition is technically accurate
- [ ] Pronunciation uses IPA notation
- [ ] Category is from the controlled vocabulary
- [ ] Definition is understandable by a non-expert
- [ ] Related terms link to existing glossary entries
- [ ] SeeAlso links to actual HOP content that uses the term

## Example Output

```yaml
type: glossary
term: "Zari"
slug: zari
pronunciation: "/ˈzɑːri/"
category: Technique
definition: "A metallic thread traditionally made of fine silver or gold wire wrapped around a silk core, used in Indian handloom weaving to create decorative patterns and borders."
extended: "Real zari is made by spinning silver wire around a silk core, then washing it in gold..."
relatedTerms:
  - pattu
seeAlso:
  - understanding-zari
  - kalyani
```

## Failure Cases

| Failure | Symptom | Correction |
|---------|---------|------------|
| Inaccurate definition | Claiming zari is gold thread | Correct: "silver wire wrapped in gold wash" |
| Overly technical | "A metallic yarn composed of a flattened wire element..." | Simplify: "A metallic thread made of silver or gold wire wrapped around a silk core." |
| Marketing tone | "The finest quality metallic thread used in our premium sarees." | Remove brand promotion. Glossary is reference, not marketing. |
| No pronunciation | Missing IPA guide | Add pronunciation or note it as unknown rather than omitting. |

---

**Cross-reference:** `src/content/_schemas/glossary.yaml`, `src/content/glossary/` (existing entries), `writing/craft-notes.md` (articles that use glossary terms)