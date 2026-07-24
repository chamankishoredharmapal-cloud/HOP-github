# Editing: Consistency

**Purpose:** Enforce brand consistency across HOP content — voice, vocabulary, grammar, messaging pillars, and emotional alignment.

**When to use:** Reviewing a batch of content before publication to ensure all pieces speak with the same voice. Auditing existing content for consistency issues. Onboarding new content into the HOP system.

**When NOT to use:** For single-piece proofreading (use `editing/proofread.md`). For voice transformation (use `editing/rewrite.md`). Consistency is about ensuring harmony across multiple pieces or against a standard — it is a broader check than other editing operations.

---

## Purpose

Ensure every piece of HOP content sounds like it came from the same house. Consistency edits catch voice drift, vocabulary violations, and structural deviations that may not be obvious in a single piece but become visible across multiple.

## Required Inputs

- The content or collection of content to check
- The standard to check against (voice bible, vocabulary system, grammar guide)

## Expected Outputs

- List of inconsistencies found with location and recommendation
- Edited content with consistency fixes applied

## Constraints

- Do not change the meaning or factual content
- Do not remove the author's individual voice within HOP's voice — consistency does not mean uniformity
- When a piece violates a rule but the violation is defensible (e.g., intentional rhythm break), note it rather than changing it

## Consistency Checks

### 1. Voice Drift

Check that all content in the batch stays within HOP's voice dimensions:

| Dimension | Acceptable Range |
|-----------|-----------------|
| Formality | 2-4/5 |
| Warmth | 3-5/5 |
| Sensory Density | 3-5/5 (varies by type) |
| Technical Depth | 1-3/5 (varies by type) |
| Urgency | 0-1/5 |
| Imperative Force | 1-2/5 |

If any piece drifts outside these ranges, flag it for voice re-alignment.

### 2. Vocabulary Consistency

Check that:
- The same concepts use the same words across pieces (e.g., always "saree" not sometimes "sari")
- Forbidden words are absent from all pieces
- Brand palette colours are used consistently
- Preferred verbs and nouns are used consistently

### 3. Tone Table Alignment

Check each piece against its page type's tone targets in the Voice Bible Tone Matrix. A journal article should not read like a product page.

### 4. Structural Consistency

Check that:
- All content of the same type follows the same body block sequence
- Frontmatter fields follow the same order
- SEO metadata follows the same pattern

### 5. Emotional Consistency

Check that:
- The emotional stage a piece serves is appropriate for its content type
- No piece creates an emotion that contradicts HOP's emotional architecture for that page

### 6. Cross-Reference Consistency

Check that:
- Related content references are bidirectional (if A references B, B references A where appropriate)
- Terminology in linked pieces matches (same term for the same concept)

## Examples

**Inconsistency found:** "zari" in one article, "jari" in another.

**Fix:** Standardise to "zari" (HOP's preferred spelling).

**Inconsistency found:** "Add to bag" on product pages but "Add to cart" in the cart page.

**Fix:** Standardise to "Add to bag" (preferred HOP vocabulary).

**Inconsistency found:** Journal article uses present tense; another uses past tense for the same time period.

**Fix:** Standardise tense. HOP prefers present tense for general truths, past for specific events.

## Common Mistakes

| Mistake | Correction |
|---------|------------|
| Over-standardising | Consistency does not mean every sentence sounds the same. Allow rhythm variation within the voice. |
| Missing cross-content issues | Consistency is easiest to check by comparing multiple pieces side by side. |
| Enforcing rules that do not apply | Different content types have different tone targets. A product page is not a journal article. |
| Confusing consistency with perfection | Some inconsistency is acceptable (e.g., a deliberately broken rhythm for effect). Flag but do not force-fix. |

---

**Cross-reference:** `docs/editorial/02-brand-architecture/voice-bible.md` (tone matrix), `docs/editorial/04-vocabulary-system/` (vocabulary standards), `review/brand-review.md` (related brand audit)