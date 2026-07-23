# Security Standards — House of Padmavati

## Principles

1. **Defense in depth** — multiple layers of security
2. **Least privilege** — minimum access required for each role
3. **Never trust user input** — validate everything
4. **Never expose secrets** — no keys, tokens, or credentials in code
5. **Fail securely** — errors should not leak information

## Frontend Security

### Environment Variables
```typescript
// All secrets come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Validate at startup
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}
```

### Input Validation
```typescript
// All user input validated with Zod
const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Invalid phone number"),
  address: z.string().min(10, "Address must be complete"),
});

// NEVER trust raw input
const rawInput = new URLSearchParams(window.location.search);
const validated = checkoutSchema.parse(rawInput);
```

### XSS Prevention
- React auto-escapes JSX (primary defense)
- Never use `dangerouslySetInnerHTML` unless absolutely necessary
- If using `dangerouslySetInnerHTML`, sanitize with DOMPurify
- Never interpolate user input into URLs without validation

```typescript
// AVOID
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// If necessary, sanitize first
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

### API Communication
- All API calls over HTTPS
- Supabase client handles CSRF protection
- Edge Functions validate request origin
- No sensitive data in URL params

## Payment Security

### Razorpay Integration
```typescript
// Order creation on server side (Edge Function)
const { data, error } = await supabase.functions.invoke(
  "create-razorpay-order",
  { body: { amount, currency: "INR", receipt: orderId } }
);

// Payment verification on server side
const { data, error } = await supabase.functions.invoke(
  "verify-payment",
  { body: { razorpay_payment_id, razorpay_order_id, razorpay_signature } }
);

// NEVER verify payments on the client
```

### Webhook Security
- Verify webhook signature on every event
- Validate event payload before processing
- Use a webhook secret stored as environment variable
- Respond 200 quickly, process asynchronously
- Log all webhook events for audit

### PCI Compliance
- Never store raw card numbers
- Never store CVV codes
- Use Razorpay's hosted checkout (no custom card forms)
- Razorpay is PCI DSS Level 1 compliant

## Authentication Security

### Supabase Auth
- Email/password for admin accounts
- Enforce strong passwords (min 8 chars, mixed case, numbers)
- Rate limit login attempts
- Session management with HTTP-only cookies (future)
- MFA for admin accounts (enable in Supabase)

### RLS Policies
```sql
-- Every table must have RLS enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access"
  ON products FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Admin write access"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Customer data isolation
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);
```

## Data Privacy

### PII Protection
- Encrypt PII at rest (Supabase handles this)
- Never log PII (names, emails, addresses, phone numbers)
- Mask PII in admin interfaces (partial display)
- Implement data retention and deletion policies
- Right to erasure (GDPR compliance)

### API Responses
```typescript
// Never return sensitive fields to the client
const { data, error } = await supabase
  .from("customers")
  .select("id, first_name, last_name") // NO: email, phone, address hash
  .eq("id", customerId);
```

## Infrastructure Security

### Headers
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' https://*.supabase.co data:; connect-src 'self' https://*.supabase.co https://api.razorpay.com; frame-src https://checkout.razorpay.com
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Dependencies
- Regular dependency audits: `pnpm audit`
- Keep dependencies updated (use Dependabot/Renovate)
- Pin exact versions in package.json
- Review new dependencies for supply chain risk
- No packages with known vulnerabilities

## Incident Response

### Security Incident Workflow
1. **Detect** — monitoring alerts, user reports, automated scanning
2. **Contain** — isolate affected systems, revoke compromised keys
3. **Assess** — determine scope, impact, and root cause
4. **Remediate** — fix vulnerability, rotate keys, restore from backup
5. **Report** — document incident, notify affected users if required
6. **Prevent** — update policies, add monitoring, improve tests

### Contact
- Security issues: security@houseofpadmavati.com (future)
- Emergency: contact project lead directly
