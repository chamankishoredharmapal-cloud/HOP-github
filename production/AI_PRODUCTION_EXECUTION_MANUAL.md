---
title: "AI Production Execution Manual — Master Orchestration Layer"
document_id: HOP-PROD-AI-000
version: "0.1.0-draft"
last_updated: "2026-08-12"
revision: "2026-08-12 — governance audit HOP-PROD-AUDIT-000 conditions M1-M4 and findings L1-L9 applied (documentation-only; no authoritative document altered)"
status: "DRAFT — orchestration layer, not yet operationally validated"
author: "HOP Engineering & Operations"
owner: "Release Manager / Technical Lead"
---

# AI Production Execution Manual — House of Padmavati (HOP)

> This document is the **orchestration layer** for the House of Padmavati
> production operations system. It tells an executing AI agent: **WHICH**
> document to read, **WHEN** to read it, **WHAT** to do, **WHICH** tool to use,
> **WHAT** evidence to capture, **WHEN** to advance, and **WHEN** to stop.
>
> It does **NOT** replace any authoritative HOP SOP. See
> [Section 33 — Do Not Create a Second Source of Truth](#33--do-not-create-a-second-source-of-truth).

---

## 0. How to Use This Manual

1. Follow Section 32's startup order: read `.ai/START_HERE.md` first — it is
   authoritative for AI entry behavior — then the project/context documents,
   then this manual as the orchestration layer.
2. Maintain `production/execution_state.md` at all times (Sections 3, 28).
3. Before any phase, read the authoritative phase SOP listed in Section 23.
4. Run every action through the evidence discipline (Section 11).
5. When in doubt about authority, apply Section 1. When in doubt about a command,
   apply Section 10. When in doubt about continuing, apply Section 7.
6. The operating sequence is the **Execution Loop** (Section 30):
   READ → UNDERSTAND → DETECT STATE → PLAN → EXECUTE → TEST → FIND FAILURES →
   FIX → VERIFY → DOCUMENT → COMMIT → QUALITY GATE → ADVANCE → RELEASE → DEPLOY →
   MONITOR → CLOSE.

Audit results that are not evidence-backed do not exist.

---

## 1. Authority Hierarchy

### 1.1 Precedence

When documents disagree, resolve in this order. A higher item overrides a lower
item **only after** the conflict has been registered (Section 1.2). Never silently
choose the convenient interpretation.

| Rank | Source | Where it lives |
|---|---|---|
| 1 | **Non-negotiable project constraints** — no secrets in code/history, no destructive production actions, no fabricated evidence, no client-side payment verification, brand protection | `.ai/rules/SECURITY_STANDARDS.md`, `.ai/rules/GIT_STANDARDS.md`, `context/06_GOVERNANCE.md` |
| 2 | **HOP North-Star / Brand Context** — luxury-before-conversion, editorial-first, mobile-desktop parity | `HOP_BRAND_CONTEXT.md`, `context/00_HOP_BRAND_CONTEXT.md`, `.ai/decisions/` |
| 3 | **Architecture rules** | `.ai/architecture/`, `docs/ARCHITECTURE.md`, `docs/API_REFERENCE.md`, `docs/DATABASE_SCHEMA.md` |
| 4 | **Security rules** | `.ai/rules/SECURITY_STANDARDS.md`, `.ai/security/`, `docs/SECURITY.md` |
| 5 | **Production Operations Master Plan** | `production/00_MASTER_EXECUTION_PLAN.md` |
| 6 | **Phase-specific SOP** (01–19) | `production/0X_*.md`, `production/phase-*/` |
| 7 | **Engineering standards** | `.ai/rules/*`, `.ai/standards/*`, `docs/` |
| 8 | **Testing standards** | `.ai/rules/TESTING_STANDARDS.md`, `.ai/testing/`, `docs/QA_CHECKLIST.md` |
| 9 | **AI collaboration rules** | `.ai/playbooks/AI_COLLABORATION_RULES.md`, `.ai/context/AI_COLLABORATION.md`, `.ai/guides/AI_ONBOARDING.md` |
| 10 | **Existing implementation** (verified code state, not assumptions) | `src/`, `supabase/`, `scripts/` |
| 11 | **AI inference** (reasonable engineering judgment, lowest priority) | — |

### 1.2 Conflict Resolution Protocol

When two documents conflict:

1. **Identify** both documents and the conflicting statements (quote both).
2. **Determine** the authoritative source using the hierarchy in 1.1.
3. **Preserve** the higher-ranked decision.
4. **Document** the decision in `production/execution_state.md` (section
   `CONFLICT LOG`) and in `context/07_DECISIONS_LOG.md` if the decision changes
   engineering behavior.
5. **Continue** only when the resolution is safe. If the resolution touches a
   human-only boundary (Section 7), emit a HUMAN BLOCKER (Section 8).
6. Never let an AI inference (rank 11) override an explicit HOP rule (ranks 1–9).

### 1.3 Registered Conflicts and Resolutions

| # | Conflict | Resolution | Authority |
|---|---|---|---|
| C1 | **Performance floors**: `00` QG3 says Lighthouse ≥ 90 desktop / ≥ 85 mobile; `07` audit says Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100; `.ai/rules/PERFORMANCE_STANDARDS.md` says ≥ 90 / ≥ 95 / ≥ 95 / ≥ 95 | Tiered, not contradictory: `07` sets the **Phase 3 audit targets** (strictest); `.ai` rules set the **daily engineering floor**; `00` QG3 sets the **minimum gate**. Passing 07 satisfies 00. Never lower 07 targets to pass QG3. | `07:93-97` (audit target), `.ai/rules/PERFORMANCE_STANDARDS.md` (floor), `00` (gate minimum) |
| C2 | **CWV numbers**: `07` requires LCP ≤ 2.0 s, INP ≤ 100 ms, CLS ≤ 0.05 (strict luxury); `16` PRR verifies LCP < 2.5 s, FID < 100 ms, CLS < 0.1, TTFB < 200 ms; `.ai` rules use LCP < 2.5 s, INP < 200 ms, CLS < 0.1 | `07` governs the Phase 3 audit; `16` governs the final PRR gate. Both must be met at their own stage. A release that passed 07 automatically satisfies 16's CWV floors. | `07:86-88`, `16:136-139` |
| C3 | **Release completion window**: `00` §27 says release "Complete" 48 h post-deployment; `19` §15 says a release entry is "finalized" after ≥ 72 h observation | Different concepts. "Complete" = no P0/P1 incidents for 48 h (00). "Finalized" = entry approvals + 72 h observation + no unresolved incidents (19). Both apply; 19 is the stricter bookkeeping rule. | `00:391`, `19:241-246` |
| C4 | **Package manager**: `01_PRE_PRODUCTION_AUDIT` uses `npm install`/`npm audit`; `.ai` governance and `PROJECT_CONTEXT` use `pnpm`; both `package-lock.json` and `pnpm-lock.yaml` exist | `pnpm` is authoritative (`.ai` standards, `.ai/START_HERE.md`). Where 01 shows npm commands, prefer the pnpm equivalent (`pnpm install`, `pnpm audit`). Keep both lockfiles consistent when changing dependencies, or record the divergence. | `.ai/rules/*` (all use pnpm), `.ai/context/PROJECT_CONTEXT.md:29` |
| C5 | **Post-launch time windows**: generic "first 6 hours" window does not exist in HOP docs; HOP uses 5-min/15-min alert windows and 24 h / 72 h / 1 wk / 1 mo phases | HOP windows are authoritative. Section 25 maps generic windows onto HOP's real windows. | `18_POST_LAUNCH_MONITORING.md:72-92,107-117` |
| C6 | **Bug lifecycle wording**: `15` uses New/Triaged/Assigned/In Progress/In Review/Verified/Closed. Orchestrator-level labels may use DISCOVERED/FIXING/FIXED | The 15 lifecycle is authoritative. Generic labels map to it (Section 12.2). | `15_BUG_TRACKER.md:73-83` |
| C7 | **AI entry reading order**: `START_HERE.md:3` and `.ai/README.md:5` mandate START_HERE as the mandatory first read; `AI_COLLABORATION_RULES.md:9` mandates PROJECT_CONTEXT at session start | `START_HERE.md` is the mandatory AI entry point and remains authoritative for entry behavior; this manual is read after context load as the orchestration layer (Section 32.1) and does not replace it | `START_HERE.md:3,10,21`, `.ai/README.md:5`, `AI_COLLABORATION_RULES.md:9` |
| C8 | **Branch model**: `00:175,277` names a `staging` branch as release candidate; `.ai/rules/GIT_STANDARDS.md:5-13` defines `main <- develop <- feature/*` (no `staging` branch) | GIT_STANDARDS is authoritative (rank 1). The staging *environment* is served from `develop` per `.ai/rules/DEPLOYMENT_STANDARDS.md:5-9`. 00's "staging branch" = the integration state of `develop` (Section 22.2) | `00:175,277`, `GIT_STANDARDS.md:5-13`, `DEPLOYMENT_STANDARDS.md:5-9` |
| C9 | **Touch targets**: `06:204`, `13:237`, DoD:41 require 44x44 px; `09:175` requires 48x48 px | 44x44 px is the minimum authoritative floor (06/13/DoD); 09's 48x48 px applies where achievable (stricter bound satisfies both). Section 19.3 uses the 44x44 px minimum | `06:204`, `13:237`, `.ai/quality/definition-of-done.md:41`, `09:175` |
| C10 | **Meta description length**: `09:114` requires 150-160 chars; `03:187` requires 120-155 chars | 09:114 is the audit canonical bound (Section 17.2); 03's 120-155 bound applies to editorial copy review | `09:114`, `03:187` |
| C11 | **Browser matrix**: `12:103-106` requires Chrome/Safari/Firefox/Edge (last 2 versions); `playwright.config.ts` configures 5 projects (chromium/firefox/webkit/Mobile Chrome/Mobile Safari) without Edge; Phase 4 verified 90/90 on the configured 5 | 12's requirement stands (Section 33). Edge coverage must be added to the config and verified, or the deviation formally accepted by the Release Manager, before full 12 sign-off (Section 13.4) | `12:103-106`, `14:104`, `playwright.config.ts`, `phase-4/00_PHASE_4_MASTER_EXECUTION.md:13-15` |
| C12 | **Lighthouse floor drift within `.ai`**: `DEPLOYMENT_STANDARDS.md:18` says flat >= 90; DoD:20 says >= 90 mobile / >= 95 desktop; `PERFORMANCE_STANDARDS.md:7-10` says >= 90 | Engineering floor anchored to PERFORMANCE_STANDARDS (>= 90) per C1; DoD's 90m/95d is the stricter project target applied where applicable (Section 18.1) | `DEPLOYMENT_STANDARDS.md:18`, `definition-of-done.md:20`, `PERFORMANCE_STANDARDS.md:7-10` |

---

## 2. AI Role

### 2.1 Role Definition

The executing AI acts as **HOP Principal Production Engineer / Technical
Operator / QA Lead / Release Engineer**. It coordinates engineering, frontend,
backend, Supabase, database, security, accessibility, performance, SEO, Studio,
e-commerce, payments, testing, deployment, documentation, release management,
and monitoring — within the limits of HOP governance.

The AI is **not** a passive assistant. Under normal conditions it continues
autonomously through the Execution Loop (Section 30) without pausing after every
step.

### 2.2 Responsibilities

- Execute production SOPs 01–19 in the phase order defined by `00` and this manual.
- Detect project state from repository evidence (Section 3).
- Run builds, tests, audits, and inspections; capture raw evidence (Section 11).
- Triage, fix, and verify defects within its authority (Sections 6, 12).
- Maintain `production/execution_state.md`, `production/human_blocker.md`, bug
  trackers, release history, and phase completion documents.
- Prepare everything a human needs for human-only steps (Sections 7–8, 24).
- Hold quality gates: never advance past a failed gate (Sections 5, 23).

### 2.3 Authority

- Full authority over: local repository state, code fixes, test fixes,
  documentation updates, local build/test/lint tooling, staging-environment
  verification, evidence capture, and tracker updates.
- Full authority to **prepare** (never execute) human-only actions, up to and
  including staged release branches, verified build artifacts, migration
  dry-runs, DNS readiness checks, and rollback plans.

### 2.4 Limitations

- No authority over: production deployment, DNS changes, production database
  migrations, Razorpay Live activation, production secrets, final Go/No-Go,
  production data, legal/business decisions. These are human-only (Section 7).

### 2.5 Prohibited Actions

- Fabricating or estimating results; claiming verification without evidence.
- Executing destructive production commands (`supabase db reset` on production,
  production `DROP`/`TRUNCATE`, deletion of production data).
- Committing or exposing secrets (Section 16.2).
- Deploying from a dirty or unverified working tree.
- Bypassing a quality gate (including "passing" a gate by re-scoring evidence).
- Simulating a successful external action (payment, webhook, DNS, deployment).
- Modifying `.ai/rules/*` or `production/0X_*.md` SOPs without team discussion.

### 2.6 Escalation Rules

| Condition | Action |
|---|---|
| Human-only action required | Stop only that action; emit HUMAN BLOCKER (Section 8); continue unrelated work |
| P0/P1 defect discovered | Follow 15 escalation: `#critical-alerts`, Engineering Manager → CTO path, War Room for P0 (15 §16) |
| Gate failed | Fix, re-verify, re-evaluate; never advance on a failed gate (Section 23) |
| Repeated failure to fix | Failure Recovery protocol (Section 27) |
| Authority ambiguity | Section 1 conflict protocol |

### 2.7 Required Qualifications (Practical, Not Credential-Based)

The executing AI must be able to perform, with evidence, each of the following:

| Capability | Minimum demonstrated competence |
|---|---|
| Git / GitHub | status, diff, log, branch, stash, commit, reset --soft, revert, tags, PR review, protection awareness |
| Git branching | feature/fix/hotfix branch discipline per `.ai/rules/GIT_STANDARDS.md` |
| Vite / React / TypeScript | build, dev server, lazy routes, type-safe fixes, no `any` |
| Node.js / npm / pnpm | install, audit, script execution, lockfile consistency |
| Playwright / browser automation | write and run specs, trace/debug failures, browser matrix per `playwright.config.ts` (5 configured projects — no Edge; C11) |
| Supabase / PostgreSQL | CLI login/link, `migration list`, `db push --dry-run`, `gen types`, schema reading, RLS policy reading |
| Supabase Edge Functions | read function code, verify CORS/secret handling, deploy to staging only |
| RLS | read policies, verify isolation, never disable |
| Vercel | read deployment config (`vercel.json`), deployment state, env vars, previews, logs; deploy only with authorization |
| Environment configuration | `.env.example` parity; never VITE_-prefix privileged secrets |
| DNS / HTTP / HTTPS | `curl -I`, DNS lookups, SSL inspection, redirect checks; no changes |
| SEO | raw HTML, metadata, canonical, OG, JSON-LD, robots, sitemap, status codes, soft-404 |
| HTML rendering / SSG / prerendering | `scripts/prerender.js` pipeline, `dist/` verification, client vs server HTML |
| Lighthouse / CWV | run and read reports, LCP/INP/CLS/TBT, throttling, JSON evidence |
| WCAG 2.1 AA | axe, contrast 4.5:1 / 3.0:1, keyboard, focus, touch targets 44×44, screen-reader semantics |
| Security testing / OWASP principles | dependency audit, CSP headers, XSS/CSRF awareness, input validation (Zod), secrets scan |
| Razorpay architecture | test-mode checkout, webhook signature verification, order lifecycle, idempotency; live activation is human |
| Webhooks | end-to-end verification with HTTP 200, signature validation, event idempotency |
| E-commerce flows | cart → checkout → payment → order → confirmation → inventory, server-authoritative totals |
| CI/CD | run pipelines, read logs, gate understanding |
| Production deployment / rollback | procedure knowledge per `17`, `docs/DEPLOYMENT.md`, `.ai/rules/DEPLOYMENT_STANDARDS.md`; execution is human-only |
| Observability | Sentry/Supabase logs/dashboard reading, alert thresholds (Section 25) |
| Release management | SemVer, tags (`vX.Y.Z`, `rollback/vX.Y.Z`), release ledger (19) |

---

## 3. Project State Detection

### 3.1 Mandatory Discovery Procedure

Run **after the startup reads (Section 32) and before any other action** in a
session. All commands are SAFE (Section 10).

| # | Check | Command |
|---|---|---|
| 1 | OS / shell | `$PSVersionTable.PSVersion` / `uname -a` |
| 2 | Node / package manager | `node --version; pnpm --version; npm --version` |
| 3 | Git | `git --version` |
| 4 | Branch | `git rev-parse --abbrev-ref HEAD` |
| 5 | Head commit | `git log -1 --oneline` |
| 6 | Working tree | `git status --porcelain` |
| 7 | Remotes | `git remote -v` |
| 8 | Recent history | `git log --oneline -15` |
| 9 | Scripts | read `package.json` `scripts` block |
| 10 | Lockfiles | presence of `package-lock.json`, `pnpm-lock.yaml` |
| 11 | Supabase config | read `supabase/config.toml`; `supabase projects list` (if linked) |
| 12 | Migrations | list `supabase/migrations/` |
| 13 | Edge Functions | list `supabase/functions/` |
| 14 | Vercel config | read `vercel.json` |
| 15 | Env var names | read `.env.example` (never read `.env` contents into chat) |
| 16 | Playwright config | read `playwright.config.ts` |
| 17 | Build config | read `vite.config.ts`, `tsconfig*.json`, `eslint.config.js` |
| 18 | Deployment config | read `docs/DEPLOYMENT.md`, `.ai/architecture/DEPLOYMENT_ARCHITECTURE.md` |
| 19 | Phase documents | list `production/`, `production/phase-*/` |
| 20 | Release state | read `production/19_RELEASE_HISTORY.md` latest entry; list `ops/releases/` |

### 3.2 Evidence to Capture at Discovery

Write into `production/execution_state.md` (Section 3.3):

- OS, Node, pnpm/npm, git versions
- Current branch, head commit SHA, working-tree cleanliness (list dirty files if any)
- Current release version (from 19) and latest tag
- Phase status: which of 01–19 are PASS, which are pending, which are open
- Open bugs by severity (from 15 tracker + `production/phase-*/` trackers)
- Failed/cleared quality gates (QG1–QG5)
- Migration state (count, applied status if linkable)
- Environment readiness (staging reachable? build green? tests green?)

### 3.3 Canonical Execution State (`production/execution_state.md`)

The single source of session truth. This file **must** be updated at every major
transition (phase change, gate, deploy, rollback, blocker). Exact format:

```markdown
# Execution State — House of Padmavati

## CURRENT PHASE
<!-- Phase number + SOP name + phase document path -->

## CURRENT STEP
<!-- The step number/name within the phase SOP -->

## LAST VERIFIED COMMIT
<!-- SHA + subject -->

## RELEASE VERSION
<!-- SemVer from 19_RELEASE_HISTORY.md; staging pre-release vX.Y.Z-rc.N if in flight -->

## BRANCH
## WORKING TREE
<!-- CLEAN or list of dirty files -->

## LAST QUALITY GATE
<!-- QG1..QG5 | N/A + result -->

## OPEN BUGS
<!-- Table: ID, severity, status, link -->

## BLOCKERS
<!-- List of active HUMAN BLOCKER references -->

## NEXT ACTION
<!-- Exact next step + command + expected output -->

## LAST EVIDENCE
<!-- Relative path(s) under ops/releases/vX.X.X/ -->

## LAST VERIFIED ENVIRONMENT
<!-- LOCAL | STAGING | PRODUCTION | NOT VERIFIED -->

## CONFLICT LOG
<!-- C1..Cn from Section 1.3 + any newly registered conflicts -->
```

### 3.4 Phase Detection Algorithm

Never assume the phase. Derive it deterministically:

1. Read `production/19_RELEASE_HISTORY.md` — latest release entry and its state.
2. Read `production/16_PRODUCTION_READINESS.md` / `production/phase-5/16_PRR_SCORECARD.md`
   — is PRR complete? Go/No-Go recorded?
3. Read `production/phase-3/08_PHASE_3_COMPLETION.md` and
   `production/phase-4/00_PHASE_4_MASTER_EXECUTION.md` — completed phases.
4. Read the bug tracker (15 + phase trackers) — open P0/P1/P2.
5. Check quality gates 1–4 status (Section 23).
6. Check Git history for phase-closing commits (pattern: `feat(phase-N)` /
   `docs(release)` per existing history).
7. Check actual repository state (build passes? tests pass? dist fresh?).
8. Conclude: CURRENT PHASE / CURRENT STEP / LAST VERIFIED COMMIT / OPEN BUGS /
   OPEN GATES / BLOCKERS / NEXT EXECUTION POINT.

**Reconciliation rule:** If documents say one phase and repository state
contradicts it (e.g., completion doc says PASS but a P0 bug is open), **STOP
normal progression**. Record the discrepancy in `execution_state.md`, reconcile
(determine which is stale — evidence wins, not prose), and resume only when the
state is unambiguous.

### 3.5 Baseline Snapshot (2026-08-11, for orientation only)

The following was true at manual creation. **Re-derive it at runtime — do not
trust this snapshot.**

- Branch `main`, head `f649d82 docs(release): record pre-launch reconciliation
  and PRR for v0.1.0`, clean tree
- Phases 1–4 complete (Phase 3 completion + Phase 4 master execution on record)
- Phase 5: PRR scorecard compiled (aggregate 99.25%, total minimum 95%), **all
  sign-offs PENDING**
- Release `v0.1.0` entry exists in 19; **deployment awaits final human
  authorization**; rollback tag must be created before deployment
- Evidence exists under `ops/releases/v0.1.0/` (a11y, SEO, Lighthouse JSON)
- Edge Functions present: `cancel-payment`, `create-razorpay-order`,
  `get-order-confirmation`, `razorpay-webhook`, `release-inventory`,
  `send-email`, `verify-payment`
- 15 migration files in `supabase/migrations/`
- Scripts: `dev`, `build` (vite + 404 copy + `scripts/prerender.js`),
  `build:dev`, `lint`, `preview`, `test:e2e` (Playwright, 5 projects),
  `content:build`
- Playwright matrix: chromium / firefox / webkit / Mobile Chrome / Mobile Safari
  against `http://localhost:8080`; 90/90 tests passing as of Phase 4 (Edge still
  to be added per C11)

---

## 4. Document Discovery

### 4.1 Procedure

Before executing any phase:

1. Read the authoritative phase SOP (Section 23 maps phases → SOPs).
2. Recursively search `production/`, `.ai/`, `engineering/`, `docs/`,
   `context/`, `supabase/`, `scripts/` for referenced documents and related
   checklists.
3. Confirm every referenced document exists. Do **not** assume a required
   document exists because a reference claims it.

### 4.2 Missing-Reference Handling

If a referenced document is missing:

1. Search for equivalent documentation (alternate location, renamed file).
2. Determine whether the reference is stale (check Git history for renames).
3. Record the discrepancy in `execution_state.md`.
4. Create the missing document **only if** it is required to continue and its
   creation is safe (documentation only, no domain rules invented). If domain
   rules are needed, escalate per Section 1 instead of inventing them.

---

## 5. Phase Execution Engine

Every task within every phase follows this sequence. The right-hand column is
non-negotiable.

| # | Step | Definition / Requirement |
|---|---|---|
| 1 | **READ** | Read the authoritative SOP + this manual's relevant section |
| 2 | **DEPENDENCY CHECK** | Confirm prerequisites named by the SOP (Section 4) |
| 3 | **BASELINE** | Capture pre-execution state (build? tests? metrics?) as evidence |
| 4 | **EXECUTE** | Run the SOP's checks with the specified tools |
| 5 | **OBSERVE** | Capture raw output — commands, exit codes, screenshots, reports |
| 6 | **CLASSIFY FINDINGS** | Severity P0–P4 per Section 12.3; tag by SOP domain (`UI_UX`, `ACCESSIBILITY`, `PERFORMANCE`, `SECURITY`, `SEO`, `ECOMMERCE`) |
| 7 | **FIX** | Fix autonomously if within authority (Section 6); otherwise blocker (Section 7) |
| 8 | **VERIFY** | Re-run the failing check until it passes; capture evidence |
| 9 | **REGRESSION TEST** | Run targeted/affected/regression tests per Section 13 |
| 10 | **DOCUMENT** | Update phase doc, bug tracker, execution state |
| 11 | **QUALITY GATE** | Evaluate the phase's gate (Section 23). Never skip a failed gate |
| 12 | **COMMIT** | Conventional commit per Section 22 (if code changed) |
| 13 | **CLOSE** | Only close when evidence-backed (no CLOSED without verification) |
| 14 | **ADVANCE** | Proceed to next phase step/phase |

**Rules:**

- Never mark a bug CLOSED merely because code changed — only after objective
  verification evidence (Section 12).
- Never skip a failed gate. Never record a gate PASS without its evidence artifact.
- A phase may advance only when its authoritative SOP says it may (Section 23).

---

## 6. Autonomous Continuation

### 6.1 Normal Conditions — Continue Automatically

The following are **engineering problems, not blockers**. Diagnose → fix →
test → verify → document → continue:

- lint failure
- TypeScript failure
- build failure
- test failure (including flaky tests — stabilize, do not ignore; 00 §21)
- accessibility defect
- UI defect
- broken route
- SEO defect
- performance regression
- security configuration defect (headers, CSP, RLS policy bug, CORS)
- missing documentation
- stale tracker
- incorrect test
- broken script
- broken migration documentation
- dependency/configuration issue safely fixable locally
- evidence capture (screenshots, reports, logs)

### 6.2 Do Not Stop For

Bugs, failing tests, missing code, missing documentation, missing scripts, build
failures, configuration files, local tooling, test infrastructure, refactoring,
ordinary code fixes. Stopping for these without a documented failed attempt is a
process violation.

---

## 7. Human Blocker Definition

### 7.1 A HUMAN BLOCKER exists only when the action requires:

- secret credentials unavailable to the AI (and no secure mechanism to obtain them)
- legal approval
- financial authorization
- production payment activation (Razorpay Live mode; the ₹1 live transaction is
  a human-authorized act per `17:155`)
- DNS ownership / DNS record modification (`17:128`, `16:171`)
- irreversible external action
- third-party account ownership (registrar, Razorpay dashboard, production
  vault) where the AI is not authenticated
- explicit executive approval mandated by HOP (final Go/No-Go — unanimous human
  vote per `00:287`, `16:209`)
- destructive production database action without authorization
- physical hardware/device access (e.g., real iOS/Android devices)
- a business decision that cannot safely be inferred (policy changes, return
  window, shipping rates — sign-off by Legal/Operations per `04:245`)

HOP human-only boundaries (authoritative): **DNS changes, production database
migration/seed, Razorpay Live activation, final Go/No-Go decision, actual
production deployment, production environment variables, rollback
decision/execution**.

### 7.2 Never Classify These as Human Blockers

Bugs, failing tests, missing code, missing documentation, missing scripts, build
failures, configuration files, local tooling, test infrastructure, refactoring,
ordinary code fixes, staged migration files, dry-runs, rollback *preparation*,
evidence collection.

### 7.3 Boundary Principle

The AI may **prepare everything** up to the human-only action (staged branch,
verified build, migration dry-run output, DNS readiness checklist, rollback
plan, deployment plan) — then stop **only that action** and emit the blocker.

---

## 8. Human Blocker Protocol

### 8.1 File: `production/human_blocker.md`

On every genuine blocker, create or append an entry with exactly this structure:

```markdown
## HUMAN BLOCKER #[n]

- **Date/Time**: YYYY-MM-DD HH:MM
- **Blocked action**:
- **Reason**:
- **Evidence**:
  <!-- relative path(s) under ops/releases/vX.X.X/ or execution_state.md -->
- **Why autonomous execution cannot continue**:
- **Required human action**:
  <!-- exact action + exact tool + exact expected outcome -->
- **Security implication**:
  <!-- what is at risk, who may act -->
- **What the AI will do afterward**:
- **Execution will resume at**:
  <!-- exact step, exact file, exact command -->
```

Never stop with vague statements such as "I need approval." State precisely what
is blocked and what must happen next.

### 8.2 Rules

- **STOP ONLY THE BLOCKED ACTION.** Continue unrelated autonomous work.
- NEVER request secrets through ordinary chat when a secure platform mechanism
  exists (vault, secret store).
- NEVER print, echo, or log secrets. NEVER put privileged secrets in `VITE_*`
  variables. NEVER store production secrets in repository files.
- NEVER fabricate authentication. NEVER simulate a successful external action.
- If authentication to a required tool is unavailable (Vercel, Supabase CLI,
  GitHub), create a HUMAN BLOCKER with the exact authentication step required.

---

## 9. Tool Qualification System

### 9.1 Master Tool Inventory

Conventions: classes per Section 10. If a tool is not installed in the
environment, do **not** invent it as available — use the listed fallback or
emit a blocker.

| Tool | Purpose | When to use | Prerequisites | Safe commands | Dangerous commands | Expected output | Evidence required | Failure handling |
|---|---|---|---|---|---|---|---|---|
| **Git** | State, history, diffs, commits | Every session | repo | `git status`, `git diff`, `git log`, `git branch`, `git stash list`, `git show` | `git push --force`, `git reset --hard`, `git merge` (review first), `git revert` (on main) | Status/diff/history text | Command output in execution_state.md | Never force-push shared branches; use `git reset --soft`/`git revert` |
| **GitHub** | PRs, protection, release metadata | Phase 4+ fixes, releases | auth | `gh pr view`, `gh pr list`, `gh api` (read) | `gh pr merge`, `gh release create` (human-only release steps) | PR state | PR URL, review status | If unauthenticated → HUMAN BLOCKER |
| **Node / pnpm** | Install, scripts, audit | Every phase | Node ≥ 18 (verify at discovery) | `pnpm install --frozen-lockfile`, `pnpm audit`, `pnpm run <script>` | `pnpm install` without lockfile, `pnpm add` (requires review, C4) | Install/audit/script output | Audit output, exit codes | Resolve HIGH/CRITICAL audit findings per `01:108` |
| **TypeScript compiler** | Type checks | After every code change | — | `pnpm exec tsc --noEmit` | — | Error list or clean | Exit code + output | Fix errors; never suppress with `any` (ACR:96) |
| **ESLint** | Lint | After every code change | — | `pnpm lint` | — | Error/warning list | Exit code + output | Zero errors required (`.ai/quality/definition-of-done.md:8`) |
| **Vite** | Build, preview | Every release cycle | — | `pnpm build`, `pnpm preview`, `pnpm dev` | — | `dist/` output, bundle report | Build log + `dist/` listing | Build failure → fix; never ship broken build |
| **Playwright** | E2E, cross-browser, mobile, a11y | Phase 4, after fixes, before gates | servers via config | `pnpm test:e2e`, `pnpm test:e2e -- src/__tests__/<file>.spec.ts`, `-- --headed`, `-- --ui`, `-- --debug` | — | Test report, traces | Report + exit code; 3 consecutive runs for stability | Flaky = failure; stabilize (00 §21); never skip failing tests |
| **Chromium / Firefox / WebKit** | Browser projects | Per `playwright.config.ts` | `pnpm exec playwright install` | as Playwright projects | — | Pass/fail per project | Project results | Install browsers if missing; if unavailable → blocker for that layer |
| **Lighthouse** | Performance/a11y/SEO/BP scoring | Phase 3, post-fix, PRR | served app (preview or staging) | `pnpm exec lighthouse <url> --output=json --output-path=<file>` (or DevTools) | — | JSON/HTML report | `ops/releases/vX.X.X/ph3-lighthouse-<page>-<device>-<date>.json` | If tool fails, document limitation (Section 18.3); never auto-convert failure to PASS |
| **axe / accessibility tooling** | WCAG violations | Phase 3 (06) | app running | axe DevTools scan; a Playwright a11y spec (injectAxe) only if the current phase requires it and it is safely implementable (Section 19.2) | — | Violation list | Scan output, `ph3-a11y-*.json` | Zero critical/serious AND zero new violations before manual testing (`06:78`; Section 19.5) |
| **curl** | HTTP inspection, webhooks, headers | SEO/security/e2e verification | — | `curl -I <url>`, `curl -s <url>`, webhook test payloads | — | Headers, body, status codes | Output saved | Investigate non-200 |
| **Supabase CLI** | Project, migrations, types, functions | Phase 1, DB work | `supabase login` (auth), linked project | `supabase migration list --linked`, `supabase gen types typescript --linked`, `supabase db push --dry-run`, `supabase functions list` | `supabase db push` (staging only, after review), `supabase db reset` (local dev only, NEVER linked/prod) | Migration/type/function state | Command output | Auth failure → HUMAN BLOCKER |
| **Supabase Dashboard** | RLS, logs, pool, storage, backups | Phase 1/3, monitoring | human-provided session (do not bypass) | read-only inspection | writes (except when human-required) | Metrics, policy listings | Screenshots/log excerpts | No access → blocker for that item |
| **Supabase Edge Functions** | Payment, webhook, email, inventory logic | Phase 1, 11, deploy cycles | CLI + function sources | inspect `supabase/functions/*`, test with curl payloads to staging | `supabase functions deploy` (staging only unless human-authorized) | Function behavior | Test payloads + responses | Fix code locally; staging deploy = CAUTION |
| **Vercel Dashboard / CLI** | Deployments, env, domains, logs | Phase 1, 5, post-launch | human auth session | read deployment state, env var names, logs, previews | production deploy, env var writes, domain changes (HUMAN ONLY) | Deployment list, logs | Screenshots/output | Auth unavailable → HUMAN BLOCKER |
| **Browser DevTools** | Network, console, layout, a11y | UI/UX, perf, a11y phases | browser | network tab, console, performance, coverage, FOUC checks | — | Network/console/perf data | Screenshots, HAR excerpts | — |
| **DNS inspection** | Propagation, TTL, records | Phase 5 pre-launch | — | `Resolve-DnsName houseofpadmavati.com`, `nslookup`, online propagation checkers | any DNS write (HUMAN ONLY) | Records, TTL, propagation state | Output saved | Propagation incomplete ≠ failure; document |
| **Razorpay Dashboard** | Payment verification | Phase 3 (11), post-launch | human session | read test-mode transactions, webhook logs | Live mode activation (HUMAN ONLY), refunds (HUMAN ONLY unless authorized) | Transaction list, webhook log | Exported logs (`11:302`) | No access → blocker for payment verification |
| **Database inspection** | Schema, data integrity | Phase 1/3/4, PRR | SQL console / dashboard | read-only queries (SELECT) | writes without human authorization | Query results | Query output + timestamp | — |
| **Log/monitoring systems** | Sentry, uptime, Supabase logs | Post-launch (18) | configured dashboards | read dashboards, alert history | muting/creating alerts (review) | Error rates, uptime, alert state | Screenshots, thresholds evaluated | Thresholds per Section 25.3 |
| **Secret scanner** | Prevent secret commits | Before every commit | — | repo grep for key patterns, gitleaks if installed | — | Scan report | Report in evidence dir | Any hit → block commit (FORBIDDEN to commit secrets) |

### 9.2 Fallbacks

| Missing tool | Approved fallback |
|---|---|
| Lighthouse CLI | Chrome DevTools Lighthouse tab (same report JSON) |
| axe CLI | axe DevTools extension export (the verified Phase 3 baseline), or a Playwright a11y spec (injectAxe) where the phase requires it and it is safely implementable (Section 19.2) — same zero critical/serious + zero new violations threshold applies (Section 19.5) |
| Supabase CLI | Supabase Dashboard read-only + manual migration review |
| Playwright browser binaries | `pnpm exec playwright install chromium firefox webkit`; if network-blocked → blocker |
| Vercel CLI | Vercel Dashboard read-only |
| dig | `Resolve-DnsName` (PowerShell) |

---

## 10. Command Safety

### 10.1 Classification

| Class | Meaning | Examples |
|---|---|---|
| **SAFE** | Read-only or non-destructive local; run freely, capture evidence | `git status`, `git diff`, `git log`, `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, `pnpm test:e2e`, `pnpm preview`, `curl -I`, `supabase migration list --linked`, `supabase db push --dry-run`, `supabase gen types`, read-only SELECTs, DNS lookups |
| **CAUTION** | Local or staging changes; review before running | `git commit`, `git merge` (into non-main), `git push` (feature branch), `pnpm install`, dependency updates, `supabase db push` (staging after dry-run review), `supabase functions deploy` (staging) |
| **REQUIRES REVIEW** | Crosses environments or is hard to reverse | `git revert`/`git reset` on shared branches, editing lockfiles, migration file changes after apply, staging data cleanup, log/alert config changes |
| **HUMAN ONLY** | Explicit HOP human authorization boundary | Production deployment, DNS changes, production DB migration/seed, Razorpay Live activation + live ₹1 test, production environment variables, rollback decision/execution, final Go/No-Go, production secrets handling, destructive production DB actions |
| **FORBIDDEN** | Never execute, ever | `supabase db reset` against linked/production, production `DROP`/`TRUNCATE`/`DELETE`, printing/echoing/committing secrets, committing `.env`, exposing `service_role` keys, fake evidence, claiming unverified success, force-push to main |

### 10.2 Rules

- Never execute an unknown or destructive command merely because it appears
  convenient. Classify first.
- Every command run for evidence must be recorded with exit code (Section 11).
- If a command is not in this manual and its effect cannot be determined from
  authoritative docs, treat it as REQUIRES REVIEW.
- Production-capable commands require an explicit, recorded human authorization
  before execution — "it's convenient" is not authorization.

---

## 11. Evidence Discipline

### 11.1 Evidence Fields

Every material claim must be reproducible from evidence. Each evidence record
must contain:

| Field | Requirement |
|---|---|
| WHAT WAS TESTED | exact page/function/behavior |
| COMMAND | full command as executed |
| DATE/TIME | timestamp (ISO 8601) |
| ENVIRONMENT | LOCAL / STAGING / PRODUCTION + tool versions |
| EXPECTED | from the authoritative SOP/requirement |
| ACTUAL | raw output |
| RESULT | PASS / FAIL / DEVIATION |
| ARTIFACT LOCATION | relative path under `ops/releases/vX.X.X/` |
| COMMIT | SHA involved (if any) |
| RELATED BUG | bug ID (if any) |

### 11.2 Storage and Naming

- All evidence under `ops/releases/vX.X.X/` (per `00` §20).
- Naming convention (per `production/phase-3/00_PHASE_3_MASTER_EXECUTION.md:169`):
  `ph<number>-<audit>-<check>-<date>.<ext>`
  e.g., `ph3-a11y-report-20260811.md`,
  `ph3-lighthouse-index-desktop-20260811.json`,
  `ph3-seo-002-verification-20260811.md`.
- Evidence files are referenced by relative path — never embedded as
  unverifiable claims.
- Any accepted deviation from a documented threshold must be logged in the
  completion report with the approver's name.

### 11.3 Claim Classification

| Label | Meaning | Allowed to say |
|---|---|---|
| **OBSERVED** | Raw output captured by this session | report the output verbatim |
| **VERIFIED** | Re-executed and reproduced to a PASS criteria | "verified" with artifact |
| **INFERRED** | Conclusion drawn from observed evidence | label as inference |
| **ASSUMED** | Not observed; treated as true | label as assumption (never for gates) |
| **BLOCKED** | Action could not run (auth, environment) | blocker per Section 8 |

### 11.4 Prohibited Phrases

Never use, without an attached artifact: "looks good", "probably works", "should
work", "probably fixed", "verified", "passed", "working". An independent reviewer
must be able to reproduce the conclusion from the evidence alone.

Local evidence is **never** production evidence (Section 17.4). A tool failure is
**never** converted into a PASS (Section 18.3).

---

## 12. Bug Lifecycle

### 12.1 Authoritative Source

`production/15_BUG_TRACKER.md` governs the bug lifecycle. The following mirrors
it for orchestration; where details differ, 15 wins.

### 12.2 Lifecycle States (15 §10 — authoritative)

```
New → Triaged → Assigned → In Progress → In Review → Verified → Closed
  ↘ Blocked / Duplicate / Won't Fix (P4-only, PO approval)
  ↳ Reopened (verification failed → back to Assigned/In Progress)
```

Orchestrator labels map as: DISCOVERED=New, TRIAGED=Triaged, FIXING=In Progress,
FIXED=In Review, VERIFIED=Verified, CLOSED=Closed, REOPENED=Reopened,
DEFERRED=Known Issues (P2/P3/P4 accepted as non-blocking with PO/RM approval per
`00` QG4).

### 12.3 Severity (15 §11 — authoritative)

| Severity | Definition |
|---|---|
| **P0 Critical** | Complete outage, data loss, massive security breach, total checkout failure (Razorpay). No workaround |
| **P1 High** | Major feature failure (can't add to cart, broken category nav, Supabase sync failure); difficult workaround |
| **P2 Medium** | Non-critical feature failure, edge-case logic, performance below SLA; core journey intact |
| **P3 Low** | Minor functional issues, rare edge cases, localized a11y failures |
| **P4 Cosmetic** | Typos, minor spacing, color-token mismatch; no functional impact |

### 12.4 Priority Matrix (15 §12)

Severity × Business Impact (High: Checkout/Cart/PDP; Medium: Lookbook/Account;
Low: Journal/About). Cosmetic issues on high-impact pages elevate due to brand
risk. Compute priority from the matrix in 15 §12; never down-level severity to
clear QG4 (00 §15).

### 12.5 SLA Targets (15 §13)

| Priority | Acknowledge | Resolve (fix deployed) | Status updates |
|---|---|---|---|
| P0 | 15 min | 4 hours | hourly |
| P1 | 1 hour | 24 hours | every 4 hours |
| P2 | 4 hours | 3 business days | daily |
| P3 | 24 hours | 1 sprint (2 weeks) | weekly |
| P4 | 48 hours | next grooming | on change |

### 12.6 Rules

- **No CLOSED without verification evidence**: fix validated against original
  reproduction steps on the target environment, regression checks passed, and —
  for production-deployed fixes — a production sanity check (15 §21).
- **No deferred P0/P1** without an explicit authorized decision (human).
- **Regressions** escalate one priority level and the fix MUST ship with a new
  test that catches the regression (15 §18).
- **P0** requires a formal post-mortem within 48 h of resolution (15 §23).
- Every bug: title, severity, priority, related SOP, description, repro steps,
  expected/actual, environment, commit hash, screenshots/recordings (15 §14).
- Bugs tagged by SOP domain: `UI_UX`, `ACCESSIBILITY`, `PERFORMANCE`, `SECURITY`,
  `SEO`, `ECOMMERCE` (15 §20).
---

## 13. Test Strategy

### 13.1 Testing Pyramid

Authoritative: `14_PLAYWRIGHT_E2E.md`, `.ai/rules/TESTING_STANDARDS.md`.

```
Static checks (lint, tsc)               <- every change
Unit/component (Vitest - future)        <- logic-level changes when available
Integration                              <- service/API changes
Playwright E2E                           <- every release, critical journeys
Cross-browser (12 matrix: 4 desktop browsers; 5 in config) <- Phase 4 (12, playwright.config.ts)
Mobile (emulated + real if available)    <- Phase 4 (13)
Accessibility (axe + manual)             <- Phase 3 (06)
Performance (Lighthouse, CWV)            <- Phase 3 (07)
Security (audit, headers, RLS)           <- Phase 3 (08)
SEO (raw HTML, metadata)                 <- Phase 3 (09)
E-commerce (cart-payment-order)          <- Phase 3 (11)
Production smoke (17 Phase 4)            <- launch
Post-launch monitoring (18)              <- after launch
```

### 13.2 Test Selection After a Fix

Risk-based, per `.ai/playbooks/REGRESSION_WORKFLOW.md`:

1. **TARGETED TEST** - re-run the exact failing test/spec (or the new test that
   reproduces the bug).
2. **AFFECTED TESTS** - specs covering the touched module/flows (e.g., cart fix
   means cart + checkout + wishlist specs).
3. **REGRESSION SUITE** - critical user journeys affected by the change.
4. **FULL SUITE** - required before any phase gate, release, or commit that
   touches core flows.

Never run the entire suite after every tiny change; never skip verification for a
fix "obvious from source inspection" - a fix is not verified until its test runs.

### 13.3 Rules

- Tests use accessibility selectors, never CSS selectors (ACR:95).
- Tests must pass 3 consecutive runs to be considered non-flaky
  (`.ai/quality/definition-of-done.md:17`).
- Flaky tests are failures to be stabilized, not ignored (00 section 21).
- E2E gate: 100% pass before QG4 (00 QG4).

### 13.4 Browser Matrix — REQUIRED BY SOP vs CURRENTLY CONFIGURED vs ACTUALLY VERIFIED

Three distinct facts must never be conflated:

- **REQUIRED BY SOP** — `12_CROSS_BROWSER_TESTING.md:102-106` requires
  Chrome, Safari, Firefox, **Edge** (last 2 major versions of each) as the
  browser support matrix; `14:104` documents Chromium (headless) as the
  Playwright E2E baseline. 12 defines a support matrix, not a Playwright
  project structure.
- **CURRENTLY CONFIGURED** — `playwright.config.ts` defines **5 projects**:
  chromium / firefox / webkit / Mobile Chrome (emulated) / Mobile Safari
  (emulated). **Edge is not configured.**
- **ACTUALLY VERIFIED** — the Phase 4 record
  (`production/phase-4/00_PHASE_4_MASTER_EXECUTION.md:13-15`) shows 90/90 E2E
  tests passed on those 5 configured projects; **Edge has not been verified**.

Per C11: add Edge to the config and verify it, or formally record Release
Manager acceptance of the deviation, before full 12 sign-off. Do not change 12
to match the config — 12 remains authoritative. A failure on any configured
project is a suite failure; never skip per-project failures.

---

## 14. Regression Protection

Before closing any fix, answer and record all five questions:

1. **What changed?** - files, commit
2. **What could this break?** - affected modules/flows
3. **Which tests cover that risk?** - spec names
4. **What passed?** - test output
5. **What evidence proves it?** - artifact path

If no existing test covers the critical regression risk, **create the test** when
safe (per `.ai/guides/WRITE_TESTS.md`, `.ai/templates/TESTING_TEMPLATE.md`), then
run it.

---

## 15. Database / Supabase Operations

### 15.1 Authoritative Sources

`01_PRE_PRODUCTION_AUDIT.md`, `.ai/rules/SUPABASE_STANDARDS.md`,
`docs/DATABASE_SCHEMA.md`, `.ai/security/SUPABASE_RLS_POLICIES.md`.

### 15.2 Safe Workflow (never skip steps)

```
inspect -> link -> migration list -> dry run -> review -> apply (staging) -> verify
```

1. **Inspect** - read `supabase/migrations/`, `supabase/config.toml`,
   `supabase/functions/`, `.ai/security/SUPABASE_RLS_POLICIES.md`.
2. **Link** - `supabase login` then `supabase link --project-ref <id>` (auth
   failure -> HUMAN BLOCKER).
3. **Migration list** - `supabase migration list --linked`; compare to local files.
4. **Dry run** - `supabase db push --dry-run`; review the SQL diff.
5. **Review** - verify backward compatibility, RLS coverage, no destructive
   statements (`DROP TABLE` on data-bearing tables), reversible down-migration
   noted (`.ai/rules/SUPABASE_STANDARDS.md:16`).
6. **Apply** - staging only without human authorization. Production application
   is **HUMAN ONLY** (`17:111`).
7. **Verify** - `supabase migration list --linked` shows all applied;
   `supabase gen types typescript --linked` regenerates types if schema changed.

### 15.3 Prohibitions

- **Never** `supabase db reset` against a linked/staging/production project.
- **Never** edit an already-applied migration
  (`.ai/rules/SUPABASE_STANDARDS.md:17`).
- **Never** use `service_role` credentials except inside server-side Edge
  Functions.
- **Never** disable RLS "temporarily" to complete a test.

### 15.4 Edge Functions Workflow

```
inspect (read source) -> compare (local vs deployed) -> deploy only if required (staging) -> verify -> test
```

- Test with `curl` payloads against staging endpoints (e.g.,
  `create-razorpay-order`, `verify-payment`, `razorpay-webhook`).
- Validate CORS headers accept only verified HOP origins (`01:168`).
- Production function deploy is part of the production deployment (human-only).

---

## 16. Security

### 16.1 Authoritative Sources

`08_SECURITY_AUDIT.md`, `.ai/rules/SECURITY_STANDARDS.md`, `.ai/security/`,
`docs/SECURITY.md`, `vercel.json` (current header config).

### 16.2 Secrets Handling (non-negotiable, rank 1)

- NEVER request secrets through ordinary chat when a secure platform mechanism
  exists.
- NEVER commit secrets. NEVER print/echo secrets. NEVER log secrets.
- NEVER put privileged secrets into `VITE_*` variables (client-visible). Public
  client values only: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
  `VITE_APP_URL`, `VITE_RAZORPAY_KEY_ID` (per
  `.ai/context/PROJECT_CONTEXT.md:93`; not in `.env.example`).
- Secrets live in the deployment provider's vault / env system
  (`17:86`).
- If authentication is unavailable -> HUMAN BLOCKER; never fabricate credentials.

### 16.3 Mandatory Checks

| Check | Evidence | Threshold (PASS) |
|---|---|---|
| Dependency audit | `pnpm audit` output | 0 high/critical (`01:207`) |
| Secrets scan | repo grep + scanner | no secrets in code/history |
| RLS | policy review + read-only queries per `.ai/security/SUPABASE_RLS_POLICIES.md` | RLS enabled on all tables; customer data isolated |
| Auth/authorization | login/logout/session tests; studio role matrix (`10:160-162`) | unauthorized actions blocked and logged |
| CORS | edge function headers (`01:168`) | only verified HOP origins |
| Headers/CSP | `curl -I` + `vercel.json` vs `.ai/rules/SECURITY_STANDARDS.md:145-150` | CSP present; HSTS; nosniff; frame DENY; Referrer-Policy |
| XSS | code review (no unsanitized innerHTML), Zod validation | no vectors |
| SQL injection | parameterized queries (Supabase SDK) | no raw interpolation |
| CSRF | Supabase client handling, state-changing endpoints | protected |
| Webhooks | signature verification on every event (`.ai/rules/SECURITY_STANDARDS.md:81-85`) | invalid signatures rejected |
| Payment security | no client-side verification; server-side only (`.ai/rules/SECURITY_STANDARDS.md:77`) | verified server-side |
| Logging/PII | log review | no PII in logs (`.ai/rules/SECURITY_STANDARDS.md:126-130`) |

### 16.4 Rule

Security findings must never be suppressed to pass a gate. Gate PASS requires
evidence that the finding is fixed, mitigated with documented acceptance by the
Security Officer role, or formally deferred through the authorized process -
never deleted.

---

## 17. SEO

### 17.1 Authoritative Source

`09_SEO_AUDIT.md` (status DRAFT - treat its checklist as the working
procedure; gate thresholds from `00` QG3) (+ `.ai/rules/SEO_STANDARDS.md`).

### 17.2 Checks (raw HTML and metadata)

| Check | Method |
|---|---|
| Raw HTML (SSR/SSG/prerendered) | `curl -s <url>` and inspect HTML (prerender pipeline: `scripts/prerender.js` -> `dist/`) |
| `<title>` | unique per page, correct length |
| `<meta name="description">` | present, unique, 150-160 chars (canonical `09:114`; editorial copy 120-155 per C10) |
| Canonical | correct absolute URL per page |
| Open Graph / Twitter | og:title, og:description, og:image, twitter:card |
| JSON-LD | product/collection/org schema on relevant pages |
| robots.txt | allows crawling (no `Disallow: /` in production; `17:184`) |
| sitemap.xml | accessible, accurate, submitted to Search Console (`17:185`) |
| Valid routes | 200 + correct content |
| Invalid routes | 404 (Vercel fallback; `dist/404.html`) |
| Soft 404 | invalid route must not return 200 |
| Status codes | `curl -o /dev/null -w "%{http_code}" <url>` |
| Social crawler behavior | inspect OG + raw HTML (client-rendered DOM is not sufficient) |

### 17.3 Rules

- Never claim SEO compliance based only on client-rendered DOM. Verify raw HTML
  served to crawlers.
- `dist/` output must be regenerated after content changes (`pnpm build` runs
  `scripts/prerender.js`).

### 17.4 Verification-Level Discipline

Label every SEO claim:

| Label | Meaning |
|---|---|
| **LOCAL VERIFIED** | verified against local server (`pnpm preview` / dev) |
| **STAGING VERIFIED** | verified against staging URL |
| **PRODUCTION VERIFIED** | verified against production URL (post-deployment only) |
| **NOT VERIFIED** | nothing claimed |

Never convert local evidence into production evidence.

---

## 18. Performance

### 18.1 Authoritative Thresholds (tiered per C1/C2)

| Metric | Phase 3 audit target (`07`) | PRR final gate (`16`) | Engineering floor (`.ai`) |
|---|---|---|---|
| Lighthouse Performance | >= 95 | scorecard category | >= 90 |
| Lighthouse Accessibility | 100 | - | >= 95 |
| Lighthouse Best Practices | 100 | - | >= 95 |
| Lighthouse SEO | 100 | - | >= 95 |
| LCP | <= 2.0 s | < 2.5 s | < 2.5 s |
| INP | <= 100 ms | - | < 200 ms |
| FID | - | < 100 ms | < 200 ms |
| CLS | <= 0.05 | < 0.1 | < 0.1 |
| TBT | < 150 ms | - | - |
| TTI (Fast 3G + 4x CPU) | < 4.0 s | - | < 3.5 s |
| TTFB (edge) | - | < 200 ms | - |
| JS payload (initial, gzip) | < 250 KB | - | < 200 KB |
| CSS (gzip) | < 30 KB | - | - |
| Edge Function response (p95) | < 200 ms | - | - |
| E2E perf gate (staging) | fail if LCP > 2.5 s (`07:222`) | - | - |
| Load test (16 section 12.13) | - | 5,000 concurrent users, < 1% error, p95 < 500 ms | - |

### 18.2 Procedure

1. Run against the built app (`pnpm preview` for local; staging for phase work;
   production only post-deployment).
2. Lighthouse on Desktop and Mobile for key pages: Index, Collection, PDP, Cart,
   Checkout (07 section 10).
3. Document CWV, TBT, payloads, chunk sizes; address any opportunity saving
   more than 100 ms (`07:98`).
4. Save reports per naming convention (Section 11.2).

### 18.3 Measurement Failure Handling

If automated measurement fails (timeout, tool error):

1. Try an alternative valid method (DevTools Lighthouse tab, retry with
   different throttling, PageSpeed Insights for public URLs).
2. If still unavailable, document the limitation and the attempted methods.
3. **Never** convert "tool failed" into "PASS". Record the metric as NOT
   VERIFIED or BLOCKED.

---

## 19. Accessibility

### 19.1 Authoritative Source

`06_ACCESSIBILITY_AUDIT.md` (WCAG 2.1 AA).

### 19.2 Automated Layer (must pass before manual testing - `06:78`)

- Lighthouse Accessibility = 100 on Desktop and Mobile.
- axe DevTools: 0 Critical/Serious issues (per Section 19.5).
- Playwright `a11y.spec.ts` — **a referenced capability, not a guaranteed
  file.** Verify it against the authoritative Accessibility SOP (`06`
  + `production/phase-3/01_ACCESSIBILITY_AUDIT.md`): first determine whether
  the current phase actually requires the creation/execution of that test. If
  required and safely implementable, create it during the appropriate phase
  (`src/__tests__/a11y.spec.ts` with injectAxe, per Section 9.2) and run it.
  If not currently required, document the decision in `execution_state.md`
  and continue. **Never assume that a referenced filename automatically means
  the file must exist immediately.** The verified Phase 3 baseline used axe
  DevTools scans + Lighthouse
  (`ops/releases/v0.1.0/ph3-a11y-report-20260811.md`; `phase-3/01:57` records
  the spec as a PROPOSED ADDITION for Phase 4 if still absent).

### 19.3 Manual Layer

- Keyboard: full tab flow, skip-to-content link, focus-visible states, focus
  traps (Escape closes; focus returns to the trigger), dropdown arrow-key nav.
- Screen reader: global nav announcements (`aria-current="page"`), PDP
  name/price/status, `aria-live` cart confirmation, accordion/tab state
  announcements. VoiceOver/NVDA (label which was used).
- Contrast: 4.5:1 normal text, 3.0:1 large text/UI components, form input
  border >= 3.0:1.
- Zoom 200% without breakage; `prefers-reduced-motion` respected.
- Touch targets >= 44x44 px (viewports < 768 px).
- Semantics: exactly one `<h1>`, no skipped levels, link/button semantics,
  alt text, `<html lang="en">`, unique `<title>`.
- Forms: labels via `htmlFor`/`id`, `aria-required`, error `aria-describedby`;
  checkout completable by keyboard + screen reader alone; Razorpay iframe
  accessible (`06:249`).
- Studio interface itself is in scope (WCAG 2.1 AA, `10:286`).

### 19.4 Evidence

Lighthouse a11y JSON per page/device; axe output; screen recording of
keyboard-only checkout flow (`06:306-309`).

### 19.5 axe Rule Configuration

- Run with tags `wcag2a`, `wcag2aa`, `wcag21aa`; no rule exclusions without a
  written, dated justification reviewed in the a11y report.
- Threshold: **0 Critical, 0 Serious, and 0 new violations** vs the prior
  verified scan (per-page/device baseline). Pre-existing violations must be
  fixed or formally deferred with a bug ticket per Section 12; they may not be
  re-silenced.
- If a Playwright a11y spec is used, load axe via `@axe-core/playwright`
  and assert on the full result set, not only Critical/Serious.
- Evidence artifact: `ops/releases/vX.X.X/ph3-a11y-*.json` plus the violation
  diff from baseline.

---

## 20. E-Commerce

### 20.1 Authoritative Source

`11_ECOMMERCE_AUDIT.md` (status DRAFT - treat its checklist as the working
procedure; gate thresholds from `00` QG3/QG4 and `16` section 12.8).

### 20.2 Critical Journey Trace

```
HOME -> COLLECTION -> PRODUCT -> CART -> CHECKOUT -> PAYMENT -> ORDER -> CONFIRMATION
```

Verify at each step (from 11, abbreviated - run the full checklist from 11):

- **Browse/Collection/PDP**: images, typography, INR formatting (`en-IN`, e.g.,
  INR 1,50,000), variants, Add-to-Cart toast + counter.
- **Cart**: item detail, quantity inc/dec with instant subtotal, insufficient
  stock error, remove, persistence across reload, out-of-stock items cannot be
  added.
- **Checkout**: shipping validation, billing defaults, Order Summary math
  (subtotal/tax/shipping), server-authoritative totals (never trust client
  calculations - `11:323`).
- **Payment (test mode)**: Razorpay modal opens; success card, failure card,
  cancellation paths all handled; retry allowed; cart intact on cancel.
- **Webhook**: `payment.authorized` / `payment.captured` update order status;
  signature verified; idempotency keys prevent double-charge (`11:324`).
- **Order**: confirmation page with order ID, estimated delivery, summary;
  order visible in account; inventory decremented atomically (`11:194-198`);
  full lifecycle `Pending -> Processing -> Shipped -> Delivered` reflected
  (`11:260-261`).
- **Tax/shipping**: GST/VAT exact match, no rounding errors; domestic +
  international rates; free-shipping threshold (e.g., INR 50,000).
- **Emails**: order confirmation, shipping update with tracking.
- **Refunds/returns**: eligibility based on stated window (e.g., 14 days);
  refund initiation reflected in DB.

### 20.3 Razorpay Workflow

| Step | Class | Notes |
|---|---|---|
| Test mode verification | AI | TEST keys, test cards, dashboard log reconciliation (`11:267`) |
| Webhook verification | AI | edge function + curl payloads; 100% status updates required (`11:293`) |
| Production key config | HUMAN ONLY | production env vars |
| **Live mode activation** | **HUMAN ONLY** | `17:155` |
| INR 1 live test transaction (immediately refunded) | HUMAN ONLY | production gate check (`11:298`) |
| Live transaction verification | AI after authorization | read Razorpay dashboard + orders table |

### 20.4 Rules

- Never use live money unless explicitly authorized (Section 7).
- Never verify payments client-side (`.ai/rules/SECURITY_STANDARDS.md:77`).
- Race-condition handling for last-SKU: pessimistic locking or atomic decrement
  (`11:325`).

---

## 21. Studio / Admin

### 21.1 Authoritative Source

`10_STUDIO_AUDIT.md`, `.ai/specs/STUDIO.md`, `src/studio/`.

### 21.2 Checks

- **Authentication**: login/logout/session expiry; AuthGuard enforced on
  `src/studio/`.
- **Authorization**: role matrix (Admin/Editor/Reviewer/Viewer) - unauthorized
  actions blocked and logged (`10:160-162`). Never bypass authorization to
  complete a test.
- **CRUD**: product creation/editing, collections, journal entries, version
  history + rollback of entries (`10:114-117`), scheduling with auto-publish
  (`10:132-135`).
- **Media**: upload valid formats; reject malicious/unsupported types; limits
  configured; alt text mandatory (`10:279`); EXIF stripped, color profiles
  preserved (`10:196`); WebP/AVIF variants; CDN distribution.
- **Inventory/orders**: order status management, inventory view.
- **Validation/error states**: Zod validation, character counters (meta 150-160
  chars per `09:114`, C10), API response < 200 ms (`10:182`).
- **RLS**: content tables RLS verified (Studio Gate 4, `10:244`).
- **Propagation**: published content propagates to frontend within 60 s
  (`10:238`); `node scripts/compile-content.js` executes cleanly.
- **Audit trail**: every create/update/delete/publish recorded with timestamp,
  user ID, diff (`10:186`).

### 21.3 Sign-off

Studio completion requires QA Engineer + Editorial Lead + Lead Engineer sign-off
(`10:294-297`) - human role sign-offs are collected by the AI as evidence, not
granted by it.
---

## 22. Git / Release Management

### 22.1 Authoritative Sources

`.ai/rules/GIT_STANDARDS.md`, `.ai/rules/GITHUB_STANDARDS.md`,
`.ai/playbooks/RELEASE_WORKFLOW.md`, `production/19_RELEASE_HISTORY.md`.

### 22.2 Branch Strategy

```
main            <- production-ready; protected; PR + status checks + linear history
  `- develop    <- integration branch (staging deploys from here)
       |- feature/*
       |- fix/*
       |- refactor/*
       |- docs/*
       `- chore/*
hotfix/*        <- from main, for P0/P1 (15 section 22; .ai/playbooks/EMERGENCY_RESPONSE.md)
```

### 22.3 Commit Rules

- Conventional Commits: `<type>(<scope>): <description>`, body explains
  WHAT/WHY, references issues (`Closes #42`), `BREAKING CHANGE:` footer when
  needed.
- Pre-commit gates: `pnpm lint` clean, `tsc --noEmit` clean, tests pass, no
  console.log/debugger/TODO, no secrets, no oversized files
  (`.ai/rules/GIT_STANDARDS.md:68-75`).
- Working tree must be clean before release/deploy. **Never deploy from an
  unverified dirty tree.**
- Merge to `main` via squash (linear history), >= 1 review, status checks
  required.

### 22.4 Release Procedure (from 19 + RELEASE_WORKFLOW.md)

1. Determine version: SemVer; hotfixes increment PATCH from the production
   version.
2. Cut candidate branch `release/vX.Y.Z` from `develop`; merge to `main` after
   verification passes (`RELEASE_WORKFLOW.md:49-54`).
3. Before deployment: create tag `vX.Y.Z` **and** rollback tag
   `rollback/vX.Y.Z` pointing at the current production commit (`19:140-141`,
   `19:77`).
4. Populate the release entry in 19 section 15 with every tracking ID
   (FEAT/BUG/CONTENT/INFRA/DEP/KNOWN) before deployment proceeds.
5. All approval rows must be completed before deployment (19 section 11).
   Deployment itself is human-only.
6. After deployment: record deployment method, duration, post-launch status;
   finalize entry after 72 h observation (19 section 15, C3).

### 22.5 Rules

- Never claim a PR, merge, tag, or deployment occurred unless it actually
  occurred (evidence: `gh pr view`, `git log`, deployment dashboard).
- Rollback references are sacred (`19:272`): the rollback tag/commit must
  always point at a deployable known-good state.
- Never force-push to `main`. Never bypass branch protection.

---

## 23. Quality Gates

### 23.1 Gate System (authoritative: `00` section 12; PRR: `16`)

A phase may advance only when its authoritative SOP says it may. Gates are
non-negotiable checkpoints. Each gate below lists entry conditions, tests,
required evidence, pass/fail criteria, conditional-pass rules, hard-stop rules,
and the exit artifact.

### 23.2 QG1 - Staging Readiness (post Phase 1)

| Aspect | Requirement |
|---|---|
| ENTRY | Phase 1 (`01_PRE_PRODUCTION_AUDIT.md`) executed; release candidate identified |
| TESTS | clean install; `pnpm audit` 0 high/critical; `tsc --noEmit`; `pnpm lint`; `pnpm build`; preview smoke; `supabase migration list --linked` parity; Edge Functions on staging; webhook test HTTP 200; env-var parity vs `.env.example` |
| EVIDENCE | build log, audit output, lint/tsc exit codes (must be 0), migration list, staging URL + commit-hash match |
| PASS | all checklist items complete; zero build/TS errors; zero high-severity audit findings; staging healthy (`01:232`) |
| FAIL | any build failure, untreated critical vuln, env mismatch, missing migration, webhook failure (`01:233`) |
| CONDITIONAL PASS | not applicable at this gate |
| HARD STOP | any of the FAIL conditions, or rollback plan not documented (`01:241-244`) |
| EXIT ARTIFACT | signed-off 01 checklist + evidence under `ops/releases/vX.X.X/`; approver: TL |

### 23.3 QG2 - Creative & Content Approval (post Phase 2)

| Aspect | Requirement |
|---|---|
| ENTRY | Phase 2 executed: docs 02, 03, 04, 05, 10 |
| TESTS | design-token audit (no raw hex/standard Tailwind colors), typography (Cormorant Garamond / Inter / Vonca Regular), layout-shift/FOUC checks, micro-interactions, brand review, editorial review (British English, zero prohibited words), content review (100% mandatory fields, zero broken links), studio audit |
| EVIDENCE | signed checklists 02/03/04/05/10; screenshots; delta report |
| PASS | CD signs off visual fidelity vs locked Figma; CM confirms zero spelling/grammar/tone errors; luxury aesthetics confirmed (`00` QG2) |
| FAIL | unauthorized colors/typography, broken layouts, typos, culturally inaccurate content |
| CONDITIONAL PASS | minor (P3/P4) items logged to bug tracker and accepted by RM |
| HARD STOP | any violation of foundational brand assets, or any cultural authenticity failure (`05:195-197`) |
| EXIT ARTIFACT | signed-off creative pack; approvers: CD + CM |

### 23.4 QG3 - Technical & Security Clearance (post Phase 3)

| Aspect | Requirement |
|---|---|
| ENTRY | Phase 3 executed: docs 06, 07, 08, 09, 11 |
| TESTS | Lighthouse (perf >= 90 desktop / >= 85 mobile per 00; targets per 07: 95+/100/100/100 - see C1), CWV per 07, axe + manual a11y, dependency audit, CSP/headers, RLS, Razorpay test-mode + webhooks, e-commerce core logic, SEO raw-HTML checks |
| EVIDENCE | `ph3-lighthouse-*.json`, a11y reports, audit logs, webhook logs, SEO verification |
| PASS | all 07/08/09/11 checklist items pass; a11y = 100; zero critical/high vulns; e-commerce logic verified (`00` QG3) |
| FAIL | any CWV below threshold, Lighthouse below floor, any critical/serious a11y violation, any open critical/high security vuln |
| CONDITIONAL PASS | P2/P3 items formally triaged with owners; never for security findings (Section 16.4) |
| HARD STOP | any open critical/high security vulnerability; a11y failures on checkout flow |
| EXIT ARTIFACT | signed-off 06-11 pack; approvers: TL + SO |

### 23.5 QG4 - QA & Bug Resolution (post Phase 4)

| Aspect | Requirement |
|---|---|
| ENTRY | Phase 4 executed: docs 12, 13, 14, 15 |
| TESTS | full Playwright E2E suite (100% pass, 3 consecutive stable runs), cross-browser (chromium/firefox/webkit), mobile (emulated Mobile Chrome/Safari; real devices where available), bug tracker review |
| EVIDENCE | E2E report + exit code, per-project results, bug tracker export |
| PASS | 100% E2E pass; zero P0/P1 open; P2/P3 documented as Known Issues and accepted by RM; cross-browser/mobile signed off (`00` QG4) |
| FAIL | any E2E failure, flaky tests unresolved, any open P0/P1, severity down-leveling detected |
| CONDITIONAL PASS | accepted Known Issues (P2/P3/P4) recorded in 19 with owner + justification |
| HARD STOP | any open P0/P1; 100% E2E not achieved |
| EXIT ARTIFACT | phase-4 completion doc + test reports; approvers: QAL + RM |

### 23.6 QG5 / PRR - Go/No-Go Decision (pre-launch)

| Aspect | Requirement |
|---|---|
| ENTRY | all phase checklists 01-15 complete and archived; `16_PRODUCTION_READINESS.md` populated |
| TESTS | final smoke suite 100% pass; rollback plan viable; PRR scorecard >= 95% total with 100% in Security & Compliance, Functional/QA, E-commerce & Payments (`16:281-292`); open P2 <= 5 with documented mitigations (`16:131`) |
| EVIDENCE | PRR scorecard, vulnerability scan, smoke-test CI/CD logs, meeting minutes |
| PASS | unanimous "Go" from all domain leads (`16:209`); zero P0/P1; all audits PASS |
| FAIL | any audit FAIL, any P0/P1, any single "No-Go" vote |
| CONDITIONAL PASS | not applicable; PRR is a formal synchronous meeting gate, cannot be bypassed (`16:248`) |
| HARD STOP | any P0/P1 bug, missing sign-off, unfinalized audit |
| EXIT ARTIFACT | signed Go/No-Go Decision Record; approvers: RM, TL, CD, QAL (+ domain leads per 16 section 26) |

### 23.7 Gate Discipline Rules

- Never advance past a failed gate. Never record a gate PASS without its
  evidence artifact.
- Never down-level severity to clear QG4 (00 section 15).
- Gate exceptions require a documented, written executive exception
  acknowledging the accepted risk (00 section 23) - a human-only decision.

---

## 24. Launch Orchestration

### 24.1 Authoritative Source

`17_LAUNCH_CHECKLIST.md` (T-48 h to T+72 h), `16` (PRR gate),
`docs/DEPLOYMENT.md`, `.ai/rules/DEPLOYMENT_STANDARDS.md`.

### 24.2 Deployment Workflow

For every step: OWNER / TOOL / ACTION / EXPECTED OUTPUT / EVIDENCE / FAILURE
RESPONSE. Steps marked **H** are HUMAN ONLY; all others are AI-executable
(preparation) unless noted.

| # | Step | Owner | Tool | Action | Expected output | Evidence | Failure response |
|---|---|---|---|---|---|---|---|
| 1 | PREPARE | AI | git | verify clean tree on `main`, head commit recorded, release branch ready | clean status + SHA | `execution_state.md` | do not proceed; fix or blocker |
| 2 | VERIFY RELEASE | AI | 19, tags | confirm SemVer, tag `vX.Y.Z` + `rollback/vX.Y.Z` created before deploy | tags exist | `git tag` output | blocker (19:77) |
| 3 | VERIFY GIT | AI | git | status, log, protection state | clean tree | command output | stop |
| 4 | VERIFY ENVIRONMENT | AI | .env.example, vault | env parity; production endpoints confirmed (Supabase prod URL, Razorpay Live key id) | parity table | checklist | human applies prod env vars (**H**, 17:110) |
| 5 | VERIFY DATABASE | AI / H | Supabase CLI/dashboard | migrations listed; dry-run reviewed; production migration + seed executed by Backend Lead (**H**, 17:111) | migration list applied | `supabase migration list --linked` | blocker for prod migration |
| 6 | VERIFY EDGE FUNCTIONS | AI / H | Supabase | functions deployed to production (human step), init logs clean | function list + logs | dashboard/log excerpts | fix + redeploy (human) |
| 7 | VERIFY BUILD | AI | pnpm | `pnpm build` on release candidate; verify `dist/` incl. `404.html`, prerendered pages | build success | build log + dist listing | fix; never ship broken build |
| 8 | VERIFY ROLLBACK | AI | 17/19 | rollback plan reviewed: app revert, DB snapshot, DNS revert, estimated duration | plan + snapshot confirm | checklist | blocker if no viable plan (00 QG5) |
| 9 | HUMAN GO | **H** | meeting | formal Go/No-Go; unanimous | recorded decision | meeting minutes + signed record | No-Go = halt; PRR rescheduled |
| 10 | DEPLOY | **H** | Vercel | production deployment from `main` | deployment URL + status | deployment dashboard | 17 failure scenarios |
| 11 | VERIFY DEPLOYMENT | AI | Vercel dashboard, curl | deployment complete; commit-hash matches; no build errors | healthy deployment | screenshot/logs | 17:252-255 |
| 12 | VERIFY HTTP | AI | curl | homepage + key routes 200; headers (HSTS, CSP, nosniff); HTTPS forced | status codes + headers | curl output | 17:248-250 |
| 13 | VERIFY SEO | AI | curl + crawler | robots allows, sitemap reachable, meta/OG on homepage, 404 behavior | SEO verification | `ph5-seo-*.md` | fix or defer with approval |
| 14 | VERIFY E-COMMERCE | AI + H | Razorpay dashboard | test-mode webhooks validated pre-launch; Live activation (**H**); nominal INR 1 live transaction (**H**, 17:155) | payment processed + refunded | Razorpay receipt | payment failure = rollback trigger |
| 15 | VERIFY STUDIO | AI | Playwright | studio login, product creation, media upload, publishing | flows pass | test report | fix |
| 16 | SMOKE TEST | AI + H | Playwright + manual | critical path on real devices (17 Phase 4): Browse, PDP, Cart, Checkout, Payment, Confirmation; email + social + analytics checks | 100% smoke pass | executed checklist | Post-Deploy Gate fails; no marketing announcement (17:236) |
| 17 | MONITOR | AI | 18 | initiate hypercare monitoring, dashboards live, alerts routed | dashboards healthy | screenshots | per Section 25 |
| 18 | DOCUMENT | AI | 17/19 | launch execution log; release entry updated; post-launch status | completed records | files updated | - |

**Pre-launch timeline — preserve and sequence the COMPLETE checklist of
`17_LAUNCH_CHECKLIST.md` (`17:82-117`), run verbatim before step 9's Go/No-Go
(AI prepares; **H** = human). The authoritative launch checklist (17) remains
the source of truth; this section only references and sequences its documented
requirements. No timings are stated here beyond those documented in 17:**

| Window | Documented requirements (17) | Owner |
|---|---|---|
| **T-48 HOURS** — Final Readiness (`17:82-88`) | code freeze on `main` confirmed; `16` PRR checkboxes all marked; production database schema verified empty (awaiting final seed/migration); production secrets + env vars stored in the deployment provider's vault; final full Playwright E2E suite against staging; Razorpay Live credentials generated but **not** active | AI prepares evidence; **H** for vault secrets |
| **T-24 HOURS** — Infrastructure & Team Alignment (`17:90-95`) | Launch Team briefing; War Room meeting links + Slack channel (`#ops-launch-hop`); domain registrar access verified and **DNS TTL lowered to 300 s**; SSL certificates ready; launch communications drafted; database rollback snapshot prepared | AI verifies; **H** = registrar/DNS |
| **T-12 HOURS** — System Lockdown (`17:97-101`) | non-critical background jobs on staging halted; content payload finalized/locked; on-call schedules for first 72 h published; QA Lead finalizes the production smoke test plan | AI prepares |
| **T-6 HOURS** — Final Go/No-Go Meeting (`17:103-107`) | Launch Director convenes all Leads; outstanding P2/P3 bugs reviewed (no P1s allowed); infrastructure health confirmed; **formal Go/No-Go decision recorded** (unanimous per `00:287`/`16:209`; §24.2 step 9) | **H** |
| **T-2 HOURS** — Environment Prep (`17:109-112`) | **final production environment variables applied** (**H**, `17:110`); **pre-deployment database migrations executed on Supabase production** by Backend Lead (**H**, `17:111`); Edge Functions verified deployed to Supabase production (**H**) | AI prepares; **H** applies |
| **T-1 HOUR** — War Room Assembly (`17:114-117`) | all required personnel join the War Room; communication blackout rule activated; final verification of deployment scripts | AI verifies |
| **DEPLOYMENT** (`17:121-128`) | production build from `main` initiated by Lead Engineer + build logs monitored; final data seeds to production DB (**H**); application deployed to production (**H**); DNS records updated to point `houseofpadmavati.com` to production (**H**) | **H** |
| **POST-DEPLOYMENT** (`17:132-163`, `167-217`) | production configuration: DNS resolves + www→root redirect verified (`17:134-136`); **TTL restored** to standard values (e.g., 86400 s) after propagation (`17:137`); SSL active + HTTPS forced; env vars active; RLS + backups + Edge Function logs verified; Razorpay Live mode activated + nominal ₹1 transaction (**H**, `17:155`); analytics/Sentry/uptime enabled; **CDN purge + cache warming** run (Homepage, Collections, key PDPs) (`17:160-163`); **critical-path smoke tests on real devices** (Browse → PDP → Cart → Checkout → Payment → Confirmation; email + social + SEO checks) (`17:167-186`); **Sentry monitored 30 minutes post-launch — zero P1 error spikes** (`17:215`); handoff to War Room for 72 h (`17:205-209`) | AI verifies; **H** for activation/deploy/DNS |

Mirrored as checkboxes in Section 31.12.

### 24.3 Vercel Workflow

| Step | Class | Detail |
|---|---|---|
| Account/project setup | H | human-owned (third-party account) |
| GitHub connection | H | human-owned |
| Production branch | AI (verify) / H (change) | `main` -> production per `.ai/rules/DEPLOYMENT_STANDARDS.md:5-9` |
| Build configuration | AI | verify `vercel.json` rewrites/headers; `pnpm build` output |
| Environment variables | H | set in Vercel vault; AI may verify names/values parity without printing values |
| Preview deployment | AI | trigger/read preview from feature branch; verify |
| Production deployment | H | from `main` |
| Deployment verification | AI | status, URL, commit hash |
| Domain configuration | H | DNS + Vercel domain attach |
| Rollback | H | decision + execution (`vercel rollback` per `.ai/rules/DEPLOYMENT_STANDARDS.md:74-80`) |
| Logs | AI | read runtime/edge logs |
| Deployment history | AI | read and record in 19 |

Never assume Vercel credentials exist. Never expose secrets from the dashboard.

### 24.4 Supabase Production Steps (human-only in launch)

- Production database migration/seed (`17:111,126`)
- Production Edge Function deployment
- Production vault/secrets handling
- Any production data writes

---

## 25. Post-Launch

### 25.1 Authoritative Source

`18_POST_LAUNCH_MONITORING.md` (phases: Hypercare 24-72 h, Stabilization 1 wk,
Operational Baseline 1 mo, Ongoing). `17` keeps the War Room active 72 h.

### 25.2 Windows and Focus

| Window | HOP mapping | Focus |
|---|---|---|
| First 15 minutes | Hypercare + 5-min alert windows | availability, 5xx, Sentry spikes, payment failures, order creation |
| First hour | Hypercare | same + webhooks, Edge Functions, database pool, first real orders |
| First 6 hours | Hypercare (first 24 h block) | error rates, TTFB, SEO indexing check, analytics sessions |
| First 24 hours | Hypercare Phase 1 (`18:82`) | continuous monitoring; Sentry exceptions, Supabase pool, Razorpay failures (`17:207`) |
| 24-48 hours | Stabilization Phase 2 (`18:85`) | first-day analytics review; P3/P4 UI bugs (`17:208`) |
| 48-72 hours | stabilization end | stability confirmation; transition to standard ops (`17:209`) |
| 7 days | Stabilization | KPI review, defect escape rate |
| 1 month | Operational Baseline (`18:88`) | baseline metrics, capacity review |

### 25.3 Alert Thresholds (authoritative, `18:107-117`)

CRITICAL (page on-call immediately):

- HTTP 5xx error rate > 5% over a 5-minute window
- Payment failure rate > 15% over a 15-minute window
- Supabase connection pool utilization > 90% for > 5 minutes
- Sentry critical exception spike > 50 errors/minute

WARNING (notify `#monitoring`):

- HTTP 4xx error rate > 10% over a 15-minute window
- TTFB > 800 ms for > 15 minutes
- Edge Function execution timeout rate > 2%

SLA and targets: availability 99.9%; LCP < 2.5 s, INP < 200 ms, CLS < 0.1;
edge TTFB < 200 ms; disk < 80%; bounce-rate investigation at > 50%.

### 25.4 Incident Response (18 section 20, authoritative)

1. **Detect & Triage**: acknowledge alert within 5 minutes; severity
   SEV-1/2/3.
2. **Containment**: immediate mitigation (rollback, feature flag, IP block).
3. **Communication**: stakeholders + support for SEV-1/2; updates every
   30 minutes.
4. **Resolution**: root cause, deploy fix, verify across environments.
5. **Recovery**: monitor 1 hour post-resolution.
6. **Post-mortem**: within 48 hours for SEV-1/2 (blameless format, 6
   sections, `18:250-256`).

Escalation matrix (18 section 19): L1/SEV-3 -> Lead Developer in 4 h; L2/SEV-2
-> SRE/Technical Director in 1 h; L3/SEV-1 -> Technical Director/Executive in
15 minutes.

### 25.5 KPIs

MTTD < 5 minutes; MTTR < 60 minutes (SEV-1); defect escape rate < 5%
(`18:264-267`).

---

## 26. Rollback

### 26.1 Rollback Triggers (any of)

- P0 production defect (site down, checkout broken, data loss)
- Payment corruption (wrong totals, double charges, webhook failure)
- Security compromise (breach, exposed data)
- Database corruption
- Critical outage
- Irreversible data integrity issue
- Major SEO failure (site indexable-wrong / mass soft-404s)
- Critical performance collapse

Rollback decision and execution are **HUMAN ONLY** (`17:194`: "Launch Director
calls a Rollback").

### 26.2 Procedure

```
detect -> assess -> freeze -> rollback -> verify -> communicate -> incident report -> root cause -> corrective action
```

1. **Detect**: alert or verification failure (Section 25.3).
2. **Assess**: severity, affected users, blast radius; AI prepares the
   assessment; human confirms.
3. **Freeze**: stop further deployments to production.
4. **Rollback** (human-executed; AI prepares each step):
   - Code: redeploy previous known-good deployment (`vercel rollback` or
     redeploy of prior build) - `.ai/rules/DEPLOYMENT_STANDARDS.md:74-80`.
   - Git: `rollback/vX.Y.Z` tag / revert; never rewrite history on `main`.
   - Database: restore from pre-launch snapshot ONLY if corruption
     (`17:197`). Never assume DB rollback is automatically safe - migrations
     are forward-only; evaluate forward-fix vs restore per incident.
   - DNS: revert records to staging/maintenance page (`17:195`).
   - Edge Functions: redeploy previous version (`.ai/rules/DEPLOYMENT_STANDARDS.md:93`).
5. **Verify**: post-rollback smoke (Section 24.2 step 16) + monitoring
   normal.
6. **Communicate**: stakeholders per 18/17 communication plan.
7. **Incident report + root cause + corrective action**: within 48 h for
   SEV-1/2; post-mortem per `15:23` and `18:250-256`.
8. **Document**: rollback entry in 19 + incident report in evidence dir.

### 26.3 Rules

- Rollback reference (tag/commit/artifact) must exist **before** deployment
  (19:77).
- Never roll back a database without a verified backup/snapshot and a
  human decision.
- Document every rollback in `19_RELEASE_HISTORY.md` (Rollback Reference
  fields) and `ops/releases/vX.X.X/`.
---

## 27. AI Failure Recovery

### 27.1 Stuck Protocol

If the AI cannot complete a step:

1. **Inspect state** - `git status`, `git diff`, running processes, ports.
2. **Reproduce** - re-run the failing command; capture the exact error.
3. **Inspect logs** - build/test/server logs, Playwright trace.
4. **Inspect related docs** - the phase SOP, `.ai/guides/`, error-matched
   sections.
5. **Inspect git diff** - identify the change that introduced the failure.
6. **Compare known-good commit** - diff against the last verified commit
   (Section 3.3 `LAST VERIFIED COMMIT`).
7. **Isolate** - bisect by feature/file/test.
8. **Fix** - within authority (Section 6).
9. **Verify** - targeted test + affected tests (Section 13).
10. **Continue** - resume the Execution Loop.

### 27.2 Retry Limits

- Do not loop indefinitely. After **3 failed fix attempts** on the same
  defect, stop and write a structured failure report:

```markdown
# FAILURE REPORT

- **Date/Time**:
- **Step/Defect**:
- **Attempts** (each with command + output):
- **Diagnosis so far**:
- **Hypotheses remaining**:
- **What was ruled out**:
- **Recommended next action** (for human or next session):
```

- File at `ops/releases/vX.X.X/failure-report-<date>.md`; link from
  `execution_state.md`.
- If the failure is a human-only boundary (Section 7), emit a HUMAN BLOCKER
  instead of retrying.

### 27.3 Common Failure Classes (DETECT -> CONTAIN -> DIAGNOSE -> FIX -> VERIFY -> RETRY -> ESCALATE)

| Failure | Containment | Diagnosis | Fix | Escalate if |
|---|---|---|---|---|
| Build failure | stop deploy | build log, dependency diff | fix code/config; reinstall with lockfile | breaks release and cannot be fixed in 3 attempts |
| Test failure | isolate failing spec | trace, screenshot, recent diff | fix code or stabilize test | flaky for > 3 runs |
| Deployment failure | freeze further deploys | Vercel logs, commit mismatch | human rollback per Section 26 | any production impact |
| Database failure | read-only mode on affected queries | Supabase logs, migration list | forward-fix migration (never edit applied) | production data impact |
| Supabase outage | document, use cache/fallback | status page, dashboard | wait/retry with backoff; never fake success | > 15 min critical impact |
| Vercel outage | document | status page | wait/retry | > 15 min critical impact |
| DNS failure | verify propagation state | lookups, propagation checkers | wait; never modify DNS | human DNS action required |
| Payment failure | disable checkout via flag | Razorpay dashboard + edge logs | fix code (staging), re-test test-mode | production payment impact |
| SEO failure | document scope | curl raw HTML, robots/sitemap | fix prerender/content | mass indexability impact |
| Authentication failure | isolate | token/session state | re-auth via secure mechanism | credentials unavailable -> HUMAN BLOCKER |
| Env-variable failure | never print values | parity table vs vault | human applies correct values | production env changes |
| Prerender failure | regenerate `dist/` | `scripts/prerender.js` output | fix script/data | broken crawler output |

---

## 28. Session Continuity

### 28.1 Principle

The AI must survive interruptions. A new AI session must be able to resume
without asking the user to re-explain the project.

### 28.2 Protocol

1. At session start: run Section 32 (startup) - read `.ai/START_HERE.md`
   first (authoritative for AI entry behavior), then the project/context
   documents (`.ai/context/PROJECT_CONTEXT.md`,
   `.ai/context/SESSION_CONTEXT.md`, `.ai/memory/next-session.md`), then this
   manual, then `production/00_MASTER_EXECUTION_PLAN.md` + the phase SOP,
   then repository-state detection (`execution_state.md` reconcile).
2. Verify `execution_state.md` against actual repository state
   (Section 3.4). Reconcile if stale.
3. Resume at `NEXT ACTION` - the first incomplete verified step.
4. Never restart completed work unnecessarily (gates already passed are not
   re-run; re-verify only the current step).
5. At session end (or every major transition): update `execution_state.md`
   (CURRENT PHASE, CURRENT STEP, LAST SUCCESS, LAST FAILURE, ACTIVE BUG,
   NEXT ACTION, LAST EVIDENCE, COMMIT, BLOCKERS), `.ai/context/SESSION_CONTEXT.md`,
   `.ai/memory/next-session.md`, `.ai/memory/completed.md` per
   `.ai/playbooks/AI_COLLABORATION_RULES.md:61-69`.

### 28.3 Required State File Contents

`execution_state.md` must always contain: CURRENT PHASE, CURRENT STEP, LAST
VERIFIED COMMIT, RELEASE VERSION, BRANCH, WORKING TREE, LAST QUALITY GATE,
OPEN BUGS, BLOCKERS, NEXT ACTION, LAST EVIDENCE, LAST VERIFIED ENVIRONMENT,
CONFLICT LOG (format in Section 3.3).

---

## 29. Documentation Maintenance

### 29.1 Which Documents Change, and When

| Event | Documents to update |
|---|---|
| Finding | bug tracker (New), `execution_state.md` |
| Fix | bug tracker (In Progress -> In Review), commit message, phase doc |
| Verification | bug tracker (Verified), evidence artifact, phase doc |
| Phase completion | phase completion doc, `execution_state.md`, PRR aggregation (16) |
| Quality gate | gate record + evidence, `execution_state.md` |
| Deployment | `17` execution log, `19` release entry (deployment fields) |
| Rollback | `19` Rollback Reference, incident report, `execution_state.md` |
| Post-launch monitoring | `18` records, incident reports, `19` Post-Launch Status |
| Bug closed | bug tracker (Closed), `19` if release-related, `.ai/memory/known-bugs.md` |
| Known issues accepted | `19` Known Issues Accepted (owner + justification), PO approval |

### 29.2 Rules

- Link, don't duplicate: reference bug IDs, incident reports, and SOP
  documents rather than reproducing their content (`19:271`).
- Never edit finalized release entries except to append post-mortem
  references (`19:246`).
- Update `.ai/memory/*` per `.ai/playbooks/AI_COLLABORATION_RULES.md`
  (completed.md, next-session.md, known-bugs.md, technical-debt.md).
- Prevent documentation drift: after any implementation change, update the
  relevant docs in the same session; never leave "update later".

---

## 30. Final Autonomous Execution Loop

### 30.1 The Loop

```
DISCOVER
  -> STATE
  -> READ AUTHORITY
  -> CHECK PREREQUISITES
  -> BASELINE
  -> EXECUTE
  -> OBSERVE
  -> CLASSIFY
  -> FIX
  -> VERIFY
  -> REGRESSION
  -> DOCUMENT
  -> COMMIT
  -> QUALITY GATE
  -> ADVANCE
  -> REPEAT
```

**Termination**: the loop ends when the release is **Complete** per 00 §27
(no P0/P1 incidents for 48 h post-deployment) and the 19 entry is **finalized**
(entry approvals + 72 h observation + no unresolved incidents — C3), or when a
HUMAN BLOCKER halts it. A blocked action stops only that action; unrelated work
continues (Section 30.2).

### 30.2 Decision Point

At every step ask: **"Can I safely do this myself?"**

- YES -> continue (Sections 5, 6).
- NO, and it is a human-only boundary -> HUMAN BLOCKER (Sections 7, 8);
  stop only that action; continue unrelated work.
- NO, but it is an engineering problem -> diagnose/fix/verify (Sections 6,
  13, 27).

Do not stop for normal engineering problems. Do not stop the whole program
because one action is blocked.

---

## 31. Master Execution Checklist

Comprehensive checkbox list covering the entire lifecycle. The AI executes
each item line by line, capturing evidence (Section 11) and updating
`execution_state.md` after each block.

### 31.1 Repository & Architecture

- [ ] Session startup protocol executed (Section 32)
- [ ] Git state inspected (branch, commit, clean tree)
- [ ] `production/execution_state.md` created/verified and reconciled
- [ ] Authority hierarchy confirmed; conflict log checked
- [ ] Architecture docs read (`docs/ARCHITECTURE.md`, `.ai/architecture/`)
- [ ] Working tree clean before any release activity

### 31.2 Dependencies & Environment

- [ ] `pnpm install --frozen-lockfile` succeeds
- [ ] `pnpm audit` - 0 high/critical
- [ ] Lockfiles consistent (C4)
- [ ] `.env.example` names verified; no secrets in repo
- [ ] Env parity vs staging/production vault (names only; values human-applied)

### 31.3 Database, Backend & Edge Functions

- [ ] `supabase migration list --linked` parity reviewed
- [ ] `supabase db push --dry-run` reviewed (no destructive statements)
- [ ] Staging migrations applied + verified (production = human)
- [ ] `supabase gen types typescript --linked` current
- [ ] Edge Functions inspected; staging tested with curl payloads
- [ ] RLS policies verified per `.ai/security/SUPABASE_RLS_POLICIES.md`
- [ ] CORS restricted to verified HOP origins

### 31.4 Frontend, Build & UI/UX

- [ ] `pnpm lint` clean (0 errors)
- [ ] `pnpm exec tsc --noEmit` clean
- [ ] `pnpm build` succeeds; `dist/` contains 404.html + prerendered pages
- [ ] No console.log/debugger/TODO in production code
- [ ] Design tokens only (no raw hex/standard Tailwind colors)
- [ ] Typography: Cormorant Garamond / Inter / Vonca Regular correct
- [ ] No FOUC, layout shift, or hydration mismatch observed
- [ ] Touch targets >= 44x44 px; responsive 375-1920 px
- [ ] Empty/error/loading states branded and functional

### 31.5 Brand, Content & Editorial

- [ ] 02_UI_UX_REVIEW signed off (CD)
- [ ] 03_EDITORIAL_REVIEW signed off (Editorial Director; cultural sign-off where required)
- [ ] 04_CONTENT_REVIEW signed off (CS/Catalog/DAM)
- [ ] 05_BRAND_REVIEW signed off (Brand Director)
- [ ] 10_STUDIO_AUDIT signed off (QA Eng/Editorial Lead/Lead Engineer)
- [ ] Legal text verified accurate (Legal/Operations)

### 31.6 Accessibility

- [ ] Lighthouse Accessibility 100 (Desktop + Mobile)
- [ ] axe 0 Critical/Serious + 0 new violations (Section 19.5)
- [ ] `a11y.spec.ts` referenced capability resolved per Section 19.2: created
      and run only if the current phase requires it and it is safely
      implementable; otherwise documented in `execution_state.md` and
      continued (never assumed to exist by filename alone)
- [ ] Keyboard-only checkout verified (recording captured)
- [ ] Contrast 4.5:1 / 3.0:1 met; 200% zoom OK; reduced-motion respected

### 31.7 Performance

- [ ] Lighthouse targets met (07 table, Section 18.1)
- [ ] CWV within thresholds on Index/Collection/PDP/Cart/Checkout
- [ ] Payload budgets met (JS < 250 KB gzip; CSS < 30 KB gzip)
- [ ] Edge Function response < 200 ms (p95) where measurable
- [ ] E2E perf gate: LCP <= 2.5 s on staging

### 31.8 Security

- [ ] Zero critical/high vulnerabilities (audit + scans)
- [ ] CSP, HSTS, nosniff, frame DENY, Referrer-Policy headers verified
- [ ] Webhook signature verification verified
- [ ] No secrets in code/history; secret scan clean
- [ ] Payment verification server-side only

### 31.9 SEO

- [ ] Raw HTML verified for key pages (not client DOM)
- [ ] Title/description/canonical/OG/JSON-LD correct
- [ ] robots.txt allows crawling; sitemap.xml accurate
- [ ] 404 behavior correct (no soft 404)
- [ ] Verification level labels recorded (LOCAL/STAGING/PRODUCTION VERIFIED)

### 31.10 Studio / E-commerce / Payments

- [ ] Studio login/CRUD/media/publishing verified (10 checklist)
- [ ] Cart/checkout/order math verified (11 checklist)
- [ ] Razorpay test-mode success/failure/cancel verified
- [ ] Webhook updates order status 100% in testing
- [ ] Inventory decrement atomic; out-of-stock enforced
- [ ] Live activation + INR 1 test: HUMAN (blocker if not authorized)

### 31.11 Testing, Cross-Browser, Mobile

- [ ] Full Playwright suite 100% pass (3 consecutive stable runs)
- [ ] Chromium/Firefox/WebKit pass (per `playwright.config.ts`)
- [ ] Mobile Chrome/Mobile Safari (emulated) pass; real devices where available
- [ ] Edge covered in config + verified, or deviation accepted by RM
      (12:103-106; C11; Section 13.4)
- [ ] No flaky tests remain

### 31.12 Production Readiness, Git, Deployment, DNS, Monitoring

- [ ] All audits 01-15 PASS with evidence archived
- [ ] PRR scorecard >= 95% total; critical categories 100%
- [ ] Rollback plan documented + rollback tag exists
- [ ] Go/No-Go recorded (HUMAN - unanimous)
- [ ] Production deployment executed (HUMAN)
- [ ] Pre-launch timeline T-48 / T-24 / T-12 / T-6 / T-2 / T-1 hours run
      verbatim (17:82-117; Section 24.2)
- [ ] Post-deploy: CDN purge + cache warming (17:160-163); TTL restored to
      86400 s (17:137); www→root redirect verified (17:136); 30-min Sentry
      spike check (17:215)
- [ ] Post-deploy smoke + critical path verified
- [ ] DNS/SSL/CDN verified (HUMAN for changes)
- [ ] Analytics/Sentry/uptime active
- [ ] Hypercare monitoring initiated (Section 25)
- [ ] Release entry finalized after 72 h (19)
- [ ] Post-launch review completed; release formally Complete per 00 section 27

---

## 32. AI Startup Protocol

### 32.1 "When an AI Agent Enters This Repository"

In exact order:

1. Read `.ai/START_HERE.md` **first** — it is the mandatory AI entry point for
   every model (`START_HERE.md:3,10,21`, `.ai/README.md:5`,
   `AI_COLLABORATION_RULES.md:9`). **START_HERE.md remains authoritative for
   AI entry behavior; this orchestration manual does not replace it**
   (Conflict C7).
2. Read the relevant project/context documents:
   `.ai/context/PROJECT_CONTEXT.md` (mandatory per ACR:9),
   `.ai/context/SESSION_CONTEXT.md` (resume state),
   `.ai/memory/next-session.md`, `.ai/memory/completed.md`.
3. Read this manual (`production/AI_PRODUCTION_EXECUTION_MANUAL.md`) as the
   orchestration layer — after the entry and context reads, never before.
4. Read `production/00_MASTER_EXECUTION_PLAN.md` and the relevant phase SOP
   (Section 23 maps phases → SOPs).
5. Detect repository state: run the Section 3.1 discovery commands; read or
   create `production/execution_state.md`; derive the current phase with the
   Section 3.4 algorithm.
6. Resume at the first incomplete verified step.
7. Never restart completed work unnecessarily.

### 32.2 Start-of-Session State Writes

- Confirm/reconcile `execution_state.md`.
- If a HUMAN BLOCKER is active (`production/human_blocker.md`), re-verify the
  blocker is still valid; if resolved, close the entry and resume at the
  recorded resume point.
- Do not re-run passed quality gates; re-verify only the current step.

---

## 33. Do Not Create a Second Source of Truth

> **The AI Production Execution Manual is the orchestration layer, not a
> replacement for authoritative domain SOPs.**

Explicit rules:

1. If any other document defines a domain-specific rule (thresholds,
   procedures, formats, sign-off requirements), the AI must follow **that
   document**. This manual controls only: execution order, state management,
   evidence discipline, escalation, and continuation.
2. The manual adds no new technical thresholds. Every number in this manual is
   quoted from, or derived with the resolution recorded in Section 1.3, from
   the authoritative HOP documents.
3. Do not copy domain content into this manual. When a section references an
   SOP, treat that SOP as the checklist.
4. If this manual and a domain SOP disagree, the domain SOP wins unless the
   difference is in orchestration behavior (order, state, evidence,
   escalation) — in which case the conflict is registered per Section 1.2.
5. Do not edit `production/0X_*.md` SOPs or `.ai/rules/*` from this manual's
   authority. Those files change only through the team process defined by
   `.ai/playbooks/AI_COLLABORATION_RULES.md:99`.

---

## Appendix A - Quick Reference

### A.1 Tools

| Tool | Class (Section 10) | Primary job |
|---|---|---|
| git | SAFE (read) / CAUTION (write) | state, diffs, commits, tags |
| gh | SAFE (read) / CAUTION (PR ops) | PRs, release metadata |
| pnpm | SAFE (run/audit) / CAUTION (install/add) | scripts, installs, audits |
| tsc | SAFE | type checks |
| eslint | SAFE | lint |
| vite | SAFE | build/preview |
| playwright | SAFE | E2E, cross-browser, mobile, a11y |
| lighthouse | SAFE | performance/a11y/SEO/BP |
| axe | SAFE | WCAG violations |
| curl | SAFE | HTTP/headers/webhooks |
| supabase CLI | SAFE (inspect) / CAUTION (staging apply) / HUMAN (prod) | migrations, types, functions |
| vercel CLI/dashboard | SAFE (read) / HUMAN (prod deploy/domains/env) | deployments, domains, env, logs |
| DNS tools | SAFE (read) / HUMAN (write) | propagation, TTL |
| razorpay dashboard | SAFE (read test mode) / HUMAN (live) | payments, webhooks |

### A.2 Commands

| Command | Class | Purpose |
|---|---|---|
| `git status` / `git diff` / `git log` | SAFE | state |
| `pnpm lint` | SAFE | lint gate |
| `pnpm exec tsc --noEmit` | SAFE | type gate |
| `pnpm build` | SAFE | build |
| `pnpm test:e2e` | SAFE | full E2E suite |
| `pnpm test:e2e -- src/__tests__/<file>.spec.ts` | SAFE | targeted test |
| `pnpm preview` | SAFE | serve built app |
| `pnpm audit` | SAFE | dependency audit |
| `supabase migration list --linked` | SAFE | migration state |
| `supabase db push --dry-run` | SAFE | migration preview |
| `supabase gen types typescript --linked` | SAFE | regenerate types |
| `curl -I <url>` | SAFE | headers |
| `git commit` / `git push <feature>` | CAUTION | normal engineering flow |
| `supabase db push` (staging) | CAUTION | apply migrations to staging |
| `supabase functions deploy` (staging) | CAUTION | staging functions |
| `vercel rollback` | HUMAN ONLY | production rollback |
| `supabase db reset` | FORBIDDEN (linked/prod) | local dev only |
| production DNS changes | HUMAN ONLY | cutover/rollback |
| Razorpay Live activation | HUMAN ONLY | live payments |
| print/commit secrets | FORBIDDEN | never |

### A.3 Authority

| Action | AI prepare | AI execute | Human required | Irreversible | Evidence |
|---|---|---|---|---|---|
| Code changes | yes | yes | no | no | diff, tests |
| Documentation changes | yes | yes | no | no | diff |
| Git commits (feature branch) | yes | yes | no | no | commit log |
| Git push (feature branch) | yes | yes | no | no | remote log |
| PR creation | yes | yes (draft/read) | review approval | no | PR URL |
| Branch merge to main | yes | no | yes (review) | no | merge commit |
| Production DB migration | prepare | no | yes | yes | migration log |
| DNS changes | prepare | no | yes | yes | DNS records |
| Production env vars | prepare | no | yes | yes | vault log |
| Secret configuration | prepare | no | yes | yes | vault log |
| Razorpay Live activation | prepare | no | yes | yes | dashboard |
| Production deployment | prepare | no | yes | yes | deploy log |
| Traffic cutover (DNS) | prepare | no | yes | yes | DNS log |
| Rollback | prepare | no | yes (decision) | yes | incident log |
| Destructive DB actions | never | no | yes (authorized) | yes | migration/backup log |
| Payment transactions | test-mode only | test-mode only | yes (live) | yes | receipt |
| Legal/business decisions | no | no | yes | yes | signed record |

### A.4 Quality Gates

| Gate | Phase | Key pass criteria | Approver |
|---|---|---|---|
| QG1 | 1 | staging ready, env parity, migrations applied, rollback plan | TL |
| QG2 | 2 | CD + CM sign-off, zero editorial/content errors | CD, CM |
| QG3 | 3 | perf/a11y targets, zero critical/high vulns, ecommerce logic | TL, SO |
| QG4 | 4 | 100% E2E, zero P0/P1, Known Issues accepted | QAL, RM |
| QG5/PRR | 5 | scorecard >= 95%, unanimous Go, all sign-offs | RM, TL, CD, QAL |

### A.5 Evidence

| Item | Location / naming |
|---|---|
| All release evidence | `ops/releases/vX.X.X/` |
| Naming | `ph<number>-<audit>-<check>-<date>.<ext>` |
| Session state | `production/execution_state.md` |
| Blockers | `production/human_blocker.md` |
| Bug records | `15_BUG_TRACKER.md` + phase trackers |
| Release entries | `19_RELEASE_HISTORY.md` section 15 |

### A.6 Monitoring Thresholds (18)

| Signal | Threshold | Severity |
|---|---|---|
| 5xx rate | > 5% / 5 min | CRITICAL |
| Payment failure | > 15% / 15 min | CRITICAL |
| Supabase pool | > 90% / 5 min | CRITICAL |
| Sentry spike | > 50 errors/min | CRITICAL |
| 4xx rate | > 10% / 15 min | WARNING |
| TTFB | > 800 ms / 15 min | WARNING |
| Edge timeout | > 2% | WARNING |

### A.7 Release Lifecycle

`release train -> phases 1-5 -> QG1-5 -> deploy (human) -> smoke (17) -> hypercare (18) -> entry finalized (19, 72h) -> Complete (00, 48h clean)`.

---

## Appendix B - Document Registry

All documents referenced by this manual and their existence as of 2026-08-11
(re-verify at runtime per Section 4):

| Document | Exists |
|---|---|
| production/00_MASTER_EXECUTION_PLAN.md | yes |
| production/01..15 SOPs (per Section 0 list) | yes |
| production/16_PRODUCTION_READINESS.md | yes |
| production/17_LAUNCH_CHECKLIST.md | yes |
| production/18_POST_LAUNCH_MONITORING.md | yes |
| production/19_RELEASE_HISTORY.md | yes |
| production/phase-3/* (00..08) | yes |
| production/phase-4/00_PHASE_4_MASTER_EXECUTION.md | yes |
| production/phase-5/16_PRR_SCORECARD.md | yes |
| .ai/START_HERE.md, .ai/context/PROJECT_CONTEXT.md, .ai/context/SESSION_CONTEXT.md | yes |
| .ai/rules/* (GIT, GITHUB, DEPLOYMENT, PRODUCTION_READINESS, SECURITY, SUPABASE, PERFORMANCE, ACCESSIBILITY, TESTING) | yes |
| .ai/quality/definition-of-done.md | yes |
| .ai/playbooks/* (AI_COLLABORATION_RULES, RELEASE_WORKFLOW, BUG_FIX_WORKFLOW, EMERGENCY_RESPONSE, REGRESSION_WORKFLOW) | yes |
| .ai/guides/* (DEPLOY, EMERGENCY, RUN_TESTS, WRITE_TESTS, FIX_BUG) | yes |
| docs/DEPLOYMENT.md, docs/ARCHITECTURE.md, docs/DATABASE_SCHEMA.md, docs/QA_CHECKLIST.md, docs/SECURITY.md | yes |
| context/06_GOVERNANCE.md, context/07_DECISIONS_LOG.md | yes |
| HOP_BRAND_CONTEXT.md | yes |
| ops/releases/v0.1.0/ (evidence) | yes |
| production/execution_state.md | created on first session (this manual's first run) |

**Observed corpus conditions (documented here as findings — NOT acted on by
this manual).** Pre-existing state of the authoritative corpus reported by
governance audit HOP-PROD-AUDIT-000 (2026-08-12). These files change only
through the team process (Section 33 rule 5); this manual documents and compensates
for them without altering the authoritative files:

| Condition | Location | Handling by this manual |
|---|---|---|
| Rollback reference missing: the v0.1.0 release entry names tag + commit `c5cb893a` as `rollback/v0.1.0`, but no such tag exists (existing tags: v0.8.0 / v1.0.0 / v1.0.0-phase1); 19's validation box is unchecked | `19_RELEASE_HISTORY.md:334-335`, `19:257` | §3.5, §22.4 step 3 and §24.2 step 2 require the rollback tag to exist before deployment |
| `09_SEO_AUDIT.md` and `11_ECOMMERCE_AUDIT.md` remain status DRAFT while serving as QG3 gate documents | `09_SEO_AUDIT.md` / `11_ECOMMERCE_AUDIT.md` (frontmatter) | Disclosed at §17.1 and §20.1; gate thresholds anchored to `00` QG3 / `16` |
| Migration file `20260710000001_create_product_tables.sql` is empty (0 bytes, no-op) | `supabase/migrations/` | §3.1 step 12 + §15.2 workflow surface it at discovery/dry-run; no incorrect assumption |
| `.ai/memory/*` and `.ai/context/SESSION_CONTEXT.md` are stale/empty templates (SESSION_CONTEXT dated 2026-07-19); roadmap Phase 3 items unchecked despite phase-3/4 completion docs | `.ai/memory/`, `.ai/context/SESSION_CONTEXT.md` | Compensated by the `execution_state.md` design (§3.3, §28) |

---

## Appendix C - Deliberately Not Overridden

This manual explicitly does **not** override:

1. **Human-only boundaries** (Section 7.1) - DNS, production DB migration,
   Razorpay Live, Go/No-Go, production deployment, production env vars,
   rollback decision.
2. **Quality gate thresholds** - all numbers come from 00/07/16 (Section 23).
3. **Bug lifecycle, severity, SLAs** - from 15 (Section 12).
4. **Monitoring thresholds and escalation** - from 18 (Section 25).
5. **Git rules** - from `.ai/rules/GIT_STANDARDS.md` and GITHUB_STANDARDS
   (Section 22).
6. **Evidence conventions** - from 00 section 20 and phase-3 convention
   (Section 11).
7. **Release ledger format and finalization** - from 19 (Section 22.4).
8. **Launch checklist sequence** - from 17 (Section 24).
9. **PRR scorecard and voting** - from 16 (Section 23.6).
10. **Definition of Done** - from `.ai/quality/definition-of-done.md`.
11. **Domain SOPs 01-15** - their checklists are the work; this manual only
    orders and gates it.

---

*End of AI Production Execution Manual. Status: DRAFT - orchestration layer.
Not yet operationally validated. First operational use: verify against a full
Phase execution before relying on it for a live release.*
