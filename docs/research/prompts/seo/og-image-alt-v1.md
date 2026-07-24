# PROMPT: OG Image Alt Text Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: seo
# CONTENT TYPE: all

## Description

Generates alt text for the Open Graph (OG) image of a content unit. The alt text must be 5-15 words, describe what the image contains (not what it means), and include relevant content keywords naturally. Format: describe the visual scene factually.

## Context Requirements

**Editorial System:**
- docs/editorial/04-vocabulary-system/forbidden-words.md

## Brand Constraints

- **Sensory Density:** 2/5
- **Forbidden words:** beautiful, stunning, amazing, gorgeous, lovely, luxury, premium
- **Length:** 5-15 words

## Input

- Content type
- Image description (what the image actually shows — the photographer's description if available)
- Content context (what the content is about, for keyword relevance)

## Output Format

A single string — the complete alt text. No alternatives, no explanation.

```
{Alt text. Does not start with "Image of" or "Picture of."}
```

## Quality Criteria

- 5-15 words
- Describes what is visible in the image, not what it means or how it feels
- Does not start with "Image of," "Picture of," or "Photo of"
- Includes relevant keyword naturally (not stuffed)
- No forbidden words
- No emotional interpretation ("a serene scene" → "a saree draped by a window, morning light on the zari")

## Examples

| Image Description | Content Context | Output |
|---|---|---|
| A saree draped by a window, morning light catching the zari thread | Journal article about morning light | "A saree draped by a window, morning light catching the zari on the border." |
| A weaver at a pit loom, hands adjusting the warp | Weaver portrait of Gangamma | "A weaver adjusting the warp threads on a pit loom." |
| Close-up of a hand-spun zari thread next to a machine-made thread | Craft note about zari | "Hand-spun zari thread beside a machine-made imitation — the hand-spun is uneven and catches light differently." |

## Review Prompts to Run After Generation

- `accessibility-check-v1` — validates alt text quality
