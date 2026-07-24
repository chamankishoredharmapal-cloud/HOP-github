# Review: Accessibility Review

**Purpose:** Audit content for accessibility standards compliance — ensuring HOP content is usable by people with disabilities.

**When to use:** Before publication of any content. Especially important for content with images, complex layouts, or rich media.

**When NOT to use:** For voice or brand review (use `review/brand-review.md`). For SEO review (use `review/seo-review.md`). Accessibility review focuses on inclusive design standards.

---

## Purpose

Ensure HOP content is accessible to all readers, including those using screen readers, those with visual impairments, those with cognitive disabilities, and those with limited literacy.

## Required Inputs

- The content to review
- All images and their alt text
- The page layout (for heading hierarchy and semantic structure)

## Expected Outputs

- Accessibility score (percentage)
- List of accessibility issues with severity and recommendations
- Overall: Pass / Conditional Pass / Fail

## Accessibility Review Criteria

### 1. Alt Text

**Pass criteria for every image:**
- Alt text is present (not empty, not missing)
- Alt text describes what is visible in the image
- Alt text is concise (≤125 characters for simple images)
- Alt text does not begin with "image of" or "picture of"
- Decorative images have empty alt text (alt="")

**Warning signs:**
- Alt text describes what the image should make the reader feel, not what is visible
- Alt text is identical for different images
- Alt text contains marketing language
- Missing alt text

### 2. Reading Level

**Pass criteria by content type:**

| Content Type | Target Reading Level |
|-------------|-------------------|
| Homepage | Grade 8 |
| Collections | Grade 8 |
| Product Detail | Grade 9 |
| Journal Article | Grade 9 |
| About | Grade 8 |
| Customer Care | Grade 7 |
| Policies | Grade 9 |
| Microcopy | Grade 6 |
| Emails | Grade 7 |

**Warning signs:**
- Sentences over 25 words
- Uncommon words without context
- Academic or jargon-heavy language without explanation

### 3. Semantic Structure

**Pass criteria:**
- Single h1 per page (matches the page title)
- Headings follow logical hierarchy (h1 → h2 → h3 — no skipping)
- Heading text is descriptive, not generic
- Lists use proper list markup (implied in markdown)
- No information conveyed through colour alone

**Warning signs:**
- Multiple h1 elements
- h2 followed by h4 (skipping h3)
- Headings that say "Click Here" or "Read More"

### 4. Link Text

**Pass criteria:**
- Link text describes the destination
- No "click here" or "read more" as link text
- Link text is unique on the page (no two identical links to different destinations)

### 5. Colour and Contrast

**Pass criteria:**
- No information conveyed through colour alone
- Text has sufficient contrast against background (this is a design review — flag but do not block content for)

### 6. Language

**Pass criteria:**
- Content language is declared (assumed: en-IN)
- Abbreviations are spelled out on first use (or avoided in narrative)
- Contractions are used consistently (allowed at HOP)

## Finding Format

```
### Issue {N}: {Type}

**Severity:** critical | important | minor
**Criterion:** {which accessibility criterion}
**Element:** {the specific element with the issue}
**Current:** {the current value or behaviour}
**Issue:** {why this is an accessibility problem}
**Recommendation:** {specific fix}
**WCAG Reference:** {the WCAG success criterion this relates to, if applicable}
```

## Scoring

| Score | Meaning |
|-------|---------|
| **Pass (90-100%)** | All critical and important checks pass. Minor improvements optional. |
| **Conditional Pass (70-89%)** | All critical checks pass. Important checks have issues with clear fixes. |
| **Fail (<70%)** | Critical accessibility issues present. Must fix before publication. |

---

**Cross-reference:** `review/quality-checklist.md` (comprehensive review includes accessibility), `editing/clarity.md` (related readability work), `system/writing-principles.md` (sentence construction rules)