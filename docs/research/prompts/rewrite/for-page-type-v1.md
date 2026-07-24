# PROMPT: for-page-type-v1
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: rewrite
# CONTENT TYPE: all

## Description

Transforms content from one HOP page type to another while preserving brand voice and adapting structure, depth, and narrative scope. Supports four transformations: Journal Article ↔ Product Story, Journal Article → Email, and Collection Narrative → Homepage Hero.

## Context Requirements

- Voice Bible
- Editorial Principles
- HOP Page Type Definitions (content structure specs for each page type)
- Vocabulary System
- Product Detail Page (PDP) component specs (System 1 / System 2 accordion)

## Strategic Principles

- Each page type serves a different reader need — preserve the intent of the destination type.
- The voice stays constant. What changes is scope, structure, and depth.
- Never transplant content. Always reimagine it for the new format.

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 4/5
- **Sensory Density:** 4/5
- **Technical Depth:** Variable (higher for Product Story, lower for Email)
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Forbidden words:** luxury, premium, exquisite, opulent, lavish, glamorous, beautiful, stunning, gorgeous, amazing, incredible, wonderful, hurry, limited edition, exclusive, sale, discount, shop now, buy now, must-have, elevate, wardrobe essential, statement piece, investment piece, subscribe, sign up

## Input

```
Original content: [paste full content]
Source page type: [Journal Article | Product Story | Collection Narrative]
Target page type: [Product Story | Journal Article | Email | Homepage Hero]
```

## Methodology

### Transformation A: Journal Article → Product Story

1. **Extract sensory language.** Identify all sentences that describe how a saree looks, feels, moves, sounds, or smells. These form the core of the Product Story.

2. **Reduce narrative scope.** Journal articles include maker history, cultural context, travelogue. Product Stories focus on: what the saree is, how it was made, what makes it distinctive. Remove tangential narrative.

3. **Add the System 2 accordion.** Identify technical details from the article (loom type, weave count, dye process, material spec) and reformat them as accordion items. Each item needs: a question as a header (e.g. "What is the weave count?") and a concise answer.

4. **Restructure to PDP format.** Product Stories follow this order: sensory opening (1 paragraph), material and making (2-3 paragraphs), System 2 accordion (3-6 items), care note (1 sentence).

5. **Reduce word count.** Target 40-50% of original article length.

### Transformation B: Product Story → Journal Article

1. **Expand narrative.** Add context around the craft tradition (1-2 paragraphs on the weaving community, region, or history of the technique).

2. **Add a pull-quote.** Identify the single most evocative sentence about the craft or the cloth. Format it as a stand-alone pull-quote mid-article.

3. **Add broader framing.** Connect this saree to something larger — a season, a philosophy, a cultural note. Give the reader a reason this story matters beyond the object.

4. **Reduce technical detail.** Move weave-specific specs from the main text to brief references. Keep the sensory language. Do not include the System 2 accordion — that belongs on the product page.

5. **Target length.** 800-1200 words. Expand by adding context, not by padding.

### Transformation C: Journal Article → Email

1. **Shorten dramatically.** Target 200-300 words for the body. This is 20-25% of the original article.

2. **Add subject line and preheader.** Subject: max 50 characters, should contain a specific detail (a colour, a place, a weaver name) — not a marketing phrase. Preheader: max 100 characters, complements the subject.

3. **Personalise.** Add a greeting that feels like a letter from a specific person, not a brand broadcast. Use "you might remember" or "the last time we wrote" if appropriate.

4. **Keep one narrative thread.** Choose the strongest single angle from the article (the weaver's story, the origin of the dye, the design inspiration). Build the email around that thread only.

5. **Remove all structural elements.** No navigation, no sidebars, no related articles, no multiple CTAs. One gentle link at most.

6. **Warm the tone.** Email should feel +1 warmer than the article version. Use shorter sentences. Address the reader directly but softly.

### Transformation D: Collection Narrative → Homepage Hero

1. **Extract the essence.** What is this collection about in one sentence? Find the philosophical or emotional core.

2. **Create the tagline.** 4-8 words. Should feel like a fragment of conversation, not a slogan. Must pass the "would a woman say this to a friend?" test.

3. **Create the subtitle.** 15-25 words. Expands on the tagline with one concrete detail about the collection.

4. **Reduce to 2 sentences for hero display.** The hero is not the place for the full narrative. Two sentences max. First sentence: the tagline (standalone). Second sentence: the subtitle (standalone). Together they create a quiet opening.

5. **Strip all calls to action.** The hero should not tell the reader what to do. It should simply be present.

## Output Format

### For A, B, C:

```
## Transformed Content

[Full transformed content with appropriate structural markers]

## Transformation Notes

- **Source → Target:** [page type transformation performed]
- **Structural changes made:** [bullet list of structural changes]
- **Word count:** [original] → [new]
- **Tone shift:** [if applicable]
- **Key decisions:** [notable choices in the transformation]
```

### For D:

```
## Tagline
[tagline text]

## Subtitle
[subtitle text]

## Hero Text (combined)
[tagline]
[subtitle]

## Transformation Notes
- **Original collection:** [collection name]
- **Essence extracted:** [the one-sentence essence]
- **Decisions:** [why these words were chosen]
```

## Quality Criteria

- Page-type-specific structure matches HOP content spec for the target type
- No forbidden words present
- Product Stories include System 2 accordion (Transformation A)
- Journal Articles include pull-quote (Transformation B)
- Emails include subject, preheader, greeting, signature, one CTA (Transformation C)
- Homepage Hero is exactly 2 sentences (Transformation D)
- Brand voice is preserved — reader should not be able to tell the content was from another page type

## Review Prompts to Run After Transformation

- for-voice-v1.md (verify voice consistency after restructuring)
- for-accessibility-v1.md
- for-email-v1.md (if Transformation C was used)
