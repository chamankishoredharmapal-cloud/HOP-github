# Specification: Orders

## Purpose
Display order confirmation after purchase and provide order management for admin.

## Functional Requirements

### Storefront
- Order confirmation page: order number, items, shipping address, total, payment status
- Estimated delivery date
- "Continue Shopping" link
- Order lookup by order number + email (future)

### Admin Studio
- Orders list: table with order #, date, customer, total, status, payment status
- Sort by: date, total, status
- Filter by: status (pending, confirmed, shipped, delivered, cancelled), date range
- Search by: order number, customer email/name
- Pagination
- Order detail: customer info, shipping address, payment info, items, order timeline
- Status management: update order status with confirmation modal
- Status transitions: pending → confirmed → processing → shipped → delivered → cancelled
- Internal notes per order
- Export to CSV (future)

## User Journey (Storefront)
1. User completes payment → redirected to confirmation page
2. Sees order number, items, shipping address, delivery estimate
3. Clicks "Continue Shopping" → returns to homepage
4. (Future) User can look up order status by order number + email

## User Journey (Admin)
1. Admin logs into studio → navigates to Orders
2. Sees order list, applies filters, searches for specific order
3. Clicks order → sees full detail with timeline
4. Updates order status (e.g., "shipped") with confirmation
5. Adds internal note if needed

## Edge Cases
- Order not found → clear "Order not found" message
- Invalid order number format → validation error
- Status transition validation → can't go from "delivered" back to "pending"
- Payment pending → order shows as "pending payment"
- Cancelled order → cancellation reason displayed
- Large order list → efficient pagination, server-side filtering

## Acceptance Criteria
- Order confirmation: all details accurate, matches payment response
- Admin order list: sortable, filterable, searchable, paginated
- Status change: confirmation modal, updates in real-time
- Order timeline: accurate timestamps, clear status history
- Order detail: all required fields displayed
- Responsive: admin table usable on mobile (horizontal scroll)

## Analytics Events
- `order_confirmation_view` { order_id }
- `studio_order_view` { order_id }
- `studio_order_status_change` { order_id, old_status, new_status }

## Accessibility Requirements
- Order confirmation: clear heading, structured content
- Admin table: sortable headers with aria-sort, keyboard nav
- Status update: confirmation dialog with focus trap
- Timeline: semantic list or table

## Performance Targets
- Order confirmation: LCP < 2s (text, no hero images)
- Admin order list: paginated, server-side filtering
- Order detail: all data loaded in single query

## Future Expansion
- Order tracking page with carrier tracking number
- Email notifications on status change
- Customer order history page
- Reorder from past orders
- Return/refund management
- Print invoice / packing slip
