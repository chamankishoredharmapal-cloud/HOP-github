# Orders Engineering Checklist

## Storefront

### Order Confirmation Page
- [ ] Order number displayed prominently
- [ ] Order items listed (image, name, price, quantity)
- [ ] Order total with breakdown
- [ ] Shipping address
- [ ] Payment status
- [ ] Estimated delivery date
- [ ] "Continue Shopping" link
- [ ] Order confirmation email trigger (future)

### Order Lookup (Future)
- [ ] Order lookup by order number + email
- [ ] Order status display
- [ ] Order tracking

## Admin Studio

### Orders List
- [ ] Data table with all orders
- [ ] Columns: Order #, Date, Customer, Total, Status, Payment
- [ ] Sort by date, total, status
- [ ] Filter by status (pending, confirmed, shipped, delivered, cancelled)
- [ ] Filter by date range
- [ ] Search by order number / customer email
- [ ] Pagination
- [ ] Export to CSV (future)

### Order Detail
- [ ] Order information (number, date, status)
- [ ] Customer information (name, email, phone)
- [ ] Shipping address
- [ ] Payment information (method, transaction ID, status)
- [ ] Order items (image, name, price, quantity)
- [ ] Order timeline (status history with timestamps)
- [ ] Status update action
- [ ] Internal notes

### Order Status Management
- [ ] Status options: pending → confirmed → processing → shipped → delivered → cancelled
- [ ] Status transition validation (can't go from delivered back to pending)
- [ ] Confirmation modal for status changes
- [ ] Notification to customer on status change (future)

## Database
- [ ] Orders table with all required fields
- [ ] Order items table
- [ ] Payment events table
- [ ] Order status history table
- [ ] RLS policies for orders

## Testing
- [ ] E2E: order confirmation page renders
- [ ] E2E: order list in admin loads
- [ ] E2E: order detail loads correctly
- [ ] E2E: order status update works
- [ ] E2E: filter orders by status
- [ ] E2E: search orders
- [ ] E2E: pagination
