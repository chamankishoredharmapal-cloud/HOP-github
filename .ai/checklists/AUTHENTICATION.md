# Authentication Engineering Checklist

## Layout
- [ ] Login page (email/password)
- [ ] Forgot password flow
- [ ] Reset password flow
- [ ] Session management
- [ ] AuthGuard wrapper for protected routes

## Components
- [ ] LoginForm
- [ ] ForgotPasswordForm
- [ ] ResetPasswordForm
- [ ] AuthGuard (redirects to login if not authenticated)
- [ ] SessionTimeout warning (future)

## Supabase Auth Integration
- [ ] Email/password sign-in
- [ ] Password reset request
- [ ] Password reset confirmation
- [ ] Session refresh
- [ ] Auth state listener
- [ ] Sign out

## Security
- [ ] Rate limiting on login
- [ ] Strong password requirements (min 8 chars, mixed case)
- [ ] JWT token management
- [ ] Session timeout (configurable)
- [ ] No sensitive data in localStorage
- [ ] MFA support (future)

## Accessibility
- [ ] Login form: labels, error messages
- [ ] Password field: show/hide toggle
- [ ] Forgot password: clear instructions
- [ ] Error messages: helpful, not technical

## Testing
- [ ] E2E: login with valid credentials
- [ ] E2E: login with invalid credentials shows error
- [ ] E2E: forgot password flow
- [ ] E2E: reset password flow
- [ ] E2E: session persists on refresh
- [ ] E2E: logout works
- [ ] E2E: auth guard redirects unauthenticated users
