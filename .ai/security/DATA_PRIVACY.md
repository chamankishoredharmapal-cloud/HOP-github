# Data Privacy — House of Padmavati

## Data Collected

| Data | Purpose | Storage | Retention |
|------|---------|---------|-----------|
| Email address | Order confirmation | Database | 7 years (tax) |
| Name | Shipping label | Database | 7 years (tax) |
| Phone number | Delivery contact | Database | 7 years (tax) |
| Shipping address | Delivery | Database | 7 years (tax) |
| Order history | Customer service | Database | 7 years (tax) |
| Payment ID | Transaction record | Database | 7 years (tax) |
| IP address | Fraud prevention | Logs | 30 days |
| Browser info | Analytics, optimization | Analytics | 26 months |
| Cart items | Shopping experience | localStorage | Until cleared |

## Data Minimization

- Collect only data necessary for the transaction
- No social media data collection
- No location tracking (except IP)
- No browsing behavior tracking (except analytics)
- No marketing profiles without consent

## User Rights

### Right to Access
Users can request a copy of their data. Process:
1. User emails privacy@houseofpadmavati.com
2. Identity verified
3. Data exported within 30 days
4. Response sent securely

### Right to Rectification
Users can update their data:
1. Via order confirmation email link
2. By contacting customer care
3. Updates reflected within 24 hours

### Right to Erasure
Users can request data deletion:
1. User emails privacy@houseofpadmavati.com
2. Identity verified
3. Data anonymized within 30 days
4. Order data retained (tax requirement) but anonymized

### Right to Data Portability
Data provided in machine-readable format (JSON).

## Data Storage

### Database
- Supabase PostgreSQL (Mumbai region)
- Encryption at rest
- Automated backups (daily)
- Point-in-time recovery (7 days)
- Connection pooling with PgBouncer

### Logs
- Application logs: 30-day retention
- Error logs: 90-day retention
- Access logs: 6-month retention
- No PII in logs

### Analytics
- Privacy-preserving analytics
- IP anonymization
- No cross-site tracking
- Cookie consent required

## Cookie Usage

| Cookie | Type | Purpose | Duration |
|--------|------|---------|----------|
| Session | Essential | Auth state | Session |
| Cart | Essential | Cart items | 30 days |
| Analytics | Analytics | Usage stats | 26 months |
| Preference | Functional | Theme, currency | 1 year |

## Third-Party Data Sharing

| Partner | Data Shared | Purpose | Safeguards |
|---------|-------------|---------|------------|
| Razorpay | Order amount, receipt | Payment processing | PCI DSS, DPA |
| Supabase | All app data | Database hosting | DPA, SOC 2 |
| Vercel | Static assets | Hosting, CDN | DPA, SOC 2 |

## Breach Notification

In case of a data breach:
1. Identified and contained within 24 hours
2. Affected users notified within 72 hours
3. Regulatory bodies notified (if required)
4. Public disclosure (if significant)
5. Post-mortem report published
6. Preventive measures implemented

## Privacy-by-Design

- Privacy considered at every stage of development
- Data minimization: only collect what's needed
- Purpose limitation: data used only for stated purpose
- Storage limitation: data deleted when no longer needed
- Integrity and confidentiality: data protected at all stages
- Accountability: privacy documentation maintained
