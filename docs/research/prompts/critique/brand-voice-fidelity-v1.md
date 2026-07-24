# PROMPT: Brand Voice Fidelity
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: critique
# CONTENT TYPE: all

## Description

Evaluates how closely content matches the HOP brand voice. Checks whether each sentence sounds like it comes from a trusted friend who knows cloth, whether any sentence could belong to a different brand, whether sentence architecture follows HOP rules (12–18 word average, varied rhythm, no questions, no exclamations), whether vocabulary stays within approved words, and whether the content feels like it was written for one woman rather than a million. Provides before/after examples for violations.

## Input

Full content unit to critique.

## Methodology

1. **Trusted friend test:** Read each sentence and ask: would this sound right coming from a trusted friend who knows cloth? A sentence passes if it feels like a knowledgeable, warm human speaking to one other human. A sentence fails if it sounds like a brand, a textbook, a sales pitch, or a generic content farm. Flag every failing sentence with the reason.
2. **Cross-brand contamination:** Read the content looking for sentences that could appear on any other fashion or ecommerce site. HOP sentences are distinctive — they name specific things (weaves, places, people), use sensory language, and avoid generic praise. Flag any sentence that is interchangeable.
3. **Sentence architecture audit:** Compute the word count for every sentence. HOP rules: average 12–18 words, maximum 25. Rhythm must vary — no consecutive same-length sentences. No questions. No exclamation marks. No imperatives.
   - Flag sentences exceeding 25 words
   - Flag consecutive same-length sentences (within ±3 words)
   - Flag any question mark or exclamation mark
   - Flag any imperative verb used as a command
4. **Vocabulary audit:** Check every significant word against the HOP approved vocabulary. Flag forbidden words. Flag words that feel too corporate, academic, or generic for the HOP voice.
5. **Audience scale test:** Read the content as a whole. Does it feel like it is speaking to one woman (specific, intimate, personal) or to a million (generic, broadcast, templated)? HOP content should always feel like a letter to one person. Flag passages that feel broadcast.

## Output Format

```yaml
overall_score: "{score}/10"

criteria:
  trusted_friend_test:
    score: "{score}/10"
    violations:
      - sentence: "{quoted sentence}"
        reason: "{why it fails the trusted friend test}"
        before: "{original}"
        after: "{suggested rewrite in HOP voice}"
  cross_brand_contamination:
    score: "{score}/10"
    violations:
      - sentence: "{quoted sentence}"
        source_brand_type: "{generic luxury|mass-market ecommerce|generic fashion|other}"
        before: "{original}"
        after: "{suggested rewrite in HOP voice}"
  sentence_architecture:
    score: "{score}/10"
    stats:
      average_word_count: "{value}"
      max_word_count: "{value}"
      question_count: "{count}"
      exclamation_count: "{count}"
      imperative_count: "{count}"
    violations:
      - type: "{too_long|same_length|question|exclamation|imperative}"
        sentence: "{quoted sentence}"
        details: "{specific issue with metrics}"
  vocabulary:
    score: "{score}/10"
    forbidden_words_found:
      - word: "{forbidden word}"
        sentence: "{quoted sentence}"
    out_of_voice_words:
      - word: "{word}"
        reason: "{why it doesn't fit HOP voice}"
        alternative: "{suggested HOP word}"
  audience_scale:
    score: "{score}/10"
    passages:
      - text: "{quoted passage}"
        issue: "{why it feels broadcast rather than personal}"
        recommendation: "{how to make it feel like one woman}"

key_violations:
  - severity: "{critical|important|nice-to-fix}"
    dimension: "{trusted_friend|cross_brand|architecture|vocabulary|audience}"
    description: "{specific issue}"

recommendations:
  - "{priority-ordered list of revisions with before/after examples for top violations}"
```

## Quality Criteria for the Reviewer

- The trusted friend test is the most important criterion. If a sentence fails this, it fails HOP voice regardless of other scores.
- Cross-brand contamination requires naming the brand type the sentence sounds like. "This sentence could be on any D2C clothing site" is specific. "This sentence sounds off" is not.
- Sentence architecture is mechanical — compute exact word counts. Do not estimate.
- Vocabulary audit must check every content word, not just the first pass. Common hidden violations: "truly", "simply", "just", "very" — these weaken HOP voice even though they are not on the forbidden list.
- Audience scale: check for constructions that signal broadcast voice — "our customers", "every woman", "any saree lover", generalised claims without specific grounding.
- Every violation must include a before/after or at minimum a rewrite recommendation. Critique without a suggested fix is incomplete.
- Score holistically: a piece that scores low on one dimension but high on others might still be publishable after revision. A piece that fails the trusted friend test on multiple sentences needs a full rewrite.

## Severity Levels

- **Critical:** Any sentence fails the trusted friend test. Any forbidden word present. Any question or exclamation mark. Any imperative. Must fix before publish.
- **Important:** Cross-brand contamination detected. Sentence architecture rules violated (average outside 12–18, max over 25, same-length rhythm). Vocabulary beyond forbidden words feels off-voice. Should fix.
- **Nice-to-fix:** Audience scale sounds slightly broadcast. Minor vocabulary choices could be more HOP. Optional but recommended.
