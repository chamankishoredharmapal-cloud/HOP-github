# Folder Structure — House of Padmavati

```
E:\HOP\
├── .ai/                           # AI Engineering Workspace (this directory)
│   ├── architecture/              # System architecture documents
│   ├── context/                   # AI project context and collaboration
│   ├── rules/                     # Coding and design standards
│   ├── prompts/                   # Reusable task prompts
│   ├── testing/                   # Testing strategy and guides
│   ├── performance/               # Performance optimization
│   ├── security/                  # Security architecture
│   ├── ux/                        # UX principles and guides
│   ├── reports/                   # Report templates
│   ├── templates/                 # Reusable templates
│   ├── checklists/                # Engineering checklists
│   └── playbooks/                 # Workflow playbooks
│
├── .env                           # Environment variables (gitignored)
├── .git/
├── .gitignore
├── components.json                # shadcn/ui configuration
├── dist/                          # Build output (gitignored)
├── docs/                          # Project documentation
│   ├── ARCHITECTURE.md
│   ├── BRAND_SYSTEM.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT.md
│   ├── EDITORIAL_SYSTEM.md
│   ├── PERFORMANCE.md
│   ├── QA_CHECKLIST.md
│   ├── ROADMAP.md
│   ├── SECURITY.md
│   ├── UI_DESIGN_SYSTEM.md
│   └── ...
├── eslint.config.js               # Flat ESLint config
├── HOP/                           # (workaround or lib submodule)
├── index.html                     # Vite entry HTML
├── package.json
├── playwright.config.ts            # Playwright E2E configuration
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.js
├── public/
│   ├── fonts/
│   ├── images/
│   └── robots.txt
├── scripts/                       # Build/deploy scripts
├── src/                           # Application source code
│   ├── __tests__/                 # Playwright E2E tests
│   ├── App.tsx                    # Root component with routing
│   ├── app/                       # App-level config (future)
│   ├── assets/                    # Static images
│   ├── components/                # Reusable components
│   │   ├── about/                 # About page components
│   │   ├── hop/                   # Brand-specific storefront components
│   │   ├── layout/                # Layout components (Header, Footer)
│   │   ├── motion/                # Animation/motion components (future)
│   │   ├── navigation/            # Navigation components (future)
│   │   └── ui/                    # shadcn/ui primitives (49 files)
│   ├── contexts/                  # React contexts
│   │   ├── CartContext.tsx
│   │   └── WishlistContext.tsx
│   ├── data/                      # Static data files
│   ├── design-tokens.css          # Design tokens (stub)
│   ├── design-tokens.ts           # Design tokens (stub)
│   ├── features/                  # Feature modules (scaffolded)
│   │   ├── account/
│   │   ├── checkout/
│   │   ├── collections/
│   │   ├── home/
│   │   ├── journal/
│   │   └── products/
│   ├── hooks/                     # Custom React hooks
│   ├── index.css                  # Tailwind + CSS custom properties
│   ├── integrations/              # Third-party integrations
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client
│   │       └── types.ts           # Auto-generated DB types
│   ├── lib/                       # Utilities
│   ├── main.tsx                   # React entry point
│   ├── pages/                     # Route page components
│   ├── services/                  # API service layer
│   ├── styles/                    # Additional styles (future)
│   ├── studio/                    # Admin panel (separate sub-app)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── types/                     # Shared TypeScript types
│
├── supabase/                      # Supabase configuration
│   ├── config.toml                # Supabase project config
│   ├── functions/                 # Edge Functions
│   │   ├── create-razorpay-order/
│   │   ├── get-order-confirmation/
│   │   ├── razorpay-webhook/
│   │   └── verify-payment/
│   └── migrations/                # SQL migrations (13 files)
│
├── tailwind.config.ts
├── tsconfig.json                  # Root TS config
├── tsconfig.app.json              # App TS config
├── tsconfig.node.json             # Node TS config
└── vite.config.ts                 # Vite configuration
```

## Naming Conventions

| Artifact | Convention | Example |
|----------|-----------|---------|
| React components | PascalCase | `HopHeader.tsx` |
| Page components | PascalCase | `ProductDetail.tsx` |
| Hooks | camelCase, `use` prefix | `usePayment.ts` |
| Services | camelCase | `productService.ts` |
| Contexts | PascalCase | `CartContext.tsx` |
| Types | PascalCase | `StorefrontProduct` |
| Test files | PascalCase | `CheckoutPricing.spec.ts` |
| CSS files | kebab-case | `design-tokens.css` |
| Directories (features) | lowercase | `checkout/`, `collections/` |
| Edge Functions | kebab-case | `create-razorpay-order/` |
| Migrations | timestamp prefix | `20260706000000_init.sql` |
