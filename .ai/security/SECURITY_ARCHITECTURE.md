# Security Architecture — House of Padmavati

## Overview

House of Padmavati processes financial transactions and handles customer PII. Security is built into every layer.

## Security Layers

```
┌──────────────────────────────────────────────────┐
│                  Client Browser                   │
│  Content-Security-Policy, HSTS, XSS Protection   │
└──────────────────────┬───────────────────────────┘
                       │ HTTPS (TLS 1.3)
┌──────────────────────▼───────────────────────────┐
│               Supabase Backend                    │
│  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Auth (JWT)   │  │ Row Level Security (RLS) │  │
│  │ Rate Limiting│  │ Parameterized Queries    │  │
│  │ MFA Support  │  │ Input Validation         │  │
│  └──────────────┘  └──────────────────────────┘  │
└──────────────────────┬───────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────┐
│              Razorpay Gateway                     │
│  PCI DSS Level 1, Tokenization, 3D Secure        │
│  Signature Verification, Webhook Validation      │
└──────────────────────────────────────────────────┘
```

## Authentication & Authorization

### Admin Authentication
- Supabase Auth with email/password
- JWT tokens with expiration
- MFA enabled for all admin accounts
- Session management with automatic timeout

### Storefront
- No authentication required for browsing
- Order lookup by order number (not email)
- Cart stored in localStorage (client-side)
- No user accounts for customers (guest checkout)

### Authorization (RLS)
- Public tables: read-only access
- Admin tables: full access (authenticated admin role only)
- Customer data: user-scoped access
- Payments: service role only

## Data Protection

### In Transit
- HTTPS enforced (HSTS, TLS 1.3)
- API calls use HTTPS
- Webhook calls validate origin

### At Rest
- Supabase encrypts data at rest
- Passwords hashed (bcrypt via Supabase Auth)
- Payment tokens (Razorpay handles card data)
- PII minimized (only essential data stored)

### In Code
- No secrets in code (environment variables)
- No logging of PII
- No exposed API keys
- Input sanitization

## API Security

### Supabase API
- Anon key is public (limited by RLS)
- Service role key is secret (server-side only)
- Rate limiting via Supabase settings
- CORS configured for production domain only

### Edge Functions
- Validate request origin
- Validate request body with Zod
- Authenticate via JWT (when needed)
- Rate limit sensitive endpoints (payment creation)
- Log all requests for audit

### Razorpay API
- Key ID is public (client-side)
- Key Secret is secret (server-side only)
- Webhook secret for signature verification
- All API calls authenticated

## Payment Security

### Flow
1. Client requests Razorpay order → Edge Function
2. Edge Function creates order with Razorpay API
3. Client receives order_id and opens Razorpay checkout
4. Razorpay handles card entry (PCI DSS compliant)
5. Payment result returned to client
6. Client sends result to Edge Function for verification
7. Edge Function verifies signature
8. Order created in database
9. Webhook confirms (server-side verification)

### Webhook Security
```typescript
// Validate webhook signature
function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(expected, signature);
}
```

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P0 | Data breach, payment compromise | Immediate |
| P1 | Authentication bypass, unauthorized access | 1 hour |
| P2 | Non-critical vulnerability | 24 hours |
| P3 | Best practice violation | 1 week |

### Response Steps
1. **Identify**: Alert from monitoring or external report
2. **Contain**: Revoke keys, pause services, block IPs
3. **Assess**: Determine scope, impact, and root cause
4. **Remediate**: Fix vulnerability, rotate credentials
5. **Report**: Document incident, notify affected parties
6. **Prevent**: Update policies, improve monitoring

## Compliance

- PCI DSS: Razorpay handles compliance (we never touch card data)
- GDPR: Data minimization, right to erasure, privacy policy
- CCPA: California resident rights
- Indian IT Act: Data localization, breach notification

## Security Checklist (Pre-Launch)

- [ ] HTTPS enforced (HSTS preload)
- [ ] CSP headers configured
- [ ] RLS policies tested for all tables
- [ ] Environment variables reviewed (no secrets in code)
- [ ] Dependencies audited (pnpm audit)
- [ ] Payment flow tested (create, verify, webhook)
- [ ] Authentication tested (login, session, logout)
- [ ] XSS vectors eliminated
- [ ] CSRF protection in place
- [ ] Rate limiting configured
- [ ] Error pages don't leak information
- [ ] .env in .gitignore
- [ ] Git history checked for secrets
- [ ] Third-party integrations reviewed
- [ ] Backup and recovery plan documented
