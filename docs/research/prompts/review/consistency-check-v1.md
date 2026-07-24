# PROMPT: Consistency Check
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: review
# CONTENT TYPE: all

## Description

Checks content against the target tone matrix for the given page type. Scores formality, warmth, sensory density, technical depth, urgency, imperative force, and reading level on 1–5 scales. Detects register violations, warmth inconsistencies, missing sensory language, technical depth mismatches, urgency signals, imperatives, and reading level gaps.

## Input

The content to review (full content unit, not excerpts) plus the target tone matrix row for the page type.

## Methodology

1. Parse the target tone matrix row from the input (page type → formality, warmth, sensory, technical, urgency).
2. Scan each sentence and classify it against each tone dimension:
   - **Formality:** Count contractions, personal pronouns, sentence-initial conjunctions. Higher count = lower formality.
   - **Warmth:** Count second-person address, inclusive we, sensory sharing, personal anecdote frames. Score proportionally.
   - **Sensory Density:** Count sensory words across five categories (sight, touch, sound, smell, movement). Divide by total words, normalise to per-100-words.
   - **Technical Depth:** Count domain-specific terms (weave names, fibre types, tool names, process verbs). Score proportionally.
   - **Urgency:** Count time-pressure language, scarcity signals, imperatives with immediate action. Score inversely (should be 0–1).
   - **Imperative Force:** Count imperative verbs (commands). Score inversely.
   - **Reading Level:** Apply the Flesch-Kincaid Grade Level formula. Compare to target.
3. Flag each violation with its source sentence and the dimension it violates.

## Output Format

```yaml
dimension_scores:
  formality: {score}/5
  warmth: {score}/5
  sensory_density: {score}/5
  technical_depth: {score}/5
  urgency: {score}/5
  imperative_force: {score}/5
  reading_level: "Grade {value}"

violations:
  - dimension: {dimension}
    severity: {critical|important|nice-to-fix}
    sentence: "{quoted sentence}"
    expected: {expected value or range}
    found: {actual value}
    recommendation: "{how to fix}"

pass_fail:
  formality: {pass|fail}
  warmth: {pass|fail}
  sensory_density: {pass|fail}
  technical_depth: {pass|fail}
  urgency: {pass|fail}
  imperative_force: {pass|fail}
  reading_level: {pass|fail}

overall_pass: {true if all pass, else false}
```

## Quality Criteria for the Reviewer

- Scores are objective based on the tone matrix, not subjective preference
- Each violation cites the exact sentence — never a paraphrase
- Reading level is computed via Flesch-Kincaid, not estimated
- Formality accounts for Indian English conventions (slightly more formal than US English by default)
- Warmth violations are directional — flag both too cold and too familiar
- Sensory scores count unique sensory words, not repeated instances
- Technical depth considers the content type — a Craft Note naturally has higher technical depth than a Homepage

## Severity Levels

- **Critical:** Any dimension scoring ≥2 points from target (e.g. target 0 urgency but found 3). Must fix before publish.
- **Important:** Any dimension scoring 1 point from target. Should fix.
- **Nice-to-fix:** Minor variance within 0.5 points of target. Optional.
