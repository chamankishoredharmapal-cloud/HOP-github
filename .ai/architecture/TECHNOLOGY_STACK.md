# Technology Stack — House of Padmavati

## Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | ^18.3.1 | UI library |
| TypeScript | ^5.8.3 | Type safety |
| Vite | ^5.4.19 | Build tool and dev server |
| React Router DOM | ^6.30.1 | Client-side routing |
| TanStack React Query | ^5.83.0 | Server state management |
| React Hook Form | ^7.61.1 | Form state management |
| Zod | ^3.25.76 | Schema validation |
| Tailwind CSS | ^3.4.17 | Utility-first styling |
| shadcn/ui | Latest | Component library (Radix-based) |
| Radix UI Primitives | Various | Accessible headless components |
| Embla Carousel | ^8.6.0 | Carousel/slider |
| Recharts | ^2.15.4 | Charts (admin dashboard) |
| Sonner | ^1.7.4 | Toast notifications |
| Lucide React | ^0.462.0 | Icons |
| date-fns | ^3.6.0 | Date utilities |
| clsx + tailwind-merge | Latest | Class name utilities (`cn()`) |
| CVA | ^0.7.1 | Component variants |
| cmdk | ^1.1.1 | Command palette |
| Vaul | ^0.9.9 | Drawer component |
| next-themes | ^0.3.0 | Theme management |

## Backend

| Technology | Purpose |
|-----------|---------|
| Supabase PostgreSQL | Primary database |
| Supabase Auth | Authentication (admin studio) |
| Supabase Edge Functions | Serverless API endpoints (Deno) |
| Supabase Realtime | Real-time subscriptions (future) |
| Supabase Storage | Media assets (product images, journal) |
| Supabase Row Level Security | Database-level authorization |

## Payments

| Technology | Purpose |
|-----------|---------|
| Razorpay | Payment gateway |
| Razorpay Orders API | Order creation |
| Razorpay Payment Verification | Signature verification |
| Razorpay Webhooks | Server-side payment confirmation |

## Testing

| Technology | Purpose |
|-----------|---------|
| Playwright | End-to-end testing |
| @playwright/test | Test runner |
| Chromium (headless) | Browser target |

## Tooling

| Technology | Purpose |
|-----------|---------|
| ESLint 9 (flat config) | Code linting |
| TypeScript ESLint | Type-aware lint rules |
| PostCSS + Autoprefixer | CSS processing |
| pnpm | Package management |

## Infrastructure

| Service | Purpose |
|---------|---------|
| Supabase Cloud | Database, auth, functions, storage |
| Razorpay | Payment processing |
| Vercel / Netlify (planned) | Frontend hosting |
| Namecheap / GoDaddy (owned) | Domain registration |
