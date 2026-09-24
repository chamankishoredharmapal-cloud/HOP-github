# Phase 3 — React & Application Engineering Audit

**Audit Timestamp**: 2026-08-16T05:23:00+05:30  

---

## 1. State Management & Consistency

### Cart Context (`CartContext.tsx`)
- **Pattern**: `useReducer` with initial state lazy-loaded via `loadCart()` from `localStorage`.
- **Integrity**: Actions `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART` are pure reducers.
- **Defensive Quantity Checks**: `UPDATE_QUANTITY` with quantity <= 0 filters the item out rather than producing negative or zero counts.
- **Currency Calculations**: `totalPrice` aggregates `price * quantity` and divides by 100 in paise to avoid floating-point drift.
- **Persistence**: `useEffect` updates `localStorage` whenever `state.items` changes.

### Wishlist Context (`WishlistContext.tsx`)
- **Pattern**: `useReducer` + `localStorage` with explicit `syncToSupabase(customerId)` helper.
- **De-duplication**: `ADD_ITEM` and `TOGGLE_ITEM` check `state.items.find(i => i.id === payload.id)` to prevent duplicates.

### Authentication State (`AuthContext.tsx` & `customerAuthService.ts`)
- **Session Management**: Listens to `supabase.auth.onAuthStateChange`.
- **Profile Synchronization**: Delegated to `upsert_customer_profile` RPC, avoiding client-side duplicate key exceptions.

---

## 2. React Query Configuration & Invalidation

- **Root Client (`src/App.tsx`)**: Instantiates `new QueryClient()`.
- **Hydration Boundary**: Mounts `<HydrationBoundary state={window.__REACT_QUERY_STATE__}>` allowing seamless SSG hydration without flash of unstyled content or empty states.
- **Post-Mutation Invalidation**:
  - `Checkout.tsx` calls `queryClient.invalidateQueries({ queryKey: ["storefront"] })` immediately upon payment confirmation.
  - Studio mutations systematically invalidate `["orders"]`, `["products"]`, `["inventory"]`.
- **Stale Overwrite Protection**: React Query deduplicates active queries; background refetches preserve cached UI while fetching fresh server data.

---

## 3. Form Validation & Resilience

### Checkout Form (`src/pages/Checkout.tsx`)
- **Controlled Inputs**: Managed via `form` state initialized with `EMPTY_FORM`.
- **Field Validation (`validate(form)`)**:
  - Validates non-empty string for `firstName`, `lastName`, `address`, `city`, `postalCode`, `country`.
  - Validates presence of `@` symbol in `email`.
- **Return Policy Mandate**: Native `required` checkbox for Return & Replacement Policy agreement (`returnPolicyAccepted`) prevents submission if unchecked.
- **Double Submit Prevention**:
  - `isProcessing` and `isPaymentProcessing` disable the "Pay Securely" button.
  - `validatedRef.current` tracks checkout pre-validation status.
  - Razorpay order ID is cached in component state (`orderId`), ensuring rapid double clicks or payment window reopenings reuse the existing order rather than creating duplicate orders.

---

## 4. Routing & Navigation Boundaries

- **Public Routes**:
  - `/`, `/collections`, `/collections/:slug`, `/product/:productId`, `/cart`, `/checkout`, `/order/confirmation/:orderNumber`, `/about`, `/customer-care`, `/privacy-policy`, `/terms-of-service`, `/shipping-policy`, `/returns-policy`, `/lookbook`, `/journal`.
- **Protected Studio Routes**:
  - Wrapped in `<StudioRoute>` auth guard.
  - Redirects unauthenticated users to `/studio/login`.
- **Error / 404 Route**:
  - `vercel.json` and static `dist/404.html` provide fallback to `index.html` for client-side routing resolution.
