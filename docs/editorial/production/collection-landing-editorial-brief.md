# Editorial Brief: Collection Landing Page

## Strategic Mandate
- **Purpose (one sentence):** Present HOP's five collections as a curated universe of distinct feminine characters, each woven with a different rhythm — inviting the reader to discover which voice belongs to her.
- **Business Goal:** Drive browsing from the Collections landing to individual Collection Detail pages.
- **Brand Goal:** Demonstrate HOP's range and curatorial depth without overwhelming — five voices, tightly curated, each named after a woman.

## Emotional Targeting
- **Primary Emotion:** Wonder (page emotion map: Collections primary = Wonder)
- **Secondary Emotion:** Desire (page emotion map: Collections secondary = Desire)
- **Customer Journey Stage:** Curiosity → Wonder
- **Emotional Arc:** Curiosity (what are these names?) → Fascination (each name is a character) → Wonder (this is a curated universe) → Desire (she wants to explore one)

## Reader
- **Primary Persona:** The Woman Who Chooses Well — educated urban professional, 28–55, spends 30–60 minutes reading collection narratives across multiple sessions, non-linear browsing
- **Reader Intent:** "What collections does HOP offer? Which one is mine?"
- **Trust Requirement:** Provide enough character and mood information per collection for her to self-select which one to explore first

## Content Priorities
1. The intro — what HOP collections are (named after women, not categories)
2. Per-collection cards — name, tagline, and a 2–3 sentence editorial description capturing the character, mood, and occasion
3. A quiet close — a pull-quote and a link back to the brand story

## Call to Action
- **Primary CTA:** Explore [Collection Name] (per-card, gentle invitation to discover)
- **Secondary CTA:** The Padmavati story (link to About page from closing section)

## SEO Mandate
- **Primary Keyword:** House of Padmavati collections
- **SEO Intent:** Navigational (collection discovery)
- **Title:** "Collections — House of Padmavati" (36 chars)
- **Description:** "Five collections, one quiet house. Every Padmavati saree belongs to one of five families — each woven with a different rhythm." (125 chars)

## Content Delivery Format
- **This is NOT a single markdown content unit.** Deliverables are structured editorial copy for three surfaces:
  1. **Page intro copy** — heading + subheading + intro paragraph (consumed by `Collections.tsx` component)
  2. **Per-collection editorial descriptions** — tagline + editorial_story per collection (consumed by Supabase `editorial_story` field)
  3. **Closing section copy** — pull-quote + CTA link

## Constraints
- **Brand constraints:** No self-praise, no urgency, no marketing noise, no forbidden words, no exclamation marks, no rhetorical questions
- **Vocabulary focus:** Quiet, rhythm, weave, voice, character, woman, curated, family, different, same
- **Tone register:** Reflective (intro), Sensory (collection cards), Resolution (closing)
- **Key risk:** Taglines must not use forbidden words. "Fashion Forward" in Spandana tagline conflicts with forbidden word "fashion-forward." Must be rewritten.

## Version
- **Brief Version:** 1.0
- **Status:** Approved
- **Approved By:** Editorial Lead (documented architecture)
- **Approval Date:** 2026-07-25
