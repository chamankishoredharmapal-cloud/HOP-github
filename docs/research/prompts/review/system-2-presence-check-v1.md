# PROMPT: System 2 Presence Check
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: review
# CONTENT TYPE: all

## Description

Verifies that required trust signals (System 2 information blocks) are present for each content type. Checks for weave specs, fabric composition, care instructions, origin, weaver references, and CTA presence. Detects missing technical detail, hidden information, and urgency or scarcity signals in the System 2 block.

## Input

Full content unit to check. Content type (product-detail, craft-note, collection, journal-article, or other).

## Methodology

1. Identify all body blocks in the content unit. Classify each as System 1 (sensory, narrative, emotional) or System 2 (technical, informational, trust-building).
2. Check required System 2 elements per content type:
   - **Product Detail:** Must have System 2 block containing weave specifications, fabric composition, care instructions, geographic origin
   - **Craft Note:** Must have System 2 or equivalent technical detail block explaining the technique, materials, and process
   - **Collection:** Must have weaverNote or craft reference block containing weaver name, location, and technique
   - **Journal Article (with technical content):** Must have System 2 block for any technical claims, weave references, or process descriptions
   - **Other types:** No mandatory System 2 requirement
3. For each required element, scan the System 2 block for the corresponding information field.
4. Check that CTAs are present where expected (one per product detail or collection) but not excessive (maximum 2 per content unit). CTAs must not use urgency, scarcity, or imperative language.
5. Verify no hidden information — trade secrets, weaver payment details, proprietary process information that the brand has chosen not to disclose should not appear in System 2.

## Output Format

```yaml
content_type: "{type}"
block_count: {total blocks}
system_1_blocks: {count}
system_2_blocks: {count}

required_elements:
  weave_specifications: {present|missing}
  fabric_composition: {present|missing}
  care_instructions: {present|missing}
  geographic_origin: {present|missing}
  weaver_name: {present|missing}
  weaver_location: {present|missing}
  technique_detail: {present|missing}
  process_description: {present|missing}
  cta_present: {true|false}

missing_elements:
  - {element name}

pass_fail: {pass|fail}
notes:
  - "{any additional observations about System 2 quality or appropriateness}"
```

## Quality Criteria for the Reviewer

- A System 2 field counts as "present" only if it contains specific information. A placeholder like "Care: See care tag" does not count — it must be substantive.
- For Product Detail, all four fields (weave specs, fabric, care, origin) must be present for a pass. Missing any one is a fail.
- For Craft Note, the technique detail must be substantial enough that a reader could understand how the craft differs from related techniques.
- For Collection, a weaver note that names the weaver and describes their relationship to the collection passes even if brief.
- If a content type has no mandatory System 2 requirement but contains one, flag it as a positive note rather than a violation.
- CTAs must be in HOP voice — no "Shop Now" or "Buy Yours". Acceptable: "Explore the {collection}", "Read the weaver's note".
- If any required element is present but placed in a System 1 block (mixing technical detail into sensory narrative), flag it as a structural violation even if the information exists.

## Severity Levels

- **Critical:** Any required element missing from a mandatory System 2 content type. Must fix before publish.
- **Important:** CTA missing from a content type that typically needs one (Product Detail, Collection). Should fix.
- **Nice-to-fix:** Required element exists but could be more specific or better placed. Optional.
