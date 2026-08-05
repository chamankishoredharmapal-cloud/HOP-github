---
title: 01 Pre-Production Audit
project: House of Padmavati (HOP)
version: 1.0.0
last_updated: 2026-08-05
status: Active
category: Production Operations Manual
---

# 01_PRE_PRODUCTION_AUDIT

## 1. Purpose
The purpose of this Standard Operating Procedure (SOP) is to govern the comprehensive pre-production audit for the House of Padmavati (HOP) platform. This audit serves as the first operational step before any release cycle, ensuring that all code, infrastructure, integrations, and environments are rigorously validated and prepared for a zero-defect production deployment.

## 2. Scope
This document covers the end-to-end audit procedures required prior to deploying any release candidate (RC) to the production environment. The scope includes:
- Environment verification across Development, Staging, and Production.
- Dependency auditing and vulnerability scanning.
- Build verification, type checking, and linting.
- Environment variable and configuration validation.
- Supabase database migration and health checks.
- API and Edge Function health verification.
- Third-party service integration (Razorpay, Supabase, CDN).
- Code freeze and branch management protocols.
- Rollback plan preparation and validation.
- Infrastructure and monitoring readiness checks.

## 3. Objectives
- Ensure absolute stability and integrity of the release candidate before it enters the deployment pipeline.
- Prevent regressions, build failures, and deployment blockages through exhaustive pre-checks.
- Guarantee that all environmental configurations are synchronized and secure.
- Establish a clear, documented, and reproducible quality gate that must be passed before proceeding to UI, Editorial, and E2E testing phases.

## 4. Definitions
- **RC (Release Candidate):** A finalized version of the application code targeted for production release.
- **Vite:** The frontend build tool and development server used for HOP.
- **Supabase:** The backend-as-a-service provider handling PostgreSQL database, authentication, and Edge Functions.
- **Razorpay:** The payment gateway integration handling transactional processing.
- **Code Freeze:** A designated period during which no new features or non-critical code merges are permitted on the release branch.

## 5. Roles & Responsibilities

| Role | Responsibilities |
| :--- | :--- |
| **Release Manager** | Orchestrates the pre-production audit, enforces code freeze, and provides final sign-off. |
| **Lead DevOps Engineer** | Validates infrastructure readiness, environment variables, monitoring, and database migrations. |
| **Frontend Tech Lead** | Verifies Vite builds, TypeScript compilation, ESLint compliance, and dependency audits. |
| **Backend Engineer** | Validates Supabase edge functions, database migrations, and API endpoint health. |
| **QA Automation Lead** | Prepares the staging environment for upcoming Playwright E2E testing. |

## 6. Prerequisites
- The release candidate code is merged into the `release/vX.Y.Z` branch.
- Access to Supabase production and staging dashboards is secured.
- Access to the Vercel/Netlify/Hosting deployment dashboard is secured.
- Local development environment is correctly configured (Node.js 20+, npm 10+).
- Access to Razorpay staging/production dashboards is secured.

## 7. Inputs
- Release branch (e.g., `release/vX.Y.Z`).
- `.env.example` file outlining required configuration variables.
- Supabase migration SQL files located in `supabase/migrations/`.
- `package.json` and `package-lock.json`.

## 8. Outputs
- Verified and locked `package-lock.json`.
- A fully audited and functional staging environment mirroring production.
- A completed Pre-Production Audit checklist with all passing marks.
- Documented Rollback Plan for the specific release.

## 9. Dependencies
- Up-time of Supabase services (Database, Auth, Storage, Edge Functions).
- Availability of Razorpay API endpoints.
- Accessibility of the CDN provider (e.g., Cloudflare or Vercel Edge Network).
- Complete synchronization of the Github repository.

## 10. Execution Order
1. Code Freeze and Branch Management
2. Dependency Audit and Package Verification
3. Environment Configuration Validation
4. Build Verification and Static Analysis
5. Database Migration and State Verification
6. Infrastructure and API Endpoint Health Checks
7. Third-Party Integration Verification
8. Monitoring and Alerting Setup
9. Rollback Plan Preparation

## 11. Phases / Stages

### Phase 1: Code Freeze and Branch Management
The Release Manager shall initiate the code freeze to stabilize the codebase.
1. Announce the code freeze across all communication channels (Slack, Email).
2. Create the release branch from `main` or `develop` (e.g., `git checkout -b release/v1.2.0`).
3. Apply branch protection rules to `release/v1.2.0` in GitHub, preventing direct pushes and requiring pull request reviews.
4. Verify that all outstanding pull requests targeting the release are merged or explicitly deferred to the next sprint.

### Phase 2: Dependency Audit and Package Verification
The Frontend Tech Lead shall audit all project dependencies.
1. Pull the latest release branch locally.
2. Execute a clean installation of all dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Run the npm audit tool to identify known vulnerabilities:
   ```bash
   npm audit --audit-level=high
   ```
4. Address any HIGH or CRITICAL vulnerabilities immediately. If updates introduce breaking changes, apply targeted resolutions or overrides after manual testing.
5. Verify that core dependencies (React 18, Vite 5, Tailwind 3, TanStack Query, React Router v6, Supabase-js) remain pinned to their verified major/minor versions.
6. Commit the regenerated `package-lock.json` if changes occurred.

### Phase 3: Environment Configuration Validation
The Lead DevOps Engineer shall audit environment variables across environments.
1. Compare `.env.example` with the staging and production environment variables stored in the deployment CI/CD pipeline.
2. Validate the presence and correct formatting of the following critical keys (DO NOT expose actual keys in documentation):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`
   - `SUPABASE_SERVICE_ROLE_KEY` (Backend/Edge Functions only)
   - `RAZORPAY_KEY_SECRET` (Backend/Edge Functions only)
3. Ensure no trailing spaces exist in the configuration strings.
4. Verify that the production environment variables point strictly to production endpoints (e.g., live Razorpay keys, production Supabase project).

### Phase 4: Build Verification and Static Analysis
The Frontend Tech Lead shall confirm that the codebase compiles and passes linting.
1. Execute the TypeScript compiler check to verify type safety without emitting files:
   ```bash
   npm run typecheck # typically maps to `tsc --noEmit`
   ```
2. Execute the ESLint validation across all source directories:
   ```bash
   npm run lint # typically maps to `eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0`
   ```
3. Execute the Vite production build command:
   ```bash
   npm run build
   ```
4. Inspect the build output logs. Verify that the `dist/` directory is successfully generated.
5. Review the chunk sizes in the build output. Ensure no single chunk exceeds 500KB (gzipped) without explicit code-splitting justification.
6. Run the local preview server to ensure the built assets execute properly:
   ```bash
   npm run preview
   ```

### Phase 5: Database Migration and State Verification
The Backend Engineer shall audit the Supabase project configuration.
1. List all local migrations in `supabase/migrations`.
2. Connect to the staging database and verify the migration history against the local repository:
   ```bash
   supabase migration list --linked
   ```
3. Identify any pending migrations that need to be applied to the staging or production databases.
4. Execute a dry-run or verify the SQL schemas of new migrations to ensure they do not perform destructive operations (e.g., `DROP TABLE`) without a verified backup strategy.
5. Verify Row Level Security (RLS) policies. Ensure no tables are left publicly writable without explicit business requirements.
6. Verify database types generation synchronization:
   ```bash
   supabase gen types typescript --linked > src/types/supabase.ts
   ```
7. Confirm that the generated types match the committed `src/types/supabase.ts` file.

### Phase 6: Infrastructure and API Endpoint Health Checks
The Lead DevOps Engineer shall verify system endpoints and Edge Functions.
1. Access the deployment dashboard (Vercel/Netlify/Custom VPS). Verify that the staging deployment reflects the exact git commit hash of the release branch.
2. Monitor the staging deployment build logs for any anomalies or deprecated warnings.
3. Verify Supabase Edge Functions:
   - Ensure all functions in `supabase/functions/` are successfully deployed to the staging project.
   - Use Postman or cURL to send test payloads to critical endpoints (e.g., `create-order`, `verify-payment`).
4. Validate CORS headers on Edge Functions to ensure they accept requests only from the verified HOP domain origins.

### Phase 7: Third-Party Integration Verification
The Backend Engineer shall validate external service connections.
1. **Razorpay:**
   - Log into the Razorpay staging dashboard.
   - Ensure Webhook URLs are correctly configured to point to the Supabase Edge Functions.
   - Trigger a test webhook (e.g., `order.paid`) and verify it is processed with HTTP 200 by the backend.
2. **CDN / Asset Delivery:**
   - Verify that all static assets (fonts, luxury imagery, videos) are resolving with appropriate cache-control headers (`public, max-age=31536000, immutable`).
   - Confirm that images are loading via the optimized image delivery network (e.g., format=webp/avif).

### Phase 8: Monitoring and Alerting Setup Verification
The Lead DevOps Engineer shall verify telemetry and observability.
1. Verify integration with error tracking tools (e.g., Sentry, LogRocket, or Datadog).
2. Purposely trigger a captured exception in the staging environment (e.g., via a hidden debug route) and verify the alert is routed to the designated engineering Slack/email channel.
3. Check the Supabase observability dashboard. Ensure log retention is correctly configured.
4. Verify custom performance monitoring (e.g., Web Vitals tracking) is active and recording in staging.

### Phase 9: Rollback Plan Preparation
The Release Manager shall formulate and document the specific rollback strategy.
1. Document the exact Git commit hash of the current stable production release.
2. Define the database rollback strategy if migrations are included in the RC:
   - If backward-compatible: Web-app rollback only.
   - If breaking changes: Document point-in-time recovery (PITR) procedures via Supabase or down-migration scripts.
3. Write out the exact deployment revert commands or identify the "Rollback" button on the deployment platform.
4. Ensure the rollback plan is approved by the Lead DevOps Engineer.

## 12. Validation Steps
- The auditor shall attempt to access the staging environment via browser to confirm successful deployment.
- The auditor shall verify the exact release branch commit is what generated the staging build.
- The auditor shall run `npm run lint` and `npm run typecheck` locally on the release branch and capture the exit code (must be 0).
- The auditor shall verify the database schema hash matches between local and staging environments.

## 13. Checklists

### Code & Build
- [ ] Code freeze announced and enforced.
- [ ] Release branch created and protected.
- [ ] `npm audit` shows 0 high/critical vulnerabilities.
- [ ] `npm run typecheck` passes with no errors.
- [ ] `npm run lint` passes with no warnings or errors.
- [ ] `npm run build` succeeds.
- [ ] Bundle size within acceptable thresholds.

### Environment & Database
- [ ] All `.env.example` keys exist in Staging environment variables.
- [ ] All `.env.example` keys exist in Production environment variables.
- [ ] Supabase migrations are tested and verified.
- [ ] `src/types/supabase.ts` is perfectly synced with the database schema.
- [ ] RLS policies verified for all tables.

### Infrastructure & Integrations
- [ ] Staging deployment matches release branch commit.
- [ ] Supabase Edge Functions deployed to staging.
- [ ] Razorpay webhooks configured and responding.
- [ ] CDN serving assets with correct cache headers.
- [ ] Error tracking alerts routed to Slack.

### Documentation
- [ ] Rollback strategy defined and documented.
- [ ] Required approvals obtained for the rollback plan.

## 14. Pass / Fail Criteria
- **Pass:** All steps in the checklist are marked complete. Zero build errors, zero typescript errors, zero high-severity audit vulnerabilities, and the staging environment is perfectly healthy.
- **Fail:** Any build failure, any untreated critical security vulnerability, mismatched environment variables, missing database migrations, or failure of external webhooks to respond.

## 15. Acceptance Criteria
- A fully reproducible build is artifacted.
- The Staging environment accurately represents the upcoming Production state.
- Monitoring systems actively report the health of the Staging environment.

## 16. Quality Gates
- **Quality Gate 1:** Static Analysis (Linting, Typechecking, Bundle Size). Must be automated in CI but verified manually here.
- **Quality Gate 2:** Security Audit. No high/critical dependencies.
- **Quality Gate 3:** Database Integrity. Migrations verified against staging.
- **Quality Gate 4:** Rollback Plan. Explicitly signed off by DevOps.

## 17. Evidence Required
- Screenshot or CI link proving a successful Vite build.
- Terminal output logs for the `npm audit`.
- Output of `supabase migration list --linked` confirming synchronization.
- Link to the Rollback Document or ticket.

## 18. Documentation Requirements
- The auditor must create a sign-off ticket in the project management tool (e.g., Jira, Linear) containing the evidence outlined in Section 17.
- Any deviations or accepted risks (e.g., deferring a medium-severity npm vulnerability) must be thoroughly documented in the ticket with a remediation timeline.

## 19. Common Failure Scenarios
- **Typecheck Failures due to Database Changes:** The `supabase.ts` types were updated, but frontend code (e.g., React Query hooks) was not updated to reflect nullable fields or renamed columns.
- **Environment Variable Mismatch:** A new feature requires a new third-party API key, but it was only added to `.env.local` and forgotten in the Staging/Production UI.
- **Migration Conflicts:** Multiple developers added migrations simultaneously, causing sequence conflicts in Supabase.
- **Edge Function Timeout:** The Razorpay webhook function exceeds the Edge Function execution limit during testing.

## 20. Troubleshooting
- **If `npm audit` fails:** Run `npm audit fix`. If issues persist, identify the offending dependency. If it is a transitive dependency, utilize `overrides` or `resolutions` in `package.json` to force a secure version, then thoroughly test the application.
- **If Supabase migrations conflict:** Rebase the migrations locally. Rename the migration files to ensure a linear timestamp sequence. Reset the local database (`supabase db reset`) and re-test before applying to staging.
- **If the build fails on CI but passes locally:** Check the Node.js version in the CI configuration (must match local, e.g., v20). Verify that no local `.env` variables are being implicitly relied upon by the build process.

## 21. Best Practices
- **Never test against Production during this phase.** All integration testing must target the Staging environment or isolated test environments.
- Always use `--noEmit` with `tsc` during the typecheck phase to separate compilation from transpilation (which Vite handles via esbuild/swc).
- Keep the Rollback Plan simple and deterministic. Rely on automated tools over manual script execution where possible.

## 22. Standards
- All code must comply with the established HOP TypeScript strict mode configurations.
- All database interactions must happen via Supabase generated types to ensure end-to-end type safety.
- Commits on the release branch must follow conventional commit standards to facilitate automated changelog generation.

## 23. Review Process
- The Pre-Production Audit checklist must be reviewed by at least one peer who did not execute the audit (e.g., the Release Manager reviews the Tech Lead's audit).
- Any anomalies must be flagged as blocking issues.

## 24. Sign-off Requirements
The following roles must provide explicit sign-off (in the project management tool or via digital signature) before moving to the `02_UI_UX_REVIEW` phase:
1. Frontend Tech Lead
2. Backend Engineer
3. Lead DevOps Engineer
4. Release Manager

## 25. Completion Criteria
The Pre-Production Audit is complete when:
- The `release/vX.Y.Z` branch is locked.
- The Staging environment is fully deployed and verified.
- The sign-off ticket is marked as "Approved".
- The team is authorized to proceed to the subsequent manual and automated testing phases.

## 26. References to other Production Manual documents
- → See `00_MASTER_EXECUTION_PLAN.md` for overall pipeline context.
- → See `02_UI_UX_REVIEW.md` for the immediate next phase.
- → See `11_ECOMMERCE_AUDIT.md` for specific Razorpay and cart flow validation.
- → See `17_LAUNCH_CHECKLIST.md` for how the Rollback plan integrates into the final launch.
