# API Reference

The frontend communicates with Supabase exclusively through the JavaScript client (`@supabase/supabase-js`). There is no custom backend API layer.

## Supabase Client

```ts
import { supabase } from "@/integrations/supabase/client";

// Typed with generated Database types
supabase.from("orders").select("*")
```

**Configuration**:
- `auth.storage`: `localStorage`
- `auth.persistSession`: `true`
- `auth.autoRefreshToken`: `true`

## Storefront Services

### `src/services/collectionService.ts`

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `fetchCollections()` | GET | `/rest/v1/collections?status=eq.published&order=display_order.asc` | All published collections |
| `fetchFeaturedCollection()` | GET | `/rest/v1/collections?featured_on_homepage=eq.true&status=eq.published&order=display_order.asc&limit=1` | Featured collection for hero |
| `fetchCollectionBySlug(slug)` | GET | `/rest/v1/collections?slug=eq.{slug}&status=eq.published` | Single collection by URL slug |

### `src/services/productService.ts`

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `fetchProductById(id)` | GET | `/rest/v1/products?id=eq.{id}&status=eq.active&select=*,product_images(*)` | Active product with images |
| `fetchRelatedProducts(collectionId, excludeId, limit)` | GET | `/rest/v1/products?collection_id=eq.{coll}&id=neq.{exclude}&status=eq.active&limit={limit}&select=id,name,selling_price,slug,product_images(url)` | Related products |
| `fetchProductsByCollection(slug?)` | GET | `/rest/v1/products?collection.slug=eq.{slug}...` or all active | Products with hero image |

### `src/services/orderService.ts`

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `createOrder(input)` | POST | `/rest/v1/rpc/create_order` | Calls transactional RPC |

## Studio Services

### `src/studio/services/dashboardService.ts`

| Function | Table | Description |
|----------|-------|-------------|
| `fetchRevenueToday()` | `orders` | `SELECT total WHERE payment_status=paid AND created_at today → reduce sum` |
| `fetchOrdersToday()` | `orders` | `SELECT count WHERE created_at today` |
| `fetchPendingPayments()` | `orders` | `SELECT count WHERE status=pending_payment` |
| `fetchCustomerCount()` | `customers` | `SELECT count` |
| `fetchRecentOrders()` | `orders` | `SELECT ... customers!inner(full_name) → ORDER BY created_at DESC LIMIT 10` |
| `fetchRecentCustomers()` | `customers` | `SELECT ... ORDER BY created_at DESC LIMIT 10` |

### `src/studio/services/orderService.ts`

| Function | Table | Filters/Joins |
|----------|-------|---------------|
| `fetchOrdersMetrics()` | `orders` | 4 parallel count/sum queries |
| `fetchOrders()` | `orders` | `select("*")` without join — customer data omitted (use `fetchOrder(id)` for customer detail) |
| `fetchOrder(id)` | `orders`, `shipping_addresses`, `order_items`, `payments` | 3 parallel sub-queries after main query |
| `updateOrderStatus(id, status, additional?)` | `orders` | UPDATE status + optional fields |
| `updateShipping(id, {courier_name, tracking_number})` | `orders` | UPDATE shipping fields |
| `fetchOrdersSearch(query)` | `orders` | `order_number.ilike OR customers.full_name.ilike OR customers.email.ilike OR customers.phone.ilike` |

### `src/studio/services/productService.ts`

| Function | Description |
|----------|-------------|
| `fetchProducts()` | Products with `product_images( is_primary filter)` + collection name join |
| `fetchProduct(id)` | Single product with all images ordered by sort_order |
| `createProduct(data)` | INSERT into products |
| `updateProduct(id, data)` | UPDATE products |
| `updateProductStatus(id, status)` | UPDATE products SET status |
| `uploadImage(productId, file, isPrimary)` | Upload to `product-images` bucket + INSERT product_images row |
| `deleteImage(imageId)` | DELETE product_images + DELETE from storage |
| `reorderImages(productId, orderedIds)` | UPDATE sort_order for each image |
| `setPrimaryImage(imageId, productId)` | UPDATE is_primary (unset others, set target) |

### `src/studio/services/collectionService.ts`

| Function | Description |
|----------|-------------|
| `fetchAllCollections()` | All collections ordered by display_order |
| `fetchCollectionById(id)` | Single collection |
| `createCollection(data)` | INSERT |
| `updateCollection(id, data)` | UPDATE |
| `uploadCollectionFile(collectionId, file, type)` | Upload to `HOP-films` bucket |
| `deleteCollectionFile(url)` | DELETE from storage |

### `src/studio/services/inventoryService.ts`

| Function | Description |
|----------|-------------|
| `fetchInventoryMetrics()` | 5 aggregate metrics (total, in stock, low stock, out of stock, reserved) |
| `fetchInventoryList(search?, status?, sort?, dir?)` | Products with stock info, joins collections + product_images |
| `adjustStock(input)` | UPDATE products.stock + INSERT inventory_history in one operation |
| `fetchInventoryHistory(productId)` | All adjustments for a product, ordered by created_at DESC |

## Storage Buckets

| Bucket | Public | Used By |
|--------|--------|---------|
| `product-images` | Yes | Product image uploads |
| `HOP-films` | Yes | Collection hero images + videos |

## Auth Endpoints

| Function | Supabase Method |
|----------|----------------|
| `signIn(email, password)` | `supabase.auth.signInWithPassword()` |
| `signOut()` | `supabase.auth.signOut()` |
| `getSession()` | `supabase.auth.getSession()` |
| `getUser()` | `supabase.auth.getUser()` |
| `onAuthChange(callback)` | `supabase.auth.onAuthStateChange()` |
