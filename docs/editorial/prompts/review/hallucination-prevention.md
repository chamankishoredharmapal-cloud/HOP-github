# Review: Hallucination Prevention

**Purpose:** Detect and eliminate fabricated content — claims, details, names, or facts that the AI has invented.

**When to use:** Every time AI generates content about craft, culture, history, geography, or specific people. Hallucination detection is a mandatory step before human review of any AI-generated HOP content.

**When NOT to use:** For fact-checking verified claims (use `review/fact-checking.md`). Hallucination prevention is specifically about detecting fabrication, not about verifying accuracy.

---

## Purpose

Catch content that sounds plausible but is not true. AI models frequently fabricate details about handloom craft, Indian culture, and specific weavers or villages. Every piece of AI-generated content must be scanned for hallucinations before it reaches human review.

## Required Inputs

- The AI-generated content to scan
- Any research sources that were provided to the AI

## Expected Outputs

- List of detected potential hallucinations
- Recommended action for each (remove, flag, verify)
- Confidence assessment for each detection

## Hallucination Detection Categories

### 1. Specific Names

**Warning signs:**
- A weaver name that does not match any known HOP weaver
- A village name that sounds made up or is not in the craft research
- A technique name that is not in the craft glossary

**Detection method:** Cross-reference against `docs/research/craft/`, known HOP weaver names, and verified textile terminology.

**Action:** If the name is not in any source provided, flag as potential hallucination. Remove unless independently verified.

### 2. Numerical Specificity

**Warning signs:**
- Suspiciously round numbers ("exactly 100 years")
- Numbers that sound dramatic ("seventh-generation weaver" for a young weaver)
- Numbers that contradict general knowledge ("a saree takes 100 days to weave")

**Detection method:** Plausibility check. Verify against known references.

**Action:** If a number sounds dramatic or unlikely, verify against a source or remove.

### 3. Historical Claims

**Warning signs:**
- Vague anchoring ("since ancient times," "for centuries")
- Specific historical dates or periods without source
- Claims about the origin of a technique or tradition

**Detection method:** Cross-reference against `docs/research/culture/textile-history.md`.

**Action:** Remove any historical claim that cannot be sourced. HOP does not need "ancient" to be valuable.

### 4. Sensory Overreach

**Warning signs:**
- Descriptions of sensory experiences that the AI could not know
- Claims about how a specific saree feels, smells, or sounds without basis in provided materials

**Detection method:** Check against the provided product or collection details. If the AI describes sensory qualities not in the source material, flag.

**Action:** Remove fabricated sensory details. Only include sensory descriptions grounded in provided references.

### 5. Cultural Generalisations

**Warning signs:**
- "In Indian culture, all women..."
- "Traditionally, every bride..."
- Sweeping statements about regional practices

**Detection method:** Specificity check. If a cultural claim is vague and sweeping, it is likely fabricated or oversimplified.

**Action:** Replace with specific, sourced claims or remove.

### 6. Process Descriptions

**Warning signs:**
- Detailed step-by-step weaving or dyeing processes that sound plausible but are not in the provided research
- Technical descriptions of loom mechanics that the AI likely extrapolated

**Detection method:** Cross-reference against `docs/research/craft/`. If a process detail is not in any provided source, flag.

**Action:** Remove process details that are not verified. Stick to information in the provided research.

## Common Hallucination Patterns

| Pattern | Example | Why It Is Suspicious |
|---------|---------|---------------------|
| Perfect generational math | "A seventh-generation weaver at age 35" | Generations are ~25 years. 7 × 25 = 175 years. Unlikely. |
| Exotic technique name | "The Kalyani drape technique" | Sounds invented. No known HOP technique by that name. |
| Vague geography | "A small village in the hills of Tamil Nadu" | "Small village" and "hills" are generic. If the AI cannot name it, it may not exist. |
| Dramatic numbers | "Only three weavers in the world still practise this technique" | Extreme rarity claims are commonly fabricated. |
| Sensory certainty | "The fabric smells of jasmine and sandalwood" | Unless the AI was given this specific detail, it is likely invented. |

## Finding Format

```
### Detection {N}: {Type}

**Potential hallucination:** {the text that may be fabricated}
**Location:** {paragraph, sentence}
**Category:** {name | number | history | sensory | cultural | process}
**Why it is suspicious:** {specific reason}
**Source provided:** {did the AI have access to information that would support this?}
**Confidence:** {high | medium | low}
**Recommended action:** {remove | flag for verification | keep with low confidence}
```

---

**Cross-reference:** `review/fact-checking.md` (verifying claims that are not fabricated), `system/master-system-prompt.md` (HOP's truthfulness standard, Integrity Check in reasoning principles)