# PROMPT: Accessibility Check
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: review
# CONTENT TYPE: all

## Description

Checks content against accessibility standards. Verifies every image has descriptive alt text, the reading level matches the target Flesch-Kincaid grade, the semantic structure uses proper heading hierarchy, and no information is conveyed solely through sensory characteristics.

## Input

Full content unit to check. Content type (for reading level target lookup).

## Methodology

1. **Alt text audit:** Extract every `![...](...)` or `<img>` reference. Verify each has an alt attribute that is not empty and not a filename derivative.
2. **Reading level analysis:** Compute Flesch-Kincaid Grade Level on the full body text (exclude frontmatter). Compare against target:
   - Homepage, Journal Article, Email: Grade 6–7
   - Product Detail, Collection, Craft Note: Grade 7–8
   - Weaver Portrait, Field Note, Ritual Guide: Grade 6–8
   - Policy: Grade 8–9
3. **Semantic structure audit:** Check heading levels form a proper hierarchy (h1 → h2 → h3, never skipping levels). Verify lists use proper markdown list syntax. Check that any visual emphasis (bold, italic) has semantic meaning.
4. **Sensory-only information check:** Scan for instructions or information that relies solely on sensory perception (e.g. "the blue one", "the softest fabric") without accompanying text that makes the information accessible.
5. **Colour contrast note:** If any styling or colour information is present in content (e.g. "the deep indigo border"), verify it is accompanied by descriptive text that works without colour perception.

## Output Format

```yaml
images:
  total: {count}
  with_alt_text: {count}
  descriptive_alt_text: {count}
  violations:
    - image: "{image path or identifier}"
      issue: "Missing alt text | Alt text is filename | Alt text is not descriptive"

reading_level:
  computed_grade: "{grade}"
  target_range: "Grade {min}–{max}"
  pass_fail: {pass|fail}

semantic_structure:
  heading_hierarchy: {valid|invalid}
  list_semantics: {valid|invalid}
  semantic_emphasis: {valid|invalid}
  violations:
    - "{description of violation}"

sensory_only_information:
  pass_fail: {pass|fail}
  violations:
    - line: {line_number}
      text: "{sentence that relies on sensory-only information}"
      recommendation: "{how to make accessible}"

overall_pass: {true if all pass, else false}
```

## Quality Criteria for the Reviewer

- Alt text must describe what is visually depicted, not what the image is about conceptually. "A woman draping a saree" not "Product styling shot for collection X".
- Alt text is "descriptive" only if it conveys the visual content without the image. Minimum 5 words, maximum 125 characters for standard images, up to 250 for hero images.
- Decorative images (borders, separators) must have `alt=""` (empty alt) not missing alt.
- Reading level is computed on body text only. Frontmatter, captions, and alt text are excluded.
- Heading hierarchy violations include: skipping from h1 to h3, having multiple h1 elements, having any heading level that does not follow a logical document outline.
- Sensory-only violations are most common in product content: "feel the weight in your hand" assumes tactile access. Fix by adding objective measurements (grams per metre) alongside sensory language.
- Colour-dependent information must have a non-colour alternative: "the border in deep indigo" becomes "the deep indigo border, distinguished by its saturated dark blue tone".

## Severity Levels

- **Critical:** Missing alt text, reading level exceeding target by more than 2 grades. Must fix before publish.
- **Important:** Non-descriptive alt text, heading hierarchy violations, sensory-only information. Should fix.
- **Nice-to-fix:** Reading level 1 grade above target, minor semantic structure issues. Optional but recommended.
