# Template: Writing Request

**Purpose:** Standard template for submitting a writing request to an AI collaborator. Fill in the placeholders and submit.

**When to use:** Every time you ask an AI to write HOP content. Do not submit a writing request without using this template.

**When NOT to use:** For editing (use `templates/editing-template.md`). For review (use `templates/review-template.md`).

---

## Template

```
# Context Loading

The following documents have been loaded for context (see loading-order.md):

- {system/brand-context.md}
- {system/master-system-prompt.md}
- {system/writing-principles.md}
- {system/reasoning-principles.md}
- {docs/editorial/04-vocabulary-system/approved-words.md}
- {docs/editorial/04-vocabulary-system/forbidden-words.md}
- {the relevant writing/ document}
- {any additional research or reference documents}

# Writing Request

## Content Type

{journal | collection | product-story | craft-note | about | ritual-guide | glossary | email | microcopy | CTA | seo-metadata}

## Brief

{2-4 sentences explaining what this content is about, why it is being created now, and what it should achieve}

## Required Inputs

### Identity
- {Title or name of the content unit}
- {Slug (optional — AI may suggest)}
- {Tag from controlled vocabulary (if applicable)}

### Context
- {Key weaver names, places, or techniques to include}
- {Related collection, product, or article references}
- {Any specific sensory notes or details}

### Emotional Target
- {Primary emotional stage from the emotional journey}
- {Key feeling the content should create}

### Practical Details
- {Fabric, weave, colour, or material details (if applicable)}
- {Price tier or positioning (if relevant to tone)}

## Specific Instructions

{Any specific direction not covered by the standard writing document. Examples:}
- {Emphasise the tradition aspect over the sensory}
- {Include a specific weaver quote}
- {Write for a first-time visitor}

## Constraints

- {Word count target, if any}
- {Must include certain references}
- {Must avoid certain topics}

## Reference Material

{Any text, images, or links that should inform the writing}
```

## Instructions for Use

1. Load context documents as specified in `loading-order.md`
2. Copy the template into the AI session
3. Fill in all fields. If a field is not applicable, mark it as "N/A" — do not delete it.
4. Submit the complete request as a single message
5. The AI should respond with the content in the format specified in `system/output-format.md`

---

**Cross-reference:** `templates/editing-template.md`, `templates/review-template.md`, `templates/context-loader.md`, `templates/session-bootstrap.md`