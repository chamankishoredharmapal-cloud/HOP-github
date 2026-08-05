---
document_id: HOP-PROD-017
title: Launch Checklist
version: 1.0.0
last_updated: 2026-08-05
status: APPROVED
owner: DevOps / Launch Director
---

# 17. Launch Checklist

## Purpose
The purpose of this Standard Operating Procedure (SOP) is to provide the definitive, step-by-step launch day operations checklist for the House of Padmavati (HOP) digital platform. This document ensures that the transition from a staging environment to a live, production-grade luxury e-commerce platform is executed with absolute precision, mitigating risks and guaranteeing an uncompromised experience reflective of the brand's heritage and standards.

## Scope
This checklist covers all technical, operational, and communication activities required for the successful launch of the HOP platform. It spans from the T-48 hour pre-launch preparation phase through the immediate post-launch monitoring (first 72 hours). It includes deployment, infrastructure verification, third-party integrations (Supabase, Razorpay), analytics, marketing alignment, and rollback strategies.

## Objectives
- Execute a flawless deployment of the HOP application with zero downtime or data loss.
- Ensure all production configurations (environment variables, DNS, SSL) are correctly applied and verified.
- Confirm all critical user journeys (e.g., browsing, checkout, payment) function flawlessly in the live environment.
- Establish a clear communication protocol among the Launch Team.
- Define a definitive rollback procedure in the event of critical failures.
- Transition smoothly from deployment into active monitoring and support.

## Definitions
- **Go/No-Go Decision**: A formal consensus reached by the Launch Team to proceed with or halt the launch.
- **War Room**: A designated physical or virtual space (e.g., a dedicated Slack channel or Zoom bridge) where the Launch Team coordinates operations.
- **Cache Warming**: The process of pre-loading CDN and application caches to ensure fast load times for the first real users.
- **Critical Path**: The essential user journey: Browse → Product Detail → Cart → Checkout → Payment → Order Confirmation.

## Roles & Responsibilities

| Role | Responsibilities |
| :--- | :--- |
| **Launch Director** | Orchestrates the launch, makes final Go/No-Go decisions, manages stakeholder communication. |
| **Lead Engineer (Frontend)** | Oversees Vite/React deployment, asset delivery, UI integrity, and cache warming. |
| **Lead Engineer (Backend)** | Manages Supabase configuration, database migrations, Edge Functions, and external APIs. |
| **QA Lead** | Executes production smoke tests, critical path verification, and signs off on quality gates. |
| **DevOps / SRE** | Handles DNS/CDN configurations, SSL, environment variables, monitoring activation, and error tracking. |
| **Brand Director** | Verifies content, editorial integrity, and alignment with luxury brand standards (Jasmine, Teal, Sand palettes). |

## Prerequisites
- All preceding audits (Pre-Production, UI/UX, Security, Performance, SEO) are completed and signed off.
- Staging environment is locked (Code Freeze).
- Production infrastructure (Vercel/AWS/Cloudflare) is provisioned but inactive/hidden.
- Third-party accounts (Razorpay, Supabase, Google Analytics, Sentry) are upgraded to production tiers.
- Launch team roster is finalized and communication channels are established.

## Inputs
- Final, approved production branch (`main`).
- Production environment variables (`.env.production`).
- Launch communication plan and marketing assets.
- Approved rollback strategy.

## Outputs
- Live, publicly accessible House of Padmavati digital platform.
- Active real-time monitoring and alerting dashboards.
- Launch Day Execution Log.
- Sign-off documents for all launch phases.

## Dependencies
- Availability of core infrastructure providers (Vercel, Supabase).
- Functional payment gateway (Razorpay Live Mode).
- DNS propagation times (varies by provider).
- Stakeholder availability for final approvals.

## Execution Order
The launch must follow a strict chronological sequence to ensure dependencies are respected and risks are minimized.
1. Pre-launch Preparation (T-48h to T-1h)
2. Deployment Procedure (T-0)
3. Live Configuration & Activation
4. Post-Deployment Verification
5. Handoff to War Room & Monitoring

---

## Phases / Stages

### Phase 1: Pre-launch Preparation

#### T-48 Hours: Final Readiness
- [ ] Confirm code freeze on `main` branch.
- [ ] Review `16_PRODUCTION_READINESS.md` and confirm all checkboxes are marked.
- [ ] Verify production database schema in Supabase (empty, awaiting final seed/migration).
- [ ] Ensure all required production secrets and environment variables are securely stored in the deployment provider's vault.
- [ ] Run final full suite of Playwright E2E tests against staging.
- [ ] Confirm Razorpay Live account credentials are generated but not yet active in the application.

#### T-24 Hours: Infrastructure & Team Alignment
- [ ] Conduct Launch Team briefing; verify War Room meeting links and Slack channel (`#ops-launch-hop`).
- [ ] Verify domain registrar access and DNS TTL is lowered to 300 seconds (5 minutes) for fast propagation.
- [ ] Verify SSL certificates are ready to be provisioned upon domain routing.
- [ ] Draft launch communications for internal stakeholders and VIP clients.
- [ ] Verify the rollback snapshot of the database is prepared.

#### T-12 Hours: System Lockdown
- [ ] Halt all non-critical background jobs on staging.
- [ ] Verify content payload from CMS (if applicable) is finalized and locked.
- [ ] Confirm on-call schedules for the first 72 hours are published.
- [ ] QA Lead finalizes the specific smoke test plan for production.

#### T-6 Hours: Final Go/No-Go Meeting
- [ ] Launch Director convenes all Leads.
- [ ] Review any outstanding P2/P3 bugs (No P1s allowed).
- [ ] Confirm infrastructure health.
- [ ] **Decision:** Formal Go or No-Go recorded.

#### T-2 Hours: Environment Prep
- [ ] DevOps applies final production environment variables to the deployment target.
- [ ] Backend Lead executes pre-deployment database migrations on Supabase production instance.
- [ ] Verify Edge Functions are deployed to Supabase production.

#### T-1 Hour: War Room Assembly
- [ ] All required personnel join the War Room.
- [ ] Communication blackout rule activated (only critical launch communication allowed).
- [ ] Final verification of deployment scripts.

---

### Phase 2: Deployment Procedure

#### Step-by-Step Deployment
1. **Initiate Build:** Lead Engineer triggers the production build from the `main` branch.
2. **Build Verification:** Monitor build logs for any warnings or errors. Ensure Vite bundles all assets correctly.
3. **Database Migration (Final):** Execute final data seeds (e.g., initial catalog data) to the Supabase production database.
4. **Deploy Application:** Push the build to the production environment (e.g., Vercel).
5. **Traffic Routing (DNS):** DevOps updates the primary DNS A/CNAME records to point `houseofpadmavati.com` to the production load balancer/CDN.

---

### Phase 3: Live Configuration & Activation

#### DNS and Domain Configuration
- [ ] Verify `houseofpadmavati.com` resolves to the correct production IP/CNAME.
- [ ] Verify `www.houseofpadmavati.com` correctly redirects to the root domain.
- [ ] Confirm DNS TTL is restored to standard values (e.g., 86400 or 24 hours) after successful propagation.

#### SSL Certificate Verification
- [ ] Verify SSL certificate is issued and active.
- [ ] Check certificate validity dates and issuer.
- [ ] Ensure HTTP traffic is forced to HTTPS (Strict-Transport-Security enabled).

#### Environment Variable Verification
- [ ] Confirm production `.env` is active (e.g., `NODE_ENV=production`).
- [ ] Verify Supabase URL and Anon Key are pointing to production.
- [ ] Verify Razorpay Key ID points to the Live environment.

#### Supabase Production Configuration
- [ ] Verify Row Level Security (RLS) policies are active and enforcing correct permissions.
- [ ] Confirm production database backups are enabled (e.g., Point-in-Time Recovery).
- [ ] Check Edge Function logs to ensure successful initialization.

#### External Integrations Activation
- [ ] **Razorpay:** Activate Live Mode. Perform a nominal ₹1 test transaction if required by standard operating procedure.
- [ ] **Analytics:** Enable Google Analytics / Tag Manager. Verify real-time traffic is registering (using internal IP exclusion if necessary).
- [ ] **Error Tracking:** Enable Sentry. Verify source maps are uploaded and errors are flowing to the correct production project.
- [ ] **Uptime Monitoring:** Activate Pingdom, Datadog, or similar uptime checks targeting the homepage and `/api/health` endpoints.

#### CDN and Cache Warming
- [ ] Purge any existing CDN cache.
- [ ] Execute Cache Warming script (automated crawling of high-priority pages: Homepage, Collections, key Product Details).
- [ ] Verify cache HIT ratios on static assets (fonts, images).

---

### Phase 4: Post-Deployment Verification (Smoke Tests)

#### Critical Path Verification
QA Lead and designated testers must execute the following flows manually on real devices (Mobile/Desktop):
- [ ] **Browse:** Navigate Homepage → Lookbook → Category Page. Verify image loading and typography (Cormorant Garamond, Inter).
- [ ] **Product Detail:** Open a product, select variant, add to cart.
- [ ] **Cart:** Open cart, verify calculation, taxes, and shipping estimates.
- [ ] **Checkout:** Proceed to checkout, enter shipping details.
- [ ] **Payment:** Initiate Razorpay payment (using internal test credentials or nominal live payment).
- [ ] **Confirmation:** Reach the Order Confirmation page. Verify order appears in the user account and Supabase database.

#### Email System Verification
- [ ] Verify transactional email delivery (Order Confirmation, Welcome Email) using Postmark/SendGrid production accounts.
- [ ] Check email formatting and branding against luxury standards.

#### Social Media and SEO Verification
- [ ] Verify all footer social media links point to correct brand profiles.
- [ ] Validate `robots.txt` allows indexing (remove `Disallow: /` if present from staging).
- [ ] Verify `sitemap.xml` is accessible and submitted to Google Search Console.
- [ ] Check meta tags and Open Graph tags on the homepage using external validators.

---

### Phase 5: Handoff & Rollback Procedures

#### Rollback Procedure (If issues detected)
If critical failures (P1 bugs, payment failures, data corruption) are detected within the first 60 minutes:
1. **Decision:** Launch Director calls a Rollback.
2. **DNS Revert:** DevOps immediately changes DNS records back to the staging/maintenance page.
3. **App Revert:** Redeploy the previous known-good state or activate a static maintenance page.
4. **Database Revert:** If data corruption occurred, restore Supabase from the pre-launch snapshot.
5. **Communication:** Inform stakeholders of the delay and estimated resolution time.

#### Launch Communication Plan
- [ ] Notify internal stakeholders: "Platform is LIVE and stable."
- [ ] Marketing Team initiates social media announcements and PR distribution.
- [ ] Customer Support team logs in and monitors inbound queries.

#### War Room Procedures (Post-Launch Monitoring)
The War Room remains active for 72 hours post-launch.
- **First 24 Hours:** Continuous monitoring. DevOps and Backend Lead on active standby. Monitoring Sentry for unhandled exceptions, Supabase for connection pool spikes, and Razorpay for failed transactions.
- **24-48 Hours:** Review of first-day analytics. Address P3/P4 UI bugs reported by users.
- **48-72 Hours:** Stabilization phase. Transition to standard operations and support SLAs.

---

## Validation Steps
1. Execute the Critical Path Verification flow.
2. Monitor Sentry for 30 minutes post-launch; confirm zero P1 error spikes.
3. Verify at least one successful external payment transaction.
4. Confirm Google Analytics is capturing live sessions.

## Checklists
- [ ] Pre-launch Preparation complete.
- [ ] Deployment Execution complete.
- [ ] Infrastructure (DNS, SSL, CDN) verified.
- [ ] Critical Path Smoke Tests passed.
- [ ] Monitoring and Analytics active.

## Pass / Fail Criteria
- **Pass:** The platform is accessible globally via the primary domain, SSL is valid, the critical checkout path works flawlessly, and monitoring confirms system stability.
- **Fail:** Inability to load the site, broken checkout process, database connectivity issues, or significant UI degradation requiring immediate rollback.

## Acceptance Criteria
- All steps in the Phase 3 and Phase 4 checklists are marked complete by their respective owners.
- Launch Director signs off on the final state.

## Quality Gates
- **Pre-Deploy Gate:** Go/No-Go decision from all Leads.
- **Post-Deploy Gate:** Successful completion of the Critical Path Smoke Test before marketing announcements are made.

## Evidence Required
- Screenshots of the live War Room dashboard (Uptime, Analytics).
- Test transaction receipt from Razorpay Live.
- Sentry dashboard showing healthy error rates.

## Documentation Requirements
- Launch Day Execution Log (time-stamped record of all actions taken).
- Post-Mortem document (if any anomalies or minor issues occurred during launch).

## Common Failure Scenarios
1. **DNS Propagation Delay:** Users see the old site or an error. *Mitigation:* Ensure TTL was lowered 24 hours prior. Wait and monitor global propagation checkers.
2. **CDN Cache Misses:** Slow site load times. *Mitigation:* Re-run cache warming scripts; verify cache control headers in Vite/Server configuration.
3. **Environment Variable Mismatch:** Connecting to staging database instead of production. *Mitigation:* DevOps double-checks `.env.production` against a secure vault prior to build.

## Troubleshooting
- **Checkout Failing:** Verify Razorpay keys. Check Supabase Edge Function logs for CORS issues or secret mismatches.
- **Assets Not Loading (404s):** Verify Vite build output path matches deployment configuration. Purge CDN cache.
- **Blank Screen (React Error):** Check Sentry immediately. It usually indicates a runtime error in production that was missed in staging (often data-shape related).

## Best Practices
- Never skip the T-24h TTL lowering.
- Always perform a real-money test transaction in production.
- Keep the War Room focused; limit chatter to operational updates.

## Standards
- Adherence to HOP Brand Guidelines during all public communications.
- Adherence to Security standards (no plaintext secrets shared in Slack).

## Review Process
- The Launch Checklist must be reviewed and rehearsed in a "dry run" one week prior to the actual launch.
- Post-launch, the Launch Director reviews the Execution Log to identify areas for process improvement.

## Sign-off Requirements
- Launch Director
- Lead Engineer (Frontend)
- Lead Engineer (Backend)
- DevOps / SRE
- QA Lead

## Completion Criteria
- Platform is live for 72 hours without critical incident.
- War Room is officially disbanded and transitioned to standard support operations.
- All internal and external communications have been successfully dispatched.

## References
- → See `00_MASTER_EXECUTION_PLAN.md`
- → See `01_PRE_PRODUCTION_AUDIT.md`
- → See `08_SECURITY_AUDIT.md`
- → See `11_ECOMMERCE_AUDIT.md`
- → See `16_PRODUCTION_READINESS.md`
- → See `18_POST_LAUNCH_MONITORING.md`
