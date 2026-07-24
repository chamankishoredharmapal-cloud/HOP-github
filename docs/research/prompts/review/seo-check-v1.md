# PROMPT: SEO Check
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: review
# CONTENT TYPE: all

## Description

Checks content against SEO requirements. Verifies title length, meta description length, OG image presence, JSON-LD structured data, canonical URL format, slug conventions, and meta description uniqueness. Each check produces a pass or fail with the specific value found and the required value.

## Input

Full content unit including frontmatter. The page URL or slug if available.

## Methodology

1. **Title length:** Extract the `title` field from frontmatter. Count characters. Pass if ≤ 70 characters.
2. **Meta description length:** Extract the `meta_description` field. Count characters. Pass if ≤ 160 characters.
3. **OG image:** Check for `og_image` field. If present, verify it has an `alt` attribute that is not empty. Pass if present with descriptive alt.
4. **JSON-LD structured data:** Check for a `json_ld` or structured data block in the frontmatter or body. Verify it contains the correct type for the content:
   - Product Detail → `Product` schema
   - Collection → `CollectionPage` schema
   - Journal Article → `Article` schema
   - Homepage → `WebPage` schema
   - Other → applicable schema type
   - Also check that `BreadcrumbList` is present for any content within a navigation hierarchy.
5. **Canonical URL:** Check for `canonical_url` field. Verify format: `https://houseofpadmavati.com/{slug}`. Pass if properly formatted.
6. **Slug:** Extract `slug` from frontmatter. Pass if kebab-case (lowercase letters, digits, hyphens only).
7. **Duplicate meta descriptions:** For multi-block content, check that each block does not repeat the same meta description. Pass if all unique.

## Output Format

```yaml
checks:
  title_length:
    found: "{length} characters"
    required: "≤ 70 characters"
    pass_fail: {pass|fail}
  meta_description_length:
    found: "{length} characters"
    required: "≤ 160 characters"
    pass_fail: {pass|fail}
  og_image:
    present: {true|false}
    has_alt_text: {true|false}
    pass_fail: {pass|fail}
  json_ld:
    schema_type: "{Article|Product|CollectionPage|WebPage|Other}"
    breadcrumb_list: {present|missing}
    pass_fail: {pass|fail}
  canonical_url:
    found: "{url}"
    format_valid: {true|false}
    pass_fail: {pass|fail}
  slug:
    found: "{slug}"
    is_kebab_case: {true|false}
    pass_fail: {pass|fail}
  duplicate_meta_descriptions:
    pass_fail: {pass|fail}
    violations: [{duplicate values}]

overall_pass: {true if all pass, else false}
```

## Quality Criteria for the Reviewer

- Character counts include spaces. Use the exact string length from the frontmatter field.
- OG image alt text must be descriptive of the image, not a generic phrase like "OG image for article X".
- JSON-LD must be syntactically valid JSON. Unescaped quotes, trailing commas, or missing brackets are violations even if the schema type is correct.
- If no canonical URL is present but the content is a Product Detail, the product URL should be derived from the slug and checked for consistency.
- Slug must not contain underscores, uppercase letters, or special characters except hyphens.
- For duplicate meta descriptions, compare field values exactly. Trailing whitespace differences count as different values.
- If any field is missing entirely (not just failing its criteria), report it as missing rather than assigning a value.

## Severity Levels

- **Critical:** Missing title, meta description, or canonical URL. JSON-LD missing or incorrect schema type. Must fix before publish.
- **Important:** Title or meta description exceeds length limit. Missing OG image alt. Canonical URL format wrong. Should fix.
- **Nice-to-fix:** Slug not kebab-case. Missing BreadcrumbList. Duplicate meta descriptions. Optional but recommended.
