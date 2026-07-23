# Inventory Engineering Checklist

## Storefront

### Stock Display
- [ ] Stock status on product page
- [ ] "In Stock" with confidence
- [ ] "Low Stock" / "Only X left" (subtle, not urgent)
- [ ] "Currently Unavailable" / "Inquire Within" (luxury phrasing)
- [ ] Auto-disable "Add to Cart" when out of stock
- [ ] Back-in-stock notification (future)

### Stock Logic
- [ ] Reduce stock on order confirmation
- [ ] Prevent ordering out-of-stock items
- [ ] Handle backorders (if applicable)

## Admin Studio

### Inventory Management
- [ ] Inventory list view with all products
- [ ] Columns: Product name, SKU, Stock quantity, Low stock threshold, Status
- [ ] Sort by stock quantity (low to high)
- [ ] Filter by stock status (in stock, low stock, out of stock)
- [ ] Search by product name / SKU
- [ ] Inline quantity edit
- [ ] Bulk stock update (future)

### Stock Adjustments
- [ ] Manual stock adjustment (add/reduce)
- [ ] Reason for adjustment (purchase, return, damage, correction)
- [ ] Adjustment history log
- [ ] Low stock alert threshold (configurable per product)
- [ ] Email notification on low stock (future)

## Database

### Inventory Table
- [ ] product_id (FK to products)
- [ ] quantity (integer)
- [ ] low_stock_threshold (integer, default)
- [ ] sku (unique per variant)
- [ ] updated_at (timestamp)

### Inventory History Table
- [ ] inventory_id (FK)
- [ ] quantity_change (integer, positive or negative)
- [ ] previous_quantity
- [ ] new_quantity
- [ ] reason (text)
- [ ] created_by (admin user)
- [ ] created_at (timestamp)

### Triggers
- [ ] Auto-decrement on order confirmation
- [ ] Auto-increment on order cancellation
- [ ] Log all changes to inventory_history

## Testing
- [ ] E2E: stock status displays correctly
- [ ] E2E: "Add to Cart" disabled when out of stock
- [ ] E2E: admin inventory list loads
- [ ] E2E: stock adjustment works
- [ ] E2E: order placement reduces stock
- [ ] E2E: order cancellation restores stock
- [ ] E2E: inventory history logged correctly
