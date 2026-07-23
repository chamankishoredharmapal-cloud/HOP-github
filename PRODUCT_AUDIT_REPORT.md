# PRODUCT AUDIT REPORT

## 1. Code Quality

### Dead Code
- `src/app/` — Empty directory (0 files). Remove.
- `src/design-tokens.ts` — Empty file (0 lines). Remove.
- `src/features/` — Empty directory. Remove.
- **Duplicate `Monogram` import inconsistency**: `NotFound.tsx` imports default (`import Monogram`), `Index.tsx` and `Collections.tsx` import named (`import { Monogram }`). Both work but should be consistent.
- `src/hooks/use-toast.ts` — Shadcn boilerplate, unused (project uses `sonner` toast). Can remove.

### Unused Components
- All Shadcn UI components are generated boilerplate. While most are available for use, the following are imported but may be unused: `context-menu`, `menubar`, `resizable`, `toggle-group`, `hover-card`, `drawer`, `input-otp`, `pagination`, `calendar`, `chart`, `slider`, `switch`, `aspect-ratio`, `progress` (only used in studio ResetPassword), `scroll-area`, `collapsible`.

### Duplicate Components / Hooks
- Studio has its own `orderService.ts` and `collectionService.ts` parallel to `src/services/`. This is correct separation (admin vs storefront) but worth noting.
- No duplicate hooks detected.

### Empty State Gap
- `CustomerCare.tsx` contact form has **no `onSubmit` handler** — form submission does nothing.
- The Search icon in `HopHeader.tsx` has an `aria-label="Search"` and renders `<Search>` icon but has **no onClick handler** to open a search modal or input.

## 2. Data Flow Issues

### Product Data Type Mismatch
- `CartItem.productId` is typed as `string | undefined` in the reducer (used for API calls), but `useProducts.tsx:handleAddToCart` always passes `p.id`. The type allows undefined but runtime always provides it.

### Checkout State Persistence
- Cart persists to `localStorage`. After successful payment, `clearCart()` is called. If navigation fails before `clearCart`, cart state could be inconsistent. No critical issue.

### No Retry for Failed Image Loads
- Product images use `loading="lazy"` but no `onError` fallback. A missing image shows empty div with minimal text. This could be improved with a placeholder.

## 3. Navigation Gaps

| Route | Linked From | Status |
|---|---|---|
| `/gift` | ModernHeirlooms: "Begin a gift" button | Redirects to `/collections` |
| `/search` | Not linked (search icon does nothing) | ✗ |
| `/account` | Not linked | ✗ |
| `/orders` | Not linked | ✗ |
| `/studio/customers` | Studio sidebar | Placeholder |
| `/studio/media` | Studio sidebar | Placeholder |
| `/studio/settings` | Studio sidebar | Placeholder |

## 4. Responsive Issues

- Mobile menu (`HopHeader.tsx`) uses fixed positioning, but the backdrop doesn't trap focus. Keyboard users can tab behind the menu.
- Collection pages on very small screens (<360px): product cards may overflow due to `text-4xl` headings with no `text-balance` on some elements.
- Order detail page tables have `overflow-x-auto` which is correct.
- Inventory table has responsive columns (hidden on smaller screens).

## 5. Accessibility Issues

1. **No skip-to-content link** — keyboard users must tab through entire header.
2. **Mobile menu not keyboard accessible** — focus not trapped, Escape key not handled.
3. **Product gallery zoom controls** — zoom toggles on image click but `aria-pressed` is not used to communicate state.
4. **Sort dropdown** on Category page — uses native `<select>` which is accessible, but no accessible name on the label (uses plain text, not `<label htmlFor>`).
5. **Footer newsletter form** — `<input aria-label="Email">` is correct, but the submit button has no accessible name.
6. **Wishlist toggle** — `aria-label` correctly toggles between "Save to wishlist" / "Remove from wishlist".
7. **Header navigation** — has `aria-label` and `aria-current="page"` — good.

## 6. SEO Issues

- ✅ Canonical URLs present on all pages via `useMetadata`.
- ✅ JSON-LD on Home (Organization), Product (Product + BreadcrumbList), Category (BreadcrumbList).
- ❌ **No sitemap.xml** — critical for search engine indexing.
- ❌ **No robots.txt** — not blocking any paths.
- ❌ **No JSON-LD on collections, journal, about pages** (only product and homepage).

## 7. Missing Error Boundaries

- No React Error Boundary wrapping the app. A runtime error in any component will crash the entire page.
- Checkout page has try/catch error handling but no Error Boundary for unexpected crashes.

## 8. Payment Flow Issues

- Checkout page creates order on submit, then opens Razorpay. If user refreshes the Razorpay page, the order may be created but unpaid. No cancellation/recovery for abandoned orders.
- `order_zero_total` error message exists in error map but there's no guard against ₹0 orders.
- Razorpay key is loaded from edge function response — correct pattern.

## 9. Studio Admin Issues

### Missing CRUD operations
- No way to **delete** a product or collection from the workspace.
- No **bulk operations** (bulk status change, bulk archive).
- No **duplicate product** functionality.

### Customers module
- Entirely placeholder. For a real business, this must show customer list, order history per customer, contact info, etc.

### Media Library
- Entirely placeholder. Must show all uploaded assets, allow browsing, searching, reusing across products.

### Settings
- Entirely placeholder. Needs: store name, currency, shipping defaults, email config, payment gateway config, etc.

### Analytics
- Dashboard has basic metrics (revenue today, orders today). No charts, trends, period comparisons, product performance, or customer analytics.

## 10. Asset & Build

- ✅ TypeScript compiles cleanly.
- ✅ Vite production build passes.
- ✅ 10/14 Playwright tests passing (4 CheckoutPricing isolated).
- ⚠ `src/app/` and `src/features/` are empty — should be removed or populated.
