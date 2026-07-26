# Editorial Production System Architecture Specification

**Version:** 1.0
**Status:** Draft for Review
**Classification:** Internal — House of Padmavati
**Author:** Principal Editorial Systems Architect
**Review Cycle:** Quarterly

---

## Table of Contents

1. Executive Summary
2. Architecture Overview
3. Production Pipeline
4. Content-Type Workflows
5. Page Specification
6. Editorial Lifecycle
7. Quality Gates
8. AI + Human Collaboration Model
9. Folder Structure
10. Reusable Templates
11. Workflow Automation Classification
12. Self-Review
13. Appendices

---

## 1. Executive Summary

The Editorial Production System (EPS) is the operational layer that transforms editorial intelligence into production-ready content. It sits between the Editorial Operating System (EOS — *what HOP knows*) and the Editorial Intelligence System (EIS — *how HOP thinks*) and the published page (*what the reader experiences*).

The EPS answers one question: **How is world-class content consistently produced?**

This document specifies the complete production architecture: a 12-stage deterministic pipeline, 14 content-type workflows, a 28-field Page Specification, an 8-gate quality system, an AI/human collaboration model, and 10 reusable production templates.

The EPS is designed for:
- **Determinism:** The same inputs always produce the same workflow
- **Repeatability:** Every page follows the same production stages
- **Scalability:** The workflow handles one page or one hundred
- **Auditability:** Every editorial decision is traceable through the pipeline
- **Versioning:** Every artifact is versioned and trackable

The EPS does not replace the EOS or EIS. It operationalises them. The EOS governs *what is true*. The EIS governs *how to reason*. The EPS governs *how to produce*.

### Production Principles

| Principle | Meaning |
|-----------|---------|
| Research before writing | No drafting without a complete knowledge state |
| Thinking before wording | No sentences without editorial decisions |
| Planning before drafting | No drafting without a narrative plan |
| Revision before publication | No publishing without passing all gates |
| Evidence before claims | No unverifiable claims in published content |
| Narrative before sentences | No wording without story structure |
| Editorial review before approval | No approval without human editorial review |
| Quality before speed | No deadline justifies skipping a gate |
| Consistency before creativity | Follow the workflow before innovating |

### Relationship to Existing Systems

| System | Role | EPS Integration |
|--------|------|----------------|
| Editorial Operating System | What HOP knows | EPS calls EOS documents as context at specific pipeline stages |
| Editorial Intelligence System | How HOP thinks | EPS invokes EIS layers (6-10) as automated pipeline stages |
| Content Compiler (Phase 4) | Validates + generates TS indexes | EPS Stage 11 (Publication) runs compiler as final validation |
| AI Prompt Library | Task-specific instructions | EPS templates reference prompt library by content type |

---

## 2. Architecture Overview

### 2.1 The Production Pipeline

```
CONTENT REQUEST
      │
      ▼
┌──────────────────────────────────────────────────────────────────┐
│  Stage 1:  Intake & Specification                                │
│  Output: Page Specification Document                             │
├──────────────────────────────────────────────────────────────────┤
│  Stage 2:  Research & Knowledge Assembly                         │
│  Output: Knowledge State + Research Brief                        │
├──────────────────────────────────────────────────────────────────┤
│  Stage 3:  Editorial Briefing & Strategy                         │
│  Output: Editorial Brief                                         │
├──────────────────────────────────────────────────────────────────┤
│  Stage 4:  Narrative & Cognitive Planning                        │
│  Output: Narrative Plan                                          │
├──────────────────────────────────────────────────────────────────┤
│  Stage 5:  Drafting (EIS Execution)                              │
│  Output: Content Draft                                           │
├──────────────────────────────────────────────────────────────────┤
│  Stage 6:  AI Self-Review (12-Pass)                              │
│  Output: Revision Report + Revised Draft                         │
├──────────────────────────────────────────────────────────────────┤
│  Stage 7:  Human Editorial Review                                │
│  Output: Editorial Review                                        │
├──────────────────────────────────────────────────────────────────┤
│  Stage 8:  Subject Matter Review (Conditional)                   │
│  Output: Subject Matter Review                                   │
├──────────────────────────────────────────────────────────────────┤
│  Stage 9:  Quality Verification                                  │
│  Output: Quality Score Card                                       │
├──────────────────────────────────────────────────────────────────┤
│  Stage 10: Approval                                              │
│  Output: Approval Sheet                                          │
├──────────────────────────────────────────────────────────────────┤
│  Stage 11: Publication                                           │
│  Output: Published Content Unit                                  │
├──────────────────────────────────────────────────────────────────┤
│  Stage 12: Post-Publication Review                               │
│  Output: Performance Review                                       │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Pipeline Characteristics

| Characteristic | Specification |
|----------------|---------------|
| Determinism | Same inputs → same workflow. Content type determines which stages execute and in what order |
| Stage independence | Each stage produces a structured artifact consumed by the next. No stage reaches into another |
| Conditional execution | Stages 4 (Narrative Plan), 8 (Subject Review), 12 (Post-Publication) are content-type conditional |
| Iteration | Stages 6-8 form a review loop. Content may iterate through these stages multiple times |
| Escalation | If Stage 9 quality score is below threshold, content returns to Stage 5 (not to Stage 1) |
| Fail-fast | Any gate failure stops the pipeline. Content cannot advance with unpassed gates |

### 2.3 Pipeline States

| State | Meaning |
|-------|---------|
| Created | Content request received, not yet started |
| In Research | Stage 1-2 in progress |
| In Planning | Stage 3-4 in progress |
| In Drafting | Stage 5 in progress |
| In Review | Stage 6-8 in progress |
| In Verification | Stage 9 in progress |
| Awaiting Approval | Stage 10 pending |
| Published | Stage 11 complete |
| In Monitoring | Stage 12 active |
| Archived | No longer actively monitored |

---

## 3. Production Pipeline — Stage Specifications

Each stage follows the engineering format: Purpose, Inputs, Outputs, Owner, Dependencies, Quality Gates, Success Criteria, Failure Modes, Recovery Strategy, Versioning.

---

### Stage 1: Intake & Specification

| Element | Specification |
|---------|---------------|
| **Purpose** | Receive the content request, validate its completeness, triage priority, and produce a complete Page Specification |
| **Inputs** | Content request (type, page, topic, format, deadline), business priority, content calendar slot |
| **Outputs** | Page Specification Document (28 fields, §5), assigned priority, estimated effort, assigned owner |
| **Owner** | Editorial Lead |
| **Dependencies** | Content calendar. Page strategy (if exists — can be created fresh) |
| **Quality Gates** | Gate 1 — Knowledge Complete. Gate 2 — Spec Approved |
| **Success Criteria** | Page Specification is complete, approved, and assigned |
| **Failure Modes** | Incomplete request (missing content type, topic, or page). Missing business priority. Deadline conflicts with calendar |
| **Recovery Strategy** | Return to requester with specific gaps. Hold in "Created" state until complete |
| **Versioning** | Page Specification gets version 0.1 at creation. Updated through Stages 2-4. Finalised at Stage 3 |

**Stage 1 Workflow:**

1. Receive content request (from calendar, editor, or business need)
2. Validate request completeness (content type, page, topic, format, deadline)
3. Triage priority (P0-P3 based on business impact and calendar slot)
4. Assign owner (Editorial Lead or designated editor)
5. Map to page strategy (if exists) or flag as needing new page strategy
6. Draft Page Specification (§5) — initially populated from page strategy template
7. Submit for Gate 2 approval (Editorial Lead approves spec)
8. Advance to Stage 2

---

### Stage 2: Research & Knowledge Assembly

| Element | Specification |
|---------|---------------|
| **Purpose** | Gather all knowledge required for the content. Produce a complete Knowledge State with verifiable facts |
| **Inputs** | Page Specification (from Stage 1), Brand Boundary Set (EIS Layer 1 output) |
| **Outputs** | Knowledge State (§5 field 17), Research Brief, Source Map, Knowledge Gap Report |
| **Owner** | AI (retrieval) + Editorial Lead (verification) |
| **Dependencies** | EIS Layer 5 (Knowledge Architecture & Grounding). EOS Knowledge Base (docs/research/) |
| **Quality Gates** | Gate 1 — Knowledge Complete |
| **Success Criteria** | Every claim required by the Page Specification has a verifiable source. Knowledge gaps are explicitly documented |
| **Failure Modes** | Critical knowledge gap cannot be filled (content cannot proceed). Conflicting sources (requires editorial judgment). Source staleness (outdated research) |
| **Recovery Strategy** | Critical gaps: escalate to Editorial Lead for decision (proceed with gap flagged or pause). Conflicts: Editorial Lead adjudicates. Staleness: flag for Knowledge Base update |
| **Versioning** | Knowledge State version matches Page Specification version |

**Stage 2 Workflow:**

1. Map Page Specification fields to knowledge domains (craft, culture, customer, competitor, visual)
2. AI retrieves relevant facts from Knowledge Base
3. AI cross-references for contradictions
4. AI produces Knowledge State + Source Map + Gap Report
5. Editorial Lead reviews Knowledge State for completeness
6. Editorial Lead adjudicates conflicts and gaps
7. If critical gap exists → escalate (pause or flag)
8. Submit for Gate 1 (Knowledge Complete)
9. Advance to Stage 3

---

### Stage 3: Editorial Briefing & Strategy

| Element | Specification |
|---------|---------------|
| **Purpose** | Define the editorial strategy — what this content must accomplish, for whom, with what emotion, and with what CTA |
| **Inputs** | Page Specification (from Stage 1), Knowledge State (from Stage 2), Brand Boundary Set (EIS Layer 1) |
| **Outputs** | Editorial Brief (§5 fields 1-16 completed), Content Mandate |
| **Owner** | Editorial Lead (strategy) + AI (drafting) |
| **Dependencies** | EIS Layer 4 (Editorial Strategy & Intent). EOS Emotional Architecture, Page Strategy |
| **Quality Gates** | Gate 3 — Brief Approved |
| **Success Criteria** | Editorial Brief is complete, approved, and ready for narrative planning |
| **Failure Modes** | Conflicting goals (business goal conflicts with emotional goal). Unrealistic CTA for content type. Emotional target not supported by Knowledge State |
| **Recovery Strategy** | Editorial Lead reconciles conflicts. If emotional target cannot be supported by Knowledge State, adjust target or adjust research |
| **Versioning** | Editorial Brief version 1.0 at creation. Updates possible through Stage 4 |

**Stage 3 Workflow:**

1. AI drafts Editorial Brief from Page Specification + Knowledge State
2. Editorial Lead reviews and refines strategy
3. Primary/secondary emotion selected from emotional architecture
4. Primary CTA designed (one only)
5. SEO mandate drafted (target keywords, search intent)
6. Success criteria defined
7. Submit for Gate 3 approval (Editorial Lead signs off)
8. Advance to Stage 4

---

### Stage 4: Narrative & Cognitive Planning

| Element | Specification |
|---------|---------------|
| **Purpose** | Design the narrative architecture — arc, scene structure, tension curve, tone registers, and identity transformation |
| **Inputs** | Editorial Brief (from Stage 3), Knowledge State (from Stage 2), Page Specification (from Stage 1) |
| **Outputs** | Narrative Plan (§5 fields 18-22 completed), Scene Sequence |
| **Owner** | AI (design) + Editorial Lead (approval) |
| **Dependencies** | EIS Layer 6 (Narrative Intelligence). EIS Layer 7 (Editorial Cognition question set) |
| **Quality Gates** | Gate 3 — Brief Approved (reuse from Stage 3) |
| **Success Criteria** | Narrative Plan is complete, coherent, and approved |
| **Failure Modes** | Arc type incompatible with content type. Scene sequence contradicts emotional journey. Tone registers conflict with brand voice |
| **Recovery Strategy** | Editorial Lead adjusts arc type or scene sequence. AI redesigns based on feedback |
| **Versioning** | Narrative Plan version matches Editorial Brief version |

**Stage 4 Workflow:**

1. AI selects narrative arc type based on content type and emotional target
2. AI designs tension curve matching emotional journey
3. AI constructs scene sequence (each scene: purpose, emotion, sensory anchor, tone register)
4. AI plans curiosity architecture and identity transformation
5. AI plans resolution design
6. Editorial Lead reviews Narrative Plan
7. If revisions needed → AI redesigns → Editorial Lead reviews
8. Once approved → advance to Stage 5

---

### Stage 5: Drafting (EIS Execution)

| Element | Specification |
|---------|---------------|
| **Purpose** | Execute the editorial cognition and language architecture to produce the first draft |
| **Inputs** | Narrative Plan (from Stage 4), Editorial Brief (from Stage 3), Knowledge State (from Stage 2), Brand Boundary Set, all EIS context |
| **Outputs** | Content Draft (first version) |
| **Owner** | AI (execution) |
| **Dependencies** | EIS Layer 7 (Editorial Cognition — 14-question framework). EIS Layer 8 (Language Architecture — sentence engine). EOS Vocabulary System, Voice Bible |
| **Quality Gates** | Gate 4 — Draft Complete (automatic — draft produced) |
| **Success Criteria** | First draft is complete, follows Narrative Plan, uses brand-compliant language, respects all constraints |
| **Failure Modes** | Draft deviates from Narrative Plan. Forbidden words present. Knowledge contradicted. AI clichés present |
| **Recovery Strategy** | Most issues caught by Stage 6 (AI Self-Review). If Stage 5 produces fundamentally flawed draft, return to Stage 4 |
| **Versioning** | Draft version 1.0. Iterates through Stages 6-8 |

**Stage 5 Workflow:**

1. AI loads all context (brand, reader, strategy, knowledge, narrative, editorial, language)
2. For each scene in Narrative Plan:
   a. AI executes Editorial Cognition (14-question framework per moment)
   b. AI executes Language Architecture (sentence construction per tone register)
   c. AI verifies against Brand Boundary Set
3. AI produces complete draft
4. Draft tagged with metadata (word count, sensory density, reading level)
5. Advance to Stage 6

---

### Stage 6: AI Self-Review (12-Pass Revision)

| Element | Specification |
|---------|---------------|
| **Purpose** | Run the 12-pass Revision Intelligence system on the draft. Identify, diagnose, and auto-fix quality issues |
| **Inputs** | Content Draft (from Stage 5), all upstream artifacts |
| **Outputs** | Revision Report, Revised Draft |
| **Owner** | AI (all 12 passes) |
| **Dependencies** | EIS Layer 9 (Revision Intelligence — 12-pass system) |
| **Quality Gates** | Gate 4 — Draft Complete |
| **Success Criteria** | All critical and important findings resolved. Residual issues documented in Revision Report |
| **Failure Modes** | Critical finding cannot be auto-fixed (requires human). Conflicting revision suggestions between passes. Over-correction that damages voice |
| **Recovery Strategy** | Critical unfixable findings escalated to Stage 7 (Human Editorial Review). Conflicting suggestions resolved by Editorial Lead |
| **Versioning** | Draft version increments (1.1, 1.2, etc.) with each revision pass |

**Stage 6 Workflow:**

1. Run 12 Revision Passes (§3.9 of EIS-AS v1.0):
   - Truth Audit → Brand Fidelity → Evidence Audit → Emotional Verification → Narrative Cohesion → Sensory Density → Compression → Sentence Music → Vocabulary Audit → Accessibility → SEO → Cultural Authenticity
2. For each pass: classify findings (critical / important / minor)
3. Apply auto-fixable changes
4. Compile Revision Report with residual issues
5. If residual critical issues exist → flag for Stage 7
6. If no critical issues → advance to Stage 7

---

### Stage 7: Human Editorial Review

| Element | Specification |
|---------|---------------|
| **Purpose** | Human editor reads the draft against the Editorial Brief, Page Specification, and Brand standards. Exercises editorial judgment that AI cannot |
| **Inputs** | Revised Draft (from Stage 6), Revision Report (from Stage 6), Editorial Brief (from Stage 3), Page Specification (from Stage 1) |
| **Outputs** | Editorial Review, Revised Draft (v2) |
| **Owner** | Editorial Lead (human) |
| **Dependencies** | EOS Editorial Principles, Voice Bible, Vocabulary System |
| **Quality Gates** | Gate 5 — Human Review Passed |
| **Success Criteria** | Editorial Lead approves content for advancement. No unresolvable editorial concerns |
| **Failure Modes** | Editorial Lead identifies fundamental strategy flaw (return to Stage 3). Editorial Lead identifies narrative flaw (return to Stage 4). Editorial Lead identifies voice issue that AI cannot fix |
| **Recovery Strategy** | Return to appropriate earlier stage. Document the reason for return in Revision Report |
| **Versioning** | Draft version 2.0 after human review |

**Stage 7 Workflow:**

1. Editorial Lead reads draft completely
2. Editorial Lead checks against Editorial Brief:
   - Does it serve the purpose?
   - Does it create the intended emotion?
   - Is the CTA effective?
3. Editorial Lead applies editorial judgment:
   - Voice: does this sound like HOP?
   - Specificity: is every claim specific enough?
   - Restraint: what should be removed?
   - Cultural: is every cultural reference accurate?
4. Editorial Lead reviews AI Revision Report
   - Are all critical findings resolved?
   - Does the Editorial Lead agree with the severity classification?
5. If revisions needed → Editorial Lead makes changes or returns to AI
6. If draft requires subject matter expertise → advance to Stage 8
7. If draft is editorial-ready → advance to Stage 9

---

### Stage 8: Subject Matter Review (Conditional)

| Element | Specification |
|---------|---------------|
| **Purpose** | Verify craft, cultural, and technical accuracy with a subject matter expert. Only triggered for content requiring specialised knowledge |
| **Inputs** | Revised Draft (v2 from Stage 7), Knowledge State (from Stage 2), Source Map |
| **Outputs** | Subject Matter Review |
| **Owner** | Subject Matter Expert (Craft Advisor, Cultural Advisor, or Technical Expert) |
| **Dependencies** | Knowledge Base (craft and cultural research). SME availability |
| **Quality Gates** | Gate 6 — Subject Matter Verified |
| **Success Criteria** | SME confirms all craft, cultural, and technical claims are accurate and appropriately framed |
| **Failure Modes** | Factual error identified (return to Stage 2). Cultural framing inappropriate (return to Stage 7). Missing research (return to Stage 2) |
| **Recovery Strategy** | Return to appropriate stage. SME provides corrected information |
| **Versioning** | Draft version 2.1 after SME review |

**When Stage 8 triggers:**

| Content Type | Subject Matter Required |
|--------------|------------------------|
| Product Detail — Craft-heavy | Yes — Craft Advisor |
| Weaver Story | Yes — Craft Advisor |
| Craft Story | Yes — Craft Advisor |
| Collection Detail — Technical | Yes — Craft Advisor |
| Journal Article — Cultural | Yes — Cultural Advisor |
| FAQ — Craft | Yes — Craft Advisor |
| Policies — Legal | Yes — Legal Review |
| Email — Campaign | Conditional — Brand Lead |
| All other types | No |

**Stage 8 Workflow:**

1. SME receives draft + Knowledge State + Source Map
2. SME reviews all craft/cultural/technical claims
3. SME verifies:
   - Weaver names, places, techniques are correct
   - Cultural references are accurate and respectful
   - Technical details are precise
4. SME produces review with findings
5. If corrections needed → Editorial Lead applies corrections
6. If content requires re-review → return to Stage 7
7. If content is verified → advance to Stage 9

---

### Stage 9: Quality Verification

| Element | Specification |
|---------|---------------|
| **Purpose** | Run EIS Layer 10 Editorial Scoring against the final draft. Verify score meets threshold for content type |
| **Inputs** | Final Draft (from Stage 7 or 8), Content Mandate, Page Specification |
| **Outputs** | Quality Score Card, Overall Quality Index |
| **Owner** | AI (scoring) |
| **Dependencies** | EIS Layer 10 (15-heuristic scoring model). Per-content-type threshold table |
| **Quality Gates** | Gate 7 — Quality Score Above Threshold |
| **Success Criteria** | OQI meets or exceeds content-type threshold |
| **Failure Modes** | Score below threshold. Single heuristic critically low (e.g., Cultural Authenticity = 0.0). Score conflicts with human editorial judgment |
| **Recovery Strategy** | If below threshold → return to Stage 5 (drafting) or Stage 7 (human review) depending on deficiency pattern. If conflict with human judgment → Editorial Lead overrides with documented reason |
| **Versioning** | Quality Score Card version matches draft version |

**Per-Content-Type Thresholds:**

| Content Type | OQI Threshold | Critical Heuristic Minimum |
|--------------|---------------|---------------------------|
| Homepage | 0.85 | Emotional Precision ≥ 0.80, Luxury Restraint = 1.0 |
| About | 0.85 | Identity Signaling ≥ 0.80, Cultural Authenticity ≥ 0.80 |
| Collection Landing | 0.80 | Narrative Cohesion ≥ 0.75 |
| Collection Detail | 0.80 | Specificity Index ≥ 0.70, Luxury Restraint ≥ 0.90 |
| Product Detail | 0.85 | Trust Formation ≥ 0.80, Luxury Restraint = 1.0 |
| Journal Article | 0.80 | Memory Density ≥ 0.75, Cultural Authenticity ≥ 0.80 |
| Craft Story | 0.80 | Specificity Index ≥ 0.75, Cultural Authenticity ≥ 0.80 |
| Weaver Story | 0.85 | Memory Density ≥ 0.80, Identity Signaling ≥ 0.75 |
| FAQ | 0.70 | Truth = 1.0 (every claim verified) |
| Policies | 0.70 | Truth = 1.0, Luxury Restraint = 1.0 |
| Email | 0.80 | Emotional Precision ≥ 0.75 |
| Campaign | 0.85 | Emotional Precision ≥ 0.80, Luxury Restraint ≥ 0.90 |
| Lookbook | 0.80 | Reader Visualization ≥ 0.75 |
| Landing Page | 0.80 | Narrative Cohesion ≥ 0.75 |

**Stage 9 Workflow:**

1. AI computes all 15 heuristics against final draft
2. AI computes Overall Quality Index with content-type weights
3. AI checks each heuristic against its minimum
4. If OQI ≥ threshold → advance to Stage 10
5. If OQI < threshold → generate improvement recommendations, return to Stage 5 or 7
6. If Editorial Lead disagrees with score → override with documented reason

---

### Stage 10: Approval

| Element | Specification |
|---------|---------------|
| **Purpose** | Final human sign-off. Verify all gates passed, all reviews complete, all issues resolved |
| **Inputs** | Final Draft, Quality Score Card, Revision Report, Editorial Review, Subject Matter Review (if applicable), Page Specification |
| **Outputs** | Approval Sheet (signed), Publication Readiness Confirmation |
| **Owner** | Editorial Lead (final signatory) + Editor-in-Chief (for major pieces) |
| **Dependencies** | All previous stages complete. All gates passed |
| **Quality Gates** | Gate 8 — Final Approval |
| **Success Criteria** | Approval Sheet signed. Content flagged as publication-ready |
| **Failure Modes** | Unresolved issue discovered during final read. Brand concern surfaced at last minute. Stakeholder disagreement |
| **Recovery Strategy** | Return to appropriate stage based on issue type. Escalation path: Editorial Lead → Editor-in-Chief → Brand Lead |
| **Versioning** | Approval Sheet version matches final draft version |

**Approval Chains by Content Type:**

| Content Type | Approver 1 | Approver 2 (if needed) |
|--------------|-----------|------------------------|
| Homepage | Editorial Lead | Editor-in-Chief |
| About | Editorial Lead | Editor-in-Chief |
| Collection Landing | Editorial Lead | — |
| Collection Detail | Editorial Lead | — |
| Product Detail | Editorial Lead | — |
| Journal Article | Editorial Lead | Editor-in-Chief |
| Craft Story | Editorial Lead | Craft Advisor (conditional) |
| Weaver Story | Editorial Lead | Craft Advisor |
| FAQ | Editorial Lead | — |
| Policies | Editorial Lead | Legal (conditional) |
| Email | Editorial Lead | Brand Lead (campaigns only) |
| Campaign | Editorial Lead | Brand Lead + Editor-in-Chief |
| Lookbook | Editorial Lead | — |
| Landing Page | Editorial Lead | Editor-in-Chief |

**Stage 10 Workflow:**

1. Editorial Lead reviews all pipeline artifacts (Spec, Brief, Knowledge, Narrative, Draft, Reviews, Score)
2. Editorial Lead verifies all 8 quality gates are passed
3. Editorial Lead does final read of content
4. If major piece → Editor-in-Chief does final read
5. Approval Sheet signed
6. Content flagged as publication-ready
7. Advance to Stage 11

---

### Stage 11: Publication

| Element | Specification |
|---------|---------------|
| **Purpose** | Transform final draft into a production content unit, validate with Content Compiler, deploy |
| **Inputs** | Final Draft + Approval Sheet (from Stage 10), Page Specification, Content Architecture schema |
| **Outputs** | Published Content Unit (src/content/{type}/{slug}/), compiler validation report |
| **Owner** | Editorial Lead (content creation) + Developer (deployment) |
| **Dependencies** | Content Compiler (scripts/compile-content.js). Runtime Content Architecture (src/content/). Git workflow |
| **Quality Gates** | Gate 8 — Final Approval (reuse) |
| **Success Criteria** | Content unit passes compiler validation. Renders correctly on staging. Merged to main. Published on production |
| **Failure Modes** | Compiler validation error. Image missing. Frontmatter field incorrect. Slug conflict. Rendering issue on staging |
| **Recovery Strategy** | Fix validation errors. Re-run compiler. Re-verify on staging |
| **Versioning** | Content unit slug is stable (no version in URL). Content unit frontmatter includes `version` field matching Page Specification version |

**Stage 11 Workflow:**

1. Create content directory: `src/content/{type}/{slug}/`
2. Write `index.md` with complete frontmatter and body blocks
3. Add hero image and in-body images (from visual direction in Page Specification)
4. Run Content Compiler: `npm run content:build`
5. Fix any compiler validation errors
6. Verify on staging environment
7. Create pull request with content unit
8. Merge to main branch
9. Verify on production
10. Update content calendar (published date, URL)
11. Advance to Stage 12

---

### Stage 12: Post-Publication Review

| Element | Specification |
|---------|---------------|
| **Purpose** | Monitor content performance, collect feedback, identify improvement opportunities |
| **Inputs** | Published Content Unit (from Stage 11), Page Specification (success criteria) |
| **Outputs** | Performance Review, Improvement Recommendations |
| **Owner** | Editorial Lead |
| **Dependencies** | Analytics data (time on page, scroll depth, CTA clicks, bounce rate, return visits) |
| **Success Criteria** | Performance review completed at 7 days, 30 days, and 90 days post-publication |
| **Failure Modes** | Content underperforms against success criteria. Reader feedback identifies issue. Competitor content outperforms |
| **Recovery Strategy** | If critical underperformance → return to appropriate pipeline stage for revision. If minor → flag for next review cycle |
| **Versioning** | Performance Review version 1.0 (7d), 2.0 (30d), 3.0 (90d) |

**Stage 12 Workflow:**

1. **7 days post-publication:**
   - Check analytics against success criteria
   - Collect any reader feedback
   - Document preliminary findings
2. **30 days post-publication:**
   - Deep analytics review (time on page, scroll depth, CTA performance)
   - Compare against similar content types
   - Produce Performance Review v2
3. **90 days post-publication:**
   - Comprehensive performance review
   - Improvement recommendations for revision or future content
   - Archive or flag for revision

---

## 4. Content-Type Workflows

Each content type follows the same 12-stage pipeline with content-type-specific variations in:

- Approval chain (Stage 10)
- Subject matter review requirement (Stage 8)
- Knowledge domains needed (Stage 2)
- Narrative arc defaults (Stage 4)
- Quality score thresholds (Stage 9)
- Publication process (Stage 11)
- Post-publication review focus (Stage 12)

### Workflow Variation Matrix

| Content Type | Stages Always | Stages Conditional | Approvers | SME Review | Default Arc | OQI Threshold |
|-------------|---------------|-------------------|-----------|------------|-------------|---------------|
| Homepage | 1,2,3,5,6,7,9,10,11,12 | 4 (narrative plan), 8 (no) | EL + EIC | No | Journey | 0.85 |
| About | 1,2,3,5,6,7,9,10,11,12 | 4, 8 (no) | EL + EIC | No | Portrait | 0.85 |
| Collection Landing | 1,2,3,4,5,6,7,9,10,11 | 8 (no), 12 (optional) | EL | No | Journey | 0.80 |
| Collection Detail | 1,2,3,4,5,6,7,9,10,11 | 8 (conditional — technical), 12 (optional) | EL | Craft (if technical) | Journey | 0.80 |
| Product Detail | 1,2,3,4,5,6,7,9,10,11 | 8 (conditional — craft-heavy), 12 (optional) | EL | Craft (if craft-heavy) | Revelation | 0.85 |
| Journal Article | 1,2,3,4,5,6,7,9,10,11,12 | 8 (conditional — cultural) | EL + EIC | Cultural (if cultural topic) | Transformation | 0.80 |
| Craft Story | 1,2,3,4,5,6,7,8,9,10,11 | 12 (optional) | EL | Craft Advisor — always | Instruction | 0.80 |
| Weaver Story | 1,2,3,4,5,6,7,8,9,10,11,12 | none | EL | Craft Advisor — always | Portrait | 0.85 |
| FAQ | 1,2,3,5,6,7,9,10,11 | 4 (no — no narrative), 8 (conditional — craft), 12 (optional) | EL | Craft (if craft FAQ) | None (Q&A structure) | 0.70 |
| Policies | 1,2,3,5,6,7,9,10,11 | 4 (no), 8 (conditional — legal), 12 (no) | EL | Legal (if needed) | None (document structure) | 0.70 |
| Email | 1,2,3,5,6,7,9,10,11 | 4 (minimal), 8 (conditional — campaign), 12 (optional) | EL | Brand (if campaign) | Revelation | 0.80 |
| Campaign | 1,2,3,4,5,6,7,8,9,10,11,12 | none | EL + BL + EIC | Brand Lead — always | Transformation | 0.85 |
| Lookbook | 1,2,3,4,5,6,7,9,10,11 | 8 (no), 12 (optional) | EL | No | Journey | 0.80 |
| Landing Page | 1,2,3,4,5,6,7,9,10,11,12 | 8 (no) | EL + EIC | No | Journey | 0.80 |

**Legend:** EL = Editorial Lead, EIC = Editor-in-Chief, BL = Brand Lead, SME = Subject Matter Expert

---

## 5. Page Specification

The Page Specification is the master document for every page. It contains 28 fields across 8 sections. Every page in the HOP production system has exactly one Page Specification.

### Specification Fields

#### Section A: Identity (Fields 1-3)

| # | Field | Description | Populated At | Populated By |
|---|-------|-------------|-------------|--------------|
| 1 | **Page Name** | Canonical name (e.g., "Homepage", "Product Detail — Kanchipuram Silk") | Stage 1 | Editorial Lead |
| 2 | **Route** | URL path (e.g., `/`, `/product/:productId`, `/journal/:slug`) | Stage 1 | Editorial Lead |
| 3 | **Content Type** | One of: Homepage, About, Collection Landing, Collection Detail, Product Detail, Journal Article, Craft Story, Weaver Story, FAQ, Policies, Email, Campaign, Lookbook, Landing Page | Stage 1 | Editorial Lead |

#### Section B: Purpose & Goals (Fields 4-9)

| # | Field | Description | Populated At | Populated By |
|---|-------|-------------|-------------|--------------|
| 4 | **Purpose** | Why this page exists. One sentence. | Stage 3 | Editorial Brief (AI + EL) |
| 5 | **Business Goal** | What this page must accomplish for HOP (measurable) | Stage 3 | Editorial Brief (AI + EL) |
| 6 | **User Goal** | What the woman visiting this page wants | Stage 3 | Editorial Brief (AI) |
| 7 | **Reader Intent** | What search intent or browsing intent brings her here | Stage 3 | Editorial Brief (AI) |
| 8 | **Customer Journey Stage** | One of: Arrival, Curiosity, Wonder, Trust, Desire, Confidence, Ownership, Belonging, Legacy | Stage 3 | Editorial Brief (EL) |
| 9 | **Brand Goal** | What brand relationship outcome this page serves | Stage 3 | Editorial Brief (EL) |

#### Section C: Emotional & Trust Architecture (Fields 10-13)

| # | Field | Description | Populated At | Populated By |
|---|-------|-------------|-------------|--------------|
| 10 | **Primary Emotion** | The dominant feeling this page should create | Stage 3 | Editorial Brief (EL, from EOS) |
| 11 | **Secondary Emotion** | The supporting feeling that reinforces the primary | Stage 3 | Editorial Brief (EL, from EOS) |
| 12 | **Trust Goal** | What trust this page must build or reinforce | Stage 3 | Editorial Brief (EL) |
| 13 | **Emotional Arc** | How emotion changes from page entry to exit | Stage 4 | Narrative Plan (AI) |

#### Section D: Reader & Audience (Fields 14-16)

| # | Field | Description | Populated At | Populated By |
|---|-------|-------------|-------------|--------------|
| 14 | **Primary Persona** | Which persona(s) this page is primarily for | Stage 2 | AI (from EOS personas) |
| 15 | **Reader Identity Model** | Who the reader is in her full human context | Stage 2 | AI (EIS Layer 2) |
| 16 | **Processing Model** | How the reader processes this page (System 1/2, trust mechanisms, attention map) | Stage 2 | AI (EIS Layer 3) |

#### Section E: Knowledge & Research (Fields 17-18)

| # | Field | Description | Populated At | Populated By |
|---|-------|-------------|-------------|--------------|
| 17 | **Knowledge State** | Complete set of verified facts relevant to this page | Stage 2 | AI (EIS Layer 5) |
| 18 | **Required Research** | Specific research documents or knowledge domains needed | Stage 1 | Editorial Lead |

#### Section F: SEO & Content Strategy (Fields 19-21)

| # | Field | Description | Populated At | Populated By |
|---|-------|-------------|-------------|--------------|
| 19 | **SEO Intent** | Search intent this page serves (informational, transactional, navigational) | Stage 3 | Editorial Brief (AI) |
| 20 | **Primary Keyword** | Target keyword for this page | Stage 3 | Editorial Brief (AI + EL) |
| 21 | **Content Priority** | What the reader should see first, second, third | Stage 3 | Editorial Brief (EL) |

#### Section G: Narrative & CTA (Fields 22-25)

| # | Field | Description | Populated At | Populated By |
|---|-------|-------------|-------------|--------------|
| 22 | **Primary Narrative** | The dominant story this page tells | Stage 4 | Narrative Plan (AI) |
| 23 | **Secondary Narrative** | Supporting narrative layer (if applicable) | Stage 4 | Narrative Plan (AI) |
| 24 | **Narrative Architecture** | Arc type, tension curve, scene sequence, tone registers | Stage 4 | Narrative Plan (AI) |
| 25 | **Primary CTA** | The single most important action on this page | Stage 3 | Editorial Brief (EL) |

#### Section H: Production Requirements (Fields 26-28)

| # | Field | Description | Populated At | Populated By |
|---|-------|-------------|-------------|--------------|
| 26 | **Writing Requirements** | Specific constraints for drafting (tone, register, vocabulary focus) | Stage 4 | Narrative Plan (AI + EL) |
| 27 | **Revision Requirements** | Which revision passes are mandatory for this content type | Stage 6 | AI (from content-type defaults) |
| 28 | **Accessibility Notes** | Specific accessibility requirements for this page type | Stage 1 | Editorial Lead |

### Specification Lifecycle

| State | Meaning |
|-------|---------|
| Draft (0.1) | Created at Stage 1, being populated |
| In Review | Fields populated, awaiting approval |
| Approved (1.0) | Signed off by Editorial Lead. Pipeline proceeds |
| Superseded (2.0) | Updated for revision cycle. Previous version archived |

---

## 6. Editorial Lifecycle

The lifecycle spans from idea to archival. Each lifecycle stage maps to one or more pipeline stages.

```
IDEA
  │
  ▼
RESEARCH ───────────────── Stage 2
  │
  ▼
SPECIFICATION ──────────── Stage 1
  │
  ▼
BRIEFING ───────────────── Stage 3
  │
  ▼
PLANNING ───────────────── Stage 4
  │
  ▼
DRAFTING ───────────────── Stage 5
  │
  ▼
REVIEW ─────────────────── Stages 6-8
  │
  ▼
VERIFICATION ───────────── Stage 9
  │
  ▼
APPROVAL ───────────────── Stage 10
  │
  ▼
PUBLICATION ────────────── Stage 11
  │
  ▼
MONITORING ─────────────── Stage 12
  │
  ▼
IMPROVEMENT ────────────── Revision cycle (returns to Stage 2 or 4)
  │
  ▼
ARCHIVAL ───────────────── No longer actively maintained
```

### Lifecycle States

| State | Pipeline Stages | Duration (Typical) | Exit Criteria |
|-------|----------------|-------------------|---------------|
| IDEA | Pre-Stage 1 | Variable | Content request accepted |
| RESEARCH | Stage 2 | 1-3 days | Knowledge State complete |
| SPECIFICATION | Stage 1 | 1 day | Page Specification approved |
| BRIEFING | Stage 3 | 1 day | Editorial Brief approved |
| PLANNING | Stage 4 | 1-2 days | Narrative Plan approved |
| DRAFTING | Stage 5 | 1-4 hours | First draft complete |
| REVIEW | Stages 6-8 | 2-5 days | All reviews passed |
| VERIFICATION | Stage 9 | 1 hour | Score above threshold |
| APPROVAL | Stage 10 | 1 day | Approval Sheet signed |
| PUBLICATION | Stage 11 | 1-2 days | Content live on production |
| MONITORING | Stage 12 | 90 days | Performance Review complete |
| IMPROVEMENT | Revision cycle | Ongoing | Content updated or flagged |
| ARCHIVAL | Post-lifecycle | Permanent | Content no longer maintained |

---

## 7. Quality Gates

Quality gates are mandatory checkpoints. A gate failure stops the pipeline. Content cannot advance past an unpassed gate.

### Gate Definitions

#### Gate 1 — Knowledge Complete

| Element | Specification |
|---------|---------------|
| **Purpose** | Verify all required knowledge is gathered before any strategic or creative work begins |
| **Check** | Every field in the Page Specification that requires research has a Knowledge State entry. No critical knowledge gaps are unaddressed |
| **Pass Criteria** | All required knowledge domains are covered. Gap Report has no critical gaps. Source Map has ≥ 1 source per factual domain |
| **Fail Criteria** | Critical knowledge gap exists and is not escalated. Required research document not consulted |
| **Owner** | Editorial Lead |
| **Pipeline Stage** | Stage 2 |
| **Automation** | AI assembles Knowledge State. Human verifies completeness |

#### Gate 2 — Spec Approved

| Element | Specification |
|---------|---------------|
| **Purpose** | Verify the Page Specification accurately defines what this page should be |
| **Check** | All 28 fields populated. Purpose stated in one sentence. Content type is valid. Route is valid |
| **Pass Criteria** | All fields complete. Editorial Lead signs off |
| **Fail Criteria** | Missing fields. Purpose not clearly stated. Content type does not match route |
| **Owner** | Editorial Lead |
| **Pipeline Stage** | Stage 1 |
| **Automation** | AI validates field completeness. Human approves |

#### Gate 3 — Brief Approved

| Element | Specification |
|---------|---------------|
| **Purpose** | Verify the editorial strategy is sound before narrative planning begins |
| **Check** | Primary emotion matches page emotion map. Business goal is measurable. CTA is one action. Content priority has three items. SEO mandate does not conflict with editorial goals |
| **Pass Criteria** | Editorial Brief is complete. Emotional target is compatible with emotional architecture. CTA is achievable |
| **Fail Criteria** | Emotional target conflicts with page emotion map. Multiple competing CTAs. SEO mandate would compromise editorial quality |
| **Owner** | Editorial Lead |
| **Pipeline Stage** | Stage 3 |
| **Automation** | AI drafts brief. AI checks emotional compatibility. Human approves |

#### Gate 4 — Draft Complete

| Element | Specification |
|---------|---------------|
| **Purpose** | Verify the first draft exists and passes AI self-review |
| **Check** | Draft exists. All scenes from Narrative Plan are written. Draft passes the 12-pass AI self-review with no critical issues |
| **Pass Criteria** | Draft is complete. AI self-review finds no critical issues. Revision Report documents any residual issues |
| **Fail Criteria** | Draft incomplete. Critical issue found by AI self-review and not resolved |
| **Owner** | AI |
| **Pipeline Stage** | Stages 5-6 |
| **Automation** | Fully automated. AI drafts, reviews, and revises |

#### Gate 5 — Human Review Passed

| Element | Specification |
|---------|---------------|
| **Purpose** | Verify a human editor has reviewed the content against the brief and brand standards |
| **Check** | Editorial Lead has read the entire draft. All AI-flagged residual issues have been adjudicated. Brand voice is consistent. Editorial judgment has been applied |
| **Pass Criteria** | Editorial Lead signs off. No editorial concerns remaining |
| **Fail Criteria** | Editorial Lead identifies unresolved issue. Content does not match brief. Brand voice violation |
| **Owner** | Editorial Lead |
| **Pipeline Stage** | Stage 7 |
| **Automation** | None — this is the primary human gate |

#### Gate 6 — Subject Matter Verified (Conditional)

| Element | Specification |
|---------|---------------|
| **Purpose** | Verify craft, cultural, or technical accuracy by a subject matter expert |
| **Check** | All claims in the SME's domain are accurate. Cultural framing is appropriate. Technical details are precise |
| **Pass Criteria** | SME confirms accuracy. No factual errors found |
| **Fail Criteria** | Factual error. Cultural misrepresentation. Technical imprecision |
| **Owner** | Subject Matter Expert |
| **Pipeline Stage** | Stage 8 |
| **Automation** | None — human expertise required. AI prepares Knowledge State for SME review |

#### Gate 7 — Quality Score Above Threshold

| Element | Specification |
|---------|---------------|
| **Purpose** | Verify the content meets measurable quality standards |
| **Check** | OQI computed. Each heuristic minimum met. Content-type threshold met |
| **Pass Criteria** | OQI ≥ content-type threshold. No heuristic below critical minimum |
| **Fail Criteria** | OQI below threshold. Single heuristic critically low |
| **Owner** | AI (computes) + Editorial Lead (overrides if needed) |
| **Pipeline Stage** | Stage 9 |
| **Automation** | Fully automated scoring. Human override available |

#### Gate 8 — Final Approval

| Element | Specification |
|---------|---------------|
| **Purpose** | Final human sign-off. Verify all previous gates have passed |
| **Check** | All 7 previous gates passed. Last complete read by Editorial Lead. Approval chain followed |
| **Pass Criteria** | Approval Sheet signed. Publication readiness confirmed |
| **Fail Criteria** | Unresolved issue. Approval chain not followed. Missing gate pass |
| **Owner** | Editorial Lead (or Editor-in-Chief for major pieces) |
| **Pipeline Stage** | Stage 10 |
| **Automation** | AI checks all gates passed. Human signs |

### Gate Status Tracking

Each gate has a status:

| Status | Meaning |
|--------|---------|
| Pending | Not yet reached in pipeline |
| In Progress | Gate evaluation underway |
| Passed | Gate criteria met |
| Failed | Gate criteria not met. Pipeline paused |
| Waived | Gate skipped with documented reason and approval |
| Overridden | Gate failed but overridden by authorized approver with documented reason |

---

## 8. AI + Human Collaboration Model

### Responsibility Allocation

| Activity | AI | Human | Rationale |
|----------|----|-------|-----------|
| Knowledge retrieval | Always | Never | AI processes large document sets faster and more thoroughly than humans |
| Knowledge verification | Never | Always | Only a human can judge whether a cultural or craft fact is appropriate |
| Page Specification drafting | Drafts | Approves | AI can populate from templates; human makes final strategic decisions |
| Editorial Brief drafting | Drafts | Approves | AI processes strategy from inputs; human validates against business reality |
| Narrative Plan design | Designs | Approves | AI generates multiple narrative options; human selects and refines |
| Drafting | Always | Never | AI executes EIS cognition and language layers |
| Brand compliance checking | Always | Never | AI scans every word against forbidden lists and voice parameters |
| 12-pass self-review | Always | Never | All 12 passes are automated |
| Emotional accuracy judgment | Assists | Decides | AI flags potential mismatches; human confirms |
| Cultural sensitivity judgment | Assists | Decides | AI flags potential issues; human (especially SME) decides |
| Voice nuance judgment | Assists | Decides | AI checks rules; human feels the voice |
| Subject matter expertise | Never | Always | Weaver names, techniques, cultural framing require human expertise |
| Quality scoring | Computes | Contextualises | AI computes heuristics; human interprets in context |
| Final approval | Never | Always | Only a human can authorise publication |
| Performance analysis | Gathers | Interprets | AI collects analytics; human decides what to improve |

### Decision Rights Matrix

| Decision Type | AI Decision | Human Decision | Human Approval Required |
|---------------|-------------|----------------|------------------------|
| Brand boundary violation | Auto-reject | — | — |
| Forbidden word present | Auto-reject | — | — |
| Unverifiable claim | Flag | Confirm flag | — |
| Emotional target selection | Propose | Select | — |
| Narrative arc type | Propose | Select | — |
| Scene sequence | Design | Approve | Yes |
| Writing style | Execute | Validate | — |
| Word choice | Execute | Only if flagged | — |
| Sentence structure | Execute | Only if flagged | — |
| SEO metadata | Draft | Approve | Yes |
| Quality score | Compute | Override if needed | Override requires documented reason |
| Publication timing | — | Decide | — |
| Content priority | — | Decide | — |
| Revision strategy | Propose | Approve | Yes |

### Human Workload Projection

| Role | Activities | Estimated Time per Content Unit |
|------|-----------|--------------------------------|
| Editorial Lead | Stage 1 (spec approval), Stage 2 (knowledge verification), Stage 3 (brief approval), Stage 4 (narrative approval), Stage 7 (editorial review), Stage 10 (final approval) | 2-4 hours per major piece, 30 min per minor piece |
| Editor-in-Chief | Stage 10 (approval for major pieces) | 20-30 min per major piece |
| Craft Advisor | Stage 8 (subject matter review) | 1-2 hours per craft-heavy piece |
| Brand Lead | Stage 8 (campaign review), Stage 10 (campaign approval) | 30-60 min per campaign |
| Legal | Stage 8 (policy review) | As needed |

---

## 9. Folder Structure

The EPS is documented as a production directory within the Editorial Operating System.

```
docs/editorial/production/
│
├── README.md                          # This document — EPS overview
├── INDEX.md                           # Quick navigation
│
├── workflows/                         # Content-type-specific workflows
│   ├── homepage.md                    # Workflow: Homepage
│   ├── about.md                       # Workflow: About
│   ├── collection-landing.md          # Workflow: Collection Landing
│   ├── collection-detail.md           # Workflow: Collection Detail
│   ├── product-detail.md              # Workflow: Product Detail
│   ├── journal-article.md             # Workflow: Journal Article
│   ├── craft-story.md                 # Workflow: Craft Story
│   ├── weaver-story.md                # Workflow: Weaver Story
│   ├── faq.md                         # Workflow: FAQ
│   ├── policies.md                    # Workflow: Policies
│   ├── email.md                       # Workflow: Email
│   ├── campaign.md                    # Workflow: Campaign
│   ├── lookbook.md                    # Workflow: Lookbook
│   └── landing-page.md                # Workflow: Landing Page
│
├── templates/                         # Reusable production templates
│   ├── page-specification.md          # Template: Page Specification (28 fields)
│   ├── editorial-brief.md             # Template: Editorial Brief
│   ├── research-brief.md              # Template: Research Brief
│   ├── narrative-plan.md              # Template: Narrative Plan
│   ├── writing-plan.md                # Template: Writing Plan
│   ├── revision-report.md             # Template: Revision Report
│   ├── editorial-review.md            # Template: Editorial Review
│   ├── approval-sheet.md              # Template: Approval Sheet
│   ├── publication-checklist.md       # Template: Publication Checklist
│   └── performance-review.md          # Template: Performance Review
│
├── quality-gates/                     # Gate specifications
│   ├── gate-01-knowledge-complete.md
│   ├── gate-02-spec-approved.md
│   ├── gate-03-brief-approved.md
│   ├── gate-04-draft-complete.md
│   ├── gate-05-human-review-passed.md
│   ├── gate-06-subject-verified.md
│   ├── gate-07-quality-above-threshold.md
│   └── gate-08-final-approval.md
│
├── checklists/                        # Actionable checklists
│   ├── pre-writing-checklist.md       # Must complete before Stage 5
│   ├── pre-publication-checklist.md   # Must complete before Stage 11
│   └── post-publication-checklist.md  # Must complete after Stage 11
│
├── approval/                          # Approval chain definitions
│   ├── approval-chains.md             # Who approves what, per content type
│   └── escalation-paths.md            # What happens when approval is contested
│
├── automation/                        # Automation classification
│   └── automation-matrix.md           # What is automated, what is not, and why
│
└── history/                           # Version history
    └── CHANGELOG.md                   # EPS version history
```

---

## 10. Reusable Templates

Ten templates are specified. Each template is a structured document with predefined fields. Templates are created as Markdown files in `docs/editorial/production/templates/`.

### Template 1: Page Specification

**Purpose:** The master document defining every aspect of a page before production begins.
**Contains:** All 28 fields from §5.
**Used by:** Stages 1-12.

**Structure:**

```
# Page Specification: {Page Name}

## Identity
- Page Name:
- Route:
- Content Type:

## Purpose & Goals
- Purpose:
- Business Goal:
- User Goal:
- Reader Intent:
- Customer Journey Stage:
- Brand Goal:

## Emotional & Trust Architecture
- Primary Emotion:
- Secondary Emotion:
- Trust Goal:
- Emotional Arc:

## Reader & Audience
- Primary Persona:
- Reader Identity Model:
- Processing Model:

## Knowledge & Research
- Knowledge State: (reference to Knowledge State document)
- Required Research:

## SEO & Content Strategy
- SEO Intent:
- Primary Keyword:
- Content Priority: 1.  2.  3.

## Narrative & CTA
- Primary Narrative:
- Secondary Narrative:
- Narrative Architecture: (reference to Narrative Plan)
- Primary CTA:
- Secondary CTA:

## Production Requirements
- Writing Requirements:
- Revision Requirements:
- Accessibility Notes:

## Version
- Version:
- Status: Draft | Approved | Superseded
- Approved By:
- Approval Date:
```

### Template 2: Editorial Brief

**Purpose:** The strategic mandate for the content. Defines what the content must accomplish.
**Used by:** Stage 3.

**Structure:**

```
# Editorial Brief: {Page Name}

## Strategic Mandate
- Purpose (one sentence):
- Business Goal:
- Brand Goal:

## Emotional Targeting
- Primary Emotion:
- Secondary Emotion:
- Customer Journey Stage:
- Emotional Arc (start → end):

## Reader
- Primary Persona:
- Reader Intent:
- Trust Requirement:

## Content Priorities
- Priority 1:
- Priority 2:
- Priority 3:

## Call to Action
- Primary CTA:
- Secondary CTA (if applicable):

## SEO Mandate
- Primary Keyword:
- SEO Intent:
- Title Constraint (≤70 chars):
- Description Constraint (≤160 chars):

## Success Criteria
- How will we know this content succeeded?

## Constraints
- Brand constraints applicable:
- Vocabulary focus:
- Tone register:

## Version
- Version: 1.0
- Status: Draft | Approved
- Approved By:
- Approval Date:
```

### Template 3: Research Brief

**Purpose:** Specify exactly what research is needed for this content unit.
**Used by:** Stage 2.

**Structure:**

```
# Research Brief: {Page Name}

## Knowledge Domains Required
- [ ] Domain 1:
- [ ] Domain 2:
- [ ] Domain 3:

## Specific Research Questions
- Q1:
- Q2:
- Q3:

## Required Source Documents
- [ ] docs/research/path/to/document.md
- [ ] docs/research/path/to/document.md

## Knowledge Gaps
- Gap 1:
- Gap 2:

## Source Map
| Claim | Source | Confidence |
|-------|--------|------------|
|       |        |            |

## Version
- Version: 1.0
- Knowledge State Reference:
```

### Template 4: Narrative Plan

**Purpose:** The structural design of the content before any drafting begins.
**Used by:** Stage 4.

**Structure:**

```
# Narrative Plan: {Page Name}

## Arc
- Arc Type:
- Narrative Tension Curve:

## Scene Sequence
| Scene # | Purpose | Emotion | Sensory Anchor | Tone Register | Knowledge Function | Transition |
|---------|---------|---------|----------------|---------------|-------------------|------------|
| 1       |         |         |                |               |                   |            |
| 2       |         |         |                |               |                   |            |
| 3       |         |         |                |               |                   |            |

## Identity Transformation
- From Identity:
- To Identity:

## Curiosity Architecture
- Question raised → Where answered:
- Question raised → Where answered:

## Resolution Design
- Central question answered:
- Emotional payoff:
- Memory anchor:
- Transition to next content:

## Pacing Map
- Section 1 (fast/slow):
- Section 2 (fast/slow):
- Section 3 (fast/slow):

## Version
- Version: 1.0
- Status: Draft | Approved
- Approved By:
```

### Template 5: Writing Plan

**Purpose:** Specific instructions for the drafting stage.
**Used by:** Stage 5.

**Structure:**

```
# Writing Plan: {Page Name}

## Drafting Instructions
- Content type:
- Target word count:
- Reading level target:

## Tone Register per Section
- Section 1:
- Section 2:
- Section 3:

## Vocabulary Focus
- Approved words to feature:
- Forbidden words to avoid (specific to this content):
- AI clichés to avoid:

## Sensory Requirements
- Visual anchors required:
- Tactile anchors required:
- Weight/movement anchors required:

## Brand Compliance
- Identity markers to include:
- Brand prohibitions to enforce:

## EIS Layer 7 Cognition Focus
- Questions to prioritise for this content type:

## Version
- Version: 1.0
- Narrative Plan Reference:
```

### Template 6: Revision Report

**Purpose:** Document the results of the AI self-review.
**Used by:** Stage 6.

**Structure:**

```
# Revision Report: {Page Name}

## Pass Results
| Pass | Critical | Important | Minor | Auto-Fixed | Residual |
|------|----------|-----------|-------|------------|----------|
| 1. Truth Audit | 0 | 0 | 0 | Yes | — |
| 2. Brand Fidelity | 0 | 0 | 0 | Yes | — |
| ... | | | | | |

## Residual Issues (Requiring Human Attention)
| # | Pass | Issue | Severity | Recommended Action | Status |
|---|------|-------|----------|-------------------|--------|
| 1 |      |       |          |                   |        |

## Summary
- Total findings:
- Critical:
- Important:
- Minor:
- Auto-fixed:
- Residual:

## Draft Version
- Draft version before review:
- Draft version after review:
- Next stage:
```

### Template 7: Editorial Review

**Purpose:** Document the human editor's review.
**Used by:** Stage 7.

**Structure:**

```
# Editorial Review: {Page Name}

## Overall Assessment
- Does the content serve its purpose? Yes / No / Partially
- Does the content create the intended emotion? Yes / No / Partially
- Is the voice consistent with HOP? Yes / No / Partially
- Is every claim specific enough? Yes / No / Partially

## Findings
| # | Issue | Location | Severity | Action Taken | Status |
|---|-------|----------|----------|-------------|--------|
| 1 |       |          |          |             |        |

## AI Revision Report Review
- Do you agree with the AI's severity classifications? Yes / No
- Are there issues the AI missed? Yes / No (if yes, list above)
- Are there AI-flagged issues you disagree with? Yes / No (if yes, list above)

## Decision
- [ ] Approve — advance to Stage 8/9
- [ ] Revise — return to AI (Stage 5/6) with specific instructions
- [ ] Rethink — return to Stage 3/4 with strategic concerns

## Version
- Reviewed By:
- Review Date:
- Draft version at review:
```

### Template 8: Approval Sheet

**Purpose:** The final sign-off document before publication.
**Used by:** Stage 10.

**Structure:**

```
# Approval Sheet: {Page Name}

## Content Identity
- Page Name:
- Route:
- Content Type:
- Slug:

## Gate Status
| Gate | Status | Notes |
|------|--------|-------|
| 1. Knowledge Complete | Pass / Fail / Waived | |
| 2. Spec Approved | Pass / Fail / Waived | |
| 3. Brief Approved | Pass / Fail / Waived | |
| 4. Draft Complete | Pass / Fail / Waived | |
| 5. Human Review Passed | Pass / Fail / Waived | |
| 6. Subject Matter Verified | Pass / Fail / Waived / N/A | |
| 7. Quality Score Above Threshold | Pass / Fail / Waived | |
| 8. Final Approval | Pass / Fail | |

## Quality Score
- OQI:
- Heuristic minimums met? Yes / No

## Approvals
| Role | Name | Signature | Date |
|------|------|-----------|------|
| Editorial Lead | | | |
| Editor-in-Chief (if required) | | | |
| Subject Matter Expert (if required) | | | |

## Publication Decision
- [ ] Approved for publication
- [ ] Rejected (reason:
- [ ] Conditional approval (condition:)

## Final Notes
- 

## Version
- Approval Sheet Version:
- Content Draft Version:
```

### Template 9: Publication Checklist

**Purpose:** Verify all publication requirements are met.
**Used by:** Stage 11.

**Structure:**

```
# Publication Checklist: {Page Name}

## Pre-Publication
- [ ] Content directory created: src/content/{type}/{slug}/
- [ ] index.md written with complete frontmatter
- [ ] All body blocks present and well-formed
- [ ] Hero image present and optimised
- [ ] In-body images present (if required)
- [ ] Alt text on all images
- [ ] SEO title (≤70 chars):
- [ ] SEO description (≤160 chars):
- [ ] Frontmatter status set to "published"
- [ ] Related content references point to existing entities
- [ ] Slug is unique and kebab-case

## Compiler
- [ ] Content Compiler runs without errors
- [ ] All relationship validations pass
- [ ] Generated index files are correct

## Staging
- [ ] Renders correctly on staging
- [ ] Images load correctly
- [ ] Links work correctly
- [ ] Mobile rendering verified

## Deployment
- [ ] Pull request created
- [ ] PR reviewed (if required)
- [ ] Merged to main
- [ ] Production deployment verified

## Post-Publication
- [ ] Content calendar updated
- [ ] URL verified on production
- [ ] Stage 12 monitoring initiated

## Version
- Published By:
- Publication Date:
- Content Unit Version:
```

### Template 10: Performance Review

**Purpose:** Evaluate content performance after publication.
**Used by:** Stage 12.

**Structure:**

```
# Performance Review: {Page Name}

## Content Identity
- Page Name:
- Route:
- Published:
- Content Type:

## Review Period
- Review #: 1 (7 days) / 2 (30 days) / 3 (90 days)
- Review Date:

## Success Criteria Assessment
| Criterion | Target | Actual | Met? |
|-----------|--------|--------|------|
|           |        |        |      |

## Analytics
- Page views:
- Time on page:
- Scroll depth:
- CTA clicks:
- Bounce rate:
- Return visits:

## Qualitative Feedback
- Reader feedback received:
- Editorial team observations:
- SME feedback (if applicable):

## Comparative Analysis
- Performance vs. similar content types:
- Performance vs. predecessor (if replacement):

## Improvement Recommendations
| # | Recommendation | Priority | Action By | Timeline |
|---|---------------|----------|-----------|----------|
| 1 |               |          |           |          |

## Decision
- [ ] Archive — no further action needed
- [ ] Revise — minor updates (return to Stage 6-7)
- [ ] Redesign — significant rework needed (return to Stage 3-4)

## Version
- Reviewed By:
- Review Date:
- Content Version at Review:
```

---

## 11. Workflow Automation Classification

Every production stage is classified by automation level.

### Automation Levels

| Level | Definition | Examples |
|-------|------------|----------|
| **Fully Automated** | AI performs all work. Human not involved | Knowledge retrieval, 12-pass self-review, quality scoring |
| **AI Assisted** | AI does the work; human reviews and approves | Editorial brief drafting, narrative planning, SEO metadata |
| **Human Required** | Work requires human judgment. AI may assist with preparation | Editorial review, cultural sensitivity review, final approval |
| **Human Approval Required** | Human must explicitly approve before pipeline advances | All quality gates, approval sheet signing |
| **Future Automation** | Currently human-required, but could be automated with better tools or data | Cultural sensitivity verification, voice nuance assessment |

### Automation Matrix

| Pipeline Stage | Automation Level | Rationale |
|----------------|-----------------|-----------|
| Stage 1: Intake & Specification | AI Assisted | AI drafts spec from request and page strategy; human approves final |
| Stage 2: Research & Knowledge Assembly | Fully Automated (retrieval) → Human Required (verification) | AI retrieves and cross-references. Human verifies cultural and craft facts |
| Stage 3: Editorial Briefing & Strategy | AI Assisted | AI drafts brief from inputs; human validates strategy |
| Stage 4: Narrative & Cognitive Planning | AI Assisted | AI designs narrative architecture; human approves |
| Stage 5: Drafting (EIS Execution) | Fully Automated | AI executes entire EIS cognition and language layers |
| Stage 6: AI Self-Review (12-Pass) | Fully Automated | All 12 passes run without human involvement |
| Stage 7: Human Editorial Review | Human Required | Core human editorial judgment. AI provides Revision Report as input |
| Stage 8: Subject Matter Review | Human Required | SME expertise cannot be automated with current AI |
| Stage 9: Quality Verification | Fully Automated (computation) → Human Approval Required (override) | AI computes scores; human can override with documented reason |
| Stage 10: Approval | Human Approval Required | Only human can authorise publication |
| Stage 11: Publication | AI Assisted | AI creates content unit and runs compiler; human approves merge |
| Stage 12: Post-Publication Review | Fully Automated (data gathering) → Human Required (interpretation) | AI collects analytics; human decides on improvements |

### Automation Future Roadmap

| Currently Human-Required | Future Automation Potential | Enabling Technology / Data |
|--------------------------|---------------------------|---------------------------|
| Cultural sensitivity review | Medium — with comprehensive cultural knowledge base + clear rules | Culturally-aware LLM fine-tuning + cultural sensitivity rubric |
| Voice nuance judgment | Low — voice is subjective and context-dependent | May always require human taste |
| Subject matter expertise (craft) | Medium — with structured craft database + weaver registry | Structured knowledge graph of weavers, techniques, places |
| Subject matter expertise (cultural) | Low — cultural context is nuanced and evolving | Human cultural advisors remain essential |
| Final approval | Low — accountability requires human authorisation | Organisational policy, not technology |

---

## 12. Self-Review

### 12.1 Missing Workflows

1. **Content calendar integration:** The EPS assumes content requests arrive through a defined intake process but does not specify the content calendar system that feeds it. The calendar should be a separate operational document that triggers Stage 1.

2. **Batch production workflow:** The EPS specifies per-content-unit production. When producing multiple related content units (e.g., a collection launch with collection detail + product details + email + campaign), there is no batch coordination stage. A batch production stage should coordinate dependencies, shared research, and staggered publication.

3. **Content retirement/archival workflow:** The lifecycle ends at "Archival" but there is no defined process for retiring content — removing from sitemap, 301 redirects, updating internal links, notifying the content team.

### 12.2 Bottlenecks

1. **Stage 7 (Human Editorial Review):** This is the highest-latency stage. Every content unit, regardless of type or complexity, passes through a single human gate. For high-volume production (e.g., batch product story creation), this creates a bottleneck.

   *Mitigation:* Implement tiered review — simple content types (FAQ, Policies) use a lighter review. Only complex pieces (Homepage, Campaign) require full editorial review.

2. **Stage 8 (Subject Matter Review):** Subject matter experts are a shared resource across all content. If multiple craft-heavy pieces are in the pipeline simultaneously, SME availability becomes a bottleneck.

   *Mitigation:* Implement SME scheduling with the content calendar. Batch SME review for related pieces.

### 12.3 Redundant Stages

1. **Stage 4 (Narrative & Cognitive Planning) is redundant for some content types.** FAQ, Policies, and some Email types have no narrative structure. For these types, Stage 4 can be skipped (the variation matrix already handles this — but it should be more explicit).

2. **Stage 2 (Research) and Stage 5 (Drafting) overlap in knowledge retrieval.** The EIS Layer 5 runs during drafting (Stage 5) but Stage 2 already performed knowledge retrieval. This duplication is intentional (Stage 2 retrieval is for human review; Stage 5 retrieval is for AI context) but should be noted.

### 12.4 Scalability Issues

1. **Single editorial lead dependency:** The EPS assumes the Editorial Lead approves Gates 2, 3, 5, 8, and 10. For a team scaling beyond one editorial lead, this creates a single point of failure.

2. **Document proliferation risk:** Each content unit generates 10+ documents (Spec, Brief, Brief, Plan, Plan, Draft, Report, Review, Sheet, Checklist, Review). For high-volume production, document management becomes a challenge.

### 12.5 Human Dependency Risks

1. **Tribal knowledge in Stage 7:** The Editorial Lead's judgment cannot be fully documented. If the Editorial Lead changes, consistency may break.

2. **SME availability for Stage 8:** If a craft advisor is unavailable (vacation, departure), craft-heavy content cannot be published.

### 12.6 Version 2.0 Proposal

Based on the self-review:

**Change 1: Add batch coordination stage.**
A new Stage 1a (Batch Planning) coordinates multi-content production. It produces a Batch Plan that specifies content dependencies, shared research, publication sequence, and resource allocation.

**Change 2: Tiered editorial review.**
Replace single Stage 7 with three tiers:
- **Tier 1 (Light):** AI review only. Human spot-checks. (FAQ, Policies, minor emails)
- **Tier 2 (Standard):** AI self-review + Editorial Lead review. (Collection Detail, Product Detail, Craft Story, Lookbook)
- **Tier 3 (Deep):** AI self-review + Editorial Lead review + Editor-in-Chief review. (Homepage, About, Journal Article, Campaign, Landing Page)

**Change 3: Content calendar integration.**
Add a content calendar document (`docs/editorial/production/calendar/`) that drives Stage 1 intake. The calendar specifies content slots by week with assigned content types and priorities.

**Change 4: Content archival workflow.**
Add Stage 13 (Archival) with defined process: remove from sitemap, redirect setup, internal link update, content team notification.

**Change 5: Editorial lead backup.**
Define backup approvers for each gate to reduce single-point-of-failure risk.

### 12.7 V1 vs V2 Comparison

| Dimension | V1.0 | V2.0 | Verdict |
|-----------|------|------|---------|
| Batch coordination | Per-unit only | Batch planning stage | V2 |
| Editorial review | Single tier | Three-tier review | V2 |
| Content calendar | Implicit | Explicit integration | V2 |
| Archival workflow | Not specified | Stage 13 defined | V2 |
| Single-point-of-failure risk | Editorial Lead is sole approver | Backup approvers defined | V2 |
| Complexity | Moderate | Higher | V1 |
| Implementation time | Immediate | Requires calendar + batch planning setup | V1 |
| Production readiness | Production-ready | Requires additional development | V1 |
| Scalability | Limited by single reviewer | Tiers enable scaling | V2 |

### 12.8 Recommendation

**Recommend Version 1.0 for initial implementation.**

Rationale:

1. **Production readiness:** V1 covers the complete pipeline with all essential stages, gates, and templates. It can be implemented today.

2. **V2 improvements address edge cases, not fundamentals:** Batch coordination, tiered review, calendar integration, and archival are important for scale but not for initial operation. The EPS will function correctly without them for the first months of production.

3. **Empirical validation before complexity:** V1 in production will surface real bottlenecks and missing workflows. V2 changes should be driven by production data, not theoretical speculation.

4. **V2 items can be added incrementally:** Each V2 change is independent. The calendar can be added when scheduling becomes complex. Tiered review can be added when volume increases. These do not require a monolithic V2 rebuild.

**Implementation sequence:**

1. Create directory structure (`docs/editorial/production/`)
2. Write README.md (this document)
3. Write INDEX.md for quick navigation
4. Write template files for all 10 templates
5. Write quality gate specifications for all 8 gates (one per file)
6. Write approval chain definitions
7. Write automation matrix
8. Create first Page Specification and run through full pipeline
9. After 3 months production use, assess against self-review findings
10. Implement V2 improvements where data supports them

---

## 13. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| EPS | Editorial Production System |
| EOS | Editorial Operating System |
| EIS | Editorial Intelligence System |
| Page Specification | The 28-field master document defining every aspect of a page |
| Editorial Brief | The strategic mandate for a content unit |
| Knowledge State | Complete set of verified facts for a content unit |
| Narrative Plan | The structural design of content before drafting |
| Revision Report | Document of AI self-review findings |
| Quality Score Card | Per-heuristic scores and OQI |
| Approval Sheet | Final sign-off document |
| Quality Gate | Mandatory checkpoint that must be passed to advance |
| OQI | Overall Quality Index (composite score from EIS Layer 10) |
| Lifecycle | The full journey from idea to archival |

### Appendix B: Stage Dependency Graph

```
Stage 1 (Intake)
   │
   ▼
Stage 2 (Research)
   │
   ▼
Stage 3 (Briefing)
   │
   ▼
Stage 4 (Planning)──── conditional for FAQ, Policies
   │
   ▼
Stage 5 (Drafting)
   │
   ▼
Stage 6 (Self-Review)
   │
   ▼
Stage 7 (Editorial Review) ←─── iteration loop (Stages 6-8)
   │
   ▼
Stage 8 (Subject Review) ──── conditional, not all content types
   │
   ▼
Stage 9 (Verification) ────── can return to Stage 5 or 7 if below threshold
   │
   ▼
Stage 10 (Approval)
   │
   ▼
Stage 11 (Publication)
   │
   ▼
Stage 12 (Post-Publication) ── feeds back to Stage 2 or 4 for revision
```

### Appendix C: Document Inventory per Content Unit

Each content unit in production generates the following documents:

| # | Document | Template | Created At | Storage |
|---|----------|----------|------------|---------|
| 1 | Page Specification | Template 1 | Stage 1 | `docs/editorial/production/page-specs/{slug}-spec.md` |
| 2 | Research Brief | Template 3 | Stage 2 | Embedded in Page Specification |
| 3 | Knowledge State | — | Stage 2 | `docs/editorial/production/research/{slug}-knowledge.md` |
| 4 | Editorial Brief | Template 2 | Stage 3 | Embedded in Page Specification |
| 5 | Narrative Plan | Template 4 | Stage 4 | Embedded in Page Specification |
| 6 | Writing Plan | Template 5 | Stage 4 | Embedded in Page Specification |
| 7 | Content Draft | — | Stage 5 | `src/content/{type}/{slug}/index.md` |
| 8 | Revision Report | Template 6 | Stage 6 | Embedded in Page Specification |
| 9 | Editorial Review | Template 7 | Stage 7 | Embedded in Page Specification |
| 10 | Subject Matter Review | — | Stage 8 | Embedded in Page Specification |
| 11 | Quality Score Card | — | Stage 9 | Embedded in Page Specification |
| 12 | Approval Sheet | Template 8 | Stage 10 | Embedded in Page Specification |
| 13 | Publication Checklist | Template 9 | Stage 11 | Embedded in Page Specification |
| 14 | Performance Review | Template 10 | Stage 12 | `docs/editorial/production/reviews/{slug}-performance.md` |

### Appendix D: EPS Architecture Principles (Extended)

| Principle | Implication |
|-----------|-------------|
| Research before writing | Stage 2 must complete before Stage 5 begins. No exceptions |
| Thinking before wording | Stages 3-4 must complete before Stage 5 begins |
| Planning before drafting | Narrative Plan must be approved before drafting starts |
| Revision before publication | Stages 6-8 must complete before Stage 11 |
| Evidence before claims | Every claim in published content must trace to Knowledge State |
| Narrative before sentences | Content without a Narrative Plan is not produced |
| Editorial review before approval | Stage 7 must pass before Stage 10 |
| Quality before speed | Deadline pressure never justifies skipping a gate |
| Consistency before creativity | Follow the workflow first. Innovate within it, not around it |

---

**End of Document**

**Version:** 1.0
**Status:** Draft for Review
**Classification:** Internal — House of Padmavati
**Author:** Principal Editorial Systems Architect
**Next Review:** October 2026