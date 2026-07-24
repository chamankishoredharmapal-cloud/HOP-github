# PROMPT: Structural Flow
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: critique
# CONTENT TYPE: all

## Description

Evaluates content schema adherence and block sequence. Checks whether the content unit follows the correct block sequence for its type, whether all required block types are present, whether optional block types are used effectively, whether the block order creates a logical reader journey, and whether the balance between System 1 (sensory body blocks) and System 2 (information body blocks) is correct. Provides block-level analysis and recommendations.

## Input

Full content unit to critique. Content type (for schema lookup).

## Methodology

1. **Block sequence validation:** Parse the content unit into its component blocks (separated by `---` delimiters). Map each block to its block type from the block sequence specification for the given content type. Compare the actual sequence against the required sequence.
2. **Required block presence:** Check that every required block type for the content type is present. Required blocks are defined in the content type schema:
   - Product Detail: hero-image, sensory-body, technical-body, weaver-note, product-details
   - Collection: hero-image, sensory-body, collection-grid, weaver-note
   - Journal Article: hero-image, sensory-body, narrative-body, technical-body (if applicable), closing
   - Craft Note: hero-image, sensory-body, technical-body
   - Homepage: hero, sensory-body, collection-grid, closing
   - Others: per content type schema
3. **Optional block effectiveness:** Check each optional block that is present. Ask: does this block add something the required blocks cannot? Does it deepen the reader's understanding or emotional connection? Flag optional blocks that feel redundant, filler, or misplaced.
4. **Reader journey logic:** Read the blocks in sequence and assess the logical progression. Does the reader move naturally from one block to the next? Is there a clear narrative thread? Flag any block that feels like it belongs in a different position.
5. **System 1 / System 2 balance:** Classify each body block as System 1 (sensory, narrative, emotional — evokes feeling) or System 2 (technical, informational, trust-building — provides data). Verify that System 1 blocks come first (establishing emotional connection) and System 2 blocks follow (providing reasons to trust). Flag blocks where System 1 and System 2 content is mixed within a single block.

## Output Format

```yaml
overall_score: "{score}/10"

blocks:
  - position: {1-based index}
    type: "{block type from schema}"
    classification: "{system_1|system_2}"
    required: {true|false}
    present: {true|false}
    note: "{observation about this block's effectiveness or issues}"

missing_blocks:
  - type: "{block type}"
    required: {true|false}
    purpose: "{what this block contributes}"

block_sequence_valid: {true|false}
required_blocks_present: {true|false}
reader_journey_coherent: {true|false}
system_1_2_balance:
  system_1_count: {count}
  system_2_count: {count}
  correct_order: {true|false}
  note: "{assessment of balance}"

key_violations:
  - severity: "{critical|important|nice-to-fix}"
    element: "{block_sequence|missing_block|optional_use|journey|balance}"
    description: "{specific issue with block reference}"

recommendations:
  - "{priority-ordered list of structural revisions}"
```

## Quality Criteria for the Reviewer

- Block sequence validation must use the exact block sequence from the content type schema in the EOS. Do not substitute a generic or assumed sequence.
- Required block presence is binary — either the block exists or it does not. A block that exists but has the wrong type (e.g. a sensory-body block in the technical-body position) counts as missing the required block type.
- Optional block effectiveness is subjective but must be justified. "The secondary narrative block repeats information already in the sensory body" is specific. "This block feels unnecessary" is not.
- Reader journey logic requires reading the content as a narrative, not just checking boxes. A sequence that follows the schema exactly but feels disjointed still scores low on this criterion.
- System 1 / System 2 balance check must flag mixed blocks. If a single block contains both sensory description and technical specifications, it is a structural violation even if both elements are well-written. HOP keeps these separate by design.
- If the content type is not in the schema list, note this in the output and apply the closest matching type's block sequence.

## Severity Levels

- **Critical:** Missing required block type. Block sequence violates the schema order. System 1 and System 2 blocks are reversed. Must fix before publish.
- **Important:** Optional block used ineffectively. Reader journey has gaps or jarring transitions. System 1/System 2 mixing within blocks. Should fix.
- **Nice-to-fix:** Optional block missing but would strengthen the content. Minor reordering would improve flow. Optional.
