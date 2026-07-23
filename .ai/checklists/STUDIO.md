# Studio Engineering Checklist

## Authentication & Authorization
- [ ] AuthGuard: redirects unauthenticated users to /studio/login
- [ ] Login page with form validation
- [ ] Session management (auto-refresh, timeout)
- [ ] Route protection for all /studio/* routes
- [ ] Logout functionality

## Layout
- [ ] StudioLayout with sidebar navigation
- [ ] Sidebar with all section links
- [ ] Top action bar with user info and logout
- [ ] Responsive: sidebar collapses on mobile
- [ ] Breadcrumb navigation (where applicable)

## Sidebar Sections
- [ ] Dashboard
- [ ] Products
- [ ] Collections
- [ ] Orders
- [ ] Customers
- [ ] Inventory
- [ ] Journal
- [ ] Media
- [ ] Settings
- [ ] Active section highlighting
- [ ] Collapsible on mobile

## Common Features
- [ ] Data tables with sort, filter, search
- [ ] Pagination controls
- [ ] Form components (reusable)
- [ ] File upload with preview
- [ ] Image management
- [ ] Rich text editor (for journal/descriptions)
- [ ] Status badges (colored)
- [ ] Action confirmation modals
- [ ] Toast notifications

## Performance
- [ ] All routes lazy-loaded
- [ ] Data table pagination (client or server)
- [ ] Debounced search inputs
- [ ] Optimistic UI updates
- [ ] Bundle split by route

## Accessibility
- [ ] Sidebar: keyboard navigation
- [ ] Data tables: keyboard sort, row selection
- [ ] Forms: labels, error messages
- [ ] Modals: focus trap, Escape to close
- [ ] Toast: aria-live polite

## Testing
- [ ] E2E: login flow
- [ ] E2E: navigation to all sections
- [ ] E2E: sidebar active state
- [ ] E2E: responsive sidebar behavior
- [ ] E2E: logout clears session
- [ ] E2E: auth guard on protected routes
