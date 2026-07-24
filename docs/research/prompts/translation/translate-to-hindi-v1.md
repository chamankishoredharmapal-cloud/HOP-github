# PROMPT: translate-to-hindi-v1
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: translation
# CONTENT TYPE: all

## Description

Translates English HOP content to Hindi while preserving the brand voice — warm, reserved, precise. Hindi is one of the most widely spoken languages of the Indian handloom belt, and the language in which many weavers, traders, and textile lovers communicate about craft. The translation must feel natural in Hindi, with attention to craft terminology, sentence structure, and cultural resonance.

## Context Requirements

- Voice Bible (English)
- Vocabulary System (with Hindi equivalents for craft terms)
- HOP Translation Guidelines
- List of standard Hindi weaving terms (बुनाई, साड़ी, करघा, ज़री, etc.)
- Hindi script (Devanagari) and transliteration reference

## Strategic Principles

- The translation should feel like it was originally written in Hindi, not like an English text that was translated. Hindi sentence structure (SOV), postpositions, and gendered nouns must feel natural.
- Craft terms belong in Hindi. Use the words that weavers themselves use: बुनाई not "weave." साड़ी not "saree." करघा not "loom."
- The warmth of HOP voice must survive translation. Hindi has formal (आप) and informal (तुम) registers — use respectful आप forms while keeping warmth.
- Sensory language must be translated with equal density. Hindi is rich in textile and sensory vocabulary — use it.

## Brand Constraints

- **Formality:** 3/5 (Hindi has inherent formality through pronoun and verb choices — use respectful आप forms)
- **Warmth:** 4/5
- **Sensory Density:** 4/5
- **Technical Depth:** 3/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Forbidden words (Hindi equivalents):** विलासिता (luxury), प्रीमियम (premium), अति सुंदर (exquisite/stunning/gorgeous/beautiful etc.), अद्भुत (amazing/incredible/wonderful), जल्दी करें (hurry), सीमित संस्करण (limited edition/exclusive — do not use), बिक्री (sale), छूट (discount), अभी खरीदें (buy now), सदस्यता लें (subscribe), साइन अप (sign up)

## Input

```
Original content (English): [paste full English text]
Content type: [Journal Article | Product Story | Collection Narrative | Email | Social]
Target register: [warm formal — default: आप]
```

## Methodology

1. **Translate for meaning, not words.** Read the entire English content first. Understand the emotional arc, the sensory core, the factual details. Then write the Hindi version from that understanding — not sentence by sentence, but as a whole.

2. **Set the register.** Use आप (respectful second person) throughout. Use the ते/ती हैं, एंगे/एंगी verb forms for respect. Do not use तू (intimate) or तुम (casual) for the reader. The reader is addressed as a respected individual — mirroring the English "warm, reserved" tone. However, within the आप register, use warm verb forms (चाहेंगी, देखेंगी) rather than cold formal ones (चाहती हैं, देखती हैं).

3. **Translate craft terms using authentic Hindi vocabulary:**
   - Weave / weaving → बुनाई
   - Saree → साड़ी
   - Handloom → हथकरघा
   - Loom → करघा
   - Warp → ताना
   - Weft → बाना
   - Thread / yarn → धागा / सूत
   - Zari → ज़री
   - Pallu → पल्लू / आंचल
   - Border → किनारी / बॉर्डर (किनारी preferred)
   - Dye / colour → रंग
   - Indigo → नील
   - Silk → रेशम
   - Cotton → सूती / कपास
   - Weaver → बुनकर
   - Weaving community → बुनकर समुदाय
   - Handwoven → हाथ से बुना / हथकरघा बुनाई
   - Weave pattern → बुनावट
   - Traditional → पारंपरिक
   - Design → नक्शा / डिज़ाइन (नक्शा preferred for traditional patterns)
   - Motif → बूटी / बूटा

4. **Adapt sentence structure.** Hindi uses subject-object-verb order. Nouns have gender that must agree with verbs and adjectives. Sentences tend to use postpositions (ने, को, से, में, का/की/के) rather than prepositions. Long English sentences may become multiple Hindi sentences.

5. **Preserve sensory density.** For every sensory detail in the English, find an equally evocative Hindi equivalent. Hindi has rich textile vocabulary: रेशम की चमक (the sheen of silk), हाथ का एहसास (the feel of hand), साड़ी का भार (the weight of the saree), रंगों की गहराई (the depth of colours), करघे की आवाज़ (the sound of the loom).

6. **Use Perso-Arabic and Sanskrit-derived words thoughtfully.** Hindi vocabulary draws from both Sanskrit and Perso-Arabic sources. For HOP voice, prefer the word that feels warmer and more grounded in craft. Often Sanskrit-derived words feel more precise for craft terms (बुनाई, करघा, ताना-बाना). Perso-Arabic words can feel more literary (एहसास for feeling, रंगत for colour tone). Choose by context, not by rule.

7. **Handle the English-Urdu-Hindi spectrum carefully.** Weavers in different regions use different words for the same thing. For HOP's Hindi translations, prefer words from the बुनकर lexicon (the vocabulary weavers actually use) over literary or Sanskritised Hindi. Example: use ज़री (the weaver's word) not स्वर्ण धागा (literal "gold thread").

8. **Avoid direct translations of forbidden words.** Do not use Hindi words that are direct translations of the English forbidden list. Instead, rewrite the sentence.

9. **Read aloud.** Hindi translation must sound natural when read. The Devanagari script should be clear and correctly formed. Watch for common Devanagari issues: correct use of nuqta (ज़, फ़, क़), correct matra placement, proper conjunct consonants.

## Output Format

```
## Hindi Translation

[Full Hindi translation in Devanagari script]

---

## Translation Notes

### Key Decisions
- **Register chosen:** [आप / warm formal — note any adjustments]
- **Craft terminology:** [decisions made — e.g. "Used बुनाई throughout; chose हथकरघा over मशीन करघा to emphasise hand-weaving."]
- **Sentence structure adaptations:** [notable structural changes — e.g. "Split 3 long English sentences into 6 shorter Hindi sentences for natural flow."]
- **Sensory language preserved:** [how sensory density was maintained — e.g. "Added करघे की आवाज़ detail that was implied but not explicit in English."]

### Culturally Significant Terms
| English | Hindi | Note |
|---------|-------|------|
| [term] | [term] | [why this choice] |
| [term] | [term] | [why this choice] |

### Vocabulary Source Notes
- [e.g. "Chose ज़री (Perso-Arabic, weaver's term) over स्वर्ण धागा (Sanskritised, literary)."]

### Challenges
- [any challenges encountered — e.g. "Regional variation: बूटी vs बूटा for small motifs — chose बूटी as it is more widely understood."]

### Verification
- [ ] Forbidden words checked — none present
- [ ] Warmth level matches English original (आप register with warmth)
- [ ] Craft terms use authentic Hindi equivalents from weaver lexicon
- [ ] Sensory density is equal to or greater than English
- [ ] Read aloud — sounds natural in Hindi
- [ ] Devanagari script is correct (nuqta, matras, conjuncts)
```

## Quality Criteria

- Translation reads naturally in Hindi (verified by reading aloud)
- All craft terms use authentic Hindi vocabulary from the weaver lexicon
- No direct translations of forbidden words
- Warmth level matches the English original (आप register with warmth)
- Sensory density is equal to or greater than the English version
- Devanagari script is correct (proper use of nuqta, matras, conjuncts)
- Sentence structure follows Hindi grammar (SOV, postpositions, gendered agreement)
- Vocabulary choices reflect actual weaver usage, not overly Sanskritised Hindi
- The translation does not feel like English words in Hindi syntax

## Review Prompts to Run After Transformation

- for-voice-v1.md (verify voice preservation — may need a Hindi speaker for accuracy)
- simplify-v1.md (verify reading level of the Hindi version)
