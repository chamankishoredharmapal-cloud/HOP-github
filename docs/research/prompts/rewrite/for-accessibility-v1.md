# PROMPT: for-accessibility-v1
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: rewrite
# CONTENT TYPE: all

## Description

Transforms HOP content for improved accessibility while preserving brand voice and sensory richness. Simplifies sentence structure, reduces reading level, adds alt text, ensures semantic structure, and removes information conveyed solely through sensory characteristics. Aimed at WCAG 2.1 AA compliance for readability.

## Context Requirements

- Voice Bible
- Editorial Principles
- HOP Accessibility Guidelines
- Vocabulary System (with synonyms at different reading levels)

## Strategic Principles

- Accessibility is not a reduction. It is a translation. The same warmth, the same precision — just clearer.
- Sensory language must be preserved, but it must be accessible to screen readers and cognitive assistive tools.
- No information should be lost. Every detail must have a text equivalent.
- Simple does not mean simplistic. Grade 7 language can carry deep meaning.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 4/5
- **Sensory Density:** 3/5 (reduced from 4 to improve clarity)
- **Technical Depth:** 2/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Forbidden words:** luxury, premium, exquisite, opulent, lavish, glamorous, beautiful, stunning, gorgeous, amazing, incredible, wonderful, hurry, limited edition, exclusive, sale, discount, shop now, buy now, must-have, elevate, wardrobe essential, statement piece, investment piece, subscribe, sign up

## Input

```
Original content: [paste full content — may include images, headings, structured sections]
```

## Methodology

1. **Simplify sentence structure.** Break complex sentences into shorter ones (target 10-15 words per sentence). Each sentence should convey one idea. Remove subordinate clauses — move them to their own sentence. Replace complex verb tenses with simple past or present.

2. **Reduce reading level by 2 grades (target Grade 7).** Use the Flesch-Kincaid Grade Level as reference. Replace multi-syllable words with simpler alternatives where possible without losing meaning. Examples: "purchased" → "bought", "utilises" → "uses", "constructed" → "made", "approximately" → "about", "demonstrates" → "shows". Preserve craft terminology (loom, warp, weft, zari, pallu) — these are domain-specific and necessary. But define them on first use.

3. **Add alt text to images.** For each image in the content, write alt text that describes: what the image shows (concrete details — colours, shapes, textures, people, actions), the emotional tone (if relevant), any text in the image. Alt text format: "A [description] showing [subject]. [Tone/feeling if relevant]." Example: "A close photograph of a weaver's hands at a wooden loom. The warp threads are deep indigo. Her fingers are moving a bamboo shuttle across the weft." Do not start alt text with "Image of" or "Picture of."

4. **Ensure semantic structure.** Verify proper heading hierarchy (H1 → H2 → H3, no skips). Ensure lists are marked as lists. Ensure paragraphs are true paragraphs (not visual breaks).

5. **Define jargon and technical terms on first use.** When a craft term first appears, add a brief definition in parentheses or a short appositive phrase. Example: "The weft (the thread that runs side to side across the loom) determines the pattern." Do not define the same term twice.

6. **Remove information conveyed solely through sensory characteristics.** If the content says "the deep indigo of the warp," ensure it also explains what that means in practical terms ("the deep indigo of the lengthwise threads"). Sensory descriptions must be accompanied by their functional or material equivalent.

7. **Add text alternatives for visual information.** If the content references a diagram, chart, infographic, or visual metaphor, provide a text alternative that conveys the same information. Do not rely on visual layout (columns, sidebars, colour coding) to communicate meaning.

8. **Preserve brand voice.** After all accessibility transformations, verify that the text still feels warm, reserved, and precise. If the voice was lost in simplification, adjust. Accessibility should not flatten tone.

## Output Format

```
## Accessible Version

[Full rewritten content with proper semantic structure and alt text]

---

## Change Log

### Reading Level
- **Original grade level:** [Flesch-Kincaid grade]
- **New grade level:** [Flesch-Kincaid grade]
- **Target:** Grade 7

### Sentence Structure
- **Original average sentence length:** [X words]
- **New average sentence length:** [X words]
- **Sentences restructured:** [count]

### Vocabulary
- **Complex words replaced:** [list of substitutions]

### Accessibility Additions
- **Alt text added for images:** [number of images + note on descriptions]
- **Technical terms defined:** [list of terms and definitions added]
- **Semantic structure corrections:** [list of heading or structure fixes]
- **Sensory-only information remediated:** [list of changes]

### Voice Preservation Notes
- [Any adjustments made to ensure voice was preserved during simplification]
```

## Quality Criteria

- Flesch-Kincaid Grade Level is 7 or below (verify with a readability tool)
- Average sentence length is 10-15 words
- Every image has alt text (none start with "Image of")
- All technical terms are defined on first use
- No information is conveyed solely through sensory characteristics
- Heading hierarchy is correct and semantic
- No forbidden words
- Brand voice is recognisably HOP after transformation
- The accessible version does not lose any information from the original

## Review Prompts to Run After Transformation

- for-voice-v1.md (critical — verify voice survived simplification)
- simplify-v1.md (secondary check on reading level)
