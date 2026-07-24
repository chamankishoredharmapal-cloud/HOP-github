# Template: Context Loader

**Purpose:** A reusable checklist for loading the correct context before any AI session. Ensures no layer is skipped.

**When to use:** Before every AI session. Run through the checklist and load the indicated documents.

**When NOT to use:** For the initial session setup (use `templates/session-bootstrap.md` which includes this checklist and more).

---

## Context Loading Checklist

### Layer 1: Identity

- [ ] `system/brand-context.md` (required)
- [ ] `docs/editorial/02-brand-architecture/brand-bible.md` (optional — for deep context)

### Layer 2: Voice

- [ ] `system/master-system-prompt.md` (required)
- [ ] `docs/editorial/02-brand-architecture/voice-bible.md` (required — for tone matrix)

### Layer 3: Vocabulary

- [ ] `docs/editorial/04-vocabulary-system/approved-words.md` (required)
- [ ] `docs/editorial/04-vocabulary-system/forbidden-words.md` (required)
- [ ] `docs/editorial/04-vocabulary-system/grammar-and-usage.md` (required for proofreading, optional for writing)
- [ ] `docs/editorial/04-vocabulary-system/preferred-verbs-nouns.md` (optional — for vocabulary refinement)

### Layer 4: Editorial Governance

- [ ] `system/editorial-context.md` (required)
- [ ] `system/writing-principles.md` (required for writing)
- [ ] `system/reasoning-principles.md` (required for writing)
- [ ] `docs/editorial/02-brand-architecture/editorial-principles.md` (optional — for deep understanding)
- [ ] `docs/editorial/02-brand-architecture/messaging-pillars.md` (required for brand review)

### Layer 5: Emotional Architecture

- [ ] `docs/editorial/02-brand-architecture/emotional-principles.md` (optional)
- [ ] `docs/editorial/07-emotional-architecture/emotional-journey.md` (required for major content)
- [ ] `docs/editorial/07-emotional-architecture/page-emotion-map.md` (required for page-specific content)

### Layer 6: Task-Specific

Based on the task, select from:

**Writing:**
- [ ] The relevant `writing/` document
- [ ] `templates/writing-template.md`
- [ ] Relevant `src/content/_schemas/` file (for schema reference)
- [ ] Research documents from `docs/research/` as needed

**Editing:**
- [ ] The relevant `editing/` document
- [ ] `templates/editing-template.md`

**Review:**
- [ ] The relevant `review/` document
- [ ] `templates/review-template.md`

## Quick Loading Commands

For the AI, specify which documents to load:

```
Please load the following context documents:
1. docs/editorial/prompts/system/brand-context.md
2. docs/editorial/prompts/system/master-system-prompt.md
3. docs/editorial/04-vocabulary-system/approved-words.md
4. docs/editorial/04-vocabulary-system/forbidden-words.md
5. docs/editorial/prompts/system/editorial-context.md
6. docs/editorial/prompts/system/writing-principles.md
7. docs/editorial/prompts/system/reasoning-principles.md
8. docs/editorial/prompts/writing/{task-document}.md
```

---

**Cross-reference:** `loading-order.md` (the rationale for this order), `templates/session-bootstrap.md` (complete session setup)