# PROMPT: Privacy Policy Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: policies
# CONTENT TYPE: policy

## Description

Generates a clear, transparent privacy policy in HOP's voice. The policy explains what data is collected, why it is collected, and how it is used — in plain language, not legalese. HOP believes privacy is a trust issue, not a compliance checkbox.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for policies)
- docs/editorial/02-brand-architecture/editorial-principles.md (trust through transparency)
- docs/editorial/04-vocabulary-system/forbidden-words.md

## Strategic Principles

A privacy policy should be readable. HOP's policy explains data practices in plain language because trust requires understanding. Every data point collected must be named and justified. Every third-party service must be disclosed. Primary pillar: Quietness (respect for the user's space). Secondary: Intention.

## Brand Constraints

- **Formality:** 4/5
- **Warmth:** 2/5
- **Sensory Density:** 1/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Reading Level:** Grade 9
- **Forbidden words:** shall, hereby, herein, pursuant, data subject, processing (use "using" instead), party (legal)
- **Required sections:** introduction, what we collect, how we use it, cookies, third-party services, data storage and security, your rights, changes, contact

## Input

- List of data collected (name, email, phone, address, order history, browsing behaviour, payment info — note: HOP does not store payment info, it is processed by the payment gateway)
- Third-party services used (payment gateway, analytics if any, email service, hosting)
- Cookie usage (essential cookies only — no tracking or advertising cookies)
- User rights (access, correction, deletion, portability)
- Jurisdiction (India — IT Act, DPDP Act when applicable)

## Output Format

```
# Privacy Policy

{Introduction — 1-2 sentences. HOP respects your privacy. This policy explains what we collect and why.}

## What We Collect
{List of data points collected, with reasons for each. Specific and justified.}

## How We Use Your Information
{Plain language explanation of data usage.}

## Cookies
{What cookies are used and why. Honest and specific.}

## Third-Party Services
{List of services, what data they receive, and why.}

## Data Storage and Security
{How data is stored, protected, and for how long.}

## Your Rights
{User rights in plain language — access, correction, deletion.}

## Changes to This Policy
{How users will be notified of changes.}

## Contact
{How to reach HOP about privacy concerns.}
```

## Quality Criteria

- Every data point collected is named and justified
- Plain English throughout
- No CYA language or legalese
- Specific about third-party services (name them)
- No forbidden words
- Not a compliance document — a trust document

## Review Prompts to Run After Generation

- `grammar-check-v1` — validates grammar and spelling
