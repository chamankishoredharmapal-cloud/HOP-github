# Verification Report — {TICKET_ID} — {Title}

## Summary

{Outcome of verification: pass, fail, or partial.}

## Environment

| Attribute | Value |
|-----------|-------|
| Node version | {version} |
| npm version | {version} |
| OS | {OS} |
| Commit | {sha} |

## Dependency Check

| Package | Expected | Actual | Status |
|---------|----------|--------|--------|

## TypeScript

```bash
npx tsc --noEmit
```
{Output / result}

## Lint

```bash
npm run lint
```
{Output / result}

## Build

```bash
npm run build
```
{Output / result}

## Tests

```bash
npx playwright test
```
{Output / result}

## Runtime

{Console output check, performance check, accessibility check results.}

## Sign-off

| Role | Name | Date |
|------|------|------|
| Lead Engineer | | |
| Reviewer | | |
