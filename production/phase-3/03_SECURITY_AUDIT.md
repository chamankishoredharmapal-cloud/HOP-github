---
title: "Phase 3 — Security Audit"
document_id: "HOP-P3-03"
project: "House of Padmavati (HOP)"
version: "1.0.0"
status: "Active"
last_updated: "2026-08-11"
category: "Phase 3 — Technical Validation"
owner: "Security Lead"
reviewer: "DevSecOps Engineer"
source_sop: "08_SECURITY_AUDIT.md"
---

# Phase 3 — Security Audit

## 1. Purpose

This procedure validates the security posture of the HOP platform against every requirement in `08_SECURITY_AUDIT.md`. It is the executable, evidence-driven implementation of the security SOP for Phase 3, scoped to the staging environment and test-mode integrations.

**WHAT is being tested:** authentication, authorization, Supabase RLS, database permissions, storage policies, API access, client-side exposure, environment variables, secrets, input validation, injection risks, XSS, CSRF, session handling, admin/Studio protection, dependency vulnerabilities, error information leakage, production configuration.
**WHY:** Zero Critical/High vulnerabilities is a hard QG3 requirement; customer PII and payment integrity depend on it.
**WHEN:** Third audit of Phase 3 (after Performance; the authoritative `08` document requires execution after `07`). Also re-executed after any security-relevant change.

## 2. Scope

Frontend (Vite 5 + React 18 + TS + Tailwind 3), Supabase (PostgreSQL + Auth + Storage + Edge Functions), Razorpay integration (test mode), hosting/headers, CI/CD configuration. Safe testing only — see Section 6.

## 3. Definitions

Preserved from `08`: SOP, OWASP, PII, RLS, CSP, XSS, CSRF, SQLi, PCI DSS, Edge Functions.

## 4. Roles & Responsibilities

Per `08`: Security Lead (accountable/sign-off), DevSecOps Engineer (executes scans), Frontend/Backend Engineers (fixes), QA Automation (security assertions in Playwright), DPO (GDPR/PII).

## 5. Prerequisites

- Staging deployed, mirroring production architecture.
- Supabase Dashboard access (staging project), source code repository access.
- Scanning tools installed: `npm audit` (npm 10+), secret scanner (TruffleHog or `git-secrets`), OWASP ZAP (baseline), `curl`.
- Razorpay **test** credentials; staging-only env vars.
- Test accounts (Admin, Customer, Guest) and dummy test data seeded.

## 6. Safe Testing Rules (non-negotiable)

1. All dynamic testing targets the **staging** environment only. Never production.
2. Use only test-mode Razorpay keys and test cards. Never trigger real charges.
3. Never paste, commit, or log real secret values. Redact with `<REDACTED>` in all evidence.
4. Never weaken an existing control to make a test pass. If a control blocks a legitimate flow, that is a finding, not a license to relax the control.
5. RLS negative tests use dummy UUIDs and separate test accounts — never another real user's data.
6. Stop and escalate any accidental secret exposure to the Security Lead immediately.

---

## 7. Detailed Step-by-Step Procedures

### Phase 1 — Dependency & Code Scanning

#### 1.1 Dependency vulnerabilities
```bash
npm audit --audit-level=high
```
- **PASS:** 0 high/critical vulnerabilities. **FAIL:** any high/critical → finding (P1 by default). Remediation per `08` Troubleshooting: `npm audit fix`, targeted updates, `overrides` only with Security Lead approval.
- Medium/low vulnerabilities: document as accepted risk with expiry date if unfixable.

#### 1.2 Secret scanning
1. Verify `.env*` files are in `.gitignore`.
2. Run secret scanner over repository history (e.g., `trufflehog git file://. --results=verified,unverified` or `git secrets --scan-history`).
3. **PASS:** no secrets in history. **FAIL:** any secret → P0 finding; rotate the secret immediately and purge history.

#### 1.3 Client-side exposure
1. Grep the codebase for `VITE_` prefixed variables.
2. **Verify (per `08` Step 2):** the client bundle contains **only** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_RAZORPAY_KEY_ID`. No service-role key, no Razorpay secret, no Supabase service key, anywhere in `src/`.
3. **FAIL:** any privileged key exposed client-side → P0 finding.

### Phase 2 — Infrastructure & Transport Security

#### 2.1 TLS
1. `curl -v https://<staging-url>` — verify TLS 1.2+ negotiated; no TLS 1.0/1.1.

#### 2.2 HTTP security headers
```bash
curl -I https://<staging-url>
```
Verify (per `08` Step 3):
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (or `SAMEORIGIN`)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` present and strict (see 2.3)
- `Permissions-Policy` (check; record as **PROPOSED ADDITION** if absent — not yet mandated by `08`)

**PASS:** all headers present with documented values. **FAIL:** missing/weak header → finding (P1 if CSP/HSTS missing).

#### 2.3 Content Security Policy & CORS
1. Verify CSP explicitly defines (per `08` Step 4):
   - `default-src 'self'`
   - `script-src` limited to expected sources (Razorpay `https://checkout.razorpay.com`, analytics)
   - `connect-src` limited to Supabase endpoints + Razorpay
   - `img-src` restricted to trusted CDN/Supabase Storage
2. Verify Supabase API settings → CORS origins limited to HOP domains (`https://houseofpadmavati.com`, `http://localhost:8080`) and the staging domain.

**PASS:** CSP present without unsafe-inline/unsafe-eval (except documented necessity), CORS allow-list correct. **FAIL:** CSP `default-src *` / `unsafe-eval`, or CORS `*` → finding.

### Phase 3 — Application Security (OWASP Top 10)

#### 3.1 Input validation (Zod)
1. Verify all form submissions (Login, Signup, Checkout, Address, Profile, Newsletter, Gift, Appointments, Studio forms) use `react-hook-form` + `zod` resolvers.
2. Review Zod schemas: `.min()/.max()` length constraints, `.email()`/`.url()` formats, no unbounded strings on server-bound fields.
3. **PASS:** schemas validate bounds. **FAIL:** unbounded/absent validation → finding.

#### 3.2 XSS
1. Grep for `dangerouslySetInnerHTML`. Any occurrence must sanitize via `DOMPurify` before insertion (per `08` Step 6.2).
2. Test injection: enter `<script>alert(1)</script>` into review/comment/name fields; verify it renders as literal text (React `{}` escaping).
3. Verify rich-text (Studio journal/product editorial fields) is sanitized on output.

**PASS:** no unsanitized `dangerouslySetInnerHTML`; injection renders inert. **FAIL:** executable injection → P0.

#### 3.3 SQL injection
1. Verify all DB interactions go through the Supabase JS client (parameterized) or typed Edge Functions; no string-concatenated raw SQL in `supabase/functions/*/index.ts`.
2. Review custom Postgres functions (migrations in `supabase/migrations/`) for parameterized inputs only.

**PASS:** no concatenated SQL. **FAIL:** any concatenation of user input into SQL → P0.

#### 3.4 CSRF
1. HOP uses Supabase Auth JWTs in storage; API calls carry `Authorization` headers — CSRF risk mitigated per `08` Step 7.
2. If any cookie-based session exists: verify `SameSite=Strict` + `Secure`.

**PASS:** JWT-header pattern or secure cookie flags. **FAIL:** vulnerable cookie config → finding.

### Phase 4 — Authentication, Authorization & Session Management

#### 4.1 Supabase Auth configuration (Dashboard → Authentication)
1. **Verify:** password strength enforced; email verification required before data access; rate limiting on Auth endpoints (anti-brute-force) per `08` Step 9.
2. JWT: expiration set (~1 hour); refresh token handling secure; logout revokes/removes tokens from client storage.

#### 4.2 Session behavior tests (Playwright or manual)
1. Login → close session → attempt authenticated API call: must fail (401/403).
2. Logout → refresh → verify session cleared.

**PASS:** all checks. **FAIL:** persistent session after logout or missing rate limiting → finding.

### Phase 5 — API, Database & Edge Functions

#### 5.1 RLS on every table
1. Supabase Dashboard → Authentication → Policies (or SQL editor: query `pg_policies`).
2. For **every** table (products, collections, orders, order items, addresses, profiles, customers, payment events, inventory history, settings, wishlists, images): verify **RLS is ENABLED** and policies reviewed for SELECT/INSERT/UPDATE/DELETE.
3. **Verify** customer-scoped tables enforce `auth.uid() = user_id`; public catalog tables are read-only for anon; admin tables (products, orders, inventory) writeable only by admin roles/service role.
4. **Negative tests:** using a second test user's token, attempt to fetch their orders/addresses via the Supabase client. Must return empty/forbidden.
5. Storage buckets: RLS enabled; file type restrictions (e.g., `image/jpeg`, `image/png`, `image/webp`); size limits (e.g., max 5MB per `08` Step 13; verify actual bucket config).

**PASS:** RLS enabled everywhere; cross-user access blocked; storage policies enforced. **FAIL:** RLS disabled on any table, or cross-user read possible → P0.

#### 5.2 Edge Function security
1. Review `supabase/functions/*/index.ts`: secrets come from `Deno.env.get` / Supabase Vault, never hardcoded; JWT verified before privileged actions (per `08` Step 12).
2. Verify functions reject unauthenticated privileged calls (401).

**PASS:** all functions validate auth and use env secrets. **FAIL:** hardcoded secret or unauthenticated privileged function → P0.

### Phase 6 — Payment Security (Razorpay, test mode)

1. Verify no card data ever touches HOP servers or frontend (`08` Step 11.1) — Razorpay Drop-in/Standard Checkout used.
2. **Webhook signature validation:** verify `razorpay-webhook` Edge Function validates `x-razorpay-signature` and **fails closed** (rejects invalid signatures). This behavior is already covered by `src/__tests__/RazorpayWebhook.spec.ts` — run:
```bash
npx playwright test RazorpayWebhook.spec.ts
```
   - Invalid signature → non-2xx response (400/401).
   - Duplicate events → idempotent handling (no double order/stock updates).
3. Verify environment key separation: staging uses `rzp_test_*`, never `rzp_live_*`.
4. Verify order creation flow (`create-razorpay-order`) validates the order amount server-side (never trusts client-side totals per `11` Best Practices).

**PASS:** fail-closed webhook, idempotency, key separation, server-side amount authority. **FAIL:** unverified signature, live keys in staging, or client-authoritative amounts → P0.

### Phase 7 — Privacy, Compliance & Operational Security

1. **GDPR/DPDP:** verify data deletion mechanism (account deletion flow) exists per `08` Step 15; minimal PII stored; no PII in logs.
2. **Backups:** Supabase Dashboard → verify PITR enabled and daily physical backups running; document restoration procedure.
3. **Rate limiting / DDoS:** verify Supabase API rate limits configured; WAF rules active (if applicable per `08` Step 14).
4. **Error information leakage:** trigger errors (bad login, failed payment, 404) — verify responses do not leak stack traces, SQL, or internal config (staging may expose Supabase error codes — record findings for client-visible surfaces only).
5. **Incident response:** confirm `08` Section "Incident Response Procedures" is documented and contact info current.

### Phase 8 — Dynamic Application Scan

1. Run OWASP ZAP baseline scan against the staging URL (automated baseline only; authenticated full scan is out of Phase 3 scope — **PROPOSED ADDITION** if a full DAST pass is required).
2. **PASS:** zero High/Critical alerts. **FAIL:** any High/Critical alert → finding with the ZAP reference.

---

## 8. Validation Steps

1. Execute `npm audit`; capture log.
2. Run ZAP baseline; capture report.
3. Run RLS negative tests (Postman or script) against the staging Supabase project; capture responses.
4. `curl -I` header validation; capture output.
5. Run `RazorpayWebhook.spec.ts`; capture results.
6. Verify Mozilla Observatory grade (optional per `08` Acceptance Criteria: "passing grade on standard testing tools").

## 9. Evidence Required (per `08`)

- `npm audit` output log.
- ZAP report export.
- RLS policy screenshots (`pg_policies` query output).
- curl outputs proving headers/TLS.
- Webhook rejection log excerpt (invalid signature).
- Secret scanner results.
- Playwright webhook spec results.

## 10. Pass / Fail Criteria (checklist-level)

| Check | PASS | FAIL |
|---|---|---|
| `npm audit` | 0 high/critical | any high/critical |
| Secrets | none in repo/history/client bundle | any secret |
| Headers/TLS | all documented headers + TLS 1.2+ | missing/weak |
| CSP/CORS | strict CSP, allow-listed CORS | permissive CSP/CORS |
| Zod validation | all forms validated | unvalidated forms |
| XSS/SQLi | no vector | vector exists |
| Auth/session | rate-limited, verifiable, revocable | weak session handling |
| RLS | enabled + enforced on all tables | disabled or bypassable |
| Edge Functions | auth-checked, vault secrets | unauthenticated/leaked |
| Razorpay | fail-closed webhook, idempotent, test keys | any failure |
| ZAP baseline | 0 High/Critical | any High/Critical |

## 11. After FAIL / Remediation & Re-test

1. **Document** every finding in `07_PHASE_3_BUG_TRACKER.md` (category `SEC`). Severity: use `15` classifications — P0 for any exploitable exposure, P1 for high/critical dependency or policy gap, P2/P3 for hardening gaps.
2. **Fix** strictly per finding, never by weakening controls.
3. **Verify** with the same test (re-run scan, re-run RLS test, re-run webhook spec).
4. **Re-test** adjoining areas (e.g., after RLS change, re-run studio + e-commerce auth flows).
5. **Close** only with evidence attached.

## 12. Common Failure Scenarios (preserved from `08`)

Service-role key in `.env`; RLS missing on a new table; webhook signature not validated (order-forgery); XSS via admin rich-text input.

## 13. Troubleshooting (preserved from `08`)

`npm audit` build failure → update package / check patches / `overrides` last resort. CORS errors on staging → add staging domain to Supabase allow list. RLS blocking valid queries → verify JWT claims and `auth.uid()` policy logic.

## 14. Best Practices (preserved from `08`)

Principle of least privilege; defense in depth (frontend validation never replaces RLS); continuous scanning in CI/CD.

## 15. Standards

OWASP Top 10 (2021) · PCI DSS v4.0 (payment-gateway handling) · GDPR / DPDP (per `08`).

## 16. Sign-off Requirements

DevSecOps Engineer · Engineering Lead · Security Lead (final approval) per `08`.

## 17. Completion Criteria

All tests executed; all critical/high vulnerabilities resolved; evidence compiled; Security Lead sign-off; results fed into `08_PHASE_3_COMPLETION.md`.

## 18. References

- → `08_SECURITY_AUDIT.md` (authoritative source)
- → `00_MASTER_EXECUTION_PLAN.md` (QG3: zero Critical/High + CSP)
- → `07_PHASE_3_BUG_TRACKER.md`
- → `08_PHASE_3_COMPLETION.md`
- → `06_ECOMMERCE_AUDIT.md` (payment flow cross-checks)
- → `01_PRE_PRODUCTION_AUDIT.md` (env/secret baseline)

---
*End of Document*
