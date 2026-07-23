# Sprint 4.3 Implementation Report — Customer Account Platform

**Status:** Complete  
**Date:** 2026-07-20  
**Branch:** (current working tree)  

## Summary

Built a full customer account platform covering authentication, profiles, address book, order history, wishlist persistence, customer dashboard, and session security — 7 modules across 14 new files, 4 modified files, and 1 SQL migration.

## Files Created (14)

| File | Module |
|---|---|
| `src/services/customerAuthService.ts` | 1 — Authentication service (signup, login, password reset, session) |
| `src/services/customerProfileService.ts` | 2 — Profile CRUD |
| `src/services/customerAddressService.ts` | 3 — Address book CRUD |
| `src/services/customerOrderService.ts` | 4 — Order history query |
| `src/services/customerWishlistService.ts` | 5 — Wishlist persistence |
| `src/contexts/AuthContext.tsx` | 1 — Auth context + provider |
| `src/components/account/ProtectedRoute.tsx` | 7 — Route guard for authenticated pages |
| `src/pages/account/AccountLayout.tsx` | 7 — Account layout with sidebar nav + Outlet |
| `src/pages/account/Login.tsx` | 1 — Customer sign in |
| `src/pages/account/Signup.tsx` | 1 — Customer registration |
| `src/pages/account/ForgotPassword.tsx` | 1 — Password reset request |
| `src/pages/account/ResetPassword.tsx` | 1 — New password form |
| `src/pages/account/Dashboard.tsx` | 6 — Account dashboard with stats + active orders |
| `src/pages/account/Profile.tsx` | 2 — Edit name / phone |
| `src/pages/account/Addresses.tsx` | 3 — Add / edit / delete addresses |
| `src/pages/account/OrderHistory.tsx` | 4 — Paginated order list |
| `src/pages/account/OrderDetail.tsx` | 4 — Single order view with items + shipping |
| `src/pages/account/WishlistPage.tsx` | 5 — Supabase-backed wishlist grid |
| `supabase/migrations/20260720000000_create_customer_wishlists.sql` | 5 — SQL migration with RLS policies |

## Files Modified (4)

| File | Change |
|---|---|
| `src/integrations/supabase/types.ts` | Added `customer_wishlists` table type |
| `src/App.tsx` | Added `AuthProvider`, account routes (login, signup, forgot/reset password, dashboard, profile, addresses, orders, wishlist) |
| `src/contexts/WishlistContext.tsx` | Added `syncToSupabase()` method to push localStorage wishlist to Supabase on login |
| `src/components/hop/HopHeader.tsx` | Added account icon link (User icon → `/account`) |

## Module Breakdown

### Module 1 — Authentication
- `customerAuthService.ts`: wraps `supabase.auth` with signup (auto-creates customer profile row), signin, signout, session, password reset, and auth state listener.
- `AuthContext.tsx`: React context providing `{ user, loading, signIn, signUp, signOut, resetPasswordForEmail, updatePassword }`.
- `Login.tsx`, `Signup.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`: fully responsive pages with loading, error, and success states.

### Module 2 — Profile
- `customerProfileService.ts`: `fetchProfile(customerId)`, `updateProfile(customerId, { full_name, phone })`.
- `Profile.tsx`: inline editing with optimistic update via React Query invalidation.

### Module 3 — Address Book
- `customerAddressService.ts`: `fetchAddresses`, `createAddress`, `updateAddress`, `deleteAddress`.
- `Addresses.tsx`: dialog-based CRUD, hover actions, empty state.

### Module 4 — Order History
- `customerOrderService.ts`: `fetchCustomerOrders` (summary list), `fetchCustomerOrderDetail` (with joined shipping address + items).
- `OrderHistory.tsx`: list with status badges.
- `OrderDetail.tsx`: full order view with shipping address, items table, and order summary.

### Module 5 — Wishlist Persistence
- `customerWishlistService.ts`: `fetchWishlistProductIds`, `addToWishlist`, `removeFromWishlist`.
- `WishlistContext.syncToSupabase()`: pushes local wishlist to Supabase on login.
- `WishlistPage.tsx`: Supabase-backed grid with remove button.

### Module 6 — Customer Dashboard
- `Dashboard.tsx`: greeting + stats cards (orders, wishlist, addresses) + active orders list.

### Module 7 — Session & Security
- `ProtectedRoute.tsx`: redirects unauthenticated users to `/account/login` with return-to redirect.
- All 8 account routes under `/account/*` wrapped with `<ProtectedRoute>`.
- RLS policies on `customer_wishlists` table restrict CRUD to owning customer.
- Email verification required for signup (Supabase handles this).

## Architecture Decisions

1. **Separate auth service**: Customer auth is distinct from studio auth — dedicated `customerAuthService.ts` avoids coupling with studio's permission system.
2. **Profile auto-creation on signup**: The `customers` table row is created during `signUp()` via upsert, so profile row always exists.
3. **Wishlist dual persistence**: LocalStorage (anonymous) + Supabase (authenticated). `syncToSupabase()` merges on login.
4. **Shadcn UI components**: Uses existing Button, Input, Label, Alert, Dialog, Skeleton components. No new UI primitives.
5. **React Query**: All data fetching uses `useQuery`/`useMutation` for caching, auto-refetch, and optimistic updates.
6. **Nested routing**: Account pages use a layout route (`AccountLayout` with `<Outlet>`) for consistent sidebar navigation.

## Future Considerations

- **Order status notifications**: Can add a polling mechanism for in-progress orders.
- **Social login**: Extend `customerAuthService` with OAuth providers.
- **Address geocoding**: Integrate with pincode API for auto-fill city/state.
- **Wishlist merge**: Handle conflicts when localStorage wishlist differs from Supabase data on sign-in.
