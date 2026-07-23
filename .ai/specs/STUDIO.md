# Specification: Studio (Admin Application)

## Purpose
Serve as the complete admin interface for House of Padmavati, providing authentication, navigation, and a consistent layout for all admin operations.

## Functional Requirements

### Authentication & Authorization
- Login page (email/password via Supabase Auth)
- Forgot password / reset password flow
- AuthGuard wrapper that redirects unauthenticated users to /studio/login
- Session management (JWT, automatic refresh, timeout)
- Logout (clear session, redirect to login)

### Layout
- Persistent sidebar navigation (collapsible on mobile)
- Top action bar: current user avatar/name, logout button
- Main content area (swaps between sections)
- Responsive: sidebar collapses to hamburger on mobile

### Sidebar Sections
- Dashboard, Products, Collections, Orders, Customers, Inventory, Journal, Media, Settings
- Active section highlighting
- Order count badge (optional)

### Common Features
- Data tables with sort, filter, search, pagination
- Form components (reusable field types)
- File/image upload with preview
- Rich text editor (journal, product descriptions)
- Status badges (colored by status)
- Confirmation modals for destructive actions
- Toast notifications for all mutations

## User Journey
1. Admin visits /studio → redirected to /studio/login
2. Logs in with email/password → redirected to dashboard
3. Sidebar shows all sections, dashboard highlighted
4. Clicks "Products" → product list loads
5. Uses search, finds product, edits, saves → toast
6. Clicks "Orders" → order list loads
7. Processes order, updates status → toast
8. Logs out → returned to login page

## Edge Cases
- Session expired → redirect to login, return to previous page after login
- Network error during data fetch → error state with retry per section
- Concurrent sessions → last login wins (notify on conflict)
- Mobile usage → sidebar becomes hamburger, table horizontal scroll
- Very long content → proper truncation, tooltips

## Acceptance Criteria
- Login: form validation, error handling, session creation
- AuthGuard: redirects unauthenticated, allows authenticated
- Sidebar: all sections visible, active highlight, collapsible
- Top bar: shows user, logout works
- All sections: lazy-loaded, loading state, error state
- Responsive: usable on tablet and mobile
- Consistent UI: same table, form, button patterns everywhere

## Analytics Events
- `studio_login_attempt`
- `studio_login_success`
- `studio_login_failure`
- `studio_logout`
- `studio_section_view` { section_name }
- `studio_session_expired`

## Accessibility Requirements
- Login form: labels, error messages, keyboard submit
- Sidebar: keyboard navigation, aria-expanded for collapse
- Data tables: keyboard sort, accessible row actions
- Modals: focus trap, Escape, aria-labelledby
- Toasts: aria-live polite
- Color-coded statuses: add text labels for color-only indicators

## Performance Targets
- Login: < 2s (Auth API call)
- Sidebar navigation: instant (all sections lazy-loaded)
- Dashboard: < 2s load time (parallel queries)
- Table pages: < 1s response (paginated API)
- Lighthouse Performance >= 90

## Future Expansion
- Multi-role access (admin, editor, support)
- Activity log / audit trail
- Dark mode toggle
- Keyboard shortcuts
- Bulk operations (select all, batch update)
- Customizable dashboard widgets
- Two-factor authentication
