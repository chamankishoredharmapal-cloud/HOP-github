# Template: Editing Request

**Purpose:** Standard template for submitting an editing request to an AI collaborator. Fill in the placeholders and submit.

**When to use:** Every time you ask an AI to edit existing HOP content. Do not submit an editing request without using this template.

**When NOT to use:** For writing (use `templates/writing-template.md`). For review (use `templates/review-template.md`).

---

## Template

```
# Context Loading

The following documents have been loaded for context:

- {system/brand-context.md}
- {system/master-system-prompt.md}
- {system/writing-principles.md}
- {docs/editorial/04-vocabulary-system/forbidden-words.md}
- {the relevant editing/ document}
- {any additional reference documents}

# Editing Request

## Edit Type

{rewrite | proofread | expand | shorten | luxury-tone | clarity | consistency}

## Source Attribution

**Author:** {who wrote the original content}
**Context:** {where this content appears or will appear}

## Original Content

{The complete text to be edited. Include all context needed to understand it.}

## Specific Instructions

{What kind of edit is needed. Examples:}
- {Rewrite this in HOP voice — it currently sounds too corporate}
- {Shorten to fit a 200-character limit}
- {Expand the sensory description — it is too dry}
- {Check for consistency with the Kalyani collection narrative}

## Constraints

- {Preserve all factual claims}
- {Do not add facts not in the original}
- {Target word count, if shortening}
- {Specific elements that must not change}

## Desired Output Format

{See system/output-format.md for standards.}

{edit-summary | inline-edits | full-rewrite}
```

## Instructions for Use

1. Load context documents as specified in `loading-order.md` (minimum through Layer 3)
2. Copy the template into the AI session
3. Fill in all fields. Include the complete original content.
4. Submit the request. The AI should respond using the editing format from `system/output-format.md`.
5. Review each edit before applying. AI suggestions are starting points, not final.

---

**Cross-reference:** `templates/writing-template.md`, `templates/review-template.md`, `templates/context-loader.md`, `system/output-format.md`