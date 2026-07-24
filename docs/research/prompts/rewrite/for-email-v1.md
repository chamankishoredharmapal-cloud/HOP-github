# PROMPT: for-email-v1
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: rewrite
# CONTENT TYPE: web → email

## Description

Transforms HOP web content (journal articles, product stories, collection narratives) into email format while preserving brand voice. Restructures content into subject, preheader, warmer body, and single CTA. Adds personal context and intimacy suitable for a direct-to-reader format.

## Context Requirements

- Voice Bible
- Editorial Principles
- Email Design System (format specs, allowed components)
- Vocabulary System
- Subscriber relationship guidelines (tone for existing vs new subscribers)

## Strategic Principles

- An email is a letter, not a broadcast. Write like one woman writing to another.
- The reader has invited you into their inbox. Honour that intimacy.
- One message per email. One thread per message.
- Warmth should be +1 over the web version — closer, softer, more personal.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 5/5
- **Sensory Density:** 3/5
- **Technical Depth:** 2/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Forbidden words:** luxury, premium, exquisite, opulent, lavish, glamorous, beautiful, stunning, gorgeous, amazing, incredible, wonderful, hurry, limited edition, exclusive, sale, discount, shop now, buy now, must-have, elevate, wardrobe essential, statement piece, investment piece, subscribe, sign up

## Input

```
Original content: [paste full web content]
Content type: [Journal Article | Product Story | Collection Narrative]
Target email type: [product launch | journal update | collection announcement | personal note]
Subscriber context: [existing subscriber | new subscriber | restressed order | abandoned browse]
```

## Methodology

1. **Write the subject line.** Max 50 characters. Use a specific detail — a weaver name, a colour, a place name, a fragment of sensory language. Avoid marketing language: no "Introducing", "New Arrival", "Don't Miss". Subject examples: "The Kanjeevaram that takes eighteen months" | "Pochampally in indigo" | "A letter from the loom".

2. **Write the preheader.** Max 100 characters. Complements the subject by adding one more detail or a quiet invitation. Should make sense after the subject but not repeat it.

3. **Write the greeting.** Use "Dear [name]" or "Hello [name]" if known. If unknown, use "Dear friend" — not "Dear customer" or "Dear subscriber" or "Hi there". For returning readers, acknowledge continuity: "It has been a while since we last wrote."

4. **Condense the body to 3-4 paragraphs.** Remove navigation, sidebars, related content, multiple links. Keep only the strongest narrative thread. Follow this structure:
   - Paragraph 1: A personal opening that connects the reader to the content ("You might remember the Pochampally we wrote about last season.")
   - Paragraph 2: The core content — one story, one angle, one idea.
   - Paragraph 3: A gentle bridge to the reader's own experience ("Perhaps you know the weight of a good handloom.")
   - Paragraph 4 (optional): A closing thought. No hard sell.

5. **Add a single CTA.** One gentle link. Phrased as a suggestion, not a command. Examples: "The full story is here." | "The collection is open to explore." | "She writes more about this on the journal." Not: "Shop Now" or "Read More" or "Click Here".

6. **Add signature.** Close with a human signature. Use the name of a real person at HOP (or just "With warmth"). No title, no brand name after the signature. The email is from the brand — the signature is from a person within it.

7. **Warm the tone.** Compared to web version: shorter sentences, fewer technical terms, more direct address (use "you" sparingly but meaningfully), references to shared experience.

8. **Remove all remnants of web structure.** No "Read more on our website." No "Follow us on Instagram." No "You are receiving this because." The email should feel self-contained and personal.

## Output Format

```
## Subject
[subject line — max 50 chars]

## Preheader
[preheader — max 100 chars]

## Email Body

Dear [name],

[Paragraph 1 — personal opening]

[Paragraph 2 — core content]

[Paragraph 3 — bridge to reader]

[Paragraph 4 — closing thought]

[CTA line]

With warmth,
[name / sign-off]

---

## Change Log

- **Subject line:** [original web title] → [subject]
- **Word count:** [original word count] → [new word count]
- **Paragraphs restructured:** [from X paragraphs to 4]
- **Tone shift:** [description of warming]
- **Content removed:** [list of removed elements]
- **Key decisions:** [notable choices in condensation]
```

## Quality Criteria

- Subject line is 50 characters or fewer
- Preheader is 100 characters or fewer
- Body is exactly 3-4 paragraphs
- Contains exactly one CTA (one link)
- No navigation, sidebar, related content, or multiple links
- Zero forbidden words
- No imperatives
- No exclamation marks
- Tone feels personal, not broadcast
- Signature is human, not a brand logo

## Review Prompts to Run After Transformation

- for-voice-v1.md (verify voice is +1 warmer than web)
- simplify-v1.md (email should be concise — check reading level)
