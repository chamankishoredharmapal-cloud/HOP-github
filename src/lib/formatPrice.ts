/**
 * Single pricing primitive for the storefront.
 *
 * Server + product payloads carry paise (integer). The cart context derives
 * rupee totals (`totalPrice`). Two helpers, one locale, no second source:
 * use `formatPaise` for payload values and `formatRupees` for cart totals.
 */
export function formatPaise(paise: number): string {
  return `₹ ${(paise / 100).toLocaleString("en-IN")}`;
}

export function formatRupees(rupees: number): string {
  return `₹ ${rupees.toLocaleString("en-IN")}`;
}
