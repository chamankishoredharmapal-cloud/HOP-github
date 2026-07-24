# Usage Guide

## Overview

The AI Writing Operating System supports three modes of operation. Every session begins with context loading and ends with validation.

## Mode 1: Writing

Generate new HOP content from scratch.

### Workflow

1. **Load context** — Follow `loading-order.md` through Layer 4 (minimum). Use `templates/context-loader.md`.
2. **Identify content type** — Select the relevant document from `writing/`.
3. **Use writing template** — Structure your request using `templates/writing-template.md`.
4. **Provide inputs** — Supply the information specified in the writing document's Required Inputs section.
5. **Execute** — The AI follows the writing document's instructions.
6. **Validate** — Run the output through `review/quality-checklist.md` and relevant review documents.
7. **Iterate** — Use `editing/` documents if refinement is needed.

### When to Use

- Creating original content for any HOP touchpoint
- Generating draft content for editorial review
- Producing SEO metadata alongside body content

## Mode 2: Editing

Transform existing content to meet HOP standards.

### Workflow

1. **Load context** — Follow `loading-order.md` through Layer 3 (minimum).
2. **Identify edit type** — Select the relevant document from `editing/`.
3. **Use editing template** — Structure your request using `templates/editing-template.md`.
4. **Provide source text** — Supply the content to be edited.
5. **Execute** — The AI follows the editing document's instructions.
6. **Validate** — Run the output through `review/brand-review.md` and `review/quality-checklist.md`.

### When to Use

- Migrating existing content into HOP voice
- Refining copy that is factually correct but tonally wrong
- Condensing or expanding content for different touchpoints
- Proofreading before publication

## Mode 3: Review

Evaluate existing content against HOP standards without modifying it.

### Workflow

1. **Load context** — Follow `loading-order.md` through Layer 3 (minimum). For brand review, include Layer 2 fully.
2. **Identify review type** — Select the relevant document from `review/`.
3. **Use review template** — Structure your request using `templates/review-template.md`.
4. **Provide content** — Supply the content to be reviewed.
5. **Execute** — The AI follows the review document's instructions.
6. **Receive findings** — The output is an actionable review report, not modified content.

### When to Use

- Pre-publication quality gate
- Periodic brand consistency audits
- Reviewing AI-generated content before human review
- Checking competitor or reference content against HOP standards

## Combining Modes

The system is composable. Common combinations:

| Scenario | Sequence |
|----------|----------|
| Full content production | Write → Review → Edit → Review |
| Voice migration | Edit (rewrite) → Review (brand) |
| Quick polish | Edit (proofread) → Edit (clarity) |
| Quality gate | Review (comprehensive) → Edit (fix issues) → Review (verify fixes) |

## Model-Specific Notes

While the system is model-agnostic, these guidelines improve output quality:

- **Claude**: Responds well to the reasoning principles in `system/reasoning-principles.md`. Use them as pre-instructions.
- **GPT-4**: Benefits from explicit output formatting in `system/output-format.md`.
- **Gemini**: Include more examples from the writing documents.
- **Kimi**: Provide the complete loading context in a single message.

## Common Mistakes

| Mistake | Correction |
|---------|------------|
| Skipping context loading | Always load at least through Layer 3 before any task. |
| Using writing prompts without the master system prompt | The master system prompt establishes identity. Writing documents assume it has been loaded. |
| Treating review documents as editing documents | Review produces findings, not modified content. Use editing documents for changes. |
| Loading every document | Load only what is relevant. Use `INDEX.md` and `loading-order.md` to select. |
| Duplicating existing EOS knowledge | The system references `docs/editorial/` and `docs/research/`. Load those documents directly rather than repeating their content. |