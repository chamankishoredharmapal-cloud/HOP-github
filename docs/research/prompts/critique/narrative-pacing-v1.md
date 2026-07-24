# PROMPT: Narrative Pacing
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: critique
# CONTENT TYPE: all

## Description

Evaluates the flow and rhythm of content. Scores opening strength, sentence variety, paragraph structure, section transitions, closure quality, and reading time alignment. Provides specific feedback with examples from the content and actionable recommendations. Use after initial generation and before final review.

## Input

Full content unit to critique. Stated reading time if available.

## Methodology

1. **Opening strength analysis:** Read the first 1–2 paragraphs. Score based on whether it hooks the reader without asking a question. HOP openings show, name a specific thing, or create a sensory frame. Openings that ask questions, make generalised statements, or use abstract nouns score lower.
2. **Sentence length variety:** Tokenise all sentences. Compute length of each. Check for consecutive sentences with the same length (±3 words). A passage with three consecutive 15-word sentences is a violation. Score based on rhythm variety.
3. **Paragraph structure:** Count sentences per paragraph. HOP standard is 2–4 sentences, one idea per paragraph. Flag paragraphs with 1 sentence (too abrupt) or 5+ sentences (too dense).
4. **Section transitions:** Read the boundary between each section (defined by `---` block delimiters or heading changes). Check for logical flow — each section should pick up from the previous one or provide a deliberate contrast. Flag jump cuts (abrupt topic shifts without transition).
5. **Closure quality:** Read the final 1–2 paragraphs. Score based on whether the ending resolves the narrative, returns to the opening image, or leaves the reader with a specific, grounded thought. Endings that fade out, repeat the opening, or end on a generic note score lower.
6. **Reading time alignment:** If stated reading time is provided, estimate actual reading time at 200 words per minute. Score based on whether the actual time is within ±30% of the stated time.

## Output Format

```yaml
overall_score: "{score}/10"

criteria:
  opening_strength:
    score: "{score}/10"
    feedback: "{specific observation with quote from content}"
    recommendation: "{actionable change}"
  sentence_length_variety:
    score: "{score}/10"
    feedback: "{specific observation with examples}"
    recommendation: "{actionable change}"
  paragraph_structure:
    score: "{score}/10"
    feedback: "{specific observation with examples}"
    recommendation: "{actionable change}"
  section_transitions:
    score: "{score}/10"
    feedback: "{specific observation with quote}"
    recommendation: "{actionable change}"
  closure_quality:
    score: "{score}/10"
    feedback: "{specific observation with quote}"
    recommendation: "{actionable change}"
  reading_time_alignment:
    score: "{score}/10"
    feedback: "{stated vs actual time}"
    recommendation: "{actionable change}"

key_violations:
  - severity: "{critical|important|nice-to-fix}"
    element: "{opening|sentence_variety|paragraphs|transitions|closure|reading_time}"
    description: "{specific issue}"

recommendations:
  - "{priority-ordered list of revisions}"
```

## Quality Criteria for the Reviewer

- Opening weakness is the most common pacing flaw. Be specific: "The opening asks a question, which HOP never does" is better than "Opening could be stronger".
- Sentence length variety is about rhythm, not grammar. Read the content aloud to feel the rhythm. Flag passages where every sentence has the same syntactic structure even if lengths vary slightly.
- Paragraph structure violations are often caused by a single very long or very short paragraph breaking the rhythm. Quote the specific paragraph.
- Section transitions should be evaluated with the EOS block sequence in mind — moving from System 1 to System 2 is a natural transition; moving between two System 2 blocks with no narrative bridge is a jump cut.
- Closure quality should reference the opening. A strong ending circles back without repeating.
- For reading time, state the actual calculated time clearly. Flag only if the discrepancy exceeds ±30%.

## Severity Levels

- **Critical:** Opening violates HOP rules (asks question, uses imperative, uses abstraction). Pacing makes content feel disjointed or difficult to follow. Must fix before publish.
- **Important:** Sentence rhythm is monotonous. Paragraph structure uneven. Section transitions are abrupt. Should fix.
- **Nice-to-fix:** Closure could be stronger. Reading time slightly off. Minor sentence variety improvements. Optional.
