# Folder Structure — House of Padmavati

> Moved from: old `architecture/FOLDER_STRUCTURE.md` (trimmed to key layout, removed naming table which is in `standards/CODING.md`)

## Top-Level

```
E:\HOP\
├── .ai/                 # AI Operating System v2 (you are here)
├── docs/                # Project documentation (ARCHITECTURE.md, BRAND_SYSTEM.md, etc.)
├── public/              # Static assets (fonts, images, robots.txt)
├── scripts/             # Build/deploy scripts
├── src/                 # Application source
├── supabase/            # Config, migrations, Edge Functions
├── vite.config.ts, tailwind.config.ts, tsconfig*.json, playwright.config.ts, eslint.config.js
└── package.json, pnpm-lock.yaml, pnpm-workspace.yaml
```

## `src/`

```
src/
├── __tests__/           # Playwright E2E tests (journeys/, features/, studio/, fixtures/)
├── App.tsx              # Root + providers + routes
├── assets/              # Static images
├── components/          # about/, hop/ (brand), layout/, ui/ (shadcn), ScrollToTop.tsx
├── contexts/            # CartContext.tsx, WishlistContext.tsx
├── data/                # Static data (collectionVideos.ts, journalArticles.ts)
├── features/            # Scaffolded: account/, checkout/, collections/, home/, journal/, products/
├── hooks/               # use-mobile, use-toast, useMetadata, usePayment
├── integrations/        # supabase/client.ts, supabase/types.ts (auto-generated)
├── lib/                 # utils.ts (cn()), razorpay.ts
├── pages/               # All route pages
├── services/            # collectionService, orderService, paymentService, productService
├── studio/              # Admin sub-app (components/, hooks/, pages/, services/, types/)
└── types/               # collection.ts, order.ts
```

## `supabase/`

```
supabase/
├── config.toml          # Project config
├── migrations/          # Timestamped SQL migrations
└── functions/           # Edge Functions: create-razorpay-order, verify-payment, razorpay-webhook, get-order-confirmation
```
