# Emergency Response Playbook — House of Padmavati

## Overview

Response procedures for production emergencies (P0/P1 incidents).

## Emergency Types

| Type | Definition | Examples |
|------|------------|----------|
| P0 — Critical | System down, data loss, payment failure | Site unreachable, orders failing, security breach |
| P1 — High | Major feature broken, performance degradation | Cart not working, checkout broken, slow loading |

## Response Team

| Role | Responsibility | Primary |
|------|---------------|---------|
| Incident Commander | Leads response, coordinates team | Project lead |
| Technical Lead | Root cause analysis, fix development | Lead developer |
| Communicator | Status updates, stakeholder communication | PM or lead |
| Scribe | Timeline logging, documentation | On-call developer |

## Response Steps

### Phase 1: Detect & Triage (First 15 minutes)

**1.1 Acknowledge**
- [ ] Confirm the incident (verify it's real, not false alarm)
- [ ] Determine severity (P0 or P1)
- [ ] Notify the response team
- [ ] Create incident channel (Slack/Discord)

**1.2 Initial Assessment**
- [ ] What's the impact? (users affected, features broken)
- [ ] Is there a workaround?
- [ ] Can we reproduce it?
- [ ] Is it ongoing or intermittent?

**1.3 Declare**
```
INCIDENT DECLARED: [Brief description]
Severity: P0/P1
Impact: [affected users/features]
Time: [UTC timestamp]
Commander: [name]
```

### Phase 2: Contain (15-60 minutes)

**2.1 Immediate Actions**
- [ ] Consider rolling back recent deployment
  ```bash
  # Vercel rollback
  vercel rollback
  
  # Supabase rollback (if migration)
  supabase db diff --linked
  ```
- [ ] Consider disabling affected feature (feature flag)
- [ ] Consider scaling up resources (if performance)
- [ ] Block further deployments

**2.2 Mitigate**
- [ ] Apply temporary fix or workaround
- [ ] Route traffic away from affected region (if applicable)
- [ ] Rate limit or throttle (if under attack)

### Phase 3: Resolve (1-4 hours)

**3.1 Root Cause Analysis**
- [ ] Check recent deployments (what changed?)
- [ ] Check logs (application, server, database)
- [ ] Check monitoring dashboards
- [ ] Check error tracking (Sentry)
- [ ] Reproduce the issue

**3.2 Develop Fix**
- [ ] Create hotfix branch from `main`
- [ ] Write fix
- [ ] Test thoroughly
- [ ] Code review (fast-track)
- [ ] Merge to `main`

**3.3 Deploy Fix**
- [ ] Deploy frontend fix
- [ ] Deploy database fix (if applicable)
- [ ] Deploy Edge Function fix (if applicable)
- [ ] Verify in production

### Phase 4: Recover (After Fix)

**4.1 Verify**
- [ ] Confirm the issue is resolved
- [ ] Monitor for 30 minutes
- [ ] Check related features for regressions
- [ ] Restore normal operations

**4.2 Communicate**
```markdown
INCIDENT RESOLVED: [Brief description]
Duration: [X] hours
Root Cause: [summary]
Fix: [summary]
Status: All systems operational
```

### Phase 5: Post-Mortem (Within 1 week)

**5.1 Document**
- [ ] Complete incident report (`.ai/reports/INCIDENT_REPORT.md`)
- [ ] Timeline of events
- [ ] Root cause analysis
- [ ] What went well
- [ ] What went wrong
- [ ] Action items

**5.2 Action Items**
- [ ] Fix process gaps
- [ ] Add monitoring / alerts
- [ ] Add tests to prevent recurrence
- [ ] Update runbooks
- [ ] Schedule follow-up review

## Communication Templates

### Initial Alert
```
🚨 INCIDENT: [Brief description]
Severity: [P0/P1]
Impact: [What's broken, how many users]
Started: [Time]
Status: Investigating
Commander: [Name]
```

### Status Update (every 30 min)
```
🔍 Status Update #[number]
Incident: [ID]
What we know: [summary]
What we're doing: [actions]
ETA: [estimate]
```

### Resolution
```
✅ INCIDENT RESOLVED
Incident: [ID]
Duration: [X] hours
Root Cause: [summary]
Action Items: [link to post-mortem]
```

## Recovery Checklist

- [ ] Service fully operational
- [ ] No data loss (or recovered)
- [ ] Payment processing verified
- [ ] All user-facing features work
- [ ] Monitoring shows normal metrics
- [ ] No lingering side effects
- [ ] Stakeholders notified
