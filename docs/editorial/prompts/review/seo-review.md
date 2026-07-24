# Review: SEO Review

**Purpose:** Audit content for SEO best practice compliance — metadata quality, structural signals, and search intent alignment.

**When to use:** Before publication of any content. After writing, as a check that SEO metadata meets HOP's standards.

**When NOT to use:** For voice or brand review (use `review/brand-review.md`). For comprehensive quality review (use `review/quality-checklist.md`). SEO review is focused on search-specific elements only.

---

## Purpose

Ensure every piece of HOP content is optimised for search engines without sacrificing brand voice or integrity. SEO at HOP is honest, specific, and reader-first.

## Required Inputs

- The content to review
- The SEO metadata (title, description, OG image alt)
- The target page route

## Expected Outputs

- SEO score (percentage)
- List of SEO issues with severity and recommendations
- Overall: Pass / Conditional Pass / Fail

## SEO Review Criteria

### 1. Title Quality

**Pass criteria:**
- Title is ≤70 characters
- Title includes brand name: " — House of Padmavati"
- Title is in sentence case
- Title accurately describes the content
- Title contains the primary keyword naturally

**Warning signs:**
- Keyword stuffing
- Clickbait phrasing
- Generic title that could apply to any content
- Missing brand name

### 2. Description Quality

**Pass criteria:**
- Description is ≤160 characters
- Description is a coherent sentence or two
- Description accurately summarises the content
- Description contains relevant keywords naturally
- Description is written in HOP voice

**Warning signs:**
- Keyword stuffing
- Description that duplicates the title
- Description that is a fragment, not a sentence
- Generic description that could apply to any content

### 3. OG Image Alt

**Pass criteria:**
- OG image alt text is present
- Describes what is visible in the image
- ≤125 characters
- Functional, not poetic

### 4. Content Structure

**Pass criteria:**
- Content type is clear from the URL structure
- Heading hierarchy is logical (h1 → h2 → h3)
- First paragraph contains relevant keywords naturally
- Content length is appropriate for the topic

### 5. Search Intent Alignment

**Pass criteria:**
- Content matches the likely search intent for its target keywords
- Informational content provides genuine information (not thin content)
- Transactional content provides the information needed to decide

### 6. Structured Data (if applicable)

**Pass criteria:**
- JSON-LD is present and valid for the content type
- Required fields are populated
- No errors in structured data

**Note:** Structured data validation requires a schema validator. If one is not available, flag for technical review.

## Keyword Quality Check

| Good Keyword Use | Bad Keyword Use |
|-----------------|-----------------|
| Keyword appears naturally in the title | Keyword stuffed into the title awkwardly |
| Keyword appears in the first paragraph if relevant | Keyword forced into every paragraph |
| Synonyms and related terms used naturally | Same keyword repeated without variation |
| Primary keyword in the SEO description | Description is a list of keywords, not a sentence |

## Finding Format

```
### Issue {N}: {Type}

**Severity:** critical | important | minor
**Criterion:** {which SEO criterion}
**Element:** {title | description | og-alt | structure | intent | schema}
**Current:** {the current value}
**Recommendation:** {specific fix}
```

## Scoring

| Score | Meaning |
|-------|---------|
| **Pass (90-100%)** | All critical and important checks pass. Minor improvements optional. |
| **Conditional Pass (70-89%)** | All critical checks pass. Important checks have issues with clear fixes. |
| **Fail (<70%)** | Critical checks fail. Content needs SEO rework before publication. |

---

**Cross-reference:** `writing/seo-copy.md` (SEO copy generation), `docs/research/seo/` (SEO research), `review/quality-checklist.md` (comprehensive review that includes SEO)