# Output Format

**Purpose:** The standard format for all AI-generated HOP content. Every writing, editing, and review output must follow this structure.

**When to use:** After completing the reasoning process, before writing the output. Refer to this document to structure the response.

**When NOT to use:** For informal internal notes or brainstorming.

**Cross-reference:** `src/content/README.md` (content schemas and block types), `writing/` (content-type-specific output), `templates/writing-template.md`

---

## Writing Output Format

### For Content Units (journal, craft notes, collections, etc.)

```
--- YAML FRONTMATTER ---
type: {content type}
title: "{title}"
slug: {slug}
published: {YYYY-MM-DD}
status: draft
author: "House of Padmavati"
tag: {tag from controlled vocabulary}
dek: "{160-character summary}"
readingTime: {integer}
hero: ./hero.jpg
alt: "{descriptive alt text}"
seo:
  title: "{title} — House of Padmavati"
  description: "{160-character SEO description}"
ogImage: ./hero.jpg
relatedProducts:
  - "{uuid}"
relatedArticles:
  - "{slug}"
glossaryTerms:
  - "{slug}"
---

--- BODY BLOCKS ---

---
type: hero
image: ./hero.jpg
alt: "{descriptive alt text}"
caption: "{caption line}"
---

---
type: intro
---

{Opening paragraph. Sets the scene. Sensory, immediate, specific. 2-4 sentences.}

---
type: body
---

{Middle section. Multiple body blocks allowed. Sensory description alternating with craft detail.}

---
type: pull-quote
quote: "{A quote that crystallises the piece's soul.}"
attribution: "— House of Padmavati"
---

---
type: image
image: ./images/01-descriptive-name.jpg
alt: "{descriptive alt text}"
caption: "{caption line}"
width: full
---

---
type: closure
---

{Closing paragraph. Returns to emotion. Leaves the reader in a quiet place.}
```

### For SEO Metadata

```
SEO Title: {≤70 characters}
SEO Description: {≤160 characters}
OG Image Alt: {descriptive alt text for the hero image}
```

### For Microcopy

```
Component: {component name}
Context: {where this microcopy appears}
Copy: {the microcopy text}
```

### For Emails

```
Subject: {subject line, ≤60 characters}
Preview: {preview text, ≤90 characters}

{Email body in markdown. Follows HOP voice dimensions for email: warmth 4-5/5, formality 2/5.}

— House of Padmavati
```

## Editing Output Format

For each edit, provide:

### Original

{The original text being edited}

### Issue

{What is wrong — forbidden word, weak construction, generic language, etc.}

### Edit

{The corrected text}

### Rationale

{Why this edit was made, referencing the relevant principle or vocabulary rule}

### For multi-edit responses, provide a summary table:

| # | Location | Issue | Edit | Rationale |
|---|----------|-------|------|-----------|
| 1 | Paragraph 2, sentence 1 | Forbidden word "luxury" | Replaced with specific weaver detail | Forbidden word — see forbidden-words.md |
| 2 | Paragraph 4, sentence 3 | Generic language | Added specific sensory observation | Editorial Principle 1: Show, Don't Tell |

## Review Output Format

### Summary

```
Overall: {pass / conditional pass / fail}
Critical issues: {count}
Important issues: {count}
Minor issues: {count}
```

### Findings

Each finding must include:

```
### Finding {N}: {Title}

**Severity:** critical | important | minor
**Location:** {paragraph, sentence, or section reference}
**Issue:** {what is wrong}
**Criterion:** {which principle, vocabulary rule, or standard is violated}
**Recommendation:** {specific, actionable fix}

Evidence:
> {Direct quote from the content showing the issue}
```

### By failing content that requires a rewrite, include:

```
### Required Reworks

{List of sections that must be rewritten before this content can be approved}
```

## Template Output Format

When using templates from `templates/`, the AI fills the template's placeholders and returns a complete request that can be submitted as-is.