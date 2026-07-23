# Studio: Orders Workspace

## List Page — `/studio/orders`

| Feature | Implementation |
|---------|---------------|
| Metrics | 4 cards: Orders Today (count), Revenue Today (sum), Pending Payments (count), AOV (average) |
| Search | Input with 300ms debounce — searches `order_number` ilike, `customers.full_name` ilike, `customers.email` ilike, `customers.phone` ilike |
| Status tabs | 8 tabs: All, Pending Payment, Confirmed, Processing, Shipped, Delivered, Cancelled, Returned |
| Payment filter | Dropdown: All / Paid (`payment_status = 'paid'`) |
| Table | Columns: Order #, Customer, Status, Payment Status, Items, Total, Date, Actions (arrow-right to detail) |

### Data Flow

```
Orders page
├── useOrdersMetrics() → Promise.all([revenueToday, ordersToday, pendingPayments]) → 4 metric cards
├── useOrders(status, paymentFilter) → fetchOrders() with optional filters → table rows
└── search term → useOrdersSearch(query) → fetchOrdersSearch() → results replace table
```

## Detail Page — `/studio/orders/:id`

5 sections:

### 1. Customer Info
- `full_name`, `email`, `phone`

### 2. Order Items
- Table with: image thumbnail, product name, price, qty, subtotal

### 3. Shipping Address
- All address fields displayed
- Below: editable Courier Name + Tracking Number with Save button

### 4. Payments
- Amount, currency, status
- Razorpay payment & order IDs (when available)

### 5. Actions
Context-sensitive buttons based on current status:

| Current Status | Available Actions |
|----------------|-------------------|
| `pending_payment` | Confirm (→ confirmed) |
| `confirmed` | Pack (→ processing) |
| `processing` | Ship (→ shipped) |
| `shipped` | Deliver (→ delivered) |
| Any (not cancelled/delivered) | Cancel (with cancellation reason dialog) |

All actions use a confirmation dialog (`AlertDialog`) before executing.

### Data Flow

```
OrderDetail page
├── useOrder(id) → fetchOrder(id) → order + shipping_address + items + payments
├── useUpdateOrderStatus() → mutation with confirmation → invalidate order + orders + metrics queries
└── useUpdateShipping() → mutation → invalidate order query
```

## Hooks

| Hook | Query Key | Description |
|------|-----------|-------------|
| `useOrdersMetrics()` | `["studio", "orders", "metrics"]` | 4 aggregated metrics |
| `useOrders(status, payment)` | `["studio", "orders", status, payment]` | Filtered list |
| `useOrder(id)` | `["studio", "order", id]` | Full detail |
| `useUpdateOrderStatus()` | mutation | Status transition |
| `useUpdateShipping()` | mutation | Courier/tracking update |
| `useOrdersSearch(query)` | `["studio", "orders", "search", query]` | Debounced search |
