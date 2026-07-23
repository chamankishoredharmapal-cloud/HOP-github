# Data Flow — House of Padmavati

> Moved from: old `architecture/DATA_FLOW.md`

## Storefront

### Product Browsing
```
User → /collections/:slug → useQuery("collection") → collectionService.fetchBySlug() → Supabase SELECT → Cache → Render
```

### Cart (Client-Side)
```
Click "Add to Cart" → CartContext.dispatch(ADD_ITEM) → useReducer → localStorage → Badge update → All subscribers re-render
```

### Checkout + Payment
```
Submit form → RHF validates (Zod) → paymentService.createRazorpayOrder() → Edge Function → Razorpay API → Return order_id
→ Open Razorpay Checkout modal → User pays → paymentService.verifyPayment() → Edge Function verifies HMAC → Order in DB → Cart cleared → Confirmation page
```

### Payment Webhook
```
Razorpay → Edge Function → Signature verification (HMAC SHA256) → Event handling → Order status update → Response 200
```

## Admin Studio

### Product CRUD
```
Open workspace → useQuery("product") → studio/productService.fetchProduct() → Supabase SELECT (RLS: admin)
Save → useProductForm.handleSubmit → studio/productService.updateProduct() → Supabase UPDATE → Query invalidated → Toast
```

## Validation Layers
```
Zod (browser) → TypeScript (service) → Edge Function (server) → PostgreSQL (constraints + RLS)
```

## Caching
| Layer | Strategy | Duration |
|-------|----------|----------|
| TanStack Query | Stale-while-revalidate | 5 min (products), 1 min (orders) |
| Static assets | Content-hash | Immutable |
| Supabase API | Built-in | Varies |
| localStorage | Persistent | Until cleared |
| Browser images | HTTP cache | 1 year |
