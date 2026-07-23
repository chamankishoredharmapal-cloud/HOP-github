# Project Context — House of Padmavati

## AI Models Must Read This File First

This document provides the complete context for any AI model working on this project.

## Project Identity

- **Brand**: House of Padmavati (HOP)
- **Description**: A digital sanctuary for heritage and contemporary luxury sarees. E-commerce storefront for premium Indian fashion.
- **Status**: Under active development
- **Stage**: Pre-production (building toward MVP/launch)

## Core Technology Stack

| Layer | Technology |
|-------|-----------|
| Build tool | Vite 5 + SWC |
| Language | TypeScript 5.8 |
| UI library | React 18 |
| Routing | React Router v6 |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix primitives) |
| Server state | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions, Storage) |
| Payments | Razorpay |
| Testing | Playwright (Chromium, headless) |
| Linting | ESLint 9 (flat config) |
| Package mgr | pnpm |

## Key Architectural Patterns

1. **Component structure**: PascalCase files, colocated styles (Tailwind), component-level hooks
2. **Data fetching**: TanStack Query in service modules, custom hooks for component consumption
3. **State management**: `useReducer` + `localStorage` for cart/wishlist; React Query for server data; React Hook Form for forms
4. **API layer**: Service files in `src/services/` for storefront, `src/studio/services/` for admin
5. **Routing**: `App.tsx` with `BrowserRouter`, lazy-loaded pages via `React.lazy`
6. **Admin studio**: Separate sub-app under `src/studio/` with `AuthGuard` + `StudioLayout`
7. **Payment flow**: Edge Functions create/verify Razorpay orders; webhook for server-side confirmation

## Route Structure

| Path | Component | Page Type |
|------|-----------|-----------|
| `/` | Index | Homepage |
| `/collections` | Collections | Collection listing |
| `/collections/:slug` | Category | Collection detail |
| `/product/:productId` | ProductDetail | Product page |
| `/cart` | Cart | Shopping cart |
| `/wishlist` | Wishlist | Saved items |
| `/checkout` | Checkout | Payment |
| `/order/confirmation/:orderNumber` | OrderConfirmation | Post-purchase |
| `/journal` | Journal | Editorial |
| `/journal/:slug` | JournalDetail | Article |
| `/about` | OurStory | Brand story |
| `/customer-care` | CustomerCare | Support |
| `/privacy-policy` | PrivacyPolicy | Legal |
| `/terms-of-service` | TermsOfService | Legal |
| `/studio/*` | (various) | Admin panel |

## Brand Design Language

- **Color palette**: Jasmine (warm off-white), Teal (muted), Sand (beige), Sakura (dusty rose), Ink (near-black)
- **Typography**: Cormorant Garamond (serif headings) + Inter (sans body)
- **Design principles**: Minimal, editorial, tactile, heritage-focused
- **Animations**: fade-in, fade-up, drift, kenburns (subtle, purposeful)

## Conventions AI Models Must Follow

1. **Use `@/` alias** for all imports within `src/`
2. **Use PascalCase** for component files, **camelCase** for services/hooks/utils
3. **Use `cn()` utility** from `@/lib/utils` for conditional class names
4. **Use Zod schemas** for all form validation
5. **Use React Hook Form** for all form components
6. **Use TanStack Query `useQuery`/`useMutation`** for all server data
7. **Name test files** `*.spec.ts` in `src/__tests__/`
8. **Use `data-testid`** for Playwright selectors (never CSS selectors)
9. **No default exports** except for pages and hooks
10. **All types/interfaces** go in `src/types/` or `src/studio/types/`

## Current Development Focus

- Storefront: Cart, checkout, payment integration
- Admin: Product/collection CRUD, order management, dashboard
- Testing: Playwright E2E for critical user journeys
- Infrastructure: Supabase migrations, Edge Functions, RLS policies

## Environment Variables (Required)

```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<supabase-anon-key>
VITE_RAZORPAY_KEY_ID=<razorpay-key-id>
```
