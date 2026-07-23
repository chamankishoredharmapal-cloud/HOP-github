# START HERE — House of Padmavati AI Operating System v2

> **Mandatory reading for every AI model before any task.**

## Quick Start

Read these files in order:

```
1. START_HERE.md          ← You are here. Read once.
2. memory/next-session.md ← Read every session start.
3. memory/completed.md    ← Read every session start.
4. memory/roadmap.md      ← Read for strategic context.
5. memory/known-bugs.md   ← Read before fixing bugs.
```

## Workspace Map

```
.ai/
├── START_HERE.md          ← THIS FILE — mandatory first read
├── README.md              ← Workspace overview (optional)
│
├── standards/             ← RULES — never duplicate or contradict
│   ├── CODING.md          ← Coding + React + TypeScript
│   ├── DATABASE.md        ← Supabase + Edge Functions + RLS
│   ├── DESIGN.md          ← Brand + editorial + responsive + animation + accessibility
│   ├── TESTING.md         ← Playwright + testing practices
│   ├── PERFORMANCE.md     ← Performance targets + budgets
│   ├── SECURITY.md        ← Security principles + compliance
│   ├── SEO.md             ← SEO + metadata + structured data
│   └── WORKFLOW.md        ← Git + GitHub + code review + deployment
│
├── guides/                ← HOW-TO — step-by-step for common tasks
│   ├── AI_ONBOARDING.md   ← How AI models operate on this project
│   ├── BUILD_FEATURE.md   ← Feature development workflow
│   ├── FIX_BUG.md         ← Bug fix workflow
│   ├── WRITE_TESTS.md     ← Writing Playwright tests
│   ├── RUN_TESTS.md       ← Running + debugging tests
│   ├── REVIEW_CODE.md     ← Code review process
│   ├── DEPLOY.md          ← Deployment + release workflow
│   └── EMERGENCY.md       ← Incident response
│
├── reference/             ← REFERENCE — read on demand, deep detail
│   ├── ARCHITECTURE.md    ← System architecture + key decisions
│   ├── TECHNOLOGY_STACK.md← Tech stack versions
│   ├── FOLDER_STRUCTURE.md← Directory layout
│   ├── DATA_FLOW.md       ← Data flow diagrams
│   ├── RLS_POLICIES.md    ← Row Level Security policies
│   ├── PAYMENT_FLOW.md    ← Payment security deep-dive
│   ├── LIGHTHOUSE_STRATEGY.md ← Lighthouse optimization
│   ├── BUNDLE_OPTIMIZATION.md ← Bundle size strategy
│   └── IMAGE_OPTIMIZATION.md  ← Image optimization guide
│
├── specs/                 ← SPECS — production specifications per feature
│   ├── HOMEPAGE.md
│   ├── COLLECTIONS.md
│   ├── PRODUCT.md
│   ├── CART.md
│   ├── WISHLIST.md
│   ├── CHECKOUT.md
│   ├── ORDERS.md
│   ├── PAYMENT.md
│   ├── JOURNAL.md
│   ├── ABOUT.md
│   ├── ADMIN.md
│   └── STUDIO.md
│
├── decisions/             ← ADRs — Architecture Decision Records
│   ├── 0001-editorial-first.md
│   ├── 0002-video-first-homepage.md
│   ├── 0003-no-marketplace-ui.md
│   ├── 0004-mobile-desktop-parity.md
│   ├── 0005-luxury-before-conversion.md
│   ├── 0006-component-first-architecture.md
│   ├── 0007-accessibility-first.md
│   └── 0008-performance-budget.md
│
├── memory/                ← SESSION — read and write every session
│   ├── completed.md       ← What's been completed
│   ├── roadmap.md         ← What's coming next
│   ├── known-bugs.md      ← Currently known bugs
│   ├── technical-debt.md  ← Technical debt tracker
│   └── next-session.md    ← Handoff note for next session
│
├── quality/               ← QUALITY — gates and definitions
│   └── definition-of-done.md ← What "done" means
│
├── checklists/            ← CHECKLISTS — page/module completeness checks
│   └── (15 files)
│
└── templates/             ← TEMPLATES — reusable documents
    └── (7 files)
```

## Core Rules (Abbreviated)

1. **Read memory/next-session.md** before every task
2. **Write memory/next-session.md** at end of every session
3. **Never duplicate content** — cross-reference instead
4. **Never contradict standards/** — all rules live there
5. **Follow quality/definition-of-done.md** before marking complete
6. **Use guides/** for step-by-step task instructions
7. **Consult reference/** for deep technical detail
8. **Update memory/** with progress, bugs, and debt

## Contradictions Resolved

| Old Issue | Resolution |
|-----------|------------|
| Performance target: >=90 vs Mobile>=85 | **Mobile >= 90, Desktop >= 95** — single source in `standards/PERFORMANCE.md` |
| Two AI collaboration files | Merged into `guides/AI_ONBOARDING.md` |
| Testing content in 4+ places | Merged into `standards/TESTING.md` + `guides/WRITE_TESTS.md` |
| Deployment content in 3 places | Merged into `standards/WORKFLOW.md` + `guides/DEPLOY.md` |

## File Responsibility Rule

Every file serves exactly one purpose. If you need information from another domain, read the relevant file — never inline it. This eliminates duplication and maintenance burden.
