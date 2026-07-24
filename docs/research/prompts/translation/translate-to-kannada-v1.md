# PROMPT: translate-to-kannada-v1
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: translation
# CONTENT TYPE: all

## Description

Translates English HOP content to Kannada while preserving the brand voice — warm, reserved, precise. Kannada is the language of the weaving communities of Karnataka and the language in which craft knowledge has been passed down for generations. The translation must feel as natural in Kannada as the original does in English, with particular attention to craft terminology, sentence structure, and cultural resonance.

## Context Requirements

- Voice Bible (English)
- Vocabulary System (with Kannada equivalents for craft terms)
- HOP Translation Guidelines
- List of culturally significant Kannada weaving terms (ನೇಯ್ಗೆ, ಸೀರೆ, ಕೈಮಗ್ಗ, etc.)
- Kannada script and diacritic reference

## Strategic Principles

- The translation should feel like it was originally written in Kannada, not like an English text that was translated. Kannada has a different rhythm — longer compounds, postpositions instead of prepositions, subject-object-verb order. Honour that.
- Craft terms belong in Kannada. Do not transliterate English words when a Kannada word exists. ನೇಯ್ಗೆ not "weave." ಸೀರೆ not "saree." ಕೈಮಗ್ಗ not "handloom."
- The warmth of HOP voice must survive translation. Kannada has formal and informal registers — use a warm informal register (ನೀವು with respectful verb forms) that mirrors the English warmth.
- Sensory language must be translated with equal density. If the English has three sensory details per paragraph, the Kannada must too.

## Brand Constraints

- **Formality:** 3/5 (Kannada has inherent formality through verb endings — use respectful ನೀವು forms, not ಅದು/ಇದು distance)
- **Warmth:** 4/5
- **Sensory Density:** 4/5
- **Technical Depth:** 3/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Forbidden words (Kannada equivalents):** ಐಷಾರಾಮಿ (luxury), ಪ್ರೀಮಿಯಂ (premium), ಅತ್ಯದ್ಭುತ (exquisite/stunning/gorgous/beautiful etc.), ಅದ್ಭುತ (amazing/incredible/wonderful), ಆತುರ (hurry), ಸೀಮಿತ (limited edition/exclusive — do not use), ಮಾರಾಟ (sale), ರಿಯಾಯಿತಿ (discount), ಈಗ ಖರೀದಿಸಿ (buy now), ಚಂದಾದಾರರಾಗಿ (subscribe), ಸೈನ್ ಅಪ್ (sign up)

## Input

```
Original content (English): [paste full English text]
Content type: [Journal Article | Product Story | Collection Narrative | Email | Social]
Target register: [warm informal — default]
```

## Methodology

1. **Translate for meaning, not words.** Read the entire English content first. Understand the emotional arc, the sensory core, the factual details. Then write the Kannada version from that understanding — not sentence by sentence, but as a whole.

2. **Set the register.** Use ನೀವು (respectful second person) throughout. Use the ವುತ್ತಾರೆ / ತ್ತಾರೆ / ದರು verb endings for respect. Do not use ನೀನು (intimate) or ಅವನು/ಅವಳು (distant third person) for the reader. The reader is addressed as a respected individual — mirroring the English "warm, reserved" tone.

3. **Translate craft terms using authentic Kannada vocabulary:**
   - Weave / weaving → ನೇಯ್ಗೆ
   - Saree → ಸೀರೆ
   - Handloom → ಕೈಮಗ್ಗ
   - Loom → ಮಗ್ಗ
   - Warp → ಹಾಸು
   - Weft → ಊಟ
   - Thread / yarn → ದಾರ / ನೂಲು
   - Zari → ಜರಿ
   - Pallu → ಪಲ್ಲು / ಸೆರಗು
   - Border → ಅಂಚು / ದಾರ
   - Dye / colour → ಬಣ್ಣ / ವರ್ಣ
   - Indigo → ನೀಲಿ (or ಕರಿಮುಡಿ for the plant)
   - Silk → ರೇಷ್ಮೆ
   - Cotton → ಹತ್ತಿ
   - Weaver → ನೇಕಾರ (male) / ನೇಕಾರ್ತಿ (female)
   - Weaving community → ನೇಕಾರ ಸಮುದಾಯ
   - Traditional → ಸಾಂಪ್ರದಾಯಿಕ
   - Handwoven → ಕೈಯಿಂದ ನೇಯ್ದ

4. **Adapt sentence structure.** Kannada uses subject-object-verb order. Sentences naturally become more compact due to agglutination (adding suffixes to root words). Do not force English sentence structure onto Kannada. Long English sentences may become multiple Kannada sentences. Short English fragments may merge into a single Kannada compound sentence.

5. **Preserve sensory density.** For every sensory detail in the English, find an equally evocative Kannada equivalent. Kannada has rich onomatopoeic and sensory vocabulary for cloth — use it. Examples: the sound of the loom (ಛಕ್ ಛಕ್), the feel of fresh indigo (ತಂಪಾದ ನೀಲಿ), the weight of a silk saree (ರೇಷ್ಮೆ ಸೀರೆಯ ಭಾರ).

6. **Avoid direct translations of forbidden words.** Do not use Kannada words that are direct translations of the English forbidden list. Instead, rewrite the sentence to not need them — just as you would in English.

7. **Define English loanwords on first use.** If you must keep an English word (e.g. "pochampally," "jamdani," a weaver's name), introduce it in English script on first appearance, with Kannada transliteration in parentheses. Subsequent uses can be in Kannada script only.

8. **Read aloud.** Kannada is a spoken language in its literary form — the translation must sound natural when read. If a phrase feels awkward when spoken, restructure it.

## Output Format

```
## Kannada Translation

[Full Kannada translation]

---

## Translation Notes

### Key Decisions
- **Register chosen:** [warm informal / respectful — note any adjustments]
- **Craft terminology:** [decisions made — e.g. "Used ನೇಯ್ಗೆ throughout; chose ಕೈಮಗ್ಗ over ಯಂತ್ರಮಗ್ಗ to emphasise hand-weaving"]
- **Sentence structure adaptations:** [notable structural changes — e.g. "Split 4 long English sentences into 8 shorter Kannada sentences for natural flow."]
- **Sensory language preserved:** [how sensory density was maintained — e.g. "Added ಛಕ್ ಛಕ್ onomatopoeia for loom sound that was implied but not explicit in English."]

### Culturally Significant Terms
| English | Kannada | Note |
|---------|---------|------|
| [term] | [term] | [why this choice] |
| [term] | [term] | [why this choice] |

### Challenges
- [any challenges encountered in translation — e.g. "Regional variation in the term for pallu — chose ಸೆರಗು as it is more widely used in Karnataka handloom communities."]

### Verification
- [ ] Forbidden words checked — none present
- [ ] Warmth level matches English original
- [ ] Craft terms use authentic Kannada equivalents
- [ ] Sensory density is equal to or greater than English
- [ ] Read aloud — sounds natural in Kannada
```

## Quality Criteria

- Translation reads naturally in Kannada (verified by reading aloud)
- All craft terms use authentic Kannada vocabulary where available
- No direct translations of forbidden words
- Warmth level matches the English original (respectful, warm, reserved)
- Sensory density is equal to or greater than the English version
- Kannada script is used correctly (no Devanagari or other script mixing)
- Sentence structure follows Kannada grammar (SOV, postpositions, agglutination)
- The translation does not feel like English words in Kannada syntax

## Review Prompts to Run After Transformation

- for-voice-v1.md (verify voice preservation — may need a Kannada speaker for accuracy)
- simplify-v1.md (verify reading level of the Kannada version)
