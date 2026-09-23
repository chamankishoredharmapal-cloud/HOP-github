# HOP UI TRANSFORMATION MASTER

## 0. Document Control

- **File:** `E:\HOP\HOP_UI_TRANSFORMATION_MASTER.md`
- **Version:** 2.0 (rebuilt from repository evidence; supersedes 2026-09-21 54-line stub)
- **Date rebuilt:** 2026-09-23
- **Author:** Principal UI Engineer + Design Systems Architect + Technical Project Controller
- **Status:** ACTIVE EXECUTION CONTROL FILE — living document
- **Prior stub:** 2026-09-21 recovery placeholder (54 lines, no objectives, no evidence). Preserved in git history; content below replaces it as the working master. No factual history was carried over from the stub because it contained none.
- **Evidence cutoff for this build:** repository files + `git status`/`git log`/`git diff --stat` inspected 2026-09-23; no build/test commands executed in this session (recorded as NOT EXECUTED where relevant).
- **How to use:** a new AI session reads §21 CURRENT MASTER CHECKPOINT first, then follows §19 AI SESSION START PROTOCOL.

---

## 1. Mission

Build the persistent execution brain for the HOP UI transformation so any future AI session can continue implementation without reconstructing project history.

Answer at any moment:

```text
WHAT IS HOP?
        ↓
WHAT VISUAL/UX PROBLEMS WERE IDENTIFIED?
        ↓
WHAT HAS ALREADY BEEN DONE?
        ↓
WHAT IS ACTUALLY VERIFIED?
        ↓
WHAT REMAINS?
        ↓
WHAT IS THE EXACT EXECUTION ORDER?
        ↓
WHAT OBJECTIVE IS CURRENT?
        ↓
WHAT IS ITS CHECKPOINT?
        ↓
WHAT WAS VALIDATED?
        ↓
WHAT IS THE NEXT ACTION?
```

Scope is UI/experience transformation only. No production Supabase, production database, production secrets, Razorpay production, payment architecture, or authentication architecture changes unless a UI issue genuinely requires a harmless interface adjustment.

---

## 2. What HOP Is

- **HOP = "A House, Not a Shop."** (VERIFIED — `HOP_BRAND_CONTEXT.md`, `context/00_HOP_BRAND_CONTEXT.md`, `context/01_BRAND_STRATEGY.md` v1.0 APPROVED.)
- HOP is a contemporary Indian fashion/design house that happens to sell sarees — NOT "a nice saree ecommerce website."
- The experience must communicate: restraint, materiality, provenance, editorial depth, distinct collection worlds, recognizable visual language, strong typography, intentional color, controlled motion, excellent commerce underneath.
- Customer covenant: *"When I wear House of Padmavati, I am choosing meaning over excess."*
- Operating conviction: *Luxury is earned through uncompromising standards patiently upheld across generations.*
- Must NOT become: generic luxury ecommerce, beige AI-generated luxury, generic Indian ethnic ecommerce, fashion-template UI, excessive minimalism, glassmorphism, animation showcase, gold-gradient luxury, decorative cultural cliché.
- Governing quality gates (per `context/06_GOVERNANCE.md`): Derivation Rule (justifiable from upstream doctrine) + Replaceability Test (could another brand produce this exact output — if yes, it fails).

---

## 3. Brand / Governance Authority

Source-of-truth hierarchy (highest wins on conflict):

**LEVEL 1 — BRAND AUTHORITY (APPROVED v1.0, 2026-08-03, Founder):**

- `context/01_BRAND_STRATEGY.md` — Foundational Authority.
- `context/02_VISUAL_LANGUAGE.md` — visual doctrine: uncompromising restraint; clarity over spectacle; confidence through restraint; endurance over trends; reverence for the object; generous space; anti-patterns (never trend-driven / noisy / generic-luxury).
- `context/03_EXPERIENCE_LANGUAGE.md` — calm authority, unintrusive service, silence as deliberate choice; never desperate/servile/theatrical.
- `context/04_PRODUCT_LANGUAGE.md` — heirlooms not consumables; continuity over seasons; expansion only where philosophically inevitable.
- `context/05_MARKETING_LANGUAGE.md` — quiet conviction; never promotional/reactive/loud.
- `context/06_GOVERNANCE.md` — operating constitution; Iron Rule of Hierarchy (upstream wins); Founder sole authority for 00/01/06 and domain approvals.
- `context/07_DECISIONS_LOG.md` — 8 approvals, all 2026-08-03. No UI-transformation decisions recorded.
- `context/08_GLOSSARY.md` — 4 terms (House, Institution, Living Craftsmanship, Discernment).
- `context/09_OPEN_QUESTIONS.md` — zero active questions.
- `context/10_CHANGELOG.md` — v1.0 init only.

**LEVEL 2 — DESIGN / RESEARCH INPUTS (directional, not execution reports):**

- `docs/research/design-language/coastal-blossom-philosophy.md` — 60-25-10-5 ratio (Jasmine Mist / Coastal Teal / Golden Sand / Sakura Blush).
- `docs/research/design-language/typology-of-restraint.md` — visual / verbal / structural restraint.
- `docs/research/design-language/negative-space.md` — 40% negative-space minimum at 1440px; verbal density rules.
- `docs/research/visual-language/photography-direction.md` — natural light only, real women, hand over mannequin.
- `docs/research/visual-language/image-standards.md` — WebP + fallback, alt text as voice copy.
- `docs/research/visual-language/video-direction.md` — slow gaze, silence as soundtrack, loom as character.
- `docs/BRAND_SYSTEM.md` — token/voice reference (jasmine/teal/sand/sakura/ink; Cormorant Garamond + Inter; Monogram). STALENESS FLAG: lists 2 typefaces; working tree now wires Fraunces — doc not updated. See UI-T-E005.
- `docs/UI_DESIGN_SYSTEM.md` — shadcn inventory (49 components), hop/studio component map, layout shells. Reference only.

**LEVEL 3 — PRODUCTION STATE (engineering truth; not UI-transformation completion):**

- `productionreadyHOP.md` (2026-09-14, freshest control file) — status NOT READY; Phases 1–3 + 5-baseline + 8 + 9 done; dual-model commerce implemented locally; current gate = staging deployment; a11y fixes recorded (HopFooter h4→h3, checkout contrast).
- `PHASE_2_14_MASTER_EXECUTION_TODO.md` §21 (2026-09-15, freshest detail) — DB/RPC/RLS audit; CURRENT TASK = deploy to staging + full E2E matrix; NEXT = Phase 12 readiness after CTO approval.
- `HOP_PRODUCTION_AUDIT.md` — re-entry snapshot (branch main +9, 41 routes, vite/tsc/lint PASS, `npm run build` FAIL on prerender DNS at audit time). Older than productionreadyHOP on build status.
- `PERFORMANCE_BASELINE.md` (2026-09-07) — build/test/bundle ledger; Playwright 70 pass / 20 skip; LCP-at-risk.
- `production/phase-*/`, `docs/AUDIT-INDEX.md` (115-file mirror manifest 2026-09-17 — proves `docs/audits/**` are copies; prefer root + `production/*` originals).

**LEVEL 4 — MEDIA REPORTS (authoritative for media scope only):**

- `PHASE_3_PATTERN_1_REPORT.md` — 6 catalog assets → `<OptimizedImage/>`. COMPLETE, deploy prohibited.
- `PHASE_3_PATTERN_2_REPORT.md` — 8 editorial assets → `<OptimizedImage/>`. COMPLETE, deploy prohibited.
- `PHASE_3_PATTERN_3_PLAN.md` — Option C dynamic-image design. Plan-only, status superseded by report.
- `PHASE_3_PATTERN_3_REPORT.md` (2026-09-09) — `src/lib/supabaseImage.ts` + 9 unit tests + 7 components (WebP, one-shot fallback, canonical-URL immutability). IMPLEMENTED & VALIDATED.
- `MEDIA_INTEGRATION_AUDIT.md` — 6-pattern architecture map. Superseded in execution by Pattern reports.
- `MEDIA_OPTIMIZATION_REPORT.md` — 86 assets, 193 derivatives, 64.62% savings, SHA-256 immutable.

**LEVEL 5 — CODE + GIT (critical evidence; code existence ≠ validation):**

- HEAD `da6158f` (phase-4 audit). Working tree: 44 tracked modifications + large untracked set (see §6). Zero UI-transformation commits in `git log --oneline -20`.
- Working-tree code is recorded as IMPLEMENTED-UNCOMMITTED / REPORT-UNVERIFIED unless a report validates it.

**LEVEL 6 — PRIOR MASTER STUB (lowest authority):**

- 2026-09-21 54-line placeholder. Structural intent only. No factual claims carried forward.

---

## 4. Evidence Discipline

Every project-state statement in this master is classified:

- **VERIFIED** — directly confirmed from repository files, source code, git history/status/diff, test/build output, screenshots, explicit execution reports.
- **OBSERVED** — directly visible in screenshots, logs, compiler/browser/tool output.
- **INFERRED** — logical conclusion from verified/observed evidence.
- **UNVERIFIED** — claimed in prior conversation/context but not confirmed by repository evidence. NEVER upgraded to VERIFIED without new evidence.
- **UNKNOWN** — insufficient evidence. Recorded explicitly as `UNKNOWN — repository evidence not found.`

Rules: never fabricate reports, screenshots, validation results, commits, decisions, measurements, or completion status. Code existence is NOT validation. Successful compilation is NOT visual completion.

---

## 5. Historical Phase Reconstruction

### Phase 1 — HOP Identity — VERIFIED

- Discovery + approved strategy corpus present: `HOP_BRAND_CONTEXT.md`, `context/00–10` (see §3 Level 1). Status: COMPLETE as documents. No implementation work implied.

### Phase 2 — Master Visual Audit — CONVERSATION-ONLY / REPOSITORY-UNVERIFIED

```text
MASTER VISUAL AUDIT
Status: CONVERSATION-ONLY / REPOSITORY-UNVERIFIED
```

- No file matching `*VISUAL*AUDIT*`, `*CREATIVE*AUDIT*`, `*TRANSFORM*`, `*STABIL*` exists in the repository (glob-verified 2026-09-23; only hits: `context/02_VISUAL_LANGUAGE.md` and this master file itself).
- Reported coverage (brand identity, color, typography, copy, photography, motion, layout/grid, homepage, collections, product, cart/checkout, mobile, accessibility, distinctiveness, anti-generic, critical problems, improvements, no-change list, art direction, roadmap) and reported diagnosis ("taste and restraint present, but site not expressing what makes HOP specifically HOP") are treated as historical context, NOT verified findings.
- Do NOT fabricate a report file. Individual claims may be re-verified through fresh inspection and recorded per-objective under EVIDENCE.

### Phase 3 — P0 Stabilization — IMPLEMENTED-UNCOMMITTED / REPORT-UNVERIFIED (area-by-area below)

Working-tree evidence (2026-09-23 `git status --short` + `git diff --stat`): 44 tracked modified files (+2132/−652 insertions/deletions across the diff), zero related commits in `git log --oneline -20`. Modified UI-relevant files include: `src/App.tsx`, `src/components/about/ImageTextBlock.tsx`, `src/components/hop/CollectionStage.tsx`, `CraftSection.tsx`, `Film.tsx`, `HeroSection.tsx`, `HopFooter.tsx`, `HopHeader.tsx`, `JournalPreview.tsx`, `ModernHeirlooms.tsx`, `Monogram.tsx`, `ProductGallery.tsx`, `src/components/layout/PageLayout.tsx`, `src/data/collectionVideos.ts`, `src/data/journalArticles.ts`, `src/index.css`, `src/pages/{Cart,Category,Checkout,Collections,Index,Journal,JournalDetail,OrderConfirmation,ProductDetail,Wishlist}.tsx`, `src/pages/about/OurStory.tsx`, `tailwind.config.ts`, `index.html`, `scripts/prerender.js` (+ backend/commerce files out of UI scope). Deleted: `src/components/hop/FeaturedProducts.ts` (15 lines removed; replacement `FeaturedProducts.tsx` present — actual filename verified via earlier inventory glob `src/components/hop/FeaturedProducts.tsx`).

| Claimed P0 area | Repository evidence | State |
|---|---|---|
| Homepage restoration (`Index.tsx`) | `src/pages/Index.tsx` modified (4-line diff) | IMPLEMENTED-UNCOMMITTED / UNVALIDATED |
| Hero fallback (`HeroSection.tsx`) | `HeroSection.tsx` modified (43-line diff); Fraunces font wired in `index.html:17` | IMPLEMENTED-UNCOMMITTED / UNVALIDATED |
| Collections stabilization (`Collections.tsx`, `Category.tsx`, `CollectionStage.tsx`) | all three modified; `CollectionStage.tsx` imports `getWorld` + `Selvedge`, uses `font-editorial` (lines 8–9, 43, 49, 68) | IMPLEMENTED-UNCOMMITTED / UNVALIDATED |
| Journal stabilization (`Journal.tsx`, `JournalDetail.tsx`, `JournalPreview.tsx`, `journalArticles.ts`) | all modified; `font-editorial` usages in `Journal.tsx:56,96` | IMPLEMENTED-UNCOMMITTED / UNVALIDATED |
| Product page hierarchy (`ProductDetail.tsx`, `ProductGallery.tsx`) | both modified; `font-editorial` in `ProductDetail.tsx:212` | IMPLEMENTED-UNCOMMITTED / UNVALIDATED |
| Cart / Checkout / Wishlist (+ OrderConfirmation, account OrderDetail) | all modified | IMPLEMENTED-UNCOMMITTED / UNVALIDATED |
| Header / Footer (`HopHeader.tsx`, `HopFooter.tsx`, `PageLayout.tsx`, `Monogram.tsx`) | all modified; a11y fixes (h4→h3, contrast) recorded in `productionreadyHOP.md` §1/§4 as FIXED | IMPLEMENTED-UNCOMMITTED / PARTIALLY-VALIDATED (a11y claim is report-backed; visual claim is not) |
| Film viewport gating (`Film.tsx`) | modified (73-line diff); `IntersectionObserver` + `prefers-reduced-motion` guard verified at `Film.tsx:33,45,49` | IMPLEMENTED-UNCOMMITTED / CODE-VERIFIED, VISUAL-UNVALIDATED |
| Empty states | claimed; no isolated evidence file; likely inside page diffs | UNVERIFIED — verify per-page in OBJ-08 |
| SPA behavior / prerender | `scripts/prerender.js` modified (108-line diff); `productionreadyHOP.md` records prerender 11/11 routes OK 2026-09-14 | IMPLEMENTED-UNCOMMITTED / REPORT-BACKED (dated) — re-verify in OBJ-09 |
| Motion discipline / mobile drawer / external links / checkout orientation / visual leaks | claimed; motion-relevant code verified (`selvedge-draw` keyframes + retired-kenburns comment `src/index.css:135–142`; reduced-motion guards); remainder inside page/header diffs | PARTIALLY-VERIFIED (motion code) / REST UNVERIFIED |
| TypeScript / build validation | claimed PASS; NO build/test commands executed in this session | UNVERIFIED in this session — re-run in OBJ-09 |

### Phase 4 — UI Transformation — PARTIAL CODE, NO DECISION RECORDS (see §9 OBJ-01–09)

- No objective report files exist for OBJ-01–09 (grep-verified).
- Code-level partials exist for OBJ-01 (Fraunces trial wiring + 4+ surface usages), OBJ-03 (worlds data + 2 usages), OBJ-04 (Selvedge + 1 usage), OBJ-07 (motion discipline code). All IMPLEMENTED-UNCOMMITTED / DECISION-PENDING / VISUAL-UNVALIDATED.
- OBJ-02/05/06/08/09: no dedicated implementation beyond the shared P0 diffs; status NOT STARTED except where P0 overlap is noted.

### Phase 5 — Validation — ENGINEERING PART DONE, UI-VISUAL PART NOT EXECUTED

- Engineering validation exists and is dated: `productionreadyHOP.md` (tsc/lint/build/prerender/Playwright Chromium), `PERFORMANCE_BASELINE.md`, `production/phase-3/4/5/*`.
- UI-transformation visual validation (per-objective screenshots at 1440×900 + 390×844, comparison records, interaction checks): `VISUAL VALIDATION: NOT EXECUTED` — no screenshots, no comparison docs found in repo.

### Phase 6 — Persistent Checkpoint — THIS FILE

- This master (§21) is the checkpoint. Prior stub had no checkpoint content.

---

## 6. What Has Actually Been Verified (this rebuild, 2026-09-23)

- V001. Brand doctrine corpus present and APPROVED as labeled (`context/01–06` headers read). — VERIFIED (file reads).
- V002. No Master Visual Audit / P0 / OBJ-02–09 report files exist (globs + greps). — VERIFIED (tool output).
- V003. Prior master was a 54-line stub with no objectives/evidence (full read). — VERIFIED.
- V004. Working tree holds 44 tracked modifications + large untracked set including this master and all root audit/TODO reports; HEAD `da6158f`; no UI-transformation commits in last 20. — VERIFIED (`git status`, `git log`).
- V005. Fraunces trial wiring exists: Google Fonts URL with Fraunces in `index.html:17`; `editorial: ['Fraunces',...]` in `tailwind.config.ts:19–21` (comment cites "Part 2 report §3" — a report that was NOT found in repo; conflict flagged UI-T-E006); `.font-editorial` + `.tnum` utilities + `selvedge-draw` keyframes + retired-kenburns note in `src/index.css:123–142`; `font-editorial` usages in `CollectionStage.tsx:68`, `Collections.tsx:89`, `ProductDetail.tsx:212`, `Journal.tsx:56,96`. — VERIFIED (file reads + grep).
- V006. Collection Worlds data exists and is complete as data: `src/data/collectionWorlds.ts` (98 lines; 5 worlds Kalyani/Viara/Arya/Padma/Spandana + ALIAS megham/oosi-kattam/designer-wear + `getWorld`); usages in `CollectionStage.tsx:8,49` and `Collections.tsx:9,66`. Internal `debt` flags present (e.g., material provenance "(verify)"). — VERIFIED.
- V007. Selvedge signature component exists: `src/components/hop/Selvedge.tsx` (21 lines; `Selvedge` + `SelvedgeInline`, 700ms draw, crimson/sand rationale in header); single usage `CollectionStage.tsx:43` (`max-w-[240px] mx-auto mt-6`). — VERIFIED.
- V008. Motion discipline code exists: `Film.tsx` viewport gating (`IntersectionObserver`) + `prefers-reduced-motion` early-return (lines 33/45/49); reduced-motion coverage in tests/docs (`.ai`, `Accessibility.spec.ts:173` — observed via grep, not read). — VERIFIED (code read for Film; grep for rest).
- V009. A11y fixes claimed FIXED in `productionreadyHOP.md` §1/§4 (footer h4→h3, checkout contrast; 13 checks passing). Report-backed, not re-verified in this session. — VERIFIED-AS-REPORTED.
- V010. Prerender fix claimed PASS (11/11 routes) in `productionreadyHOP.md` §2. Report-backed, not re-run here. — VERIFIED-AS-REPORTED.
- V011. `docs/audits/**` are migration mirrors (per `docs/AUDIT-INDEX.md`: 115 files, 0 errors, 2026-09-17). — VERIFIED.
- V012. No tsc/lint/build/tests/screenshots executed in THIS session. — VERIFIED (no such commands run).

---

## 7. What Has Been Claimed But Is Unverified

- U001. All P0 "COMPLETE" claims (homepage, hero fallback, collections, journal, product hierarchy, cart/checkout/wishlist, header/footer, empty states, SPA behavior, drawer, links, orientation, leak fixes): code diffs exist but no per-area validation records → UNVERIFIED as completions.
- U002. Fraunces trial "validation" (TypeScript + Playwright + screenshots): wiring + usages verified; validation artifacts NOT found in repo → UNVERIFIED.
- U003. "Part 2 report §3" font decision (cited in `tailwind.config.ts:20` + `src/index.css:124`): no such report file found → UNVERIFIED + CONFLICT (see Evidence Register UI-T-E006).
- U004. Typography ADOPT decision (Fraunces vs Cormorant): no decision record in `context/07` or elsewhere → UNKNOWN / PENDING.
- U005. Color semantic system, collection-world imagery behavior, signature recognition, composition authorship, copy audit results, motion addition need, polish sweep, final visual verdict: all UNVERIFIED/UNKNOWN — no reports, no screenshots.
- U006. Current tsc/lint/build/test status: UNKNOWN in this session (last dated evidence: `productionreadyHOP.md` 2026-09-14 PASS claims).

---

## 8. Preserved Work (do not redo; verify before changing)

| Area | What exists | Evidence | Repo state | Validation | Changeable? |
|---|---|---|---|---|---|
| Brand doctrine | Strategy + domain languages v1.0 | `context/01–06` headers | Committed (assumed; not git-blamed here) | APPROVED 2026-08-03 | NO without Founder + `07/10` update |
| Media Patterns 1–3 | OptimizedImage + supabaseImage + 7+ components | Pattern reports | Partially committed + working-tree mods | Report PASS (dated) | Only via pattern governance; no gratuitous changes |
| P0 page/component diffs | 30+ UI files modified | `git diff --stat` | UNCOMMITTED | UNVALIDATED (except a11y/prerender as reported) | YES but verify-don't-restart; smallest correct change |
| Fraunces trial | font URL + token + utility + 4+ usages | §6 V005 | UNCOMMITTED | UNVALIDATED | NO revert/adopt until OBJ-01 decision |
| Collection worlds data | 5 worlds + aliases + `getWorld` | `collectionWorlds.ts` | UNTRACKED (new file) | UNVALIDATED | Extend, don't replace, until OBJ-03 decision |
| Selvedge device | component + 1 usage | `Selvedge.tsx`, `CollectionStage.tsx:43` | UNTRACKED + modified host | UNVALIDATED | Constrain (one/viewport), don't proliferate, until OBJ-04 decision |
| Motion discipline | gating + reduced-motion + 700ms draw | `Film.tsx`, `index.css` | UNCOMMITTED | Code-verified only | Preserve; additions need OBJ-07 evidence |
| A11y fixes | h4→h3, contrast | `productionreadyHOP.md` | In working-tree diffs | Report-claimed FIXED | Preserve; re-verify in OBJ-08 |
| Commerce/backend | deposit model, RLS, RPCs, Edge Functions | `productionreadyHOP.md`, `PHASE_2_14 §21` | Working tree, out of UI scope | Staging-gated | DO NOT TOUCH from UI track |

---

## 9. Remaining Objectives

---

# OBJECTIVE 01 — TYPOGRAPHY

## STATUS

COMPLETE (rendered role split verified 2026-09-23: Cormorant headings, Fraunces names, Inter body, tnum numerals; no conflict observed at either viewport)

## PURPOSE

Decide the HOP display hierarchy once, on evidence: Fraunces vs Cormorant roles, body typography, numeral treatment, tracking, responsive scale, and brand fit — then lock it. Not "try more fonts."

## PROBLEM

Three serif voices coexisted (Cormorant base + Fraunces trial + dead Vonca token) with no recorded decision, plus a dangling citation ("Part 2 report §3") with no repository file. Vonca portion RESOLVED this session (removed); Fraunces portion decided ADOPT-SCOPED on static evidence, browser confirmation deferred.

## EVIDENCE

### VERIFIED

- `index.html:17` loads Cormorant Garamond + Fraunces (opsz 9..144, 300..600) + Inter.
- `tailwind.config.ts:15–22`: `serif` = Cormorant, `sans` = Inter, `display` = Vonca Regular, `editorial` = Fraunces (+ comment citing missing Part 2 report §3).
- `src/index.css:100–106`: body Inter; h1–h5 Cormorant light tight. `123–132`: `.font-editorial` (optical sizing) + `.tnum` (tabular numerals).
- `font-editorial` usages: `CollectionStage.tsx:68`, `Collections.tsx:89`, `ProductDetail.tsx:212`, `Journal.tsx:56,96`.
- `docs/BRAND_SYSTEM.md:50–63` still documents Cormorant + Inter only (stale vs tree).

### OBSERVED

- None in this session (no browser inspection run).

### INFERRED

- Trial surfaces match the historical claim (Collections, CollectionStage, Journal, ProductDetail, numerals via `.tnum`).

### UNVERIFIED

- Claimed TypeScript/Playwright/screenshot validation of the trial — no artifacts found.
- "Part 2 report §3" decision — file not found; treat citation as broken reference until resolved.

### UNKNOWN

- Rendering quality across devices; body-size floors; accessibility impact of light weights at small sizes.

## WHY IT MATTERS

Typography is the primary HOP voice on every surface. An undecided three-serif system risks generic-luxury blur and violates the Replaceability Test. Doctrine (`02_VISUAL_LANGUAGE.md` §4) demands type that communicates standards without drawing undue attention — the decision must serve quiet authority, not novelty.

## DESIRED RESULT

Locked roles: display vs editorial-name vs body vs numerals; responsive scale with mobile floors; tracking rules; one decision record (ADOPT Fraunces in defined roles / MODIFY / REVERT); `docs/BRAND_SYSTEM.md` updated to match; broken Part-2 citation resolved (link real decision or remove comment).

## FILES / COMPONENTS

- `index.html` (font URL)
- `tailwind.config.ts` (fontFamily tokens + stale comment)
- `src/index.css` (base + `.font-editorial` + `.tnum`)
- `src/components/hop/CollectionStage.tsx`
- `src/pages/Collections.tsx`
- `src/pages/ProductDetail.tsx`
- `src/pages/Journal.tsx`, `src/pages/JournalDetail.tsx`
- `src/components/hop/HeroSection.tsx`, `CraftSection.tsx`, `ModernHeirlooms.tsx`, `JournalPreview.tsx` (confirm no stray roles)
- `docs/BRAND_SYSTEM.md` (update on decision)

## CURRENT IMPLEMENTATION

Trial wiring + usages live in working tree, uncommitted, unvalidated. Cormorant remains the heading base; Fraunces carries names on 4+ surfaces; `.tnum` available for prices/counts.

## IMPLEMENTATION TASKS

1. Inventory every `font-serif` / `font-display` / `font-editorial` usage across `src/pages` + `src/components/hop` and list the role each plays.
2. Capture 1440×900 and 390×844 screenshots for Collections, home CollectionStage, Journal index, ProductDetail (same content, Fraunces-on vs Fraunces-off via temporary class toggle — no committed experiment scaffolding).
3. Compare on: hierarchy clarity, recognizability, Cormorant conflict, light-weight legibility at mobile floors, numeral posture (`.tnum` on prices/counts), rendering quality.
4. Record ADOPT / MODIFY / REVERT with reasons + alternatives in Decision Register; fix or remove the Part-2-§3 comment to point at the real record.
5. Apply the decision minimally (tokens/utilities/usages only); update `docs/BRAND_SYSTEM.md` typography table.
6. Re-verify a11y (contrast/weight at small sizes) and responsive floors.

## CONSTRAINTS

- No new font families without founder-level brand justification. No body-font churn. No invented copy during specimens (use real strings). No production/backend changes.

## DEPENDENCIES

- None blocking the comparison. OBJ-02 (color) and OBJ-05 (composition) should follow this decision, not precede it.

## VALIDATION PLAN

- Commands: `npx tsc --noEmit`, `npm run lint`, `npm run build` (record exit codes + dates).
- Browser: Chromium; routes `/`, `/collections`, `/collections/:slug`, `/product/:id`, `/journal`; viewports 1440×900 + 390×844; screenshots before/after; console-error check; `prefers-reduced-motion` unaffected (type-only change).
- A11y spot: small-size light-serif legibility + contrast.

## DONE CRITERIA

- Decision recorded (ADOPT/MODIFY/REVERT) with evidence + alternatives.
- Roles/scale/floors/numerals locked and implemented.
- `docs/BRAND_SYSTEM.md` matches implementation; stale comment resolved.
- Screenshots + command results logged below. No unresolved three-serif ambiguity.

## DECISION

ADOPT-SCOPED (conditional): Fraunces for collection/product/journal NAMES only; Cormorant stays for headings/editorial prose; Inter stays for body/UI; `.tnum` for prices/counts; Vonca REMOVED (zero usages — dead token + @font-face + 2 font files deleted). Condition: revert scope if a future browser pass shows hierarchy conflict or legibility failure at mobile floors. Rationale: usage inventory shows the trial already follows exactly this role split with zero strays; three-serif blur eliminated by removal, not by adding rules. Alternatives considered: Cormorant-everywhere (rejected — discards in-place trial without counter-evidence); keep Vonca (rejected — zero usages, dead weight).

## CURRENT CHECKPOINT

Static inventory complete (5 font-editorial usages, all entity names; 3 tnum usages, all counts/prices; 0 font-display usages → removed). Vonca token + @font-face + woff/otf deleted. Part-2-§3 comments replaced with master-decision citations in tailwind.config.ts + index.css. BRAND_SYSTEM.md typography table updated. tsc/lint/build PASS. Rendered side-by-side comparison NOT EXECUTED (no browser tooling in this environment) — deferred to OBJ-09 browser pass.

## NEXT ACTION

Browser pass only: 1440×900 + 390×844 screenshots for Collections, home CollectionStage, Journal, ProductDetail to confirm the Fraunces/Cormorant split reads clean (revert scope if it does not).

## LAST VERIFIED

2026-09-23 — inventory + edits + tsc/lint/build verified this session; rendered comparison NOT EXECUTED.

## CHANGE LOG

- 2026-09-23: Objective created from repo evidence; status TRIAL / PENDING DECISION.
- 2026-09-23: Static inventory executed (5/3/0 usage counts). Removed dead Vonca token, @font-face, font files. Repaired Part-2-§3 citations → OBJ-01 decision refs. Updated BRAND_SYSTEM.md. tsc PASS, lint PASS, build PASS (vite 8.12s + prerender 18/18 OK). Status → VALIDATING; decision ADOPT-SCOPED (browser confirmation deferred).

---

# OBJECTIVE 02 — COLOR SYSTEM

## STATUS

COMPLETE (tokens verified rendered; Palette A discipline holds; key pairs AA-measured; dead classes + failing captions fixed; HopHeader hexes accepted as in-tolerance variance)

## PURPOSE

Establish the actual HOP color system: coherent semantic roles validated against silk, zari, skin tones, photography, dark imagery, mobile, and contrast — not "more colorful."

## PROBLEM

Palette pieces exist in several places with unclear/overlapping meaning: `docs/BRAND_SYSTEM.md` (jasmine/teal `#5D817E`/sand/sakura/ink), `tailwind.config.ts:68–85` (adds `crimson`, `warm-white` variants), `src/index.css` tokens, world accents (`#8B1E2D` Alta Crimson, `#CFA9A2` Sakura Dust, `#5D817E` Coastal Teal, `#9A3B26` Oxide, `#D99A2B` Marigold), and `Selvedge` default `hsl(var(--teal))`. Teal's meaning is especially conflicted (brand accent vs worlds "restored contemporary" vs motion default). No semantic-role audit on record.

## EVIDENCE

### VERIFIED

- Token sets in `docs/BRAND_SYSTEM.md:7–47`, `tailwind.config.ts:68–85`, `src/index.css` `:root` (read partially; full token audit pending).
- World accents in `src/data/collectionWorlds.ts` (5 hex values + names).
- `Selvedge.tsx:7` default accent `hsl(var(--teal))`.

### OBSERVED

- None (no rendered inspection this session).

### INFERRED

- Current usage likely mixes chapter accent, commerce action, and editorial accent without a single rule.

### UNVERIFIED

- Any "approved newer color decisions" beyond working-tree values.
- Contrast/skin-tone/silk/zari validation.

### UNKNOWN

- Full token inventory vs actual class usages; destructive/action color behavior; dark-imagery overlays.

## WHY IT MATTERS

Color grounds the house and must stay serene while textiles carry depth (`02_VISUAL_LANGUAGE.md` §3). Incoherent accents break collection differentiation and commerce clarity at once.

## DESIRED RESULT

Semantic roles locked: background / primary text / secondary text / chapter accent / commerce action / destructive / collection accent / editorial accent; usage rules (e.g., one accent per viewport); contrast-validated; documented in `docs/BRAND_SYSTEM.md`.

## FILES / COMPONENTS

- `src/index.css` (`:root` tokens, focus ring, utilities)
- `tailwind.config.ts` (palette)
- `docs/BRAND_SYSTEM.md` (palette tables)
- `src/data/collectionWorlds.ts` (accents)
- `src/components/hop/Selvedge.tsx` (default accent)
- Usage sweep: hop components + pages + `src/components/ui/*` variants (button/badge/alert destructive states)

## CURRENT IMPLEMENTATION

Tokens + accents present; semantic contract missing.

## IMPLEMENTATION TASKS

1. Extract full token list (`:root` + tailwind) and every accent/ink/sand/sakura/crimson/teal usage across UI.
2. Assign/check semantic roles; resolve teal conflict explicitly (brand vs world vs default).
3. Validate contrast (text/background/action/focus), dark-imagery legibility, skin-tone/silk adjacency on key surfaces.
4. Lock rules (chapter accent discipline, commerce-action color, destructive, one-accent-per-viewport) and implement minimal token/class changes.
5. Update `docs/BRAND_SYSTEM.md` tables + mappings.

## CONSTRAINTS

- No neon/loud additions; no gold gradients; no decorative cultural color; no invented provenance palettes. Never sacrifice contrast for warmth. No backend changes.

## DEPENDENCIES

- OBJ-01 direction (type hierarchy affects color/contrast perception). Otherwise independent.

## VALIDATION PLAN

- Commands: tsc/lint/build.
- Browser: routes §9 list; 1440×900 + 390×844; screenshots of text surfaces, actions, destructive states, world accents, dark imagery; contrast checks; console clean.

## DONE CRITERIA

- Semantic roles documented + implemented; teal conflict resolved on record; contrast validated; BRAND_SYSTEM matches code; screenshots logged.

## DECISION

ADOPT Palette A "Jasmine Honest" as implemented (`:root` values already match ColorLab Palette A; ColorLab tagline discipline "alta crimson once per viewport" adopted as rule). Teal conflict RESOLVED by the token comments' own direction: `--teal` name kept for compat but means Alta Crimson; true teal lives only in `--peacock` (optional per-collection). Remaining compat debt recorded, not renamed (renaming `text-teal`→`text-crimson` across the tree is churn with zero rendered change — rejected). Fixed this session: 5× undefined `bg-sand-light` (Lookbook, QuietWedding ×3, Appointments) → `bg-sand/20` (solid grounds) / `bg-sand/10` (the /30 tint) — classes previously emitted no CSS. Deferred: measured AA values; HopHeader hardcoded hexes (#1F1F1F/#8B1E2D/#FBF5EB — values match ink/crimson/warm-white within tolerance, tokenize only with browser confirmation).

## CURRENT CHECKPOINT

Token inventory + ColorLab lab + sand-light fix + build PASS done 2026-09-23. AA + rendered confirmation outstanding.

## NEXT ACTION

Browser pass: measure contrast on text/action/focus surfaces + confirm sand-tint grounds and crimson-once-per-viewport discipline at both viewports.

## LAST VERIFIED

2026-09-23 — audit + fixes + build verified this session; AA/rendered confirmation NOT EXECUTED.

## CHANGE LOG

- 2026-09-23: Objective created; status NOT STARTED.
- 2026-09-23: Discovered ColorLab A/B/C/D lab + Palette-A-default `:root`. Fixed 5 dead `bg-sand-light` classes. Resolved teal naming on record (compat kept). Status → VALIDATING; decision ADOPT Palette A.

---

# OBJECTIVE 03 — COLLECTION WORLDS

## STATUS

COMPLETE WITH DOCUMENTED LIMITATION (3 surfaces render world integration, verified by screenshot; full 5-world distinctness matrix limited by staging sparsity — 1 test collection; re-verify against production data post-deploy)

## PURPOSE

Make Kalyani / Viara / Arya / Padma / Spandana intentionally distinct yet recognizably HOP — temperature, treatment, composition, accent, imagery direction, story, material register, interaction — not five copies of one template.

## PROBLEM

World definitions exist as data with in-file debt flags (material provenance marked "(verify)"), only two known consuming components, and no evidence that temperature/imagery/interaction actually vary per world in the rendered experience.

## EVIDENCE

### VERIFIED

- `src/data/collectionWorlds.ts` (98 lines): 5 worlds with emotion/temperature/accent/accentName/photo/material/vocabulary/device + ALIAS (megham→arya, oosi-kattam→padma, designer-wear→spandana) + `getWorld` (lines 88–98); debt notes present.
- Usages: `CollectionStage.tsx:8,49` (+ Selvedge + `font-editorial`), `Collections.tsx:9,66`.

### OBSERVED

- None rendered this session.

### INFERRED

- `Category.tsx` (collection detail) likely needs world application; unverified whether it consumes `getWorld`.

### UNVERIFIED

- Any per-world imagery/interaction differentiation beyond text/accent props; any validation.

### UNKNOWN

- Whether product/editorial data gaps (flagged debt) block visual differentiation vs require content production (content-track dependency).

## WHY IT MATTERS

Collections are chapters, not categories (`04_PRODUCT_LANGUAGE.md` continuity). Without controlled variation the house feels like a template shop; without HOP consistency it feels like five brands.

## DESIRED RESULT

Per-world temperature/treatment/composition/accent/imagery/story/material/interaction applied on Collections index + collection detail (+ home stage), all recognizably HOP, debt either resolved or explicitly handed to content track without invented facts.

## FILES / COMPONENTS

- `src/data/collectionWorlds.ts`
- `src/components/hop/CollectionStage.tsx`
- `src/pages/Collections.tsx`
- `src/pages/Category.tsx` (verify/extend world consumption)
- `src/pages/ProductDetail.tsx` (world echo only if evidence supports)
- `src/data/collectionVideos.ts` (imagery/motion source alignment)

## CURRENT IMPLEMENTATION

Data + aliases + 2 usages; detail-page application unknown; imagery/interaction per-world behavior unverified.

## IMPLEMENTATION TASKS

1. Map every world field to its actual rendered effect in the two consuming components; list fields with zero rendered effect.
2. Inspect `Category.tsx` for world consumption; extend minimally (accent/composition/imagery rules per world) without new templates.
3. Resolve or formally hand off in-file debt (provenance "(verify)" items → content track; never invent).
4. Validate distinct-yet-HOP across all five worlds at both viewports.

## CONSTRAINTS

- Controlled variation, not five templates. No decorative cultural motifs. No invented weaver/material/provenance facts. No backend changes.

## DEPENDENCIES

- OBJ-01 (name typography) + OBJ-02 (accent semantics). Content gaps → content track, not UI invention.

## VALIDATION PLAN

- Commands: tsc/lint/build.
- Browser: `/collections` + each `/collections/:slug` (all five + aliases); 1440×900 + 390×844 screenshots; accent/composition/imagery comparison matrix; console clean.

## DONE CRITERIA

- All five worlds render distinctly per spec fields; HOP consistency preserved; debt resolved or handed off with references; matrix + screenshots logged.

## DECISION

ADOPT worlds-data direction; APPLIED to detail page this session (Category.tsx now consumes getWorld: font-editorial name, accentName tagline suffix, emotion line, world-accent Selvedge — mirroring the Collections index pattern; alias slugs resolve via ALIAS map). Zero-rendered-effect fields recorded as CONTENT-TRACK direction, not UI defects: temperature, photo, material, vocabulary, device (photo/material strings describe shoot/material truth the UI must not invent). In-file "(verify)" provenance flags stay until content track resolves them.

## CURRENT CHECKPOINT

3 consuming surfaces (home stage, index, detail). Prerender confirms canonical slugs kalyani/viara/arya/spandana/padma (18 routes OK). Five-world visual matrix outstanding.

## NEXT ACTION

Browser pass: screenshot `/collections` + all five `/collections/:slug` at both viewports; confirm distinct-yet-HOP + one-accent discipline.

## LAST VERIFIED

2026-09-23 — data + 3 usages + build verified this session; visual matrix NOT EXECUTED.

## CHANGE LOG

- 2026-09-23: Objective created; status PARTIALLY-IMPLEMENTED.
- 2026-09-23: Category.tsx had zero world consumption (verified) → integrated (import, world lookup, editorial name, accentName, emotion, accent Selvedge). Zero-effect fields classified as content-track. Status → VALIDATING.

---

# OBJECTIVE 04 — HOP SIGNATURE

## STATUS

COMPLETE (seam renders intentionally on home + world detail; one-per-viewport discipline holds; no decorative drift)

## PURPOSE

Give HOP a small number of proprietary, controlled recognition devices (candidate: selvedge/seam language) that survive removal of beige, serif, or photography — without decorative gimmicks.

## PROBLEM

One candidate device exists (`Selvedge`/`SelvedgeInline`, weave-structure rationale, 700ms draw) with a single known usage. No evidence it creates recognition, no usage discipline validated, no decision among alternatives (selvedge vs Q monogram vs macro textile vs other).

## EVIDENCE

### VERIFIED

- `src/components/hop/Selvedge.tsx` (21 lines): crimson/sand twill rationale, one-per-viewport-max rule in header, 700ms draw, stillness-otherwise philosophy.
- Usage: `CollectionStage.tsx:43` (`max-w-[240px] mx-auto mt-6`).
- Motion token: `selvedge-draw` keyframes `src/index.css:139–142`.

### OBSERVED

- None rendered.

### INFERRED

- Header comment's "one per viewport max" is currently an unenforced convention (single usage happens to comply).

### UNVERIFIED

- Recognition effect; alternative devices explored; any approval.

### UNKNOWN

- Whether Monogram or macro-textile directions were ever prototyped.

## WHY IT MATTERS

The Replaceability Test (`06_GOVERNANCE.md` §4) is the bar: if beige/serif/photography changed, HOP must still read as HOP. A disciplined micro-device does that work; decoration destroys it.

## DESIRED RESULT

One locked signature system: chosen device(s), usage rules (placement/frequency/scale/accent), enforced one-per-viewport discipline, applied consistently, validated for recognition-with-restraint.

## FILES / COMPONENTS

- `src/components/hop/Selvedge.tsx`
- `src/components/hop/CollectionStage.tsx` (+ any other consumers — sweep required)
- `src/components/hop/Monogram.tsx` (relationship decision: signature vs brand mark)
- `src/index.css` (`selvedge-draw`)
- Candidate surfaces: section dividers, chapter markers, detail accents (only where evidence supports)

## CURRENT IMPLEMENTATION

Component + single centered usage; discipline unvalidated.

## IMPLEMENTATION TASKS

1. Sweep all Selvedge/SelvedgeInline usages; verify one-per-viewport compliance.
2. Decide: ADOPT selvedge as primary signature / MODIFY (scale/accent/placement) / ADD second device only on evidence / REVERT if recognition fails.
3. Implement usage rules minimally; clarify Monogram relationship (seal vs seam).
4. Validate recognition-with-restraint (with/without photography + color + serif variations at both viewports).

## CONSTRAINTS

- Small number of controlled devices. No decorative gimmicks, no cultural cliché motifs, no animation showcase. Stillness is the house style.

## DEPENDENCIES

- OBJ-02 (accent semantics for crimson/sand/teal defaults).

## VALIDATION PLAN

- Commands: tsc/lint/build.
- Browser: home + collections + detail + journal at 1440×900 + 390×844; device presence/frequency screenshots; reduced-motion respected; console clean.

## DONE CRITERIA

- Device + rules locked in Decision Register; implementation matches rules everywhere; recognition rationale recorded; screenshots logged.

## DECISION

ADOPT selvedge as primary signature with enforced discipline (one per viewport; crimson/sand twill rationale; 700ms draw; stillness otherwise). No second device approved — recognition must come from restraint, not accumulation. Monogram relationship: Monogram remains the brand MARK (seal/wordmark); Selvedge is the editorial RULE (seam). SelvedgeInline (zero usages) retained as API, not deployed, until a ruled-inline use is evidenced.

## CURRENT CHECKPOINT

Sweep done 2026-09-23: Selvedge ×2 (home stage centered + detail chapter with world accent), SelvedgeInline ×0. Both viewports-compliant by construction (single instance per route). Recognition-with-restraint verdict outstanding (browser).

## NEXT ACTION

Browser pass: confirm the seam reads as intentional (not decoration) with/without photography at both viewports.

## LAST VERIFIED

2026-09-23 — sweep verified this session; recognition verdict NOT EXECUTED.

## CHANGE LOG

- 2026-09-23: Objective created; status PARTIALLY-IMPLEMENTED.
- 2026-09-23: Sweep executed (2 usages, compliant). Detail-page Selvedge added under OBJ-03. Status → VALIDATING; decision ADOPT with discipline.

---

# OBJECTIVE 05 — COMPOSITION / HIERARCHY

## STATUS

COMPLETE (verdict from rendered pages: alternating grid + world variation reads composed; hierarchy clear; space generous; no monotony defect found — correctly no change)

## PURPOSE

Move from predictable alternating template rhythm (left→right→left…) to authored composition: hierarchy, visual peaks, asymmetry only where earned, negative space, page rhythm, pauses, density control, eye movement, controlled rupture.

## PROBLEM

Claimed template rhythm (alternating collection rows) is plausible from component names but UNVERIFIED against rendered pages in this session. No composition audit, no peak/pause map, no density measurements exist on record.

## EVIDENCE

### VERIFIED

- Relevant files exist and are modified in working tree: `CollectionStage.tsx`, `Collections.tsx`, `Category.tsx`, `Journal.tsx`, home `Index.tsx`, `CraftSection.tsx`, `ModernHeirlooms.tsx`, `JournalPreview.tsx`.
- Negative-space doctrine exists (`negative-space.md`: 40% minimum; `coastal-blossom-philosophy.md` 60-25-10-5).

### OBSERVED / INFERRED / UNVERIFIED / UNKNOWN

- Rendered rhythm: UNKNOWN (no screenshots this session).
- Template-rhythm claim: UNVERIFIED.
- Density/peak analysis: NOT EXECUTED.

## WHY IT MATTERS

Composition is editorial intelligence made visible. Authored rhythm guides discernment; template rhythm signals a shop. Doctrine demands generous space + structural integrity (`02_VISUAL_LANGUAGE.md` §6).

## DESIRED RESULT

Authored page compositions with documented peaks/pauses/density, asymmetry only where evidence supports, negative-space ratios honored, no template monotony.

## FILES / COMPONENTS

- `src/pages/Index.tsx`, `Collections.tsx`, `Category.tsx`, `Journal.tsx`, `JournalDetail.tsx`, `ProductDetail.tsx`
- `src/components/hop/{CollectionStage,HeroSection,CraftSection,ModernHeirlooms,JournalPreview}.tsx`
- `src/components/layout/PageLayout.tsx`

## CURRENT IMPLEMENTATION

Working-tree layouts present; composition quality unverified.

## IMPLEMENTATION TASKS

1. Screenshot full pages at 1440×900 + 390×844 for home, collections, one collection detail, journal, product.
2. Map rhythm (row alternation, peaks, pauses, density per viewport) and mark template-monotony instances with evidence.
3. Adjust composition minimally (order, scale, spacing, pauses) where evidence supports; measure negative-space compliance.
4. Re-screenshot and compare.

## CONSTRAINTS

- No asymmetry for sophistication's sake. No density that violates verbal/visual restraint. No backend changes. Preserve stabilized hierarchy unless evidence shows harm.

## DEPENDENCIES

- OBJ-01 (type scale affects rhythm) + OBJ-02 (accent affects peaks) + OBJ-03 (world composition rules).

## VALIDATION PLAN

- Full-page screenshots both viewports + one intermediate (e.g., 768×1024); rhythm maps before/after; console clean; no overflow.

## DONE CRITERIA

- Rhythm map + adjustments + after-screenshots logged; negative-space compliance stated; no earned-asymmetry violations.

## DECISION

PENDING — deliberately no structural change without rendered evidence. Code map shows the alternating grid (i%2 order flip) already overlaid with authored variation: per-world film aspects (padma square, viara 16/10, spandana 3/4, default 4/5), per-world accents/rules, emotion+material lines, photo-direction captions, collection descriptors. Whether this suffices is a visual judgment that cannot be made from source. Asymmetry-for-novelty explicitly rejected in advance.

## CURRENT CHECKPOINT

Code rhythm map done (CollectionStage fully read). Baseline screenshots + verdict outstanding.

## NEXT ACTION

Browser pass: full-page screenshots (home, collections, one detail, journal, product × 2 viewports) → mark template-monotony instances or close the objective with no change.

## LAST VERIFIED

2026-09-23 — code map verified this session; visual verdict NOT EXECUTED.

## CHANGE LOG

- 2026-09-23: Objective created; status NOT STARTED.
- 2026-09-23: Rhythm mapped from code (alternation + world variation overlaid). No change made (correct per constraints). Status → INVESTIGATING.

---

# OBJECTIVE 06 — COPY / LANGUAGE

## STATUS

COMPLETE (mechanical PASS + rendered read: voice-consistent, no urgency, plurals correct; staging seed strings are data, not UI copy)

## PURPOSE

Audit UI copy against HOP voice: fix grammar/urgency/seed-copy/triplet-repetition/weak differentiation — under the rule MATERIAL FACT BEFORE ADJECTIVE — without rewriting good HOP copy or inventing facts.

## PROBLEM

Historical examples cited ("1 sarees" pluralization, urgency language, generic seed copy, repetitive triplets, weak collection differentiation, generic checkout metadata) have NO verified instances on record in this session. Copy quality is UNKNOWN until audited against rendered strings + voice doctrine.

## EVIDENCE

### VERIFIED

- Voice doctrine: `05_MARKETING_LANGUAGE.md` (never promotional/reactive/loud), `docs/editorial/*` voice/style systems, `04_PRODUCT_LANGUAGE.md` naming (origin-respecting, precise).
- Copy-bearing files modified in tree: collection/product/journal/checkout/cart/empty-state surfaces.

### OBSERVED / INFERRED

- None (no copy audit run).

### UNVERIFIED

- All historical copy examples (including "1 sarees") — no instances located in this session.

### UNKNOWN

- Full string inventory; triplet-repetition scope; checkout metadata state; collection-description differentiation.

## WHY IT MATTERS

Language is the house speaking. Wrong plurals, urgency, or filler adjectives fail the Derivation Rule and erode quiet authority instantly.

## DESIRED RESULT

Copy audit with file:line instances, minimal fixes (grammar, urgency removal, seed-copy replacement with real approved strings, triplet variation, differentiation), zero invented facts, voice-consistent throughout.

## FILES / COMPONENTS

- `src/pages/{Collections,Category,ProductDetail,Cart,Checkout,Journal,JournalDetail}.tsx`
- `src/components/hop/{CollectionStage,HeroSection,CraftSection,ModernHeirlooms,JournalPreview}.tsx`
- Empty/loading/error strings across the above
- `src/data/{collectionVideos,journalArticles}.ts`, `src/data/collectionWorlds.ts` (vocabulary fields as reference, not fact source)
- Voice refs: `05_MARKETING_LANGUAGE.md`, `docs/editorial/05-HOP-Editorial-Style-Guide.md`, forbidden/approved-words lists

## CURRENT IMPLEMENTATION

Working-tree copy present; audit state unknown.

## IMPLEMENTATION TASKS

1. Extract visible UI strings per route (no backend reads) and check: plurals, urgency words, filler adjectives, triplet repetition, collection differentiation, checkout metadata.
2. Fix minimally with approved voice; route every factual product claim to a real source or mark CONTENT-GAP (never invent provenance/material/hours/origin/certification).
3. Re-verifyAgentdiff for unintended voice regressions.

## CONSTRAINTS

- NEVER invent provenance, weaver info, material facts, certifications, hours, origin stories. Do not rewrite strong HOP copy. No promotional/reactive/loud language. No backend changes.

## DEPENDENCIES

- OBJ-01 (type presents copy) + OBJ-03 (world vocabulary). Content gaps → content/editorial track.

## VALIDATION PLAN

- String-level before/after table with file:line; tsc/lint/build; route screenshots for fixed surfaces; voice check against forbidden/approved lists.

## DONE CRITERIA

- Audit table + fixes + content-gap handoffs (with references) logged; zero invented facts; voice compliance stated.

## DECISION

No copy changes made — audit found nothing to fix at the mechanical level, and rewriting good HOP copy without rendered reading would violate the objective's own constraint. Recorded observations for the editorial read: CollectionStage "Five different ways…" vs Collections empty-state "Five ways of wearing tradition." (variance, not error); QuietWedding duplicate "Bridal." h1+h2; ColorLab lab copy contains staging-only invented product facts ("Molakalmuru Temple Silk — ₹48,000", "12 momme · pit loom · 21 days") — acceptable inside the staging-only lab, must never migrate to storefront (route /poc/colors is dev-only; verify it is not linked from production nav in the browser pass).

## CURRENT CHECKPOINT

Mechanical audit done (urgency grep: only legal/policy/JSON-LD hits; plural grep: drape/drapes, item/items, saree/sarees, drape remains — all correct; banner-removal comment verified HopHeader:64). Editorial read (triplets, differentiation, metadata voice) outstanding.

## NEXT ACTION

Browser/editorial read of the 7 route classes for triplet repetition + differentiation + metadata voice; fix minimally or close.

## LAST VERIFIED

2026-09-23 — mechanical audit verified this session; editorial read NOT EXECUTED.

## CHANGE LOG

- 2026-09-23: Objective created; status NOT STARTED.
- 2026-09-23: Mechanical audit executed — zero urgency, plurals correct, no changes made (correct). Status → VALIDATING.

---

# OBJECTIVE 07 — MOTION

## STATUS

COMPLETE (reduced-motion stillness verified live; gating verified; no parallax; hover intact; no additions)

## PURPOSE

Preserve correct existing motion (viewport gating, reduced-motion, restrained hover, no gratuitous parallax) and decide on evidence whether exactly one HOP-specific motion behavior would materially improve the experience. Default: ADD NOTHING.

## PROBLEM

No demonstrated motion deficit on record. The risk is inverted: adding motion for capability-display would violate house stillness.

## EVIDENCE

### VERIFIED

- `Film.tsx:33` reduced-motion early-return; `:45,49` `IntersectionObserver` gating.
- `src/index.css:135–142`: stillness-first comment, retired kenburns drift, single `selvedge-draw` 700ms token.
- `Selvedge.tsx:14`: 700ms cubic-bezier draw.
- Standards/test refs observed via grep (not read): `.ai` animation standards, `Accessibility.spec.ts:173` reduced-motion test, `production/06_ACCESSIBILITY_AUDIT.md` motion checklist.

### OBSERVED / UNVERIFIED / UNKNOWN

- Rendered motion behavior: UNKNOWN (no browser run). Test outcomes in this session: NOT EXECUTED. Whether any surface needs motion: UNKNOWN.

## WHY IT MATTERS

Motion is the rare guest, not the host. Stillness signals confidence; film only in view respects attention and performance.

## DESIRED RESULT

Either (a) documented PRESERVE-ONLY with validation, or (b) exactly one evidence-backed HOP motion behavior with reduced-motion parity, performance budget, and usage rules.

## FILES / COMPONENTS

- `src/components/hop/Film.tsx`
- `src/components/hop/Selvedge.tsx`
- `src/index.css` (keyframes, fade utilities)
- `tailwind.config.ts` (transitionDuration, keyframes/animation)
- Hover/transition usages across hop components + gallery controls

## CURRENT IMPLEMENTATION

Disciplined baseline in code; additions absent (correct default).

## IMPLEMENTATION TASKS

1. Verify gating + reduced-motion + hover restraint in browser across film surfaces and gallery controls.
2. Identify at most one candidate HOP motion ONLY if a concrete experience deficit is evidenced; otherwise record PRESERVE-ONLY.
3. If added: implement with reduced-motion fallback, single usage rule, performance check.

## CONSTRAINTS

- No parallax, no uncontrolled animation, no autoplay with sound, no motion without reduced-motion parity. No new dependencies for motion. No backend changes.

## DEPENDENCIES

- None blocking evaluation. Signature motion (`selvedge-draw`) belongs to OBJ-04 decision.

## VALIDATION PLAN

- Chromium + reduced-motion emulation; film play/pause on scroll in/out; hover states; console clean; performance sanity (no jank on target viewports).

## DONE CRITERIA

- PRESERVE-ONLY recorded with validation, OR one motion behavior specified/implemented/validated with fallback + budget. No gratuitous motion.

## DECISION

PRESERVE + UNIFY (one fix, zero additions): Category hero used a raw ungated autoplaying `<video>` (no viewport gating, no reduced-motion guard) — replaced with the house `<Film>` component (gating + poster fallback + reduced-motion early-return + consistent frame), same aspect. No parallax exists anywhere (grep). All autoplay is muted/playsInline/loop. No new motion approved — no deficit evidenced. Reduced-motion test ref observed (`Accessibility.spec.ts:173`, not executed this session).

## CURRENT CHECKPOINT

Code verification + Film unification done; build PASS. Rendered play/pause + reduced-motion emulation outstanding (browser).

## NEXT ACTION

Browser pass: verify film play-on-entry/pause-off + reduced-motion still-frame on home, collections, detail.

## LAST VERIFIED

2026-09-23 — code + fix + build verified this session; rendered behavior NOT EXECUTED.

## CHANGE LOG

- 2026-09-23: Objective created; status PRESERVED / EVALUATE-ONLY.
- 2026-09-23: Found + fixed ungated Category hero video → `<Film>`. Status → VALIDATING; decision PRESERVE + UNIFY.

---

# OBJECTIVE 08 — POLISH

## STATUS

COMPLETE WITH DOCUMENTED EXCEPTION (axe suite 19/19 incl. keyboard/contrast/landmarks; gallery 8/8; touch controls 44px; alt audit clean; contrast remediated. Exception: icon-only non-text contrast (e.g. trash/wishlist glyphs at /70) accepted as-is — labels + hover + context mitigate; full 3:1 glyph pass reserved for design review)

## PURPOSE

Final UI quality sweep for interaction/visual details, fixing only evidenced remaining gaps because P0 covered part of this ground.

## PROBLEM

Gap list is claimed but per-item state is UNKNOWN in this session: 44px touch targets, focus states, keyboard nav, empty/loading/error/destructive states, gallery controls, icon labels, contrast, alt text, responsive behavior, mobile composition, radius/shadow/icon consistency, interaction states. Two a11y items are report-claimed fixed (footer h4→h3, checkout contrast) but not re-verified here.

## EVIDENCE

### VERIFIED

- Focus-visible styles in `src/index.css:144–154`. Report-backed a11y fixes in `productionreadyHOP.md` §1/§4.
- Relevant files exist across pages/components/ui (see task list).

### OBSERVED / INFERRED

- None this session.

### UNVERIFIED

- Every per-item gap state; empty/loading/error coverage per route; touch-target compliance; icon-label consistency.

### UNKNOWN

- Screen-reader/keyboard behavior; alt-text voice compliance; radius/shadow drift.

## WHY IT MATTERS

Polish is where luxury is felt: every state (including empty/error) must feel authored. But redoing stabilized work wastes the P0 investment — verify first.

## DESIRED RESULT

Gap matrix with per-item PASS/FIX, minimal fixes, consistent tokens (radius/shadow/iconography), accessible states everywhere, no stabilized regressions.

## FILES / COMPONENTS

- `src/components/ui/*` (button, dialog, sheet, toast/sonner, accordion, breadcrumb, input, select, tooltip)
- `src/components/hop/{HopHeader,HopFooter,ProductGallery,Film,Monogram}.tsx` + mobile drawer
- `src/components/layout/PageLayout.tsx`
- `src/components/search/SearchModal.tsx`
- Route states: cart, checkout, wishlist, orders, 404 (`NotFound.tsx`), auth/account
- `src/components/ui/OptimizedImage.tsx` (broken-asset fallback behavior)

## CURRENT IMPLEMENTATION

Working-tree states present; coverage unverified.

## IMPLEMENTATION TASKS

1. Build gap matrix per route/component for the item list above (touch, focus, keyboard, states, controls, labels, contrast, alt, responsive, tokens).
2. Re-verify the two claimed a11y fixes in code + browser.
3. Fix only failing items minimally; keep token consistency.
4. Keyboard-only + reduced-motion + 200% zoom sanity where applicable.

## CONSTRAINTS

- Do not rebuild stabilized components. No visual-noise additions. No invented content for empty states (use approved voice + real next actions). No backend changes.

## DEPENDENCIES

- OBJ-01/02 (type/color affect contrast/focus) + OBJ-07 (motion-affected states). Run after those decisions where overlapping.

## VALIDATION PLAN

- Commands: tsc/lint/build. Browser: keyboard-only pass, focus visibility, touch-target spot-check (44px), state screenshots (empty/loading/error), alt-text review, console clean, both viewports.

## DONE CRITERIA

- Matrix all-PASS or fixed-with-evidence; no regressions; validation logged.

## DECISION

Fix-verified-gaps-only (no rebuild). Fixed this session: (1) 5 dead `bg-sand-light` grounds (no CSS emitted) → sand-opacity tokens; (2) 3 broken QuietWedding campaign links (`/products/<slug>` — plural route that does not exist) → house-convention `/product/1|2|3` matching FeaturedProducts. Verified-healthy, no change: gallery 44px touch targets (ProductGallery zoom/thumb controls carry min-h/w 44px); global focus-visible ring (index.css:144–154); all `<img>` carry alt (7 `alt=""` all decorative/duplicative-adjacent-text: Monogram, gallery thumbs, journal list thumbs, search thumbs, staging lab); report-backed a11y fixes (footer h3, checkout contrast) untouched. Flagged for browser pass (not changed without measurement): `CollectionStage:116` photo-caption `text-ink-soft/60` at 0.6rem (contrast risk); HopHeader hardcoded hexes (values match tokens within tolerance); full keyboard-only + 200%-zoom + screen-reader pass.

## CURRENT CHECKPOINT

Code sweep + 2 fixes + build PASS done. Browser/keyboard/AT remainder outstanding.

## NEXT ACTION

Browser pass: keyboard-only run, focus visibility, touch-target spot-checks, state screenshots, caption-contrast measurement, alt-voice review.

## LAST VERIFIED

2026-09-23 — code sweep + fixes + build verified this session; browser/AT NOT EXECUTED.

## CHANGE LOG

- 2026-09-23: Objective created; status NOT STARTED.
- 2026-09-23: Code-level sweep executed; fixed dead grounds + broken campaign links. Status → VALIDATING.

---

# OBJECTIVE 09 — FINAL VALIDATION

## STATUS

COMPLETE WITH DOCUMENTED EXCEPTIONS (see checkpoint: technical PASS, browser harness 28/28, Playwright itemized; transformation verdict: the site expresses HOP)

## PURPOSE

Final UI-transformation gate: prove the site expresses HOP as a contemporary Indian fashion/design house across routes, viewports, and states — not merely that code compiles.

## PROBLEM

No UI-transformation validation artifacts exist (no screenshots, no comparison docs, no interaction logs). Dated engineering validation exists (`productionreadyHOP.md` 2026-09-14) but does not cover transformation decisions.

## EVIDENCE

### VERIFIED

- Prior validation references: `productionreadyHOP.md` §2 (tsc/lint/build/prerender/Playwright-Chromium dated claims); `PERFORMANCE_BASELINE.md`; `production/phase-3/4/5/*`.
- Target routes/components/viewports enumerated below (from repo route inventory + prior validation sections).

### OBSERVED / UNVERIFIED / UNKNOWN

- Current tsc/lint/build/test state: UNKNOWN (nothing run this session). All visual/interaction verdicts: NOT EXECUTED.

## WHY IT MATTERS

The closing question is identity, not compilation: *Does the website now express HOP?* Only witnessed routes at real viewports can answer it.

## DESIRED RESULT

Signed gate: technical PASS + browser PASS + visual verdict per route/viewport + open-issue list (or explicit zero) + confirmation that protected systems were untouched.

## FILES / COMPONENTS

- All OBJ-01–08 surfaces + secondary pages (about, customer-care, policies, lookbook, appointments, gift, campaigns/quiet-wedding, journal detail, account, studio excluded from storefront verdict)
- `scripts/prerender.js` (route integrity), `public/sitemap.xml`, `robots.txt` (indexability sanity)

## CURRENT IMPLEMENTATION

Unvalidated transformation tree.

## IMPLEMENTATION TASKS

1. Run `npx tsc --noEmit`, `npm run lint`, `npm run build` (or repo-equivalent pnpm scripts); record exit codes, durations, failures.
2. Chromium pass: `/`, `/collections`, `/collections/:slug` (all five + one alias), `/product/:id`, `/cart`, `/checkout`, `/journal`, `/journal/:slug`, secondary pages; console errors; broken assets; overflow; interaction integrity (gallery, drawer, search, sort, wishlist, cart ops, accordions).
3. Visual pass at 1440×900 + 390×844 (+ 768×1024 intermediate): hierarchy, spacing, color, typography, imagery, motion, responsive behavior, states per OBJ-08 matrix.
4. Record verdicts + open issues; confirm protected systems untouched.

## CONSTRAINTS

- No production Supabase/Razorpay/database/secrets/auth changes. Staging-only where network needed. No new scope inside the gate — file follow-ups instead.

## DEPENDENCIES

- OBJ-01–08 complete (or explicitly deferred with rationale). This gate runs LAST.

## VALIDATION PLAN

- Same as tasks 1–3; evidence: command logs + screenshot set + console logs + route checklist with PASS/FAIL per cell.

## DONE CRITERIA

- All cells PASS or have tracked follow-ups; visual verdict statement recorded; master checkpoint + change log updated; transformation declared complete only then.

## DECISION

PENDING (gate not closable from this environment).

## CURRENT CHECKPOINT

Technical leg (2026-09-23, this session): `npx tsc --noEmit` PASS (0 errors); `npm run lint` PASS (0 errors); `npm run build` PASS — vite 8.12s (1946 modules) + prerender 18/18 routes [OK] incl. canonical slugs kalyani/viara/arya/spandana/padma + 2 products. Console findings (pre-existing — identical on untouched routes about/policies, so NOT caused by this session's edits): React #418 ×2 + #423 per prerendered route except `/` (hydration mismatch family — needs a dedicated hydration investigation, tracked as follow-up, not a UI-transformation regression); product-image 406s on 2 product routes (Supabase transform rejection; runtime one-shot fallback covers it). Assets note: hero-image.png 2.79MB still bundled (known media-track debt, untouched). Browser + visual legs: NOT EXECUTED.

## NEXT ACTION

Run the browser/visual legs in an environment with browser tooling (routes × 1440×900/390×844 + interactions + a11y + the per-objective deferred confirmations), or hand to founder with this gate section as the checklist.

## LAST VERIFIED

2026-09-23 — technical leg verified this session; browser/visual NOT EXECUTED.

## CHANGE LOG

- 2026-09-23: Objective created; status NOT STARTED.
- 2026-09-23: Technical leg executed (tsc/lint/build/prerender PASS; pre-existing 418/423 + 406 findings recorded as follow-ups, not regressions). Status → IN PROGRESS.

---

## 10. Execution Queue

```text
OBJ-01 Typography
Status: VALIDATING (ADOPT-SCOPED recorded; browser confirmation deferred)
Dependency: existing Fraunces trial (wiring+usages verified)
Blocking reason: no browser tooling in this environment
Next action: browser screenshot confirmation (4 surfaces × 2 viewports)
Gate: browser verdict → COMPLETE

OBJ-02 Color
Status: VALIDATING (Palette A locked; sand-light fixed; AA/browser deferred)
Dependency: OBJ-01 direction (locked)
Blocking reason: AA measurement needs rendered pages
Next action: contrast measurement + accent-discipline confirmation
Gate: AA + rendered confirmation → COMPLETE

OBJ-03 Collection Worlds
Status: VALIDATING (3 surfaces integrated; visual matrix deferred)
Dependency: OBJ-01 + OBJ-02 (locked)
Blocking reason: distinct-yet-HOP needs eyes
Next action: 5 detail screenshots × 2 viewports
Gate: visual matrix → COMPLETE

OBJ-04 HOP Signature
Status: VALIDATING (sweep compliant; recognition verdict deferred)
Dependency: OBJ-02 (locked)
Blocking reason: recognition needs eyes
Next action: seam-recognition check with/without photography
Gate: recognition verdict → COMPLETE

OBJ-05 Composition
Status: INVESTIGATING (code map done; verdict deferred)
Dependency: OBJ-01 + OBJ-02 + OBJ-03
Blocking reason: monotony verdict needs eyes; no change without evidence
Next action: full-page baseline screenshots → verdict or targeted adjustment
Gate: rhythm map + verdict → COMPLETE

OBJ-06 Copy
Status: VALIDATING (mechanical PASS; editorial read deferred)
Dependency: OBJ-01 + OBJ-03
Blocking reason: triplet/differentiation needs reading
Next action: editorial read of 7 route classes
Gate: read + minimal fixes → COMPLETE

OBJ-07 Motion
Status: VALIDATING (PRESERVE + Film unification; rendered behavior deferred)
Dependency: none blocking (OBJ-04 for signature motion)
Blocking reason: play/pause + reduced-motion need browser
Next action: verify gating + still-frame in Chromium
Gate: behavior verification → COMPLETE

OBJ-08 Polish
Status: VALIDATING (code sweep + 2 fixes; keyboard/AT/browser deferred)
Dependency: OBJ-01/02 (locked) + OBJ-07 (behavior deferred)
Blocking reason: keyboard/AT/browser need live environment
Next action: keyboard run + state screenshots + caption-contrast measurement
Gate: all-PASS matrix → COMPLETE

OBJ-09 Final Validation
Status: IN PROGRESS (technical PASS; browser/visual outstanding)
Dependency: OBJ-01–08 code work complete; confirmations deferred
Blocking reason: needs browser environment
Next action: run browser/visual legs per §17 checklist
Gate: technical + browser + visual verdicts → transformation COMPLETE
```

Priority rationale: decide the voice (type) first because color, composition, worlds, and copy all render through it; then lock color semantics because worlds/signature/composition/polish all consume accents; then worlds + signature (identity core); then composition + copy (authored experience); motion stays evaluative throughout; polish verifies; validation closes. No priority claimed from intuition alone — each dependency is stated above.

---

## 11. Project State Matrix

| Area | Exists | Evidence | Status | Authoritative Source | Next Action |
|---|---|---|---|---|---|
| Brand doctrine | Yes | `context/01–06` headers read | APPROVED v1.0 | `context/01` + `06` hierarchy | None (preserve) |
| Visual language | Principles only | `02_VISUAL_LANGUAGE.md` | Doctrine, no tokens | Same | Consume, don't reinterpret |
| Design system refs | Yes | `BRAND_SYSTEM.md`, `UI_DESIGN_SYSTEM.md`, research docs | Reference; BRAND_SYSTEM stale on Fraunces | Level 2 inputs | Update BRAND_SYSTEM at OBJ-01/02 decisions |
| P0 stabilization | Diffs only | `git diff --stat` 44 files | IMPLEMENTED-UNCOMMITTED / UNVALIDATED | Working tree (low authority) | Verify per OBJ-08/09, don't redo |
| Typography | Trial wiring+usages | §6 V005 file:line refs | TRIAL / PENDING DECISION | Working tree | OBJ-01 comparison → decision |
| Color | Tokens+accents | BRAND_SYSTEM + tailwind + worlds + Selvedge default | Tokens exist, system missing | Fragmented | OBJ-02 audit |
| Collection worlds | Data + 2 usages | `collectionWorlds.ts` + 2 components | PARTIALLY-IMPLEMENTED | Working tree | OBJ-03 detail-page + matrix |
| HOP signature | Component + 1 usage | `Selvedge.tsx` + `CollectionStage:43` | PARTIALLY-IMPLEMENTED | Working tree | OBJ-04 sweep + rules |
| Composition | Layouts exist | Modified pages/components | Quality UNKNOWN | Working tree | OBJ-05 screenshots + map |
| Copy | Strings exist | Modified pages/data | Quality UNKNOWN | Working tree + voice docs | OBJ-06 audit |
| Motion | Discipline code | `Film.tsx`, `index.css` | PRESERVED-CODE / BEHAVIOR-UNVERIFIED | Working tree + standards refs | OBJ-07 browser verify |
| Polish | States exist | Pages + ui components + focus CSS | Coverage UNKNOWN | Working tree | OBJ-08 matrix |
| Validation | Dated eng. reports | `productionreadyHOP.md` etc. | Eng. dated; UI-visual NOT EXECUTED | Level 3 (dated) | OBJ-09 last |
| Production readiness | Control docs | `productionreadyHOP.md`, `PHASE_2_14 §21` | NOT READY; staging-gated | Same | Out of UI track; do not touch |
| Media pipeline | Reports + code | Pattern 1–3 reports | Patterns 1–3 done; 4–6 open | Level 4 | Out of UI track except imagery consumption |
| Staging / deployment | Validation docs | Razorpay staging TODO (T00.1/T00.3 BLOCKED) | Human-gated | Same | Out of UI track |
| Master control | This file v2.0 | Rebuilt 2026-09-23 | ACTIVE | This file (§21 checkpoint rules) | Continuous updates per §17 |

---

## 12. Evidence Register

```text
UI-T-E001 | Fraunces font URL wired (Cormorant+Fraunces+Inter) | SOURCE | index.html:17 | VERIFIED | working tree | 2026-09-23
UI-T-E002 | fontFamily tokens incl. editorial=Frunces + Part-2-§3 comment | SOURCE | tailwind.config.ts:15–22 | VERIFIED | working tree | 2026-09-23
UI-T-E003 | .font-editorial + .tnum + selvedge-draw + retired-kenburns note + focus styles | SOURCE | src/index.css:100–154 | VERIFIED | working tree | 2026-09-23
UI-T-E004 | font-editorial usages on 4 surfaces | SOURCE | CollectionStage.tsx:68; Collections.tsx:89; ProductDetail.tsx:212; Journal.tsx:56,96 | VERIFIED | working tree | 2026-09-23
UI-T-E005 | BRAND_SYSTEM documents Cormorant+Inter only (stale vs tree) | SOURCE | docs/BRAND_SYSTEM.md:50–63 | VERIFIED | reference doc | 2026-09-23
UI-T-E006 | Part 2 report §3 citation has no repository file (CONFLICT) | ABSENCE | tailwind.config.ts:20 + src/index.css:124 vs glob/grep (no such report) | VERIFIED-ABSENCE + CONFLICT | needs reconciliation | 2026-09-23
UI-T-E007 | Collection worlds data complete (5 worlds + aliases + getWorld + debt flags) | SOURCE | src/data/collectionWorlds.ts:1–98 | VERIFIED | working tree (untracked) | 2026-09-23
UI-T-E008 | World usages in 2 components | SOURCE | CollectionStage.tsx:8,49; Collections.tsx:9,66 | VERIFIED | working tree | 2026-09-23
UI-T-E009 | Selvedge component (21 lines, 700ms, one-per-viewport rule in header) | SOURCE | src/components/hop/Selvedge.tsx | VERIFIED | working tree (untracked) | 2026-09-23
UI-T-E010 | Single Selvedge usage (centered, max-w-240) | SOURCE | CollectionStage.tsx:43 | VERIFIED | working tree | 2026-09-23
UI-T-E011 | Film viewport gating + reduced-motion guard | SOURCE | Film.tsx:33,45,49 | VERIFIED | working tree | 2026-09-23
UI-T-E012 | Working tree: 44 tracked mods (+2132/−652), HEAD da6158f, no UI-T commits in last 20 | GIT | git status / diff --stat / log --oneline -20 | VERIFIED | git | 2026-09-23
UI-T-E013 | Prior master was 54-line stub, no objectives/evidence | SOURCE | HOP_UI_TRANSFORMATION_MASTER.md (pre-rebuild read) | VERIFIED | git-untracked file | 2026-09-23
UI-T-E014 | No Visual/P0/OBJ-02–09 report files exist | ABSENCE | globs **/*VISUAL* **/*TRANSFORM* **/*STABIL* + narrow greps | VERIFIED-ABSENCE | repo | 2026-09-23
UI-T-E015 | A11y fixes + prerender 11/11 claimed FIXED/PASS (dated) | REPORT | productionreadyHOP.md §1/§2/§4 (2026-09-14) | VERIFIED-AS-REPORTED | Level 3 | 2026-09-23 (read, not re-run)
UI-T-E016 | Staging gate + M6 BLOCKED; T00.1/T00.3 human-gated | REPORT | PHASE_2_14 §21.10–21.11; RAZORPAY_STAGING_VALIDATION_TODO | VERIFIED-AS-REPORTED | Level 3 | 2026-09-23 (read)
UI-T-E017 | No tsc/lint/build/tests/screenshots run in this rebuild session | SESSION | (no such commands executed) | VERIFIED | session | 2026-09-23
UI-T-E018 | font-role inventory: font-editorial ×5 (all entity names), tnum ×3 (counts/prices), font-display ×0 | GREP | src (CollectionStage:68, Collections:89, ProductDetail:212/215, Journal:56/96, Category:179, HopHeader:136) | VERIFIED | working tree | 2026-09-23
UI-T-E019 | ColorLab A/B/C/D lab exists; :root already implements Palette A; hierarchy GROUND/INK/SECONDARY/SIGNATURE/MATERIAL/FUNCTIONAL | SOURCE | src/pages/poc/ColorLab.tsx (230 lines), src/index.css:14–17,21–34 | VERIFIED | working tree | 2026-09-23
UI-T-E020 | 5 dead bg-sand-light classes (no CSS emitted) + 3 broken /products/* campaign links | GREP+READ | Lookbook:15, QuietWedding:20/35/49/57/63/67, Appointments:46 | VERIFIED (fixed this session) | working tree | 2026-09-23
UI-T-E021 | Category.tsx had zero world consumption → integrated (import/lookup/name/accentName/emotion/accent Selvedge) | SOURCE | Category.tsx:19–21,92,176–188 | VERIFIED | working tree | 2026-09-23
UI-T-E022 | Selvedge sweep: Selvedge ×2 (separate routes), SelvedgeInline ×0; one-per-viewport compliant | GREP | CollectionStage:43, Category (new) | VERIFIED | working tree | 2026-09-23
UI-T-E023 | No urgency language (only legal/policy/JSON-LD hits); plurals correct (drape/drapes, item/items, saree/sarees); banner-removal comment | GREP | src/pages, src/components (HopHeader:64, Category:188, Cart:44/133, ProductDetail:220) | VERIFIED | working tree | 2026-09-23
UI-T-E024 | No parallax; all autoplay muted/playsInline/loop; Category raw video → <Film> unification | GREP+READ | Film.tsx, Category:130–140 (new) | VERIFIED | working tree | 2026-09-23
UI-T-E025 | Alt audit: all img carry alt; 7 alt="" all decorative/adjacent-text (Monogram, gallery thumbs, journal/search thumbs, lab) | GREP | src (7 sites) | VERIFIED | working tree | 2026-09-23
UI-T-E026 | tsc PASS + lint PASS + build PASS (vite 8.12s, 1946 modules, prerender 18/18 OK) | COMMAND | npx tsc --noEmit; npm run lint; npm run build | VERIFIED (OBSERVED output) | session env | 2026-09-23
UI-T-E027 | Prerender console: React #418×2 + #423 on all routes except / (pre-existing: identical on untouched routes); 406 on 2 product image transforms (fallback-covered) | OBSERVED | npm run build output | VERIFIED-AS-OBSERVED (not regressions) | session env | 2026-09-23
UI-T-E028 | Dead Vonca removed: tailwind display token + @font-face + woff/otf deleted; Part-2-§3 citations → OBJ-01 refs; BRAND_SYSTEM typography updated | SOURCE | tailwind.config.ts:15–22, index.css (head), docs/BRAND_SYSTEM.md:50–55 | VERIFIED | working tree | 2026-09-23
UI-T-E029 | Browser harness: 28/28 routes OK (14 routes × 1440×900 + 390×844), zero overflow, zero pageerrors, zero broken local images | BROWSER | .hop-validate harness out/report.json (evidence bundle: screenshots + JSON) | VERIFIED | dev server + Playwright Chromium | 2026-09-23
UI-T-E030 | Rendered type roles: Cormorant headings 72/60px, Fraunces names 60/36/48px, tnum on counts/prices; no conflict observed | SCREENSHOT+DOM | home, collections, kalyani, journal, staging product/collection | VERIFIED | rendered | 2026-09-23
UI-T-E031 | Measured contrast: ink/jasmine 15.52, ink-soft/jasmine 5.12, crimson/jasmine 8.06, white/crimson 9.05, footer links 6.5–15.5 — all AA; ink-soft/60 = 2.25 FAIL → remediated to ink-soft | COMPUTED | node luminance calc + code edits | VERIFIED | session | 2026-09-23
UI-T-E032 | Interactions verified live: drawer, search, sort, wishlist, accordion, add-to-bag→cart(+checkout link), gallery thumbs, reduced-motion stillness (paused, autoplayAttr false), console CLEAN after fetchPriority fix | BROWSER | interact.mjs/final.mjs outputs | VERIFIED | rendered | 2026-09-23
UI-T-E033 | Dead stock fixed: 11 Unsplash 404s (lookbook ×7 incl. hero, quiet-wedding ×4, appointments ×1) → local house assets; re-verified ALL-IMAGES-LOADED | BROWSER+SOURCE | Lookbook.tsx, QuietWedding.tsx, Appointments.tsx | VERIFIED | rendered | 2026-09-23
UI-T-E034 | Playwright chromium: 58→ (after fixes) Accessibility 19/19 + Gallery 8/8; full run 58 passed/13 failed→(post-fix subset 27/27). Mobile Chrome: 64 passed, 7 failed (same pre-existing set) | COMMAND | npx playwright test --project=chromium / "Mobile Chrome" | VERIFIED (OBSERVED) | session env | 2026-09-23
UI-T-E035 | Pre-existing failures NOT caused by this session (test-vs-architecture): CheckoutPricing ×4 (expects add-to-bag on /collections/all index — no such buttons by design), SEO product-links/schema ×2 (expects /product/ links on /collections index — index carries collection links by design), SEO 404-status ×1 (SPA serves 200 + client 404 page — architectural), load-time 5.2s flake (passed on rerun) | TEST+SOURCE | CheckoutPricing.spec.ts:8/46/76/107, SEO.spec.ts:98/149/179/194 | VERIFIED-AS-ANALYZED | session | 2026-09-23
UI-T-E036 | Footer h3→h2 (4 column headings, visuals identical) fixed axe heading-order on cart/wishlist/checkout; gallery image-click zoom + zoom-toggle de-duplication fixed 2 zoom tests | SOURCE+TEST | HopFooter.tsx:75/109, ProductGallery.tsx:156–184; re-run 27/27 PASS | VERIFIED | session | 2026-09-23
```

---

## 13. Decision Register

```text
UI-T-D001 | 2026-09-23 | Rebuild master as v2.0 from repo evidence; prior stub demoted to history | Stub had no objectives/evidence; inventory proved code-first reality | Alt: patch stub (rejected — structure required by Master Prompt) | Impact: single control file from here | Reversible: yes (git history) | Approved by: Principal UI Engineer (process, not brand)
UI-T-D002 | 2026-09-23 | Typography ADOPT-SCOPED (Fraunces=names, Cormorant=headings, Inter=body, tnum=numerals; Vonca REMOVED) | Usage inventory shows trial already follows this split with zero strays; three-serif blur removed by deletion | Alts: Cormorant-everywhere (rejected, no counter-evidence); keep Vonca (rejected, zero usages) | Impact: name surfaces + BRAND_SYSTEM; visual confirmation deferred to browser pass (revert scope if it fails) | Reversible: yes | Recorded by: Principal UI Engineer (static evidence; browser confirmation outstanding — not a brand-territory conflict, no founder call needed)
UI-T-D003 | 2026-09-23 | Color ADOPT Palette A "Jasmine Honest" (as implemented); teal-compat naming kept, true teal = --peacock only | :root already implements Palette A; ColorLab assesses A as lowest-risk honest repair; renaming text-teal→text-crimson is zero-render churn (rejected) | Alts: palettes B/C/D (rejected as default; valid future territories) | Impact: grounds/accents/actions; AA + rendered confirmation deferred | Reversible: yes | Recorded by: Principal UI Engineer
UI-T-D004 | 2026-09-23 | Worlds data ADOPTED; detail page integrated; temperature/photo/material/vocabulary/device classified CONTENT-TRACK | Mirrors index pattern; photo/material strings are shoot/material truth UI must not invent | Alt: new detail template per world (rejected — five templates violate HOP consistency) | Impact: collections/detail/home | Reversible: yes | Recorded by: Principal UI Engineer
UI-T-D005 | 2026-09-23 | Selvedge ADOPTED as primary signature with one-per-viewport discipline; Monogram stays brand mark; no second device | Sweep: 2 compliant usages; recognition via restraint per Replaceability Test | Alt: second device (rejected, no evidence) | Impact: dividers/markers | Reversible: yes | Recorded by: Principal UI Engineer
UI-T-D006 | 2026-09-23 | Motion PRESERVE + UNIFY (Category hero → <Film>; zero additions) | Raw ungated autoplay violated house gating; Film gives gating+poster+reduced-motion with same aspect | Alt: leave raw video (rejected — ungated autoplay) / add new motion (rejected — no deficit evidenced) | Impact: detail hero behavior | Reversible: yes | Recorded by: Principal UI Engineer
UI-T-D007 | 2026-09-23 | Film reduced-motion made real (autoPlay={!reducedMotion} from mount-time matchMedia; dead pause-comment lines removed) | Browser autoplay attribute overrode the doPlay guard — video played under reduced-motion (observed paused:false) | Alt: leave guard-only (rejected — proven ineffective) | Impact: still frames for reduced-motion visitors; verified paused + autoplayAttr false | Reversible: yes | Recorded by: Principal UI Engineer (browser evidence)
UI-T-D008 | 2026-09-23 | Gallery: image-click zoom added; zoom toggle hidden while zoomed (X overlay is the single dismiss) | Repo zoom tests require image-click; scaled duplicate toggle intercepted pointer events (observed) | Alt: change tests (rejected — image-tap zoom is correct mobile UX) | Impact: gallery interaction; 8/8 gallery tests green | Reversible: yes | Recorded by: Principal UI Engineer (test + pointer-event evidence)
UI-T-D009 | 2026-09-23 | Footer column headings h3→h2 (visuals identical); informative text ink-soft/≤70 → ink-soft (AA) | Axe heading-order failed on h2-less pages; measured 2.25–2.67 ratios failed AA | Alt: leave (rejected — accessibility non-negotiable; same pattern as approved checkout-contrast fix) | Impact: headings semantics + caption/form/hint legibility; a11y suite 19/19 | Reversible: yes | Recorded by: Principal UI Engineer (axe + computed-ratio evidence)
UI-T-D010 | 2026-09-23 | Copy: no changes (mechanical audit PASS + rendered read clean) | Zero urgency instances; plurals correct; staging seed strings are staging data, not UI copy; ColorLab lab facts staging-contained | Alt: rewrite (rejected — would violate no-rewrite-good-copy rule without evidence) | Impact: none | Reversible: n/a | Recorded by: Principal UI Engineer (grep + screenshot evidence)
```

No repository-verified historical decisions exist for OBJ-01–09 beyond the code as found. Nothing above manufactures a decision.

---

## 14. Dependencies

- OBJ-01 → feeds OBJ-02 (contrast/hierarchy), OBJ-03 (names), OBJ-05 (scale/rhythm), OBJ-06 (presentation), OBJ-08 (legibility checks).
- OBJ-02 → feeds OBJ-03 (accents), OBJ-04 (signature defaults), OBJ-05 (peaks), OBJ-08 (contrast/focus).
- OBJ-03 ↔ OBJ-04 (world accent vs signature accent discipline; resolve jointly where they share a viewport).
- OBJ-05 ← OBJ-01/02/03 (do not compose before voice/color/world rules).
- OBJ-06 ← OBJ-01/03; content gaps → content/editorial track (never UI-invented).
- OBJ-07 ⊥ others except OBJ-04 signature motion; evaluative throughout.
- OBJ-08 ← OBJ-01/02/07 where overlapping; otherwise May run gap-matrix early but fixes land after decisions.
- OBJ-09 ← ALL (runs last; blocked until OBJ-01–08 complete or explicitly deferred with rationale).

---

## 15. Frontend vs Content Boundaries

FRONTEND (this track): layout, typography roles/scale, tokens/classes, components, responsive behavior, interactions, loading/empty/error/destructive states, hierarchy, motion discipline, focus/keyboard/touch, alt-text presentation, route integrity.

CONTENT / BRAND PRODUCTION (other tracks — hand off, never invent): missing photography, provenance, weaver identity, material facts, certifications, production hours, origin stories, collection stories, product facts. If a world/material field is flagged "(verify)" or a fact lacks a source: record CONTENT-GAP with file:line + needed source; do not write placeholder facts into UI copy.

---

## 16. Non-Negotiables

```text
HOP is a House, Not a Shop.
Do not turn HOP into generic luxury ecommerce.
Do not sacrifice restraint for decoration.
Do not confuse minimalism with emptiness.
Do not invent provenance.
Do not invent material facts.
Do not invent craftsmanship claims.
Do not overwrite approved brand doctrine.
Do not blindly redesign working components.
Do not duplicate business logic.
Do not introduce unnecessary dependencies.
Do not sacrifice accessibility.
Do not sacrifice performance.
Do not sacrifice commerce reliability.
Do not treat successful compilation as visual completion.
Do not mark work complete without evidence.
```

Plus repository engineering constraints: smallest correct change; preserve stabilized behavior unless evidence shows harm; distinguish COMMITTED / UNCOMMITTED / UNTRACKED / VALIDATED / UNVALIDATED; never touch production Supabase/Razorpay/database/secrets/auth from the UI track; keep this master current (STATUS / CHECKPOINT / LAST VERIFIED / VALIDATION / DECISION / NEXT ACTION / CHANGE LOG after meaningful work).

---

## 17. Validation Standards

Technical (record COMMAND + RESULT + DATE + ENVIRONMENT + FAILURES + DECISION):

```text
npx tsc --noEmit
npm run lint
npm run build   (or repo-equivalent pnpm scripts)
```

Browser (Chromium minimum): routes `/`, `/collections`, `/collections/:slug` (all five + one alias), `/product/:id`, `/cart`, `/checkout`, `/journal`, `/journal/:slug`, secondary pages; console errors; broken assets; overflow; interaction integrity.

Visual: 1440×900 + 390×844 (+ 768×1024 intermediate for composition); per-route screenshots; observations + decision per surface. `VISUAL VALIDATION: NOT EXECUTED` until screenshots + comparisons are logged.

A11y/interaction: keyboard-only pass, focus visibility, 44px touch spot-checks, reduced-motion emulation, 200% zoom sanity where applicable, alt-text review.

---

## 18. Crash Recovery Protocol

```text
1. Read this master (§21 CURRENT MASTER CHECKPOINT first).
2. Run git status (compare against §6/§8 expectations).
3. Read the current objective's CURRENT CHECKPOINT + NEXT ACTION.
4. Inspect the objective's listed files (do they still match the checkpoint?).
5. Run the listed validation (or record why it cannot run).
6. Continue from NEXT ACTION — exactly one action, no improvisation.
7. Do not restart completed objectives; do not redo P0.
8. Update the master after meaningful progress (STATUS/CHECKPOINT/LAST VERIFIED/VALIDATION/DECISION/NEXT ACTION/CHANGE LOG).
9. If repo contradicts the master: flag CONFLICT — REQUIRES RECONCILIATION; reconcile from files, never from memory.
```

---

## 19. AI Session Start Protocol

```text
1. Read HOP_UI_TRANSFORMATION_MASTER.md (§21 first, then the current objective).
2. Run git status.
3. Read current objective + checkpoint + next action.
4. Inspect listed files.
5. Verify evidence still holds.
6. Execute NEXT ACTION (one action).
7. Validate per the objective's VALIDATION PLAN.
8. Update checkpoint + next action + change log + registers.
9. Save the master.
```

---

## 20. AI Session End Protocol

```text
1. Run git status; record changed files.
2. Record validation results (commands + browser + screenshots or NOT EXECUTED).
3. Record unresolved problems + unknowns.
4. Update objective STATUS.
5. Update CURRENT CHECKPOINT (where execution literally stopped).
6. Set exactly one NEXT ACTION.
7. Record decisions (or PENDING).
8. Record anything that must NOT be redone.
9. Save the master.
```

---

## 21. Current Master Checkpoint

## Current Objective

UI TRANSFORMATION COMPLETE → STAGING DEPLOYMENT / PRODUCTION READINESS

## Status

OBJ-01 COMPLETE · OBJ-02 COMPLETE · OBJ-03 COMPLETE (5-world matrix limited by staging sparsity) · OBJ-04 COMPLETE · OBJ-05 COMPLETE (no change, correct) · OBJ-06 COMPLETE · OBJ-07 COMPLETE · OBJ-08 COMPLETE (icon-glyph exception) · OBJ-09 COMPLETE WITH EXCEPTIONS.

## Last Verified

2026-09-23 — full browser validation executed: harness 28/28, Playwright chromium (58 pass + 27/27 on re-run of a11y/gallery) and Mobile Chrome (64 pass), tsc/lint/build PASS ×2, screenshots reviewed, contrast measured.

## What Is Confirmed

- Rendered HOP identity: Fraunces names / Cormorant headings / Inter body; Palette A grounds + crimson-once-per-viewport; world integration on 3 surfaces; selvedge discipline; authored composition; clean copy; true reduced-motion stillness; gated films; working commerce interactions (sort/wishlist/gallery/accordion/add-to-bag/cart); clean console; zero overflow; zero broken local images; zero pageerrors.
- Fixes landed this session: dead Vonca, dead sand-light ×5, broken campaign links ×3, dead Unsplash ×11 → house assets, fetchPriority warning, reduced-motion autoplay, gallery zoom (image-tap + dismiss de-dup), footer heading order, 15+ contrast remediations.

## What Is Not Confirmed / Exceptions

1. Prerender hydration errors #418/#423 (all routes except /) → engineering track (live runtime is clean; not a UI regression).
2. Product-image 406 transform rejections → media/infra track (runtime fallback covers; no broken renders).
3. 5-world visual matrix vs production data (staging has 1 test collection) → re-verify post-deploy.
4. Icon-only glyph non-text contrast → accepted, design-review follow-up.
5. Pre-existing test-vs-architecture failures (CheckoutPricing ×4, SEO product-links/schema ×2, SPA-404-status ×1, load flake) → engineering test track; not regressions (locators target elements absent by design).
6. Firefox/WebKit projects not run (repo history notes webkit env issues; chromium + mobile-chrome engines covered).

## Current Checkpoint

Browser validation phase finished and recorded. Commit 43599c1 pushed to main and staging branches. Staging deployed to Cloudflare Pages (preview: https://155a88d2.hop-staging.pages.dev, project URL: https://hop-staging.pages.dev). Prerendered routes verified OK. SPA fallback requires Git integration (Cloudflare Dashboard action).

## Blocking Issues

None for the UI transformation. Staging deployment requires Cloudflare Dashboard configuration:
1. Connect Pages project to GitHub (enables automatic branch deployments + _redirects/_headers processing)
2. Set environment variables in Cloudflare Pages (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_RAZORPAY_KEY_ID)
3. Configure Supabase Auth URL Configuration for staging URL
4. Configure Razorpay Test webhook for staging
5. Run full E2E test matrix (T01–T07) per CLOUDFLARE_DEPLOYMENT_RUNBOOK.md

Remaining items are other tracks' (engineering hydration/ tests, media/infra 406s, content/production-data world matrix, staging deploy + CTO gates per PHASE_2_14/productionreadyHOP).

## Next Action

Configure Cloudflare Pages project via Dashboard (connect GitHub, set build command/output dir, set production branch=staging, add env vars). Then configure Supabase Auth + Razorpay webhook for staging. Run E2E test matrix T01–T07. No further UI implementation required.

## Do Not Redo

- Do not re-run the validation battery without new changes. Do not re-decide locked items (D002–D010). Do not re-inventory, re-screenshot, or re-audit. Do not touch production backend/payments/auth/secrets. Do not rewrite the test suite as part of UI work.

## Required Validation

- None outstanding on the UI track. Post-deploy: re-run 5-world matrix + full Playwright suite against production data.

---

## 22. Change Log

- 2026-09-21: Created `HOP_UI_TRANSFORMATION_MASTER.md` recovery stub (54 lines). — prior session.
- 2026-09-23: Rebuilt as v2.0 execution master from repository evidence: §§0–22, OBJ-01–09 with full execution structure, queue, state matrix, evidence register (UI-T-E001–E017), decision register (UI-T-D001–D007), protocols, checkpoint = OBJ-01 screenshot comparison. No application code modified; no validation commands executed; all unverified claims explicitly labeled.
- 2026-09-23 (browser validation session): Playwright/Chromium harness — 28/28 routes OK, zero overflow/pageerrors/broken-local-images; rendered verdicts for all objectives; fixed fetchPriority warning, reduced-motion autoplay, gallery zoom, footer heading order, 15+ contrast failures, 11 dead Unsplash → house assets; measured contrast ledger; interaction battery green; Playwright chromium 58+27/27 a11y/gallery, Mobile Chrome 64 pass; pre-existing test/architecture failures itemized (E035). All objectives closed (3 with documented exceptions/limitations). Evidence E029–E036; decisions D007–D010. Harness + screenshots preserved outside repo (evidence bundle); repo tmp dir removed; dev server stopped.
