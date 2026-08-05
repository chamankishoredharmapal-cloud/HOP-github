---
title: "08_SECURITY_AUDIT"
status: "Active"
version: "1.0.0"
department: "Engineering"
owner: "Security Lead"
---

# 08 - Security Audit

## Purpose
The purpose of this Standard Operating Procedure (SOP) is to ensure that the House of Padmavati (HOP) digital platform is thoroughly assessed against potential security vulnerabilities before every major release. This security audit ensures the platform complies with luxury e-commerce standards, safeguards customer PII, secures financial transactions, and minimizes the risk of system breaches.

## Scope
This document covers the comprehensive security auditing of the HOP platform, which consists of:
- **Frontend**: Vite 5 + React 18 + TypeScript + Tailwind CSS 3
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **Data Integrity**: Supabase Row Level Security (RLS)
- **Payments**: Razorpay Integration
- **Infrastructure**: Hosting, Edge functions, third-party integrations, and automated pipelines.

## Objectives
1. Verify secure configuration of Authentication and Authorization mechanisms.
2. Conduct an OWASP Top 10 vulnerability assessment.
3. Validate protection against XSS, CSRF, and SQL injection.
4. Audit API security, focusing on Supabase RLS policies.
5. Ensure secure handling of environment variables and prevent secret leakage.
6. Enforce TLS 1.2+ and proper HTTPS configurations.
7. Implement robust Content Security Policy (CSP) and CORS rules.
8. Validate Razorpay payment security and PCI DSS compliance posture.
9. Protect user PII in transit and at rest.
10. Confirm sound session management and token security.
11. Test rate limiting and anti-DDoS measures.
12. Audit file upload mechanisms (if applicable).
13. Perform dependency vulnerability scans (`npm audit`).
14. Ensure Edge Functions are securely developed and deployed.
15. Review all third-party integrations for security risks.
16. Validate HTTP security headers (X-Frame-Options, etc.).
17. Verify data backup and recovery mechanisms.
18. Test incident response readiness.
19. Ensure GDPR and data privacy compliance.
20. Confirm input validation using `zod` schemas.

## Definitions
- **SOP**: Standard Operating Procedure.
- **OWASP**: Open Worldwide Application Security Project.
- **PII**: Personally Identifiable Information.
- **RLS**: Row Level Security (PostgreSQL/Supabase).
- **CSP**: Content Security Policy.
- **XSS**: Cross-Site Scripting.
- **CSRF**: Cross-Site Request Forgery.
- **SQLi**: SQL Injection.
- **PCI DSS**: Payment Card Industry Data Security Standard.
- **Edge Functions**: Serverless functions running at the network edge via Supabase.

## Roles & Responsibilities
| Role | Responsibilities |
|---|---|
| **Security Lead** | Accountable for the overall security posture and sign-off. |
| **DevSecOps Engineer** | Responsible for executing automated scans and reviewing configurations. |
| **Frontend Engineer** | Responsible for resolving client-side vulnerabilities (XSS, CSP, CSRF). |
| **Backend Engineer** | Responsible for Supabase RLS, SQLi prevention, and Edge Function security. |
| **QA Automation Engineer** | Integrates security assertions into Playwright E2E tests. |
| **Data Protection Officer (DPO)** | Verifies GDPR and PII handling compliance. |

## Prerequisites
1. Staging environment fully deployed and mirroring production architecture.
2. Access to Supabase Dashboard and PostgreSQL configuration.
3. Access to the source code repository.
4. Security scanning tools installed (e.g., `npm audit`, Snyk, OWASP ZAP).
5. Razorpay sandbox credentials available.
6. Environment variables set specifically for the staging/audit environment.

## Inputs
- Application Source Code (Frontend & Backend).
- Supabase Schema Definitions & RLS Policies.
- Dependency tree (`package-lock.json`).
- Deployment configurations (`.env.example`, `.env.staging`).
- Existing incident response plans.

## Outputs
- Security Audit Report (Vulnerability matrix).
- Automated Scan Logs.
- Remediation Action Plan for any identified risks.
- Signed-off Security Certificate for Launch.

## Dependencies
- Must be executed after → [07_PERFORMANCE_AUDIT.md].
- Requires completed functional testing → [14_PLAYWRIGHT_E2E.md].
- Any critical bugs found here must be logged in → [15_BUG_TRACKER.md].
- Must be successfully completed before → [16_PRODUCTION_READINESS.md].

## Execution Order
This security audit is conducted in a sequential, layered approach:
1. Automated Scanning (Dependencies, Code Analysis).
2. Infrastructure & Configuration Review.
3. Application Logic & OWASP Review.
4. API & Database Security Review.
5. Payment & Data Privacy Review.
6. Incident Response & Recovery Verification.

---

## Phases / Stages

### Phase 1: Dependency & Code Scanning
This phase focuses on identifying known vulnerabilities in third-party packages and ensuring no secrets are committed to the repository.

### Phase 2: Infrastructure & Transport Security
Verifies TLS, CORS, CSP, and security headers protecting the deployment environment.

### Phase 3: Application Security & OWASP Top 10
Tests the application against standard web vulnerabilities (XSS, CSRF, Injection).

### Phase 4: API, Database & Edge Functions
Focuses on Supabase-specific security measures, including RLS, JWT handling, and serverless compute security.

### Phase 5: Payment, Privacy, and Compliance
Ensures Razorpay flows are secure and GDPR mandates are upheld regarding user PII.

---

## Detailed Step-by-Step Procedures

### 1. Dependency Vulnerability Scanning
1. Open terminal at `e:\HOP`.
2. Run `npm audit` to detect vulnerabilities.
   ```bash
   npm audit --audit-level=high
   ```
3. If high/critical vulnerabilities are found, run `npm audit fix` or manually update specific packages.
4. Document any accepted risks (e.g., if a patch breaks functionality, an exception must be logged).

### 2. Environment Variable Security
1. Verify `.env` files are in `.gitignore`.
2. Ensure no sensitive keys (Supabase Service Role Key, Razorpay Secret) are prefixed with `VITE_`.
3. Validate that the client bundle only contains `VITE_SUPABASE_ANON_KEY` and `VITE_RAZORPAY_KEY_ID`.
4. Run a secret scanning tool (e.g., `git-secrets` or TruffleHog) on the repository history.

### 3. HTTP Security Headers & TLS
1. Deploy the staging app.
2. Inspect network requests to verify TLS 1.2 or 1.3 is enforced.
3. Validate HTTP headers in the response:
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY` (or `SAMEORIGIN`)
   - `Referrer-Policy: strict-origin-when-cross-origin`

### 4. Content Security Policy (CSP) & CORS
1. Verify the `Content-Security-Policy` header explicitly defines:
   - `default-src 'self'`
   - `script-src` allowing only expected sources (e.g., Razorpay, analytics).
   - `connect-src` limited to Supabase endpoints and Razorpay APIs.
   - `img-src` restricted to trusted CDN/Supabase Storage.
2. Review Supabase API Settings to ensure CORS is restricted to the specific HOP domains (`https://houseofpadmavati.com`, `http://localhost:8080`).

### 5. Input Validation & Sanitization (Zod)
1. Ensure all form submissions (Login, Checkout, Profile Update, Newsletter) use `react-hook-form` integrated with `zod`.
2. Review Zod schemas for strict typing:
   - String length constraints (`.min()`, `.max()`).
   - Format validation (`.email()`, `.url()`).
   - Prevention of prototype pollution.

### 6. XSS (Cross-Site Scripting) Prevention
1. Verify React is rendering variables correctly using `{}` which auto-escapes content.
2. Audit codebase for any use of `dangerouslySetInnerHTML`. If found:
   - Ensure the input is sanitized using `DOMPurify` before insertion.
3. Test comment/review fields by injecting `<script>alert(1)</script>` and verifying it is rendered as text.

### 7. CSRF (Cross-Site Request Forgery) Protection
1. Since HOP uses Supabase Auth with JWTs stored in local storage/session storage, CSRF risk is mitigated for API calls requiring Authorization headers.
2. If any cookies are used for session management, ensure they have `SameSite=Strict` and `Secure` flags.

### 8. SQL Injection Prevention
1. As the backend uses Supabase, verify that all database interactions occur via the Supabase Javascript Client (which uses parameterized queries) or strictly typed Edge Functions.
2. Ensure no raw SQL queries are constructed by concatenating user inputs.
3. Review any custom Postgres functions to ensure inputs are parameterized.

### 9. Authentication, Authorization & Session Management
1. Verify Supabase Auth configuration:
   - Password strength requirements are enforced.
   - Email verification is required before allowing access to user-specific data.
   - Rate limiting is enabled on Auth endpoints (preventing brute force).
2. Validate JWT configuration:
   - Token expiration is set appropriately (e.g., 1 hour).
   - Refresh token logic is secure.
   - On logout, the token is actively revoked or removed from client storage.

### 10. API Security & Row Level Security (RLS)
1. Access the Supabase dashboard -> Authentication -> Policies.
2. For *every* table (e.g., `profiles`, `orders`, `addresses`):
   - Ensure RLS is **enabled**.
   - Review SELECT, INSERT, UPDATE, DELETE policies.
   - Ensure users can only access their own data: `auth.uid() = user_id`.
3. Ensure administrative tables (e.g., `products`, `campaigns`) are strictly read-only for public/authenticated users, and writeable only by service roles or specific admin UUIDs.
4. Execute test scripts attempting to fetch `orders` of another user UUID to ensure RLS blocks the query.

### 11. Payment Security (Razorpay & PCI DSS)
1. Confirm that no credit card data is ever touched, processed, or stored by HOP servers or the frontend.
2. Verify integration uses the official Razorpay Drop-in UI or Standard Checkout.
3. Ensure Razorpay webhooks are validated in Supabase Edge Functions using the webhook signature `x-razorpay-signature`.
4. Ensure Razorpay API keys (`rzp_test_...` vs `rzp_live_...`) are strictly separated between environments.

### 12. Supabase Edge Function Security
1. Review Edge Function code for Deno security configurations.
2. Ensure secrets used within Edge Functions (e.g., Razorpay Secret) are stored securely in Supabase Vault / Edge Secrets, not hardcoded.
3. Ensure Edge Functions validate the Supabase Auth JWT before performing privileged actions.

### 13. File Upload Security
1. If users can upload files (e.g., return images), verify Supabase Storage bucket configurations.
2. RLS must be enabled on storage buckets.
3. Validate file type restrictions (e.g., only `image/jpeg`, `image/png`).
4. Validate file size limits (e.g., max 5MB).

### 14. Rate Limiting and DDoS Protection
1. Verify Supabase API rate limits are configured for anomalous spikes.
2. If a WAF (Web Application Firewall) or Cloudflare is used, verify rules are active for blocking known malicious IPs.
3. Verify Edge Functions have proper error handling to prevent resource exhaustion.

### 15. User Data Protection & GDPR Compliance
1. Verify data encryption at rest (handled natively by Supabase/AWS).
2. Ensure users have a mechanism to request data deletion (Right to be Forgotten).
3. Ensure minimal PII is stored; scrub unnecessary data from logs.
4. Verify cookie consent banners are active and accurately control tracking scripts.

### 16. Data Backup and Recovery Verification
1. Check Supabase Dashboard to confirm automated Point-in-Time Recovery (PITR) is enabled.
2. Verify daily physical backups are running successfully.
3. Document the restoration procedure.

### 17. Incident Response Procedures
1. Ensure the Incident Response Plan (IRP) is documented and accessible.
2. Verify contact information for the Security Lead and hosting provider (Supabase support) is up to date.
3. Confirm logging mechanisms are active (e.g., Supabase logs) to facilitate post-incident forensics.

---

## Validation Steps
1. **Automated Run**: Execute `npm audit`. Ensure 0 critical/high issues.
2. **Dynamic Testing**: Run OWASP ZAP (Zed Attack Proxy) baseline scan against the staging URL.
3. **RLS Testing**: Run the automated RLS testing suite (if available) or manually attempt unauthorized queries using the Supabase API via Postman.
4. **Header Validation**: Use `curl -I https://staging.houseofpadmavati.com` to inspect headers.
5. **Webhook Testing**: Send a dummy payload to the Razorpay webhook endpoint with an invalid signature; ensure it returns a 400/401.

---

## Checklists

### Pre-Scan Checklist
- [ ] Staging environment is identical to production.
- [ ] Test accounts created (Admin, Customer, Guest).
- [ ] Security testing tools are updated to the latest versions.
- [ ] Database is populated with dummy test data.

### Code & Dependency Checklist
- [ ] `npm audit` reports no high/critical vulnerabilities.
- [ ] Repository scanned for leaked secrets.
- [ ] `.env` files exclude sensitive keys from `VITE_` prefix.

### Application Security Checklist
- [ ] Forms validated using `zod`.
- [ ] No unsafe usage of `dangerouslySetInnerHTML`.
- [ ] Rate limiting enabled on authentication endpoints.
- [ ] Passwords meet complexity requirements.

### Infrastructure & Cloud Checklist
- [ ] Supabase RLS is ENABLED on all tables.
- [ ] Supabase RLS policies verified for strict access.
- [ ] TLS 1.2+ enforced.
- [ ] HSTS header active.
- [ ] CSP header configured.
- [ ] CORS policies restricted to allowed domains.

### Payment & Compliance Checklist
- [ ] Razorpay webhooks validate signatures.
- [ ] No card data stored or logged.
- [ ] GDPR Right to be Forgotten capability verified.
- [ ] Database backups configured (PITR).

---

## Pass / Fail Criteria
- **Pass**: Zero critical or high vulnerabilities identified. Medium and low vulnerabilities are either mitigated or formally accepted. All RLS policies successfully block unauthorized access.
- **Fail**: Any high or critical vulnerability exists. RLS policies allow unauthorized data access. Webhook signatures are not verified. Secrets are found in the client bundle.

## Acceptance Criteria
1. Security Audit Report is completed and attached to the release ticket.
2. `npm audit` shows 0 actionable high/critical alerts.
3. All Supabase tables have verified RLS policies.
4. Security headers achieve a passing grade on standard testing tools (e.g., Mozilla Observatory).

## Quality Gates
- **Gate 1**: Dependency check passes before build.
- **Gate 2**: Code review mandates approval from Security Lead for any Edge Function or RLS changes.
- **Gate 3**: Post-deployment dynamic scan (ZAP) must pass before moving to Production Readiness.

## Evidence Required
- Screenshot/Log of `npm audit` results.
- Exported report from OWASP ZAP or equivalent DAST tool.
- Screenshot of Supabase RLS policy configurations.
- Curl outputs proving HTTP security headers.
- Log excerpt showing successful rejection of an invalid Razorpay webhook.

## Documentation Requirements
- Update the internal Threat Model if architecture changes.
- Document any accepted risks (e.g., using a legacy dependency pending upstream patch) with an expiration date.

## Common Failure Scenarios
1. **Secret Leakage**: `VITE_SUPABASE_SERVICE_ROLE_KEY` accidentally added to `.env`. This compromises the entire database.
2. **RLS Misconfiguration**: Forgetting to enable RLS on a new table, exposing it to public read/write.
3. **Webhook Forgery**: Forgetting to validate Razorpay webhook signatures, allowing attackers to mark unpaid orders as paid.
4. **XSS via Admin Input**: Rich text descriptions for products containing malicious scripts that render on the client.

## Troubleshooting
- **Build fails due to `npm audit`**: Investigate the vulnerable package. Run `npm update <package>` or check GitHub for patches. Use `overrides` in `package.json` only as a last resort and with Security Lead approval.
- **CORS Errors on Staging**: Ensure the staging domain is added to Supabase API settings -> CORS allowed origins.
- **RLS Blocking Valid Queries**: Double-check the policy logic. Ensure the JWT contains the correct claims and the query matches the `auth.uid()`.

## Best Practices
- **Principle of Least Privilege**: Grant users, services, and Edge Functions only the minimum permissions necessary to function.
- **Defense in Depth**: Do not rely solely on frontend validation; always enforce rules at the database level via RLS and constraints.
- **Continuous Scanning**: Integrate secret scanning and dependency auditing into the CI/CD pipeline (e.g., GitHub Actions).

## Standards
- OWASP Top 10 (2021).
- PCI DSS v4.0 (concerning handling of payment gateways).
- GDPR (Data Minimization and Security).

## Review Process
1. DevSecOps Engineer completes the audit and generates the report.
2. Engineering Lead reviews findings and allocates remediation tasks.
3. Security Lead validates remediations.

## Sign-off Requirements
- DevSecOps Engineer signature.
- Engineering Lead signature.
- Security Lead final approval.

## Completion Criteria
The Security Audit is considered complete when all tests have been executed, all critical/high vulnerabilities are resolved, the required evidence is compiled, and the Security Lead has signed off on the release.

## References
- → [07_PERFORMANCE_AUDIT.md]
- → [14_PLAYWRIGHT_E2E.md]
- → [15_BUG_TRACKER.md]
- → [16_PRODUCTION_READINESS.md]
- [Supabase Security Documentation](https://supabase.com/docs/guides/getting-started/architecture)
- [Razorpay Security Guidelines](https://razorpay.com/docs/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
