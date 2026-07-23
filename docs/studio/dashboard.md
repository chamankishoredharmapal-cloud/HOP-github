# Studio: Dashboard

## Components

### `DashboardCard` (`src/studio/components/DashboardCard.tsx`)
Reusable metric card with label, value, icon, optional trend. Used for all 4 dashboard metrics.

### `RecentOrders` (`src/studio/components/RecentOrders.tsx`)
Table widget showing last 10 orders with customer name, status, amount. Links to order detail.

### `RecentCustomers` (`src/studio/components/RecentCustomers.tsx`)
List widget showing last 10 customers with name, email, registration date.

## Services

All queries in `dashboardService.ts`:

| Query | Returns | Filter |
|-------|---------|--------|
| `fetchRevenueToday()` | `number` (paise) | `payment_status=paid AND created_at::date=now()` |
| `fetchOrdersToday()` | `number` | `created_at::date=now()` |
| `fetchPendingPayments()` | `number` | `status=pending_payment` |
| `fetchCustomerCount()` | `number` | none (all customers) |
| `fetchRecentOrders()` | `OrderWithCustomer[]` | `created_at DESC limit 10` with `customers!inner(full_name)` join |
| `fetchRecentCustomers()` | `Customer[]` | `created_at DESC limit 10` |

## Data Flow

```
Dashboard page → useQuery(["dashboard", ...]) → dashboardService → Supabase → metrics displayed in DashboardCard
Dashboard page → useQuery(["dashboard", "recentOrders"]) → dashboardService → Supabase → RecentOrders table
Dashboard page → useQuery(["dashboard", "recentCustomers"]) → dashboardService → Supabase → RecentCustomers list
```
