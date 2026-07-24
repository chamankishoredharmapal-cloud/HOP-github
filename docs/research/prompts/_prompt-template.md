# PROMPT: {Name}
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: {generate | seo | microcopy | email | policies | review | critique | rewrite | translation}
# CONTENT TYPE: {journal | collection | product | craft-note | weaver-portrait | field-note | house-letter | ritual-guide | glossary | homepage | email | policy | microcopy}

## Description

{2-3 sentences explaining what this prompt does and when to use it}

## Context Requirements

Load the following documents before running this prompt:

**Knowledge Base:**
- {list of KB docs to load}

**Editorial System:**
- {list of editorial docs to reference}

## Strategic Principles

{Which messaging pillars apply to this content}

{Which emotional stage this content serves}

{Brief reminder of the EOS principles that govern this content type}

## Brand Constraints

- **Formality:** {value}/5
- **Warmth:** {value}/5
- **Sensory Density:** {value}/5
- **Technical Depth:** {value}/5
- **Urgency:** {value}/5
- **Imperative Force:** {value}/5
- **Reading Level:** Grade {value}
- **Forbidden words to avoid:** {list}
- **Vocabulary to prefer:** {list}

## Content Schema

### Frontmatter Fields

```yaml
{field}: {type} — {required/optional} — {description}
```

### Body Block Sequence

```
1. {block type} — {purpose}
2. {block type} — {purpose}
...
```

## Input

{What the user provides to this prompt}

## Output Format

Generate a complete content unit. The output must have:

1. **YAML frontmatter** between `---` delimiters with all required fields
2. **Body blocks** separated by `---` delimiters

```markdown
---
{frontmatter fields}
---

---
type: {block type}
{block fields}
---

{block body content}

---
type: {block type}
{block fields}
---

{block body content}
```

## Quality Criteria

- {Criterion 1}
- {Criterion 2}
- {Criterion 3}
- {Criterion 4}
- {Criterion 5}

## Review Prompts to Run After Generation

- `{review prompt}` — {what it checks}
- `{review prompt}` — {what it checks}
