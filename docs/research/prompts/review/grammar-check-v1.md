# PROMPT: Grammar Check
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: review
# CONTENT TYPE: all

## Description

Checks content against HOP's grammar and style standards. Verifies grammar (subject-verb agreement, tense consistency, pronoun agreement), punctuation (comma usage, quotation marks, em-dashes), Indian English conventions (British spelling, Indian English prepositions), serial comma consistency, apostrophe usage, and capitalisation consistency. Outputs violations with line numbers and severity.

## Input

Full content unit to check.

## Methodology

1. **Grammar scan — subject-verb agreement:** Scan each sentence for mismatched subject and verb (e.g. "the weave are" → "the weave is"). Pay special attention to collective nouns, compound subjects, and indefinite pronouns.
2. **Grammar scan — tense consistency:** Identify the primary tense of the content. Flag any sentence that shifts tense without a clear narrative reason (e.g. past tense narrative suddenly switching to present).
3. **Grammar scan — pronoun agreement:** Check that pronouns agree in number and gender with their antecedents. Flag ambiguous pronoun references.
4. **Indian English conventions:**
   - **British spelling:** colour (not color), metre (not meter), behaviour (not behavior), favour (not favor), labour (not labor), neighbour (not neighbor), centre (not center), fibre (not fiber), lustre (not luster), practice/practise correctly, licence/license correctly, organise/organize (either is acceptable but must be consistent)
   - **Prepositions:** "write to me" (not "write me"), "discuss" (not "discuss about"), "provide" (not "provide with"), "request" (not "request for"), "order" + direct object (not "order for")
   - **Avoid Americanisms:** check/cheque (use "cheque"), program/programme (use "programme" except in computing), tire/tyre (use "tyre"), aluminum/aluminium (use "aluminium")
5. **Serial comma:** Check that the use (or non-use) of the Oxford comma is consistent throughout the document. Neither style is required, but mixing is a violation.
6. **Punctuation:**
   - Comma usage: commas separating independent clauses with a conjunction, commas in lists, commas after introductory elements. Flag comma splices and missing commas.
   - Quotation marks: Use single quotes for quotes within quotes. Closing punctuation goes inside the quotation mark for complete sentences, outside for fragments.
   - Em-dashes: Use spaced em-dashes ( — ) for parenthetical breaks. Never use en-dashes or hyphens for this purpose.
7. **Apostrophe usage:** Check possessive forms (its/it's, whose/who's, your/you're, their/they're/there). Flag misplaced apostrophes in plural nouns.
8. **Capitalisation consistency:** Check that heading capitalisation style (sentence case or title case) is consistent. Check that proper nouns (collection names, weaver names, place names) are consistently capitalised.

## Output Format

```yaml
pass_fail: {pass|fail}

violations:
  - type: "{grammar|punctuation|spelling|preposition|apostrophe|capitalisation|serial_comma}"
    severity: "{critical|important|nice-to-fix}"
    line: {line_number}
    context: "{surrounding text}"
    found: "{the incorrect usage}"
    expected: "{the correct usage}"
    rule: "{the grammar or style rule being applied}"

summary:
  total_violations: {count}
  critical_count: {count}
  important_count: {count}
  nice_to_fix_count: {count}
```

## Quality Criteria for the Reviewer

- Subject-verb agreement must account for Indian English conventions where collective nouns can take plural verbs (e.g. "the team are"). This is acceptable in context but flag if inconsistent within the same piece.
- Tense consistency violations require context — a narrative that moves between past (weaver's history) and present (product description) is acceptable if the shift is justified.
- British spelling is mandatory for all HOP content. Any American spelling is a violation regardless of context.
- Indian English prepositions follow British conventions. American preposition usage ("write me" instead of "write to me") is a violation.
- Serial comma consistency: check the entire document. A single instance of an Oxford comma in a document that otherwise omits it is a violation, and vice versa.
- Em-dashes should be spaced on both sides. Unspaced em-dashes or en-dashes used for parenthetical breaks are violations.
- Proper noun capitalisation must be consistent across the content and with the Knowledge Base. If "Ilkal saree" appears as "ilkal saree" or "Ilkal Saree" in different places, both are violations.
- Do not flag markdown formatting syntax as grammar issues.

## Severity Levels

- **Critical:** Subject-verb agreement errors, tense inconsistency, apostrophe misuse (its/it's confusion). Must fix before publish.
- **Important:** American spelling, American prepositions, inconsistent serial comma usage, inconsistent capitalisation. Should fix.
- **Nice-to-fix:** Mixed organise/organize spelling, inconsistent em-dash spacing, minor capitalisation inconsistencies. Optional.
