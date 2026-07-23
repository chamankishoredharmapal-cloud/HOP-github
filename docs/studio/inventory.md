# Studio: Inventory Workspace

## Overview

The Inventory workspace at `/studio/inventory` is the single source of truth for stock management. Every product's available stock is tracked via `products.stock`, and all adjustments are recorded in `inventory_history` for a complete audit trail.

## Dashboard Metrics

5 metric cards at the top of the page:

| Card | Query | Description |
|------|-------|-------------|
| Total Products | `COUNT(*) FROM products` | All products in the system |
| In Stock | `WHERE stock > low_stock_alert` | Products with healthy inventory |
| Low Stock | `WHERE stock > 0 AND stock <= low_stock_alert` | Products below threshold |
| Out of Stock | `WHERE stock = 0` | Products with no inventory |
| Reserved | `SUM(quantity) FROM order_items WHERE order NOT IN (cancelled, delivered, returned)` | Units in active orders |

## Product List

Searchable, filterable table with columns:
- Product Image (primary image or placeholder)
- Product Name (clickable to show adjustment history)
- SKU
- Collection
- Available Stock
- Status Badge (Healthy / Low Stock / Out of Stock)

### State Handling

| State | Display |
|-------|---------|
| Loading | 5 animated skeleton rows |
| Error | "Failed to load inventory." |
| Empty (no matches) | "No products match your search." |
| Empty (no products) | "No products in inventory." |

### Search & Filter

- Search input with 300ms debounce — searches `name` and `sku` via `ilike`
- Status filter buttons: All / Healthy / Low Stock / Out of Stock
- Sort dropdown: Name, SKU, or Stock (ascending/descending toggle)

## Stock Adjustments

Triggered by + and − buttons on each row. Opens a dialog:

| Field | Input | Details |
|-------|-------|---------|
| Mode | Toggle buttons | Add (+) or Remove (−) |
| Quantity | Number input | Min 1, max is current stock for removal |
| Reason | Select dropdown | Initial Stock, Purchase, Sale, Return, Damage, Manual Adjustment, Correction |
| Notes | Textarea | Optional free-text notes |

### Behavior

1. Adjustment is validated (quantity ≥ 1, removal ≤ current stock)
2. `products.stock` is updated atomically (never goes below 0)
3. An `inventory_history` record is created with: product_id, change, previous_stock, new_stock, reason, notes, timestamp
4. All inventory queries are invalidated to refresh the UI

### Reasons

| Reason | Use Case |
|--------|----------|
| `initial_stock` | First time setting stock for a new product |
| `purchase` | Received new inventory from supplier |
| `sale` | Customer purchase (deduction) |
| `return` | Customer return (addition) |
| `damage` | Damaged/write-off stock |
| `manual_adjustment` | General manual correction |
| `correction` | Fixing data entry errors |

## Adjustment History

Expandable section below the product table, shown when a product name is clicked. Columns:
- Date & Time
- Quantity Change (green for positive, red for negative)
- Previous Stock
- New Stock
- Reason (human-readable label)
- Notes (truncated)

## Low Stock Alerts

Threshold configurable per product via `low_stock_alert` field (in Product Workspace → Pricing section).

| Status | Condition | Badge Style |
|--------|-----------|-------------|
| Healthy | `stock > low_stock_alert` | Green (`bg-teal-deep/10 text-teal-deep`) |
| Low Stock | `0 < stock <= low_stock_alert` | Amber (`bg-sakura/20 text-ink`) |
| Out of Stock | `stock = 0` | Gray (`bg-muted text-muted-foreground`) |

Status is computed dynamically — no background job required.

## Product Integration

The Product Workspace (`/studio/products/:id`) displays an **Inventory** section below Pricing showing:
- Current stock count with status badge
- "Manage in Inventory" button linking to the inventory page

Initial stock and low stock alert thresholds are still set during product creation in the Pricing section. Post-creation adjustments should use the Inventory workspace.

## Data Flow

```
Inventory page
├── useInventoryMetrics() → fetchInventoryMetrics() → 5 metric cards
├── useInventoryList(query, filter, sort) → fetchInventoryList() → table
│   └── Sort by name/sku/stock, filter by status, search by name/sku
├── StockAdjustment Dialog
│   └── useAdjustStock() → adjustStock() → UPDATE products.stock + INSERT inventory_history
└── Adjustment History (per product)
    └── useInventoryHistory(productId) → fetchInventoryHistory() → history table
```
