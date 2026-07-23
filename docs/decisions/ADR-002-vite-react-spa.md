# ADR-002: Monorepo with Vite + React SPA

**Date**: 2026-07-01

## Context
We needed a frontend framework that supports both a public storefront and an authenticated editorial workspace.

## Decision
Single Vite + React 18 SPA with client-side routing. Studio is a subdirectory under `src/studio/`.

## Rationale
- Single build artifact, simple deployment
- Share UI components and types between storefront and studio
- Vite provides fast HMR and tree-shaking
- React Router handles all routing client-side

## Consequences
- No SSR — static SPA only
- Route-level code splitting not yet implemented
- Studio and storefront share the same bundle
