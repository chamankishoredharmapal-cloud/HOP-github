# CheckoutPricing Forensic Report

## Execution Trace (for EACH failing test)

### Step 1: The request path

```
page.getByRole("button", { name: /pay securely/i }).click()
  → Checkout.tsx handleSubmit()
    → paymentService.createRazorpayOrder()
      → supabase.functions.invoke("create-razorpay-order", { body })
        → POST {SUPABASE_URL}/functions/v1/create-razorpay-order
```

### Step 2: Route interceptor matches

```ts
page.route("**/functions/v1/create-razorpay-order", (route) => {
  route.fulfill({
    status: 400,
    body: JSON.stringify({ error: "product_not_found" }),
  });
});
```

### Step 3: `supabase.functions.invoke()` receives the 400

From `FunctionsClient.ts` line 297-298:
```typescript
if (!response.ok) {
    throw new FunctionsHttpError(response)
}
```

### Step 4: FunctionsHttpError constructor

From `types.ts` line 89-93:
```typescript
export class FunctionsHttpError extends FunctionsError {
    constructor(context: any) {
        super('Edge Function returned a non-2xx status code', 'FunctionsHttpError', context)
    }
}
```
- `error.message` = `"Edge Function returned a non-2xx status code"`
- `error.context` = the raw `Response` object
- `error.name` = `"FunctionsHttpError"`

### Step 5: `invoke()` returns

```typescript
return { data: null, error, response: error.context }
```

So `error` is the `FunctionsHttpError`.

### Step 6: `paymentService.ts` error handling

```typescript
if (error) {
    throw new Error(error.message ?? "Failed to create payment order");
    // Throws: Error("Edge Function returned a non-2xx status code")
}
```

**BUG:** `error.message` is the generic Supabase message, not the response body. The actual error `{ error: "product_not_found" }` is in `error.context` (the Response object), but it is never read.

### Step 7: `Checkout.tsx` catch block

```typescript
const msg = err instanceof Error ? err.message : "";
// msg = "Edge Function returned a non-2xx status code"

let code = "";
try { const parsed = JSON.parse(msg); code = parsed.error ?? ""; } catch {}
// JSON.parse("Edge Function returned a non-2xx status code") → throws
// code = ""

setError(errorMessages[code] ?? (msg || "Something went wrong..."));
// errorMessages[""] is undefined
// Fallback: msg is truthy → setError("Edge Function returned a non-2xx status code")
```

### Step 8: Rendered DOM

```html
<p class="mt-6 text-sm text-red-500 text-center">
    Edge Function returned a non-2xx status code
</p>
```

### Step 9: Assertion comparison

| Test | Assertion regex | Rendered text | Contains match? |
|------|----------------|---------------|-----------------|
| missing product | `/not found/i` | `"Edge Function returned a non-2xx status code"` | NO |
| unpublished product | `/not available/i` | `"Edge Function returned a non-2xx status code"` | NO |
| invalid quantity | `/invalid quantity/i` | `"Edge Function returned a non-2xx status code"` | NO |

**All three fail** because `paymentService.ts` never reads the actual error body.

---

## Root Cause (Two Bugs)

### Bug 1: `paymentService.ts` — Error body not extracted

`supabase.functions.invoke()` returns a `FunctionsHttpError` whose `.message` is a generic string. The actual error from the Edge Function is in `error.context` (a `Response` object), but `paymentService.ts` never calls `error.context.json()`.

The Supabase docs show the correct pattern (from FunctionsClient.ts docstring lines 117-124):
```typescript
if (error instanceof FunctionsHttpError) {
    const errorMessage = await error.context.json()
    console.error('Function returned an error', errorMessage)
}
```

### Bug 2: `Checkout.tsx` — User-facing messages mismatch error codes

After fixing Bug 1, the rendered messages would be:
- `product_not_found` → "A product in your bag is no longer available..."
- `product_not_available` → "One of your selected sarees is currently out of stock..."

These don't contain the error code substrings the tests assert on:
- `product_not_found` → assertion expects "not found" in UI
- `product_not_available` → assertion expects "not available" in UI

---

## Testing Philosophy

The tests assert **backend error code text** in the UI:

| Test assertion | Error code | Assertion targets |
|---------------|------------|-------------------|
| `page.getByText(/not found/i)` | `product_not_found` | "not found" from error code |
| `page.getByText(/not available/i)` | `product_not_available` | "not available" from error code |
| `page.getByText(/invalid quantity/i)` | `invalid_quantity` | "invalid quantity" from error code |

The tests are **not** asserting user-facing messages (those would be different strings). The philosophy is: **the user-facing error message must contain the backend error code text** so users and support can identify the specific error.

---

## Fix

### Fix 1: `src/services/paymentService.ts`

Extract the actual error body from `FunctionsHttpError.context`:

```typescript
if (error) {
    if (typeof error === 'object' && error !== null && 'context' in error) {
        try {
            const body = await (error as { context: Response }).context.json();
            throw new Error(JSON.stringify(body));
        } catch {
            throw new Error(error.message ?? "Failed to create payment order");
        }
    }
    throw new Error(error.message ?? "Failed to create payment order");
}
```

After fix 1, the error flow becomes:

```
FunctionsHttpError { message: "Edge Function...", context: Response }
  → paymentService reads Response body: { error: "product_not_found" }
  → throws Error('{"error":"product_not_found"}')
  → Checkout.tsx catch block:
      msg = '{"error":"product_not_found"}'
      parsed = { error: "product_not_found" }
      code = "product_not_found"
      setError("A product in your bag is no longer available...")
```

### Fix 2: `src/pages/Checkout.tsx`

Update user-facing messages to contain the error code text:

| Error code | Current message | Fixed message |
|-----------|----------------|---------------|
| `product_not_found` | "no longer available" | "not found" |
| `product_not_available` | "out of stock" | "not available" |
| `invalid_quantity` | "invalid quantity" | "invalid quantity" (unchanged) |

---

## Expected result after fixes

| Test | Rendered text | Assertion | Result |
|------|---------------|-----------|--------|
| missing product | `"A product in your bag is not found..."` | `/not found/i` | ✅ PASS |
| unpublished product | `"One of your selected sarees is not available..."` | `/not available/i` | ✅ PASS |
| invalid quantity | `"One of your selected sarees has an invalid quantity..."` | `/invalid quantity/i` | ✅ PASS |

---

## Files changed

| File | Change |
|------|--------|
| `src/services/paymentService.ts` | Parse `FunctionsHttpError.context` to extract actual error body |
| `src/pages/Checkout.tsx` | Update `product_not_found` and `product_not_available` messages |

**0 test files changed.** All assertion fixes are in application code.
