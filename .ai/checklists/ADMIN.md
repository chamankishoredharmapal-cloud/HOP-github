# Admin Studio Engineering Checklist

## Dashboard
- [ ] Summary cards (orders, revenue, customers, products)
- [ ] Recent orders list
- [ ] Revenue chart (Recharts)
- [ ] Low stock alerts
- [ ] Navigation to all sections
- [ ] Loading state: skeleton cards
- [ ] Error state: retry per widget

## Products
- [ ] Product list with pagination
- [ ] Product search/filter
- [ ] Create product form
- [ ] Edit product form
- [ ] Product status toggle (draft/active/archived)
- [ ] Media/image management
- [ ] Inventory tracking
- [ ] Form validation
- [ ] Auto-save (optional)

## Collections
- [ ] Collection list
- [ ] Create collection form
- [ ] Edit collection form
- [ ] Product assignment to collections
- [ ] Collection ordering

## Orders
- [ ] Order list with filters (status, date range)
- [ ] Order detail view
- [ ] Order status update
- [ ] Customer information display
- [ ] Payment information display
- [ ] Order notes (internal)

## Customers
- [ ] Customer list
- [ ] Customer detail (orders, contact info)
- [ ] Search by email/name/phone

## Settings
- [ ] Store information
- [ ] Payment settings
- [ ] Shipping settings
- [ ] Tax settings
- [ ] Email settings (future)

## Common Components
- [ ] DataTable with sort/filter/pagination
- [ ] Form fields (Text, Select, Date, File upload)
- [ ] Modal/Dialog for confirmations
- [ ] Toast notifications for actions
- [ ] Loading spinners per section
- [ ] Empty state: "No data yet"
- [ ] Error state: retry button

## Performance
- [ ] Lazy-loaded routes
- [ ] Paginated data tables
- [ ] Optimistic updates for fast feedback
- [ ] Debounced search inputs

## Testing
- [ ] E2E: dashboard loads with correct data
- [ ] E2E: product CRUD
- [ ] E2E: collection CRUD
- [ ] E2E: order management
- [ ] E2E: customer list/search
- [ ] E2E: form validation
- [ ] E2E: pagination across all lists
- [ ] E2E: search filtering
