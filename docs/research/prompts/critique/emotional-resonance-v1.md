# PROMPT: Emotional Resonance
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: critique
# CONTENT TYPE: all

## Description

Evaluates the emotional impact of content against HOP's page emotion map. Scores alignment with target primary and secondary emotions, avoidance of emotional tell (vs show), specificity of emotional triggers, correct System 1 → System 2 emotional arc, and the reader's emotional destination. Use after generation to fine-tune emotional connection.

## Input

Full content unit to critique. Page type (for the emotion map lookup).

## Methodology

1. **Emotion map alignment:** Look up the target primary and secondary emotions for the given page type from the HOP emotion map:
   - Homepage: primary = wonder, secondary = trust
   - Collection: primary = curiosity, secondary = reverence
   - Product Detail: primary = desire (quiet), secondary = trust
   - Journal Article: primary = wonder, secondary = connection
   - Craft Note: primary = curiosity, secondary = respect
   - Weaver Portrait: primary = connection, secondary = reverence
   - Email Welcome: primary = belonging, secondary = trust
2. Read the content and identify the dominant emotions it actually evokes. Score alignment 1–10.
3. **Emotional show vs tell:** Scan for sentences that tell the reader how to feel (e.g. "This is a truly special saree", "You will love the way it feels"). Every instance is a violation. HOP shows emotion through sensory specificity, not emotional vocabulary.
4. **Specificity of emotional triggers:** Identify the specific things in the content that create emotion — a weaver's name, a place, a sensory detail, a process description. Score based on whether the emotional trigger is concrete and specific vs abstract and generic.
5. **Emotional arc:** Map the emotional journey through the content. HOP's arc moves from System 1 (sensory, immediate, embodied) to System 2 (reflective, informational, trust-building). Content that starts with data or ends on pure sensation without reflection breaks the arc. Score based on arc correctness.
6. **Emotional destination:** Read the closing. Identify the feeling the reader is left with. Score based on whether it matches the target emotion and feels earned rather than imposed.

## Output Format

```yaml
overall_score: "{score}/10"

criteria:
  emotion_map_alignment:
    score: "{score}/10"
    target_emotions: "{primary} + {secondary}"
    detected_emotions: "{primary} + {secondary}"
    feedback: "{specific observation with quote}"
  emotional_show_not_tell:
    score: "{score}/10"
    violations:
      - line: {line_number}
        text: "{sentence that tells rather than shows}"
        recommendation: "{rewrite that shows instead}"
  specificity:
    score: "{score}/10"
    strong_triggers:
      - "{specific trigger that works well}"
    weak_triggers:
      - "{generic trigger to replace}"
  emotional_arc:
    score: "{score}/10"
    sequence: "{System 1 → System 2 mapping for this content}"
    violations:
      - "{blocks out of order or missing}"
  emotional_destination:
    score: "{score}/10"
    destination: "{the feeling the reader is left with}"
    target: "{the target destination emotion}"
    earned: {true|false}

key_violations:
  - severity: "{critical|important|nice-to-fix}"
    dimension: "{emotion_map|show_tell|specificity|arc|destination}"
    description: "{specific issue}"

recommendations:
  - "{priority-ordered list of revisions}"
```

## Quality Criteria for the Reviewer

- The emotion map alignment check must reference the specific HOP emotion map, not a generic framework. Do not substitute.
- "Show don't tell" violations are the most common. Be ruthless: any sentence that uses an emotional adjective (wonderful, special, unique, beautiful, moving, touching) in its own voice (not in quoted speech) is a violation.
- Specificity scoring requires concrete examples. A "strong trigger" is something like "the light passing through the Kharad border" — a "weak trigger" is "the saree's beautiful border".
- The emotional arc check requires understanding the EOS block sequence. System 1 blocks (sensory-body, narrative-quote) come first; System 2 blocks (technical-body, weaver-note) come second. Content that reverses this order has an incorrect arc.
- Emotional destination scoring is about whether the destination feels earned. A piece that builds curiosity and ends on reverence (earned) is different from one that asserts reverence without building it (unearned).
- If the content does not evoke the target emotions at all, score 1–3 regardless of other strengths.

## Severity Levels

- **Critical:** Emotion map mismatch (evokes wrong primary emotion). Tells reader how to feel. No specificity in emotional triggers. Must fix before publish.
- **Important:** Emotional arc reversed (System 2 before System 1). Destination unearned. Should fix.
- **Nice-to-fix:** Secondary emotion weak. Specificity could be stronger. Minor arc adjustments. Optional.
