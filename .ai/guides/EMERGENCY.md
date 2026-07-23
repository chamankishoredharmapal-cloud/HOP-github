# Emergency Response — House of Padmavati

> From: old `playbooks/EMERGENCY_RESPONSE.md`

## Severity

| Level | Definition | Response Time |
|-------|------------|---------------|
| P0 | Site down, data loss, payment failure | Immediate |
| P1 | Major feature broken, severe perf degradation | 1 hour |

## Response Steps

### Phase 1: Detect & Triage (15 min)
- Confirm incident, determine severity, notify team
- Create incident channel, assign commander
- Initial assessment: impact, workaround, reproducibility

### Phase 2: Contain (15-60 min)
- Rollback recent deployment (`vercel rollback`)
- Disable affected feature (feature flag)
- Scale resources if performance
- Block further deployments

### Phase 3: Resolve (1-4 hours)
- Check recent changes, logs, monitoring, error tracking
- Develop fix on hotfix branch from `main`
- Test thoroughly, fast-track review
- Merge to main, deploy, verify

### Phase 4: Post-Mortem (within 1 week)
- Document timeline, root cause, impact
- Action items: prevent recurrence, add monitoring, update runbooks
- Update `memory/known-bugs.md` and `memory/technical-debt.md`

## Communication Templates

**Alert**: `INCIDENT: [desc] | Severity: P0/P1 | Impact: [what/whom] | Status: Investigating`
**Update**: `Status Update #[N]: [what we know] / [what we're doing] / [ETA]`
**Resolved**: `INCIDENT RESOLVED: [desc] | Duration: [X]h | Root Cause: [summary]`
