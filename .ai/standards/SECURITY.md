# Security Standards — House of Padmavati

> Consolidates: old `SECURITY_STANDARDS.md` + `security/SECURITY_ARCHITECTURE.md` (principles only)

## Principles

1. **Defense in depth** — multiple layers. **Least privilege** — minimum access per role.
2. **Never trust user input** — validate everything (Zod on client + server).
3. **Never expose secrets** — no keys/tokens/credentials in code or git history.
4. **Fail securely** — errors don't leak information.

## Frontend

- All API calls over HTTPS. Supabase client handles CSRF. No sensitive data in URL params.
- React auto-escapes JSX — primary XSS defense. Never `dangerouslySetInnerHTML` unless sanitized with DOMPurify.
- Environment variables validated at startup:

```typescript
if (!import.meta.env.VITE_SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
```

## Payment Security

- Razorpay handles card data (PCI DSS Level 1). We never touch raw card numbers/CVV.
- Order creation and payment verification happen in Edge Functions — never on the client.
- Webhook signature validated with HMAC SHA256:

```typescript
const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
crypto.timingSafeEqual(expected, signature);
```

- See `reference/PAYMENT_FLOW.md` for complete payment flow.

## Authentication

- Supabase Auth (email/password). Strong passwords (min 8 chars, mixed case). Rate limit login attempts.
- MFA for admin accounts. JWT session management with automatic timeout.
- RLS on all tables (see `reference/RLS_POLICIES.md` for complete reference).

## Data Privacy

- Collect only data necessary for transaction. No tracking without consent.
- PII encrypted at rest (Supabase handles). Never log PII. Mask in admin interfaces.
- Right to erasure: data anonymization on request (orders retained for tax, anonymized).
- Breach notification within 72 hours.

## Infrastructure

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://checkout.razorpay.com; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

Regular `pnpm audit`. Dependabot for dependency updates. CodeQL scanning. Signed commits on main.

See `reference/PAYMENT_FLOW.md` for payment deep-dive.
See `reference/RLS_POLICIES.md` for complete RLS reference.
