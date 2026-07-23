# Data Flow — House of Padmavati

## Storefront Data Flow

### Product Browsing Flow
```
[User visits collections page]
  → React Router resolves /collections/:slug
  → Collection page component mounts
  → useQuery('collection', slug) fires
  → collectionService.fetchCollectionBySlug(slug)
  → Supabase REST query (RLS: public read)
  → Returns collection + products
  → TanStack Query caches result
  → Component renders with loading/error/success states
```

### Cart Flow
```
[User clicks "Add to Cart"]
  → CartContext.dispatch({ type: 'ADD_ITEM', product })
  → useReducer updates state
  → useEffect persists to localStorage
  → All subscribed components re-render
  → Cart badge count updates
```

### Checkout Flow
```
[User completes checkout form]
  → React Hook Form validates with Zod schema
  → Form data submitted to handleSubmit
  → paymentService.createRazorpayOrder(cartItems, customerInfo)
  → Edge Function creates Razorpay order
  → Returns order_id + amount
  → Razorpay checkout modal opens
  → User completes payment
  → onSuccess callback fires
  → paymentService.verifyPayment(razorpay_payment_id, order_id, signature)
  → Edge Function verifies signature
  → Order created in database
  → Cart cleared
  → Redirect to OrderConfirmation page
```

### Payment Webhook Flow
```
[Razorpay sends webhook event]
  → Supabase Edge Function receives POST
  → Signature verified (HMAC SHA256)
  → Event type determined (payment.captured, order.paid)
  → Order status updated in database
  → Email confirmation triggered (future)
  → Response: 200 OK
```

## Admin Studio Data Flow

### Product CRUD Flow
```
[Admin opens ProductWorkspace]
  → AuthGuard checks authentication
  → React Router resolves /studio/products/:id
  → useQuery('product', id) fires
  → studio/productService.fetchProduct(id)
  → Supabase REST query (RLS: admin only, USING: role = 'admin')
  → Returns product data
  → Form populated with data
  → Admin edits and saves
  → useProductForm.handleSubmit
  → studio/productService.updateProduct(id, data)
  → Supabase UPDATE query
  → TanStack Query invalidated
  → Toast: "Product updated"
```

### Dashboard Data Flow
```
[Admin visits /studio]
  → React.lazy loads StudioDashboard
  → useDashboard hook fires multiple queries:
    - Total orders (today, this week, this month)
    - Revenue stats
    - Recent orders
    - Recent customers
    - Low stock alerts
  → dashboardService parallel queries
  → Recharts renders visualizations
```

## Data Validation Layers

```
┌─────────────────────────────────────┐
│ 1. Browser-side (Zod schemas)       │
│    - Form validation before submit  │
│    - URL params validation          │
├─────────────────────────────────────┤
│ 2. Service layer (TypeScript)       │
│    - Input type checking            │
│    - Response mapping               │
├─────────────────────────────────────┤
│ 3. Edge Functions (Deno)            │
│    - Payment signature verification │
│    - Webhook event validation       │
├─────────────────────────────────────┤
│ 4. Database (PostgreSQL)            │
│    - CHECK constraints              │
│    - Foreign key constraints        │
│    - RLS policies                   │
│    - NOT NULL / UNIQUE constraints  │
└─────────────────────────────────────┘
```

## Caching Strategy

| Layer | Strategy | Duration |
|-------|----------|----------|
| TanStack Query | Stale-while-revalidate | 5 minutes (products), 1 minute (orders) |
| Static assets | Vite content hash | Immutable |
| API responses | Supabase built-in caching | Varies |
| Client state | localStorage | Persistent |
| Images | Browser HTTP cache | 1 year (with hash) |
