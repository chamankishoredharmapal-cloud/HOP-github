# Review: Quality Checklist

**Purpose:** Run a comprehensive quality review on any HOP content. Covers all dimensions of editorial quality — voice, vocabulary, emotion, structure, SEO, accessibility, and truthfulness.

**When to use:** Before publication of any content. After writing or editing, as the final quality gate.

**When NOT to use:** For focused, single-dimension reviews (use the specific review document: `brand-review.md`, `seo-review.md`, etc.). This checklist is comprehensive — it takes longer but covers everything.

---

## Purpose

Ensure every piece of HOP content meets the house's quality standards before it reaches the reader. The checklist is the single pass/fail gate for publication.

## Required Inputs

- The content to review
- The content type (applies type-specific criteria)
- (Optional) The page it will appear on (applies page-specific tone targets)

## Expected Outputs

- Pass / Conditional Pass / Fail
- List of all findings with severity and actionable recommendations
- If conditional pass: conditions that must be met before publication

## Review Criteria

### 1. Identity Check (Critical)

Does this content sound like HOP? Would a reader recognise it as HOP without attribution?

**Pass:** Yes — the identity markers are present (specificity, sensory language, human scale, quiet confidence)

**Fail:** No — sounds generic, sounds like marketing, sounds like any other brand

### 2. Forbidden Words Check (Critical)

Are any forbidden words present?

**Pass:** Zero forbidden words

**Fail:** One or more forbidden words found

**Action:** List every forbidden word with its location. Content cannot pass until all are removed.

### 3. Editorial Principles Check (Critical)

Does this content violate any of the six editorial principles?

Check each principle:
- Show, Don't Tell: Does the content show sensory experience or tell abstract qualities?
- Specific Over Generic: Is every claim as specific as it could be?
- Rooted in the Real: Is every claim traceable?
- Restrained: Does every element serve the purpose?
- Human-Scale: Is it written for one woman, not a demographic?
- Trust Through Transparency: Is anything hidden that should be shown?

**Pass:** All principles satisfied

**Fail:** One or more principles violated

### 4. Sensory Density Check (Important)

Does the content have adequate sensory language for its type?

| Content Type | Min Sensory Anchors |
|-------------|-------------------|
| Homepage | 2 per section |
| Collection | 3 total |
| Product Story | 4 total |
| Journal Article | 1 per 100 words |
| Craft Note | 2 total |
| About | 2 total |

**Pass:** Meets minimum for type

**Fail:** Below minimum

### 5. Emotional Stage Check (Important)

Does the content serve the correct emotional stage for its page?

**Pass:** The dominant emotion matches the page's primary emotion from the page-emotion-map

**Fail:** The content creates a different emotion than intended

### 6. Sentence Architecture Check (Important)

Does the content follow HOP's sentence architecture rules?

- No sentences over 25 words
- Varied sentence rhythm
- No two consecutive sentences with the same structure
- No question openings or closings
- No exclamation marks

### 7. SEO Metadata Check (Important)

Check SEO title and description:
- Title ≤70 characters with brand name
- Description ≤160 characters, meaningful
- OG image alt text present and descriptive

### 8. Accessibility Check (Important)

- All images have alt text
- Reading level appropriate for content type
- Heading hierarchy is logical
- Link text is descriptive

### 9. Formatting Check (Minor)

- Sentence case for headlines
- Oxford comma in lists
- Em dashes with spaces
- Curly quotes
- Indian English spelling
- No double spaces

### 10. Cross-Reference Check (Important)

- All referenced slugs exist
- All referenced UUIDs exist
- Related content is genuinely relevant

## Scoring

| Result | Criteria |
|--------|----------|
| **Pass** | All critical checks pass. All important checks pass. Minor issues may remain. |
| **Conditional Pass** | All critical checks pass. One or two important checks fail with clear fixes identified. |
| **Fail** | Any critical check fails. Multiple important checks fail without clear fixes. |

## Finding Format

```
### Finding {N}: {Title}

**Severity:** critical | important | minor
**Criterion:** {which check from the checklist}
**Location:** {paragraph or section reference}
**Issue:** {what is wrong}
**Recommendation:** {specific, actionable fix}
```

---

**Cross-reference:** `review/brand-review.md` (focused brand audit), `review/seo-review.md` (focused SEO audit), `review/accessibility-review.md` (focused accessibility audit), `system/output-format.md` (review output format)