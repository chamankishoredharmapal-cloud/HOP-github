# HOP Staging Credentials Guide

## 1. Purpose of `.env.staging.local`

The `.env.staging.local` file provides a secure, local-only configuration for authorized AI coding agents and developers to run staging validation tests against the House of Padmavati staging environment without repeatedly requesting individual credential values from the operator.

**This file is strictly for staging environment access.** It must never be used for production.

## 2. Staging-Only Constraint

| Environment | Project Ref | Supabase URL |
|-------------|-------------|--------------|
| **Staging** | `dovnhgbisiturzbjgvei` | `https://dovnhgbisiturzbjgvei.supabase.co` |
| Production | `kbvjmcnaaogkbnerjcoc` | `https://kbvjmcnaaogkbnerjcoc.supabase.co` |

**Rules:**
- Never access, modify, query, or deploy to production using this file
- Never place production credentials in this file
- The validation script will fail if production identifiers are detected

## 3. Variable Classification

### Safe for Frontend Use (Vite `import.meta.env`)

These variables are prefixed with `VITE_` and are safe to include in the client bundle:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Staging Supabase API URL | `https://dovnhgbisiturzbjgvei.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/publishable key | `eyJhbGciOiJ...` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay **Test Mode** key ID (starts with `rzp_test_`) | `rzp_test_TcXqw4nezbIA2b` |

### Server-Only (Never Expose to Browser)

These variables must **never** appear in Vite config, frontend code, or build output:

| Variable | Description | Security Level |
|----------|-------------|----------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Full admin access to Supabase | **Critical** |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (server-side) | **Critical** |
| `RAZORPAY_WEBHOOK_SECRET` | HMAC signing secret for webhook verification | **Critical** |
| `TEST_CUSTOMER_PASSWORD` | Test account password | **High** |

### Metadata & URLs

| Variable | Description | Safe for Frontend |
|----------|-------------|-------------------|
| `SUPABASE_PROJECT_REF` | Staging project reference ID | Yes (public) |
| `FRONTEND_URL` | Staging frontend origin (Cloudflare) | Yes |
| `RAZORPAY_WEBHOOK_URL` | Webhook endpoint URL | Yes |
| `VERIFY_PAYMENT_URL` | Payment verification endpoint | Yes |
| `CREATE_ORDER_URL` | Order creation endpoint | Yes |
| `TEST_CUSTOMER_EMAIL` | Test account email | Yes |

## 4. Secrets Must Never Be Committed

- `.env.staging.local` is in `.gitignore` — **never commit it**
- `.env.staging.example` is the only commit-safe file (contains no secrets)
- If a secret appears in git history, rotate it immediately

## 5. AI Agent Access Rules

AI agents may read `.env.staging.local` **only when explicitly authorized by the operator** for a specific staging validation task.

## 6. AI Agents Must Never Print Secrets

- Never `cat`, `type`, or display `.env.staging.local` in visible logs
- Never include secret values in generated reports, diffs, or chat
- Use the validation script which outputs only masked metadata

## 7. Production Credentials Prohibited

- Production project ref: `kbvjmcnaaogkbnerjcoc`
- Production Supabase URL: `https://kbvjmcnaaogkbnerjcoc.supabase.co`
- Production Razorpay keys (Live Mode: `rzp_live_*`)
- **Never** place any of these in `.env.staging.local`

## 8. Webhook Secret vs Webhook URL

| Variable | Type | Example |
|----------|------|---------|
| `RAZORPAY_WEBHOOK_SECRET` | HMAC signing secret (string) | `whsec_abc123...` |
| `RAZORPAY_WEBHOOK_URL` | HTTPS endpoint URL | `https://dovnhgbisiturzbjgvei.supabase.co/functions/v1/razorpay-webhook` |

**Critical:** `RAZORPAY_WEBHOOK_SECRET` is a **signing secret**, not a URL. It is used to verify the `x-razorpay-signature` header on incoming webhook requests.

## 9. Test Customer Credentials

- `TEST_CUSTOMER_EMAIL`: Use a real, accessible email for staging
- `TEST_CUSTOMER_PASSWORD`: Must be unique, non-trivial, and **never reused** from production
- Create a dedicated staging test account — do not use personal credentials

---

## AI Agent Operating Rules

**Mandatory for all AI agents accessing staging credentials:**

1. **Read only the variables needed** for the current task — never load the entire file into context unless required
2. **Never display the entire file** — never use `cat .env.staging.local`, `type .env.staging.local`, or equivalent in visible output
3. **Never include secrets in generated reports** — reports must show only masked metadata (e.g., `RAZORPAY_KEY_SECRET: present, value hidden`)
4. **Never commit `.env.staging.local`** — verify `.gitignore` before any commit
5. **Never send secrets to external services** except the intended staging provider (Supabase, Razorpay)
6. **Never use staging credentials against production URLs** — the validation script enforces this
7. **Never change secrets automatically** without explicit operator authorization
8. **If a secret appears in terminal output** — immediately stop, redact the output, and recommend credential rotation to the operator
9. **Run the validation script** (`scripts/verify-staging-environment.mjs`) before any staging operation to confirm environment integrity
10. **Report missing variable names only** — if a required value is missing, report the variable name and ask the operator to provide it securely