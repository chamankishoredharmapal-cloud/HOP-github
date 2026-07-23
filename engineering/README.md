# House of Padmavati — Engineering Documentation

This directory contains the engineering governance system for the House of Padmavati (HOP) project. It serves as the single source of truth for architectural decisions, audit findings, production readiness, and quality verification.

## Structure

```
engineering/
├── README.md              # This file — entry point and navigation
├── roadmap.md             # High-level engineering roadmap across phases
│
├── audit/                 # Production readiness audit artifacts
│   ├── phase-1/           # Build integrity & quality foundations
│   ├── phase-2/           # Performance & optimization
│   └── phase-3/           # Scalability & resilience
│
├── decisions/             # Architecture Decision Records (ADRs)
│   └── ADR-001.md
│
├── reports/               # Supplementary engineering reports
│
├── verification/          # Verification protocols and results
│
└── templates/             # Reusable document templates
    ├── ticket-template.md
    ├── audit-template.md
    └── verification-template.md
```

## Principles

- **Evidence over opinion.** Every finding must be classified as VERIFIED, OBSERVED, INFERRED, UNVERIFIED, or UNKNOWN.
- **Minimal changes.** Prefer the smallest safe fix. No unnecessary refactoring.
- **Root cause before solution.** Understand why a problem exists before designing a fix.
- **Verify everything.** Every change must pass lint, type-check, build, and test gates.
- **Document decisions.** Every architectural decision must have an ADR.

## Conventions

- Ticket IDs follow the pattern `P{phase}-{number}`, e.g., `P1-001`.
- Audit reports follow the template at `templates/audit-template.md`.
- ADRs follow the template at `decisions/ADR-001.md`.
- All documents use Markdown with GitHub-flavored syntax.
- Tables and checklists are preferred over prose where structured data is conveyed.

## Navigation

| Document | Purpose |
|----------|---------|
| `roadmap.md` | Phase plan and ticket progression |
| `audit/phase-1/PHASE-1-MASTER-PLAN.md` | Active phase master plan |
| `decisions/` | All architecture decisions |
| `templates/` | Document templates for tickets, audits, verification |
