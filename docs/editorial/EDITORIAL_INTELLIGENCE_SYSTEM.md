# Editorial Intelligence System Architecture Specification

**Version:** 1.0
**Status:** Draft for Review
**Classification:** Internal — House of Padmavati
**Author:** Principal Editorial Systems Architect
**Review Cycle:** Quarterly

---

## Table of Contents

1. Executive Summary
2. Architecture Overview
3. Layer Specifications
   - 3.1 Layer 1: Brand Truth & Identity
   - 3.2 Layer 2: Human & Cultural Anthropology
   - 3.3 Layer 3: Reader Psychology & Decision Design
   - 3.4 Layer 4: Editorial Strategy & Intent
   - 3.5 Layer 5: Knowledge Architecture & Grounding
   - 3.6 Layer 6: Narrative Intelligence
   - 3.7 Layer 7: Editorial Cognition
   - 3.8 Layer 8: Language Architecture
   - 3.9 Layer 9: Revision Intelligence
   - 3.10 Layer 10: Editorial Scoring & Metrics
4. Cross-Cutting Concerns
5. Self-Review
6. Integration With Existing Systems
7. Appendices

---

## 1. Executive Summary

The Editorial Intelligence System (EIS) is the reasoning layer above the Editorial Operating System. Where the EOS defines *what* HOP believes, *what* HOP says, and *how* HOP says it, the EIS defines *how HOP thinks before saying anything at all*.

This document specifies the EIS as a ten-layer reasoning pipeline. Each layer is a bounded cognitive module with a single responsibility, clear interfaces, measurable outputs, and independent evolution capacity. The architecture is model-agnostic and optimised for editorial intelligence itself — not for any specific AI model.

The EIS does not replace the EOS. It operationalises it. Every document, principle, vocabulary list, and emotional map in the EOS becomes an input to one or more EIS layers. The EIS is what makes that knowledge *reasoned with* rather than merely *referenced*.

### Design Principles

#### First Principles

| Principle | Meaning |
|-----------|---------|
| Truth before persuasion | Never optimise for conversion at the cost of accuracy |
| Meaning before wording | Decide what to mean before deciding how to say it |
| Narrative before sentences | Structure precedes execution |
| Thinking before prompting | The reasoning framework is independent of any prompt template |
| Observation before adjectives | Observe reality before describing it |
| Specificity before abstraction | Concrete details always beat general claims |
| Restraint before embellishment | The most powerful decision is what to leave out |
| Implication before explanation | Trust the reader to infer |
| Memory before information | The goal is not data transfer — it is memory formation |
| Emotion through evidence | Emotion is earned, not declared |
| Luxury through confidence | The absence of self-praise signals true luxury |
| Culture through authenticity | Every cultural reference is specific, named, and traceable |
| Originality through insight | Original thinking precedes original writing |

#### Engineering Principles

| Principle | Meaning |
|-----------|---------|
| Single Responsibility | Each layer does exactly one thing |
| Clear Interfaces | Each layer receives typed inputs and produces typed outputs |
| Measurable Outputs | Every layer's output can be evaluated against defined quality criteria |
| Minimal Coupling | Layers communicate through well-defined contracts |
| High Cohesion | Everything within a layer belongs together |
| Independent Evolution | A layer can be redesigned, replaced, or removed without changing adjacent layers |
| Model Independence | The architecture works with any AI model capable of following structured reasoning |
| Temporal Stability | The architecture should remain useful for a decade |

---

## 2. Architecture Overview

### 2.1 Differences from Target Reference Architecture

The target reference architecture provided 10 layers. My architecture modifies it as follows:

| Target Layer | My Layer | Change | Rationale |
|--------------|----------|--------|-----------|
| 1. Brand Truth | 1. Brand Truth & Identity | Renamed | "Identity" captures voice, territories, and boundaries that "Truth" alone implies but does not encompass |
| 2. Human Anthropology | 2. Human & Cultural Anthropology | Renamed | "Human" is redundant in "Human Anthropology". Adding "Cultural" makes explicit the cultural specificity that luxury fashion requires |
| 3. Reader Psychology | 3. Reader Psychology & Decision Design | Extended | Psychology alone is descriptive. "Decision Design" adds the prescriptive layer — how psychology informs content decisions |
| 4. Editorial Strategy | 4. Editorial Strategy & Intent | Extended | "Intent" makes explicit the requirement that every piece of content serves a specific, measurable purpose |
| — | 5. Knowledge Architecture & Grounding | **New** | The original architecture had no layer for knowledge retrieval, research grounding, or source verification. This is a critical gap |
| 5. Narrative Intelligence | 6. Narrative Intelligence | Moved | Narrative Intelligence now sits after knowledge grounding, ensuring narrative decisions are informed by verified knowledge |
| 6. Editorial Cognition | 7. Editorial Cognition | Moved | Cognition now receives both narrative architecture and grounded knowledge, producing context-aware editorial decisions |
| 7. Language Architecture | 8. Language Architecture | Unchanged | Correctly positioned as the execution layer for sentence-level decisions |
| 8. Revision Intelligence | 9. Revision Intelligence | Unchanged | Correctly positioned as the pre-publication quality gate |
| 9. Editorial Scoring | 10. Editorial Scoring & Metrics | Renamed | "Metrics" adds the quantitative dimension that "Scoring" suggests but does not specify |
| 10. Publication Intelligence | Removed | Removed | Publication concerns (channel adaptation, platform limits, rendering) are operational, not cognitive. Addressed as a cross-cutting concern in §4.4 |

### 2.2 Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       10. Editorial Scoring                         │
│                   What is the quality of this output?               │
├─────────────────────────────────────────────────────────────────────┤
│                       9. Revision Intelligence                      │
│              How do we make this better before publication?         │
├─────────────────────────────────────────────────────────────────────┤
│                      8. Language Architecture                       │
│            How do we construct sentences that carry meaning?        │
├─────────────────────────────────────────────────────────────────────┤
│                       7. Editorial Cognition                        │
│       How do we make moment-to-moment editorial decisions?         │
├─────────────────────────────────────────────────────────────────────┤
│                      6. Narrative Intelligence                      │
│         What story do we tell and how is it structured?            │
├─────────────────────────────────────────────────────────────────────┤
│                5. Knowledge Architecture & Grounding                │
│           What does the EIS know about this subject?                │
├─────────────────────────────────────────────────────────────────────┤
│                    4. Editorial Strategy & Intent                   │
│       What must this piece of content accomplish?                  │
├─────────────────────────────────────────────────────────────────────┤
│              3. Reader Psychology & Decision Design                 │
│        How does the reader process information and decide?         │
├─────────────────────────────────────────────────────────────────────┤
│                  2. Human & Cultural Anthropology                   │
│           Who is the reader in their full humanity?                │
├─────────────────────────────────────────────────────────────────────┤
│                     1. Brand Truth & Identity                       │
│               Who is HOP and who is HOP not?                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 Data Flow

A content request traverses the pipeline as follows:

```
Content Request
     │
     ▼
┌──────────────────────────────────────────────────────┐
│  1. Brand Truth & Identity                            │
│     Output: Brand boundary set + identity markers     │
├──────────────────────────────────────────────────────┤
│  2. Human & Cultural Anthropology                     │
│     Output: Reader identity model + cultural frame    │
├──────────────────────────────────────────────────────┤
│  3. Reader Psychology & Decision Design               │
│     Output: Processing model + trust architecture     │
├──────────────────────────────────────────────────────┤
│  4. Editorial Strategy & Intent                       │
│     Output: Content mandate + emotional target        │
├──────────────────────────────────────────────────────┤
│  5. Knowledge Architecture & Grounding                │
│     Output: Knowledge state + gap map                 │
├──────────────────────────────────────────────────────┤
│  6. Narrative Intelligence                            │
│     Output: Narrative architecture + scene sequence   │
├──────────────────────────────────────────────────────┤
│  7. Editorial Cognition                               │
│     Output: Editorial decisions + reasoning chains    │
├──────────────────────────────────────────────────────┤
│  8. Language Architecture                             │
│     Output: Sentence-level content                    │
├──────────────────────────────────────────────────────┤
│  9. Revision Intelligence                             │
│     Output: Revised content + revision report         │
├──────────────────────────────────────────────────────┤
│  10. Editorial Scoring & Metrics                      │
│     Output: Quality score + weakness profile          │
├──────────────────────────────────────────────────────┤
     │
     ▼
Published Content
```

Each layer may iterate with adjacent layers. Iteration is expected and designed for.

---

## 3. Layer Specifications

---

### 3.1 Layer 1: Brand Truth & Identity

**Purpose:** Establish the inviolable boundary of HOP's identity. Every subsequent decision is bounded by this layer. No downstream layer questions brand boundaries.

**Single Responsibility:** Define who HOP is and who HOP is not.

**Inputs:**
- Brand Bible (`docs/editorial/02-brand-architecture/brand-bible.md`)
- Voice Bible (`docs/editorial/02-brand-architecture/voice-bible.md`)
- Messaging Pillars (`docs/editorial/02-brand-architecture/messaging-pillars.md`)
- Editorial Principles (`docs/editorial/02-brand-architecture/editorial-principles.md`)
- Emotional Principles (`docs/editorial/02-brand-architecture/emotional-principles.md`)
- Content request metadata (page type, content type, audience segment)

**Outputs:**
- Brand Boundary Set: explicit inviolable constraints for this content unit
- Identity Markers: relevant HOP identity markers (Quiet Luxury, Cultural Custodianship, Slow Making, Human Scale, Generational Thinking)
- Brand Prohibitions: absolute and context-dependent forbidden patterns
- Voice Parameters: calibrated voice dimensions (Formality, Warmth, Sensory Density, Technical Depth, Urgency, Imperative Force)

**Internal Reasoning:**

The layer reasons through constraint satisfaction, not creative generation:

1. **Identity extraction:** Given the content request, which identity dimensions are relevant? (e.g., for a product story: Quiet Luxury, Slow Making, Human Scale, Generational Thinking. For a privacy policy: Trust Through Transparency only.)

2. **Boundary mapping:** For each relevant dimension, extract absolute boundaries. (e.g., No urgency language ever. No self-praise ever. No generic craft claims ever.)

3. **Voice calibration:** Given content type and page, place the content on each voice dimension. (e.g., for a weaver portrait: Formality 3/5, Warmth 4/5, Sensory Density 5/5, Technical Depth 3/5.)

4. **Constraint formalisation:** Express brand boundaries as explicit constraints that downstream layers can check against. Each constraint is either absolute (always applies) or context-dependent (applies per content type).

**Decision Framework:**

```
For each content request:
  for each identity dimension:
    if relevant → extract constraints
    if not relevant → omit
  for each brand prohibition:
    if absolute → include always
    if context-dependent → evaluate against content type
  calibrate voice parameters
Produce Brand Boundary Set
```

**Dependencies:**
- Depends on: Existing EOS brand documents (static references)
- Used by: Layers 2-10 (as a constraint envelope)

**Failure Modes:**
- **Brand drift:** A constraint is not enforced. Mitigation: explicit constraint formalisation with output checking.
- **Over-constraint:** A rule makes the content sterile. Mitigation: context-dependent constraint evaluation.
- **Identity blindness:** An irrelevant identity marker is applied. Mitigation: per-content-type relevance filtering.

**Success Metrics:**
- Zero brand violations in final output traceable to Layer 1
- Constraint set completeness: every EOS brand rule has a corresponding constraint path

---

### 3.2 Layer 2: Human & Cultural Anthropology

**Purpose:** Build a complete model of the reader as a full human being — not a demographic segment, but a woman with cultural context, generational perspective, values, and lived experience.

**Single Responsibility:** Understand who the reader is in her full cultural and human context.

**Inputs:**
- Customer personas (`docs/research/customers/persona-primary.md`, `persona-secondary.md`, `persona-tertiary.md`)
- Decision journey (`docs/research/customers/decision-journey.md`)
- Pain points (`docs/research/customers/pain-points.md`)
- Cultural research (`docs/research/culture/` — saree rituals, wedding traditions, textile history, festival calendar)
- UX research (`docs/research/ux/` — reading behavior, trust signals)
- Content request metadata

**Outputs:**
- Reader Identity Model: who this specific reader is for this content unit
- Cultural Context Frame: relevant cultural knowledge she brings to this content
- Generational Perspective: how her generational position affects reception
- Value Priorities: what matters to her in this specific context
- Trust Baseline: what trust she already has, what trust must be built

**Internal Reasoning:**

1. **Persona selection:** Which persona(s) is this content primarily for? Select best-fit from persona research.

2. **Cultural frame construction:** Given the content topic, what cultural knowledge does the reader already have? What cultural context must the content provide without being patronising?

3. **Generational calibration:** Where does the reader sit on the spectrum from "learning about heritage" to "living heritage"? This determines how much context is needed.

4. **Value hierarchy:** In this specific context (e.g., buying a wedding saree vs. reading a craft note), what are the reader's value priorities?

5. **Trust assessment:** How much trust does the reader already have in HOP? What trust signals are most effective for this reader at this stage of the relationship?

**Decision Framework:**

```
Select primary persona(s)
Determine reader's journey stage
For content topic:
  assess cultural familiarity
  assess prior knowledge
  identify trust requirements
  determine value priorities
Produce Reader Identity Model + Cultural Context Frame
```

**Connection to Layer 1:** Layer 1 establishes HOP's identity. Layer 2 establishes the reader's identity. The gap between these two identities is where editorial work happens.

**Failure Modes:**
- **Stereotyping:** Reducing the reader to a demographic label. Mitigation: persona research grounding, not assumptions.
- **Cultural assumption:** Assuming cultural knowledge the reader doesn't have. Mitigation: explicit cultural familiarity assessment.
- **Over-explaining:** Assuming the reader knows nothing. Mitigation: trust the reader's intelligence; provide context without condescension.

---

### 3.3 Layer 3: Reader Psychology & Decision Design

**Purpose:** Model how the reader processes information, forms trust, makes decisions, and forms memories. This layer translates the reader model (Layer 2) into a cognitive processing model.

**Single Responsibility:** Design the cognitive experience of the content — how it is processed, not what it says.

**Inputs:**
- Reader Identity Model (from Layer 2)
- Decision journey stage
- Psychology research (`docs/research/psychology/` — System 1/2, mental accounting, costly signaling, choice architecture, endowment effect, loss aversion)
- Page emotion map (`docs/editorial/07-emotional-architecture/page-emotion-map.md`)
- Emotional journey (`docs/editorial/07-emotional-architecture/emotional-journey.md`)
- UX research (`docs/research/ux/reading-behavior.md`, `trust-signals.md`)

**Outputs:**
- Processing Model: how the reader will process this content (System 1 vs. System 2 distribution)
- Trust Architecture: specific trust-building mechanisms for this content
- Decision Frame: how the reader's decision context affects content reception
- Memory Design: how content should be structured for memory formation
- Attention Map: where the reader's attention goes and in what order

**Internal Reasoning:**

1. **System allocation:** For this content, what is the optimal System 1 / System 2 balance? (e.g., hero section: predominantly System 1. Craft note: System 2 with System 1 hooks. Product story: System 1 for desire, System 2 available on demand.)

2. **Trust mechanism selection:** Based on the reader's trust baseline and content requirements, select mechanisms:
   - Costly signaling (show effort, investment)
   - Social proof (show other women, community)
   - Transparency (show process, name sources)
   - Authority (show expertise, named weavers)
   - Consistency (show HOP has always done this)

3. **Decision context mapping:** What decision is the reader making? "Should I buy this?" vs. "Should I read this?" vs. "Should I trust this brand?" The decision context changes what content is persuasive.

4. **Memory architecture design:** Apply peak-end rule. Design the peak moment and the ending. Use specificity anchors for memory encoding.

5. **Attention sequencing:** What should the reader see, in what order, for maximum cognitive effectiveness?

**Decision Framework:**

```
For content type and page:
  determine System 1 / System 2 allocation
  select trust mechanisms
  map decision context
  design memory architecture (peak + end)
  sequence attention path
Produce Processing Model
```

**Connection to Layer 2:** Layer 2 describes who the reader is. Layer 3 describes how she processes. Both are needed.

**Failure Modes:**
- **Manipulation:** Using psychology to trick the reader. Constraint: First Principles (Truth before persuasion) are a hard boundary.
- **Over-design:** Making every moment a psychological trigger. Constraint: restraint is a design principle.
- **Cognitive load blindness:** Designing for memory without considering cognitive load.

---

### 3.4 Layer 4: Editorial Strategy & Intent

**Purpose:** Define the specific mandate for this content unit — what it must accomplish, for whom, with what emotional goal, and with what call to action.

**Single Responsibility:** Create the editorial mandate that all downstream layers execute against.

**Inputs:**
- Content request (type, page, topic, format)
- Brand Boundary Set (from Layer 1)
- Processing Model (from Layer 3)
- Page strategy framework (`docs/editorial/06-page-strategy/README.md`)
- Emotional Architecture (`docs/editorial/07-emotional-architecture/`)
- SEO strategy (`docs/research/seo/keyword-strategy.md`)

**Outputs:**
- Content Mandate: explicit statement of what this content must accomplish
- Emotional Target: primary and secondary emotion, emotional journey stage
- Content Priority: what information appears first, second, third
- Primary CTA: the single most important action
- Secondary CTA: supporting action (only if non-competing)
- SEO Mandate: target keywords, search intent, title/description constraints
- Success Criteria: how success will be measured for this content unit

**Internal Reasoning:**

1. **Purpose definition:** State in one sentence why this content exists. If it cannot be stated in one sentence, the strategy is not clear enough.

2. **Emotional targeting:** Select the primary emotion from the page emotion map. Verify it is compatible with the reader's journey stage (Layer 3).

3. **Content triage:** Given infinite possible things to say, select the three most important. Everything else is subordinate or omitted.

4. **CTA design:** Design one primary CTA. Secondary CTA only if it does not compete with the primary.

5. **SEO integration:** SEO is a constraint on the mandate, not the goal. SEO serves editorial purpose.

6. **Success criteria definition:** What would make this content successful? Define measurable or assessable criteria.

**Decision Framework:**

```
Given content request:
  state purpose in one sentence
  select primary emotion → verify against page emotion map
  select secondary emotion → verify against emotional journey
  triage content to three priorities
  design primary CTA
  design secondary CTA (if and only if non-competing)
  define success criteria
Produce Content Mandate
```

**Connection to Layer 3:** The cognitive model constrains what strategies are viable. A strategy that conflicts with how the reader processes information will fail regardless of execution quality.

**Failure Modes:**
- **Drift:** The mandate is forgotten during execution. Mitigation: explicit checkpoints in downstream layers.
- **Conflicting goals:** Too many goals in one content unit. Mitigation: one primary goal only.
- **CTA overload:** Multiple competing CTAs. Mitigation: one primary, one optional secondary.
- **Emotional mismatch:** Targeted emotion conflicts with page's emotional architecture. Mitigation: verify against page emotion map.

---

### 3.5 Layer 5: Knowledge Architecture & Grounding

**Purpose:** Retrieve, verify, and structure all knowledge relevant to the content. This layer ensures every claim is grounded in verifiable information.

**Single Responsibility:** Provide verified knowledge to all downstream layers.

**Inputs:**
- Content Mandate (from Layer 4)
- Brand Boundary Set (from Layer 1)
- Knowledge Base (`docs/research/` — all categories below)
- Craft research (`docs/research/craft/` — weaving techniques, fabric glossary, regional weaves, zari history, dye processes, loom geography)
- Cultural research (`docs/research/culture/` — saree rituals, wedding traditions, textile history, festival calendar)
- Competitor research (`docs/research/competitors/`)
- Customer research (`docs/research/customers/`)
- Visual language (`docs/research/visual-language/`)
- Design philosophy (`docs/research/design-language/`)
- Future research gaps (`docs/research/future-research/README.md`)

**Outputs:**
- Knowledge State: complete set of verified facts relevant to this content, organised by domain
- Knowledge Gaps: what is not known and must not be fabricated
- Source Map: traceability for every factual claim
- Craft References: specific, named techniques, places, weavers
- Cultural References: specific, named traditions, rituals, occasions
- Sensory References: verifiable observations about cloth, colour, weight, texture
- Visual References: photography direction, image standards

**Internal Reasoning:**

1. **Domain mapping:** Based on the content mandate, determine which knowledge domains are relevant. (e.g., for a Kanchipuram silk product story: weaving techniques, regional weaves, fabric glossary, saree rituals, photography direction.)

2. **Fact extraction:** For each relevant domain, extract specific, verifiable facts. Include source path with each fact.

3. **Gap identification:** What does the content mandate require that the knowledge base does not support? Mark these as explicit gaps. Downstream layers are forbidden from filling gaps by fabricating.

4. **Truth verification:** Cross-reference facts across sources. Flag contradictions. Flag single-source facts for verification.

5. **Knowledge structuring:** Organise facts by relevance and type. Structure for easy consumption by Layers 6-8.

6. **Specificity enrichment:** Where a fact exists but is generic, surface specificity opportunities. (Instead of "traditional weaving technique", surface "pit loom weaving, practiced in Molakalmuru for over 400 years.")

**Decision Framework:**

```
Map content mandate to knowledge domains
For each domain:
  retrieve relevant facts
  verify each fact (cross-reference)
  identify gaps
Cross-reference for contradictions
Structure knowledge by type (craft, cultural, sensory, visual)
Surface specificity opportunities
Produce Knowledge State + Gap Map
```

**Connection to Layer 4:** Layer 4 defines the mandate. Layer 5 checks whether the mandate is achievable given available knowledge. Critical gaps feed back to Layer 4 for mandate adjustment.

**Failure Modes:**
- **Fabrication:** Generating claims not grounded in verified knowledge. Prevention: gap map is explicit; downstream layers forbidden from filling gaps.
- **Incompleteness:** Missing relevant information. Prevention: systematic domain mapping per content type.
- **Staleness:** Using outdated information. Prevention: versioning and review cycle for knowledge base.
- **Single-source over-reliance:** Treating a single-source fact as verified. Prevention: multi-source verification requirement.

**Verification Process:**

Each fact carries:
- Source document (path)
- Confidence level: verified, single-source, inferred
- Verification date
- Cross-reference count

Facts below "verified" are surfaced as "requires verification" to human editorial.

---

### 3.6 Layer 6: Narrative Intelligence

**Purpose:** Architect the story — its structure, arc, tension, pacing, and identity transformation. This layer determines what story is told and how it unfolds.

**Single Responsibility:** Design the narrative architecture that carries the editorial strategy.

**Inputs:**
- Content Mandate (from Layer 4)
- Knowledge State (from Layer 5)
- Processing Model (from Layer 3)
- Brand Boundary Set (from Layer 1)
- Editorial Principles (`docs/editorial/02-brand-architecture/editorial-principles.md`)
- Emotional Journey (`docs/editorial/07-emotional-architecture/emotional-journey.md`)

**Outputs:**
- Narrative Architecture: complete structural design of the content
  - Arc type (transformation, revelation, journey, portrait, instruction)
  - Narrative tension curve
  - Emotional progression
  - Scene/block sequence
  - Pacing map
  - Tone register per section
- Identity Transformation Design: how the reader's sense of self changes
- Curiosity Architecture: what questions are raised, when, and how answered
- Foreshadowing Map: what is hinted at and when it pays off
- Resolution Design: how the content concludes

**Internal Reasoning:**

1. **Arc selection:** Based on content mandate and emotional target, select the narrative arc:
   - **Transformation arc:** Reader/subject changes through the content. (Journal articles, weaver portraits, house letters.)
   - **Revelation arc:** Information revealed progressively toward insight. (Craft notes, ritual guides, field notes.)
   - **Journey arc:** Reader moves through discoveries. (Collection narratives, product stories.)
   - **Portrait arc:** Subject painted through accumulated detail. (Weaver portraits, about page.)
   - **Instruction arc:** Knowledge transferred systematically. (Ritual guides, craft notes, glossary.)

2. **Tension curve design:** Map narrative tension across the content. Where does tension rise? Where does it release? The curve matches the emotional journey stage.

3. **Scene construction:** Break content into narrative scenes. Each scene has:
   - Single purpose
   - Emotional note
   - Sensory anchor
   - Knowledge function (what reader learns/feels)
   - Transition to next scene
   - Tone register (sensory, reflective, technical, trust, resolution)

4. **Pacing calibration:** Vary reading velocity. Fast-paced sections (short sentences, high sensory density) alternate with slower sections (longer sentences, reflective space).

5. **Identity transformation design:** What identity does the reader start with? What identity does the content offer her? The gap is where narrative works. (e.g., "You are someone who buys sarees → You are someone who continues a weaving tradition.")

6. **Curiosity architecture:** Raise questions early that are answered later. The gap between question and answer creates narrative drive.

7. **Resolution design:** Every content unit ends with:
   - Answer to the central question
   - Delivery of the promised emotional experience
   - A memory anchor
   - A natural transition to next content/page

**Decision Framework:**

```
Select arc type based on mandate + emotion + content type
Design tension curve matching emotional journey
Construct scene sequence:
  for each scene: purpose, emotion, sensory anchor, knowledge function, tone register
Calibrate pacing per scene (fast/slow alternation)
Design identity transformation (from → to identity)
Build curiosity architecture (question → anticipation → answer)
Design resolution (answer central question + emotional payoff + memory anchor)
Produce Narrative Architecture
```

**Connection to Layer 5:** Knowledge grounds the narrative. The narrative never contradicts the knowledge state. Compelling facts in the knowledge state should be surfaced by the narrative. Gaps must not be fabricated around.

**Connection to Layer 4:** The narrative architecture must serve the content mandate. If the mandate is "build trust for a Rs. 85,000 saree", the narrative must include trust-building mechanisms at specific structural points.

**Failure Modes:**
- **Generic narrative:** Same arc for all content. Mitigation: arc selection is content-type and mandate dependent.
- **Tension mismatch:** Tension conflicts with emotional target. Mitigation: verify tension curve against emotional target.
- **Over-architecture:** Narrative too complex to execute. Mitigation: simplicity is a design constraint.
- **Identity disconnection:** Transformation not believable. Mitigation: ground in reader model (Layer 2).

---

### 3.7 Layer 7: Editorial Cognition

**Purpose:** Make moment-to-moment editorial decisions within the narrative architecture. This is the reasoning layer that answers "what should happen here, and why?"

**Single Responsibility:** Execute editorial reasoning for each narrative moment.

**Inputs:**
- Narrative Architecture (from Layer 6)
- Content Mandate (from Layer 4)
- Knowledge State (from Layer 5)
- Processing Model (from Layer 3)
- Brand Boundary Set (from Layer 1)
- Reasoning Principles (`docs/editorial/prompts/system/reasoning-principles.md`)

**Outputs:**
- Editorial Decisions: for each narrative moment, decisions about:
  - What to say (content selection)
  - What to imply (subtext)
  - What to omit (restraint)
  - What to emphasise (weight)
  - What to trust the reader to infer
  - What cultural/memory trigger to activate
  - What sensory detail to foreground
- Reasoning Chain: the cognitive trace that produced each decision

**Internal Reasoning — The Editorial Cognition Question Set:**

Every narrative moment triggers this reasoning sequence. Not all questions apply to all moments — the framework is a tool, not a straitjacket.

| # | Question | Purpose | When Essential |
|---|----------|---------|----------------|
| 1 | What memory should survive from this moment? | Define the lasting impact (feeling, image, insight) | Every moment |
| 2 | What emotion should be earned at this exact point? | Calibrate the emotional micro-beat within the macro-arc | Scene transitions, key claims |
| 3 | What image should remain in the reader's mind? | Select the single concrete visual to encode | Every moment |
| 4 | What deserves silence — what should be left unsaid? | Identify where the reader completes meaning | High-trust moments, cultural familiarity |
| 5 | What should never be explained? | Respect what the reader is equipped to understand | Cultural references, sensory experiences |
| 6 | What belongs in subtext rather than explicit language? | Identify what is more powerful when implied | Emotional beats, identity signals |
| 7 | What tension drives this paragraph? | Find the micro-tension (between said/meant, expectation/reality) | Narrative passages |
| 8 | What cultural assumptions exist in this moment? Are they shared? | Verify cultural grounding | Any cultural reference |
| 9 | What detail at this moment establishes trust? What would destroy it? | Calibrate trust signalling | Product stories, claims, pricing |
| 10 | What deserves emphasis in this moment? | Select the single most important element | Every moment |
| 11 | What deserves omission? | Identify what would distract, dilute, or mislead | Every moment |
| 12 | What rhythm suits this moment? | Calibrate pacing (short punch? flowing cadence? quiet space?) | Every paragraph |
| 13 | What identity transformation is occurring at this moment? | Track the micro-shift in reader identity | Scene boundaries |
| 14 | Is every claim in this moment true? Verifiable? | Verify truth before writing | Every factual claim |

**Decision Framework:**

```
For each narrative moment:
  ask relevant cognition questions
  synthesize answers into editorial decision set
  verify decisions against:
    Brand Boundary Set (Layer 1)
    Content Mandate (Layer 4)
    Knowledge State (Layer 5)
    Narrative Architecture (Layer 6)
  produce decision set + reasoning chain
```

**Connection to Layer 6:** Layer 6 provides the macro-narrative structure. Layer 7 makes micro-decisions within it. Layer 7 decisions should not contradict Layer 6 architecture. If they do, this signals a flaw in the architecture that should feed back to Layer 6.

**Failure Modes:**
- **Analysis paralysis:** Answering all questions for every moment is too slow. Mitigation: question selection is moment-dependent.
- **Self-indulgence:** Reasoning becomes more important than output. Mitigation: output is the editorial decisions, not the reasoning itself.
- **Decision inconsistency:** Adjacent moments make contradictory decisions. Mitigation: cross-moment consistency check at scene boundaries.

---

### 3.8 Layer 8: Language Architecture

**Purpose:** Construct the sentences that carry the editorial decisions. This is the execution layer — where thinking becomes language.

**Single Responsibility:** Execute sentence-level construction within editorial and narrative constraints.

**Inputs:**
- Editorial Decisions (from Layer 7)
- Narrative Architecture (from Layer 6)
- Content Mandate (from Layer 4)
- Brand Boundary Set (from Layer 1)
- Vocabulary System (`docs/editorial/04-vocabulary-system/`)
- Voice Bible (`docs/editorial/02-brand-architecture/voice-bible.md`)
- Writing Principles (`docs/editorial/prompts/system/writing-principles.md`)
- Master System Prompt (`docs/editorial/prompts/system/master-system-prompt.md`)
- Tone register per section (from Layer 6)

**Outputs:**
- Sentence-level content (the actual words)
- Each sentence tagged with: rhythm pattern, sensory density, reading velocity, emotional register

**Internal Reasoning:**

1. **Sentence rhythm calibration:** Per moment, select optimal sentence length:
   - Short (6-10 words): impact, tension, emphasis
   - Medium (12-18 words): narrative flow (HOP default)
   - Longer (18-25 words): accumulation, richness
   - Default pattern: three short, one long, repeat

2. **Sensory density calibration:** Default: one sensory anchor per sentence. High-immersion moments: up to three. Reflective moments: zero (space).

3. **Vocabulary governance:** Every word must pass:
   - Forbidden list check
   - Specificity check (generic → specific)
   - AI-cliché check ("delve into", "nestled in", "testament to", etc.)
   - Abstraction check (abstract → concrete)

4. **Negative space design:** Design for verbal silence between sentences, white space between paragraphs, implications that don't need stating.

5. **Reading velocity control:**
   - Acceleration: shorter sentences, shorter words, fewer details, simpler structure
   - Deceleration: longer sentences, more sensory density, subordinate clauses, complex structure

6. **Metaphor governance:** If metaphor is used, it must be:
   - Original (not "tapestry of flavors" or similar)
   - Specific (grounded in actual craft or context)
   - Necessary (if literal achieves the same, use literal)

7. **Musicality:** Sentence sound matters.
   - Alliteration (sparing, intentional)
   - Vowel/consonant balance
   - Line endings (end on strong words)
   - Parallel structure (when listing, when comparing)
   - Sentence variety (avoid same-structure adjacent sentences)

8. **Compression:** Remove 20% of words after drafting. If meaning survives, the original was not compressed enough.

9. **Expansion:** If a complex idea cannot be followed on first read, expand it.

**Decision Framework:**

```
For each editorial decision:
  calibrate sentence rhythm (per tone register)
  select vocabulary (governed by vocabulary system)
  design negative space
  control reading velocity
  apply compression
  check musicality
  verify against brand constraints
  verify against editorial decisions
  verify against knowledge state
Produce sentence(s)
```

**Connection to Layer 7:** Layer 7 decides what to say. Layer 8 decides how to say it. This separation is critical: decisions about meaning precede decisions about wording. This prevents "writing to sound good" rather than "writing to mean something."

**Failure Modes:**
- **Rhythm monotony:** All sentences same length. Mitigation: explicit rhythm calibration per section.
- **Sensory overload:** Every sentence dense. Mitigation: rhythm includes rest moments.
- **Vocabulary slip:** Forbidden word enters. Mitigation: vocabulary filter runs before output.
- **AI diction:** Sounds like AI wrote it. Mitigation: AI-cliché detection on forbidden list.

---

### 3.9 Layer 9: Revision Intelligence

**Purpose:** Review content through independent passes, each focused on a single dimension of quality. This is an editorial review engine, not a proofreader.

**Single Responsibility:** Identify, diagnose, and recommend fixes for quality issues.

**Inputs:**
- Draft content (from Layer 8)
- All upstream layer inputs (Brand Boundary Set, Content Mandate, Knowledge State, Narrative Architecture, Editorial Decisions)
- Review prompts (`docs/editorial/prompts/review/`)

**Outputs:**
- Revised content (with changes applied)
- Revision Report: per-pass findings, severity, and recommended actions
- Residual Issues: what could not be fixed without human intervention

**Internal Reasoning — The 12 Revision Passes:**

Each pass is isolated. A strong result on one pass does not compensate for a weak result on another.

#### Pass 1 — Truth Audit

| Element | Specification |
|---------|---------------|
| Purpose | Verify every factual claim against the knowledge state |
| Checklist | Is the weaver's name correct? Is the place name correct? Is the technique name correct? Is any claim fabricated or inferred? Is any single-source claim flagged? |
| Failure Criteria | Any fabricated claim. Any unverified claim presented as fact. |
| Revision Strategy | Remove unverifiable claims. Replace with verified knowledge from Layer 5. Flag residual uncertainties. |

#### Pass 2 — Brand Fidelity

| Element | Specification |
|---------|---------------|
| Purpose | Verify every sentence against the Brand Boundary Set and Voice Bible |
| Checklist | Does this sound like HOP? Is any forbidden word present? Is any self-praise present? Is voice consistent with calibrated dimensions? |
| Failure Criteria | Any forbidden word. Any brand voice violation. |
| Revision Strategy | Replace violations with brand-compliant alternatives. Recalibrate voice dimensions if drifted. |

#### Pass 3 — Evidence Audit

| Element | Specification |
|---------|---------------|
| Purpose | Verify every significant claim has supporting evidence |
| Checklist | "The heaviest saree ever woven" → evidence: weight in grams, weaver statement? "Beloved across three generations" → evidence: testimonial, specific occasion? |
| Failure Criteria | Claims requiring evidence that have none |
| Revision Strategy | Add evidence or soften claim to match available evidence |

#### Pass 4 — Emotional Verification

| Element | Specification |
|---------|---------------|
| Purpose | Verify the content creates the intended emotion |
| Checklist | Read the content. What emotion does it actually produce? Compare with emotional target (Layer 4). Is the emotion earned or declared? |
| Failure Criteria | Experienced emotion substantially differs from target |
| Revision Strategy | Identify where the mismatch begins. Rewrite from that point to realign emotions. |

#### Pass 5 — Narrative Cohesion

| Element | Specification |
|---------|---------------|
| Purpose | Verify the content maintains its narrative arc |
| Checklist | Does opening establish what content is about? Does each section follow logically? Is there a central thread? Does conclusion resolve the introduction? |
| Failure Criteria | Broken narrative thread. Missing conclusion. Unresolved introduction. |
| Revision Strategy | Restore narrative structure. Add transitions. Complete unresolved arcs. |

#### Pass 6 — Sensory Density Audit

| Element | Specification |
|---------|---------------|
| Purpose | Verify distribution and quality of sensory language |
| Checklist | Does every section have at least one sensory anchor? Are sensory details specific? Is there sensory variety (visual, tactile, weight)? |
| Failure Criteria | A section with zero sensory anchors. A sensory cliché. |
| Revision Strategy | Add sensory anchors to empty sections. Replace clichés with specific observations from knowledge state. |

#### Pass 7 — Compression Check

| Element | Specification |
|---------|---------------|
| Purpose | Identify any sentence that can lose words without losing meaning |
| Checklist | Can any adjective be removed? Can any clause be shortened? Can any sentence be split or merged? Is there any redundancy? |
| Failure Criteria | Unnecessary words that survive the final draft |
| Revision Strategy | Remove. Shorten. Tighten. |

#### Pass 8 — Sentence Music

| Element | Specification |
|---------|---------------|
| Purpose | Verify the content reads well aloud |
| Checklist | Does it flow naturally? Are there tongue-twisters? Is rhythm varied? Do sentence endings feel intentional? |
| Failure Criteria | A paragraph that does not read well aloud |
| Revision Strategy | Rewrite awkward constructions. Vary monotonous rhythms. Strengthen weak endings. |

#### Pass 9 — Vocabulary Audit

| Element | Specification |
|---------|---------------|
| Purpose | Scan every word against forbidden list, AI-cliché list, and specificity standard |
| Checklist | Any forbidden words? Any AI-common phrases ("a testament to", "in today's world", "nestled in", "delve into")? Any abstract words that should be concrete? |
| Failure Criteria | Any forbidden word. Any AI cliché. |
| Revision Strategy | Replace immediately. No exceptions. |

#### Pass 10 — Accessibility Check

| Element | Specification |
|---------|---------------|
| Purpose | Verify content meets accessibility standards |
| Checklist | Reading level Grade 7-9? Alt text on every image? Headings logical hierarchy? No information through colour alone? Link text descriptive? |
| Failure Criteria | Missing alt text. Reading level outside target. Missing heading hierarchy. |
| Revision Strategy | Add missing alt text. Simplify complex sentences. Restore heading hierarchy. |

#### Pass 11 — SEO Verification

| Element | Specification |
|---------|---------------|
| Purpose | Verify SEO metadata meets requirements |
| Checklist | Title ≤ 70 characters? Description ≤ 160 characters? Title includes target primary keyword? Description is genuine summary, not keyword-stuffed? |
| Failure Criteria | Title or description exceeds limits. Description is keyword-stuffed. |
| Revision Strategy | Shorten title/description. Rewrite description in HOP voice. |

#### Pass 12 — Cultural Authenticity

| Element | Specification |
|---------|---------------|
| Purpose | Verify cultural accuracy and respect |
| Checklist | Are cultural references accurate? Are any claims stereotypical or reductive? Is the voice of the culture centred, not the outsider looking in? |
| Failure Criteria | Culturally inaccurate claim. Stereotyping. Appropriative framing. |
| Revision Strategy | Remove or correct. Consult cultural research from Layer 5. Escalate to human if uncertain. |

**Severity Classification:**

| Severity | Meaning | Action |
|----------|---------|--------|
| Critical | Brand violation, forbidden words, false claims, cultural inaccuracy | Must fix. Block publication. |
| Important | Low sensory density, generic language, inconsistent voice, narrative gap | Should fix. Recommend revision. |
| Minor | Optional improvement, stylistic preference, tiny compression opportunity | Consider fixing. Not publication-blocking. |

**Decision Framework:**

```
For each review pass:
  load pass criteria
  evaluate content against criteria
  classify findings by severity
  produce finding + recommended fix
After all passes:
  compile Revision Report
  apply auto-fixable changes
  flag residual issues for human
Produce Revised Content + Revision Report
```

**Connection to Layer 10:** After revision, content passes to scoring. The Revision Report feeds into the scoring model as a qualitative dimension.

**Failure Modes:**
- **Pass fatigue:** Running 12 passes on every content unit is expensive. Mitigation: per-content-type pass requirements; not all passes needed for all content.
- **False positives:** Pass identifies non-issue as issue. Mitigation: criteria calibrated per content type.
- **False negatives:** Pass misses real issue. Mitigation: multi-pass catches most issues through at least one pass.
- **Over-correction:** Content loses natural voice after revision. Mitigation: revision passes are diagnostic; they flag issues, they do not rewrite voice.

---

### 3.10 Layer 10: Editorial Scoring & Metrics

**Purpose:** Measure content quality against defined heuristics. This is not a "grade" — it is a diagnostic tool that identifies strengths and weaknesses.

**Single Responsibility:** Quantify editorial quality across multiple dimensions.

**Inputs:**
- Final content (from Layer 9, after revision)
- Revision Report (from Layer 9)
- Content Mandate (from Layer 4)
- All upstream layer constraints

**Outputs:**
- Quality Score Card: scored across all dimensions
- Overall Quality Index: weighted composite score
- Weakness Profile: dimensions below threshold
- Improvement Recommendations: specific actions for next iteration

**Scoring Heuristics:**

Each heuristic produces a score from 0.0 to 1.0.

| # | Heuristic | Formula / Assessment | Target |
|---|-----------|---------------------|--------|
| H1 | Memory Density | memorable elements per 100 words / 3 | > 1.0 (i.e., ≥ 3 per 100 words) |
| H2 | Narrative Compression | 1 - (removable words / total words) | > 0.85 |
| H3 | Emotional Precision | Composite: target emotion presence (0.3) + keyword alignment (0.3) + structural support (0.2) + no conflicting signals (0.2) | > 0.80 |
| H4 | Reader Visualization | Sensory details per 100 words | > 4 per 100 words |
| H5 | Luxury Restraint | 1 - (luxury claims / max(word_count / 50, 1)) | 1.0 (zero claims) |
| H6 | Specificity Index | specific terms / (generic terms + specific terms) | > 0.70 |
| H7 | Sensory Authenticity | specific sensory / total sensory | > 0.80 |
| H8 | Identity Signaling | Composite: identity offered (0-0.5) + credibility (0-0.3) + naturalness (0-0.2) | > 0.70 |
| H9 | Trust Formation | trust signals present / trust signals possible (per content type) | > 0.80 |
| H10 | Originality Index | original elements / (original + cliché elements) | > 0.75 |
| H11 | Sentence Music | Composite: std dev of sentence lengths + short/long ratio + structure variety | > 0.70 |
| H12 | Cadence Variation | Rhythm shift detection across sections (low variance = low score) | > 0.60 |
| H13 | Cultural Authenticity | verified cultural claims / total cultural claims | 1.0 |
| H14 | AI Detectability | human patterns / (human + AI patterns) | > 0.80 (i.e., < 0.20 AI) |
| H15 | Narrative Cohesion | Subjective assessment: flow, thread, opening/closing connection | > 0.75 |

**Overall Quality Index:**

```
OQI = weighted_average(all applicable heuristics)
```

Weights vary per content type:

| Content Type | Primary Heuristics (higher weight) |
|--------------|------------------------------------|
| Product Story | H9 Trust Formation, H5 Luxury Restraint, H6 Specificity Index |
| Journal Article | H1 Memory Density, H15 Narrative Cohesion, H3 Emotional Precision |
| Collection Narrative | H15 Narrative Cohesion, H4 Reader Visualization, H8 Identity Signaling |
| Craft Note | H6 Specificity Index, H7 Sensory Authenticity, H13 Cultural Authenticity |
| Weaver Portrait | H1 Memory Density, H8 Identity Signaling, H13 Cultural Authenticity |
| Homepage | H3 Emotional Precision, H5 Luxury Restraint, H11 Sentence Music |
| About Page | H8 Identity Signaling, H13 Cultural Authenticity, H3 Emotional Precision |

**Scoring Thresholds:**

| Range | Meaning | Action |
|-------|---------|--------|
| 0.90–1.00 | Exceptional | Publish-ready. Human review optional. |
| 0.80–0.89 | Strong | Publishable. Human review recommended. |
| 0.70–0.79 | Adequate | Publishable with revision. Human review required. |
| 0.60–0.69 | Weak | Do not publish. Must revise. |
| < 0.60 | Failing | Do not publish. Return to Layer 7. |

**Failure Modes:**
- **Gaming metrics:** Writing to optimize scores. Mitigation: scoring is diagnostic, not prescriptive; computed post-hoc.
- **Metric proliferation:** Too many heuristics. Mitigation: per-content-type heuristic selection.
- **False precision:** Scores imply more objectivity than editorial quality supports. Mitigation: use score bands, not exact scores.
- **Cultural dimension neglect:** Hardest dimension is most important. Mitigation: heavy cultural weighting in OQI.

---

## 4. Cross-Cutting Concerns

### 4.1 Context Management

Context is loaded in this order for any content generation session:

1. Session identity (content type, page, topic)
2. Brand constraints (Layer 1 context)
3. Reader context (Layer 2 & 3 context)
4. Strategy context (Layer 4 context)
5. Knowledge context (Layer 5 context)
6. Narrative context (Layer 6 context)
7. Editorial context (Layer 7 context)
8. Language context (Layer 8 context)
9. Review context (Layer 9 context)
10. Scoring context (Layer 10 context)

**Conflict resolution:** When context conflicts, priority follows layer order. Layer 1 constraints override Layer 4 goals. Brand identity is never sacrificed for editorial strategy.

**Staleness:** Every context document carries a version and last-updated date. Documents older than the review cycle are flagged.

### 4.2 Feedback & Learning

**Human feedback loop:**
- Every published content unit includes a feedback mechanism for human editors
- Discrepancies between EIS score and human assessment are analysed for model calibration
- Revision passes with consistent false positives/negatives are recalibrated

**Performance feedback loop:**
- Content performance metrics (time on page, scroll depth, CTA click rate) are mapped to EIS scoring dimensions
- Correlations between heuristics and performance are tracked over time
- Scoring weights are adjusted quarterly based on performance feedback

**Learning constraints:**
- No learning from individual content units (prevents overfitting)
- Learning at aggregate level, across content types and time periods
- EIS is versioned; changes create new versions

### 4.3 Model Independence

The EIS works with any AI model capable of:
- Following structured reasoning chains
- Receiving and applying multiple context documents
- Generating output in specified formats
- Executing independent evaluation passes

**Model selection guidelines:**
- Reasoning tasks (Layers 1-7, 9-10): prefer strong reasoning and instruction-following
- Language generation (Layer 8): prefer strong prose and vocabulary control
- Evaluation tasks (Layers 9-10): can use separate model from generation to reduce blind-spot overlap

### 4.4 Publication & Platform Adaptation

Publication concerns are addressed as a cross-cutting adaptation layer applied after scoring, not as an EIS layer.

**Adaptation dimensions:**
- Length adaptation: EIS content is canonical; platform-specific truncations/expansions are adaptations
- SEO metadata generation: title, description, structured data generated from canonical content
- Accessibility compliance: alt text, heading hierarchy, reading level verified during adaptation
- Channel-specific framing: email, social, web versions may require different framing (surfaced from Layer 3)

**Constraint:** Publication adaptation must not alter the editorial decisions made by Layer 7. Adaptation is surface-level only.

---

## 5. Self-Review

### 5.1 Three Weakest Layers

**Weakest 1: Layer 5 — Knowledge Architecture & Grounding**

The retrieval mechanism is described procedurally ("retrieve relevant facts") but the actual retrieval across 50+ research documents is made to sound simpler than it is. In practice, retrieval requires semantic understanding to match content mandates with knowledge domains, relevance ranking across potentially dozens of documents, and confidence assessment for each extracted fact. The layer specification does not provide a concrete retrieval protocol.

**Suggested improvement:** Design a formal knowledge retrieval protocol with structured queries per content type, confidence scoring per fact, and a gap-detection algorithm.

**Weakest 2: Layer 2 — Human & Cultural Anthropology**

This layer depends heavily on the quality and currency of persona research. The name promises deeper cultural analysis than the specification delivers. It currently functions more as a "reader model assembly" layer than an "anthropological reasoning" layer. Missing: systematic cultural analysis framework, generational position analysis, and cultural tension detection.

**Suggested improvement:** Add cultural analysis as a distinct reasoning stage within the layer, including cultural distance assessment and cultural sensitivity verification.

**Weakest 3: Layer 10 — Editorial Scoring & Metrics**

Several heuristics rely on subjective assessment that is difficult to automate (H3 Emotional Precision, H8 Identity Signaling, H13 Cultural Authenticity, H15 Narrative Cohesion). The numeric scoring may imply more objectivity than the assessment actually achieves. The "false precision" risk is real.

**Suggested improvement:** Separate heuristics into quantitative (auto-computed: H1, H2, H5, H6, H7, H9, H11, H12) and qualitative (human-assessed: H3, H4, H8, H10, H13, H14, H15). OQI uses quantitative only; qualitative reported separately as "editorial judgment dimensions."

### 5.2 Architectural Duplication

**Knowledge retrieval:** Layer 5 and the existing Knowledge Base README both describe knowledge retrieval. Resolution: Layer 5 should reference the Knowledge Base README's retrieval structure rather than duplicating it. Extend Knowledge Base README with an "AI retrieval protocol" section.

**Content evaluation:** Layer 9 (Revision Intelligence) and Layer 10 (Editorial Scoring) both evaluate content quality. Layer 9 diagnoses and recommends fixes. Layer 10 measures and scores. They are complementary. However, Pass 4 (Emotional Verification) and H3 (Emotional Precision) overlap. The Revision Pass should produce the qualitative assessment; the Scoring heuristic should consume it as input.

### 5.3 Missing Capabilities

1. **Content-type-specific layer variations:** The architecture treats all content types equally. Layers should have content-type-specific variations — different question sets, different decision frameworks, different heuristics.

2. **Recursion and multi-pass generation:** The architecture assumes a linear pipeline. Great editorial work is recursive. The architecture should explicitly support multi-pass generation where Layers 1-10 iterate multiple times, with each iteration informed by previous scoring.

3. **Tone register switching within content:** The architecture assumes consistent voice throughout. Many content units require multiple registers — a product story may include technical, sensory, and trust sections with different tones. Per-section tone calibration is needed.

### 5.4 Version 2.0 Proposal

Based on self-review, V2 proposes:

1. **Content-type-specific layer profiles:** Each layer publishes a content-type profile adapting its reasoning framework. (e.g., Layer 7 for product stories emphasises Trust, Sensory, and Identity Questions; for glossary entries, Truth and Compression Questions.)

2. **Explicit recursion model:** Add recursion controller between Layers 9 and 10. After scoring:
   - < 0.60: Return to Layer 6 (narrative redesign)
   - 0.60-0.69: Return to Layer 7 (editorial cognition)
   - 0.70-0.79: Return to Layer 8 (language execution)
   - Max 3 recursion passes before human escalation.

3. **Per-section tone register:** Add tone register parameter to Narrative Architecture (Layer 6) — each scene specifies: sensory, reflective, technical, trust, or resolution. Layer 8 calibrates sentences to match.

4. **Quantitative/qualitative heuristic split:** Separate scoring as described in §5.1 Weakest 3.

5. **Cultural distance assessment in Layer 2:** Assess cultural distance between HOP and reader perspectives. Distance score determines context/explanation needed.

### 5.5 V1 vs V2 Comparison

| Dimension | V1.0 | V2.0 | Verdict |
|-----------|------|------|---------|
| Content-type adaptation | Single architecture | Per-type profiles | V2 |
| Recursion | Linear pipeline | Controlled recursion | V2 |
| Tone flexibility | Single voice | Per-section register | V2 |
| Scoring objectivity | Mixed | Clear quantitative/qualitative separation | V2 |
| Cultural sensitivity | Persona-based | Persona + distance assessment | V2 |
| Complexity | Moderate | Higher | V1 |
| Implementation difficulty | Moderate | High | V1 |
| Production readiness | Immediate | Requires development | V1 |
| Future-proofing | Strong | Stronger | V2 |

### 5.6 Recommendation

**Recommend Version 1.0 for initial implementation.**

Rationale:

1. **Production readiness:** V1 can be implemented today with existing AI models and EOS. V2 requires additional development that would delay deployment.

2. **Iterative path:** V1 provides the architecture foundation. V2 improvements can be added incrementally as layers evolve. The architecture is designed for independent layer evolution.

3. **Feedback-based evolution:** V1 in production will surface real patterns of weakness that V2 can address with empirical confidence. Without V1 data, V2 changes would be speculative.

4. **Complexity management:** V2 adds significant complexity before V1 has been validated risks building an elaborate system on untested assumptions.

**Implementation sequence:**
1. Implement V1 Layers 1-4 (Brand, Anthropology, Psychology, Strategy) — most stable, least likely to change
2. Implement V1 Layer 5 (Knowledge Architecture) — requires most integration with existing systems
3. Implement V1 Layers 6-8 (Narrative, Cognition, Language) — core generation pipeline
4. Implement V1 Layer 9 (Revision Intelligence) — 12-pass review system
5. Implement V1 Layer 10 (Editorial Scoring) — quantitative heuristics only; qualitative as human workflow
6. After 3 months production use, conduct layer-by-layer review against performance data
7. Upgrade to V2 where data supports the change

---

## 6. Integration With Existing Systems

### 6.1 With the Editorial Operating System

| EOS Component | EIS Layer(s) | Integration |
|---------------|--------------|-------------|
| Brand Bible | L1 | Primary input: identity markers, territories, promises |
| Voice Bible | L1, L8 | L1: voice dimensions. L8: voice execution parameters |
| Messaging Pillars | L1, L4 | L1: territory boundaries. L4: pillar selection |
| Editorial Principles | L1, L6, L7 | L1: constraints. L6: narrative governance. L7: moment governance |
| Emotional Principles | L4, L7 | L4: emotional target. L7: emotional beat execution |
| Vocabulary System | L8 | Primary input: approved/forbidden/preferred/grammar |
| Page Strategy | L4 | Primary input: page-level content mandate |
| Emotional Architecture | L4, L6 | L4: target selection. L6: emotional arc design |
| AI Writing OS | L7, L8, L9 | L7: reasoning principles. L8: writing principles. L9: review prompts |

### 6.2 With the Knowledge Base

| KB Component | EIS Layer | Integration |
|--------------|-----------|-------------|
| Customer Personas | L2 | Reader identity model construction |
| Psychology Research | L3 | Processing model, trust mechanism design |
| Craft Research | L5 | Grounded craft knowledge |
| Cultural Research | L5 | Grounded cultural knowledge |
| Competitor Research | L5 | Differentiation knowledge |
| UX Research | L3 | Reading behavior, trust signals |
| SEO Research | L4 | SEO mandate, keyword targeting |
| Visual Language | L5, L8 | Visual references, image descriptions |

### 6.3 With the Content Compiler

The EIS does not replace the Content Compiler (Phase 4). It feeds it. The EIS generates content following the Content Architecture's block structure (hero, intro, body, pull-quote, image, etc.) and the compiler validates, resolves relationships, and generates TypeScript index files.

### 6.4 With the React Application

Content flows:

```
EIS → Content Writer → Content Units (src/content/) → Content Compiler → Generated Index Files (src/data/__generated__/) → Content Service (src/services/contentService.ts) → React Components
```

The EIS's role ends when content is written to `src/content/`. The existing pipeline takes over.

---

## 7. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| EIS | Editorial Intelligence System |
| EOS | Editorial Operating System |
| Content Mandate | Explicit statement of what a content unit must accomplish |
| Brand Boundary Set | Inviolable constraints derived from HOP's identity |
| Knowledge State | Complete set of verified facts relevant to a content unit |
| Narrative Architecture | Structural design of a content unit's story |
| Editorial Cognition | Moment-to-moment reasoning about editorial decisions |
| Revision Pass | Independent review against a single quality dimension |
| Overall Quality Index | Weighted composite score of content quality |
| Memory Density | Concentration of memorable elements per 100 words |
| Narrative Compression | Proportion of words essential to meaning |
| Luxury Restraint | Absence of claimed luxury language |
| Specificity Index | Proportion of specific vs. generic nouns and verbs |
| Sensory Authenticity | Proportion of specific vs. generic sensory language |

### Appendix B: Layer Interface Contracts

Each layer accepts and produces structured data. The formal interfaces are defined below in TypeScript-like notation.

```
interface Layer1Input {
  contentRequest: ContentRequest;
  brandDocuments: BrandDocument[];
}

interface Layer1Output {
  brandBoundarySet: BrandConstraint[];
  identityMarkers: IdentityMarker[];
  brandProhibitions: Prohibition[];
  voiceParameters: VoiceDimension[];
}

interface Layer2Input {
  contentRequest: ContentRequest;
  brandBoundarySet: BrandConstraint[];
  personaDocuments: PersonaDocument[];
  culturalDocuments: CulturalDocument[];
}

interface Layer2Output {
  readerModel: ReaderIdentityModel;
  culturalFrame: CulturalContextFrame;
  generationalPerspective: GenerationalPosition;
  valuePriorities: ValueHierarchy;
  trustBaseline: TrustLevel;
}

// Additional interfaces defined for all 10 layers
// in the full specification.
```

### Appendix C: Versioning and Review

| Element | Policy |
|---------|--------|
| Major version | Architecture redesign, layer addition/removal |
| Minor version | Layer specification changes, new heuristics, pass additions |
| Patch version | Formula corrections, threshold adjustments, documentation fixes |
| Review cycle | Quarterly. Next review: October 2026. |
| Ownership | Editorial Lead |
| Change approval | Architecture Review Board (Editorial Lead + Technical Lead + Brand Lead) |

---

**End of Document**

**Version:** 1.0
**Status:** Draft for Review
**Classification:** Internal — House of Padmavati
**Author:** Principal Editorial Systems Architect
**Next Review:** October 2026