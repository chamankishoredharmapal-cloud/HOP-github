# PROMPT: for-social-v1
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: rewrite
# CONTENT TYPE: web → social

## Description

Transforms HOP web content into social media captions calibrated for each platform's conventions while maintaining brand voice. Handles four platforms (Instagram, Facebook, Twitter/X, Pinterest) with platform-specific constraints. No exclamation marks, no urgency, no cliché social language.

## Context Requirements

- Voice Bible
- Editorial Principles
- HOP Social Media Guidelines
- Vocabulary System
- Platform-specific style guides (per-platform character limits, formatting rules)

## Strategic Principles

- HOP does not shout on social media. The voice should be the same quiet presence regardless of platform.
- Social is an invitation to slow down, not a demand for attention.
- Hashtags are wayfinding, not decoration.
- The cloth is the content. The caption is just the introduction.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 4/5
- **Sensory Density:** 3/5
- **Technical Depth:** 2/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Forbidden words:** luxury, premium, exquisite, opulent, lavish, glamorous, beautiful, stunning, gorgeous, amazing, incredible, wonderful, hurry, limited edition, exclusive, sale, discount, shop now, buy now, must-have, elevate, wardrobe essential, statement piece, investment piece, subscribe, sign up

## Input

```
Original content: [paste full web content]
Platform: [Instagram | Facebook | Twitter/X | Pinterest]
Content type being promoted: [product | journal article | collection | event]
```

## Methodology

### Platform-Specific Rules

**Instagram:**
- Caption: 150-200 characters. Not a summary — a quiet invitation. One sensory detail. No call to action. No "link in bio."
- Hashtags: 10-15 hashtags placed in a comment (not in the caption). Mix of: 2-3 craft terms (handloom, handwoven, handweave), 2-3 cultural tags (Indiantextiles, traditionalloom, weaversofindia), 2-3 mood tags (quietluxury is allowed only here — lowercase, as a community tag), 3-5 content-specific tags. Do not use generic fashion tags.
- Alt text suggestion: Describe the saree as if to someone who cannot see it — colours, pattern, border detail, fabric weight, mood.

**Facebook:**
- Caption: 40-80 characters. Shorter than Instagram. One line, one feeling, one image. Can include one link to the relevant page.
- No hashtags (or max 1-2 if using Facebook for discovery).
- More conversational tone than Instagram. Can reference the reader directly ("If you have been thinking about handloom...").

**Twitter/X:**
- Caption: 100-200 characters. Space for one thought. Should be able to stand alone without an image.
- Hashtags: 0-2, only if they carry meaning. Use #Handloom or #WeaversOfIndia sparingly. No hashtags that are just category labels (#Saree #Fashion).
- Can include a link (shortened).

**Pinterest:**
- Pin description: 100-200 characters. Descriptive, searchable language. Include key terms a person would search for: colour, weave type, region, occasion.
- Board assignment: Suggest which HOP board this belongs on (e.g. "Pochampally Silks", "Indigo Stories", "Everyday Weaves").
- No promotional language. Pinners are looking for inspiration and information, not sales.

### All Platforms

1. **Extract one core image or idea.** Social cannot carry a full narrative. Find the single most evocative element — the border detail, the weaver's gesture, the colour story.

2. **Remove all web content structure.** No headings, no paragraphs, no accordion references. Social content is a single block of text.

3. **Remove all exclamation marks.** Yes, even on social. HOP does not shout. If the content feels flat without exclamation marks, the words need to change, not the punctuation.

4. **Remove urgency.** No "just arrived," "new drop," "today only," "while they last," "back in stock."

5. **Remove social clichés.** No "link in bio," "save this for later," "double tap if," "tag someone who," "share this with."

6. **Remove imperatives.** No "shop the look," "discover the collection," "see more." Replace with: "The full story is on the journal." "The collection opens today."

## Output Format

```
## Platform: [platform name]

### Caption
[caption text]

### Hashtags (Instagram only)
[hashtags — 10-15, comma-separated]

### Board (Pinterest only)
[board name]

### Alt Text Suggestion
[descriptive alt text for the image]

---

## Change Log

- **Platform adaptation:** [key changes made for platform]
- **Word count:** [original] → [caption length]
- **Elements removed:** [list of removed content and clichés]
- **Key decisions:** [notable choices — e.g. "Chose to focus on border detail because it is the most distinctive element of this saree."]
```

## Quality Criteria

- Caption length is within platform-specified range
- Zero forbidden words
- No exclamation marks
- No imperatives
- No "link in bio" or equivalent
- No urgency signals
- Hashtag count is 10-15 (Instagram) or 0-2 (Twitter/X)
- Alt text is present and descriptive
- Voice is recognisably HOP despite platform constraints
- Pinterest description includes searchable craft terms
- Twitter/X caption can stand alone without image

## Review Prompts to Run After Transformation

- for-voice-v1.md (verify voice survived platform constraints)
- for-accessibility-v1.md (verify alt text quality)
