# PROMPT: for-voice-v1
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: rewrite
# CONTENT TYPE: all

## Description

Transforms any text into the House of Padmavati brand voice — warm, reserved, precise. Takes original text plus source and target context, then rewrites it following HOP's editorial principles. Includes a change log explaining key transformations.

## Context Requirements

- Voice Bible (brand voice guidelines, tone descriptors)
- Editorial Principles document
- Vocabulary System (forbidden words, preferred vocabulary)
- Coastal Blossom Philosophy guide
- Sentence Rhythm Guide

## Strategic Principles

- Make it feel like one woman speaking to another woman she respects.
- Replace generic fashion language with the language of craft and material.
- Let the cloth be the protagonist, not the brand.
- Restraint is the highest form of respect for the reader.

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 4/5
- **Sensory Density:** 4/5
- **Technical Depth:** 3/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Forbidden words:** luxury, premium, exquisite, opulent, lavish, glamorous, beautiful, stunning, gorgeous, amazing, incredible, wonderful, hurry, limited edition, exclusive, sale, discount, shop now, buy now, must-have, elevate, wardrobe essential, statement piece, investment piece, subscribe, sign up

## Input

```
Original text: [paste full text]
Source context: [what type of content was this originally? e.g. product description, journal article, email]
Target context: [what type of content is it becoming? e.g. homepage hero, collection narrative, product story]
```

## Methodology

1. **Remove forbidden words.** Scan the entire text for the forbidden list. Delete every instance. Do not replace with synonyms — rewrite the sentence to not need them.

2. **Replace generic language with specific language.** Change "beautiful drape" to "the pallu falls in deep, even folds." Change "high-quality fabric" to "a 60-count warp, 80-count weft." Use the Vocabulary System's preferred words: quiet, considered, gentle, hand, loom, weave, thread, zari, pallu, drape, weight, fold, border, body, still, soft, warm, deep, held, carried, belongs, remembers, slow, patient.

3. **Adjust sentence length.** Target 12-18 word average. Maximum 25 words. Break long sentences. Combine very short sentences where rhythm allows.

4. **Remove imperatives, replace with suggestions or invitations.** Change "Shop the collection" to "The collection is here to explore." Change "Buy now" to "One might begin with the Pochampally." Change "Subscribe for updates" to "Letters arrive when there is something to share."

5. **Add sensory language where appropriate.** Include at least one sensory detail (weight, texture, sound of the loom, smell of natural dye, feel on skin) per paragraph where the content describes a product or craft.

6. **Remove urgency signals.** Delete: hurry, limited, exclusive, only a few left, time is running out, don't miss, last chance. Replace with honest availability language.

7. **Ensure variety in sentence rhythm.** Mix short and medium sentences. Use an occasional longer sentence (18-22 words) followed by a short one (6-10 words). No two consecutive sentences should have the same structure.

8. **Check warmth level.** Read aloud. If it sounds like a brand, it is too cold. If it sounds rushed or noisy, it is too warm. The warmth should feel like a woman who knows cloth well, speaking calmly to a friend who has asked her about it.

## Output Format

```
## Rewritten Text

[Full rewritten text]

## Change Log

- **Tone adjusted:** [description of tone shift — e.g. "Removed 7 urgency signals. Replaced imperatives with invitations. Warmth increased from 2/5 to 4/5."]
- **Vocabulary changes:** [key vocabulary changes — e.g. "Replaced 'stunning saree' with 'a saree whose border holds its pattern quietly.' Removed 11 forbidden words."]
- **Structural changes:** [sentence-level changes — e.g. "Average sentence length reduced from 21 to 14 words. 3 paragraphs restructured."]
- **Specific substitutions:**
  - "[original phrase]" → "[rewritten phrase]"
  - "[original phrase]" → "[rewritten phrase]"
- **Notes:** [any additional context about decisions made]
```

## Quality Criteria

- Zero instances of forbidden words remaining in the output
- Average sentence length is 12-18 words (verify by counting)
- No imperatives present (no commands, no "shop" "buy" "subscribe" etc.)
- At least one sensory detail per paragraph when describing a product
- No exclamation marks
- No questions directed at the reader
- Text reads naturally aloud — warmth should be evident but not forced
- Change log accounts for every significant transformation

## Review Prompts to Run After Transformation

- for-accessibility-v1.md
- for-email-v1.md (if target is email)
- for-social-v1.md (if target is social)
