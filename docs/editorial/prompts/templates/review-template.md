# Template: Review Request

**Purpose:** Standard template for submitting a review request to an AI collaborator. Fill in the placeholders and submit.

**When to use:** Every time you ask an AI to review HOP content. Do not submit a review request without using this template.

**When NOT to use:** For writing (use `templates/writing-template.md`). For editing (use `templates/editing-template.md`).

---

## Template

```
# Context Loading

The following documents have been loaded for context:

- {system/brand-context.md}
- {system/master-system-prompt.md}
- {docs/editorial/04-vocabulary-system/forbidden-words.md}
- {the relevant review/ document}
- {any additional reference documents}

# Review Request

## Review Type

{quality-checklist | fact-checking | hallucination-prevention | brand-review | seo-review | accessibility-review}

## Content Under Review

**Title:** {title}
**Type:** {content type}
**Author:** {who wrote it}
**Target page:** {where it will appear}

{The complete content to review. Include frontmatter, body blocks, and SEO metadata.}

## Additional Context

{Any context the reviewer needs to evaluate the content. Examples:}
- {This is a first draft — expect issues}
- {This was AI-generated — check for hallucinations}
- {This is an edit of existing content — compare to the original if available}
- {The target page is the Journal — use journal tone matrix}

## Review Focus

{Optional: narrow the review to specific dimensions.}

{If left blank, the review document's full criteria will be applied.}

## Output Format

{See system/output-format.md and the specific review document for format standards.}

{Findings should be actionable and specific.}
```

## Instructions for Use

1. Load context documents as specified in `loading-order.md` (minimum through Layer 3)
2. Select the appropriate review document from `review/`
3. Copy the template into the AI session
4. Fill in all fields. Include the complete content under review.
5. Submit the request. The AI should respond using the review format from `system/output-format.md`.
6. Review the findings. Classify into must-fix, should-fix, and nice-to-fix.
7. Apply fixes using `editing/` documents or `templates/editing-template.md`.

---

**Cross-reference:** `templates/writing-template.md`, `templates/editing-template.md`, `templates/context-loader.md`, `system/output-format.md`