# Review: Fact-Checking

**Purpose:** Verify that factual claims in HOP content are accurate, traceable, and not fabricated.

**When to use:** Before publication of any content that makes factual claims about craft, culture, history, materials, or processes. Especially critical for craft notes, weaver portraits, field notes, and journal articles.

**When NOT to use:** For voice or style review (use `review/brand-review.md`). For detecting hallucinations (use `review/hallucination-prevention.md`). Fact-checking assumes good faith — it verifies claims that are intended to be true.

---

## Purpose

Ensure every factual claim in HOP content is accurate. HOP never fabricates. An omitted detail is better than a false one.

## Required Inputs

- The content to fact-check
- Source material or research documents for verification
- (Optional) Contact information for domain experts if available

## Expected Outputs

- List of verified claims (confirmed accurate)
- List of unverifiable claims (remove or flag)
- List of fabricated or inaccurate claims (must remove)

## Fact-Check Categories

### 1. Craft Claims

Verify:
- Weave type and technique names
- Fabric composition and weights
- Weaving process descriptions
- Tool and equipment names
- Regional associations

**Check against:** `docs/research/craft/`, known textile references, domain expertise.

**Common issues:** Confusing weave types, overgeneralising regional techniques, inaccurate fabric weights.

### 2. Cultural Claims

Verify:
- Ritual and tradition descriptions
- Historical dates and events
- Regional customs
- Generational claims ("four generations")

**Check against:** `docs/research/culture/`, historical sources, pattern: verify generational claims with named weavers.

**Common issues:** Exaggerating the age of a tradition, conflating regional customs, claiming "ancient" without evidence.

### 3. Material Claims

Verify:
- Fibre types (Mulberry silk, tussar, cotton, etc.)
- Zari composition (real vs imitation, silver vs copper, gold wash)
- Dye types (natural vs chemical)
- Care requirements

**Check against:** `docs/research/craft/`, material specifications, industry standards.

**Common issues:** Calling imitation zari "real," overstating natural dye usage, inaccurate care instructions.

### 4. Geographic Claims

Verify:
- Village and town names
- District and state associations
- Geographic descriptions
- Loom geography

**Check against:** `docs/research/craft/loom-geography.md`, verified sources.

**Common issues:** Putting a village in the wrong state, describing a region inaccurately.

### 5. Numerical Claims

Verify:
- Weaving time ("twenty-one days")
- Generational depth ("fourth generation")
- Measurements (length, weight, thread count)
- Batch sizes

**Check against:** Sources, interviews, domain expertise.

**Common issues:** Rounding that changes the meaning, conflating different weavers' timelines.

## Verification Protocol

| Claim Type | Verification Method | Pass Criteria |
|------------|-------------------|---------------|
| Craft technique | Cross-reference with craft research | Technique name matches source |
| Fabric composition | Cross-reference with material spec | Composition matches spec |
| Cultural practice | Cross-reference with culture research | Practice is documented in source |
| Number/measurement | Cross-reference with verified source | Number matches within reasonable tolerance |
| Name (weaver, village) | Check against known records | Name is verified or explicitly attributed |
| Generational claim | Check against named weaver's history | Generational count is attributed and plausible |

## Finding Format

```
### Claim: {the factual claim as written}

**Location:** {paragraph, sentence}
**Category:** {craft | cultural | material | geographic | numerical}
**Verification:** {verified | unverifiable | inaccurate}
**Source:** {the source that confirms or contradicts this claim}
**Action:** {keep | flag for attribution | remove}
```

## Common Mistakes

| Mistake | Correction |
|---------|------------|
| Assuming common knowledge is accurate | Verify everything. Common knowledge about handloom is often wrong. |
| Trusting AI-generated facts | AI-generated factual claims about craft and culture are frequently fabricated. Verify all of them. |
| Letting a good story override accuracy | If the factual claim makes the story better but is unverifiable, remove it. |
| Accepting round numbers | "Twenty-one days" is specific and plausible. "About three weeks" is vague. "Thirty days" is suspiciously round. |

---

**Cross-reference:** `review/hallucination-prevention.md` (detecting fabricated content), `docs/research/` (verification sources), `system/master-system-prompt.md` (HOP's truthfulness standard)