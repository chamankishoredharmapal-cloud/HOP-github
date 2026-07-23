# Database Standards — House of Padmavati

> Consolidates: old `SUPABASE_STANDARDS.md` + RLS policy content from `security/`

## Naming

- Tables: snake_case, plural (`customers`, `orders`, `order_items`). Columns: snake_case (`first_name`).
- Primary keys: `id` (UUID, `gen_random_uuid()` default). Foreign keys: `{table}_id`. Timestamps: `created_at`, `updated_at` (with trigger). Soft delete: `deleted_at`.

## Migrations

- One file per logical change. Name: `YYYYMMDDHHmmss_description.sql`. Include down migration in comments. Never edit applied migrations.

```sql
-- 20260719000000_create_products.sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
  price INTEGER NOT NULL, status TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
-- Down: DROP TABLE IF EXISTS products;
```

## Row Level Security

Enable RLS on all tables. Policies per operation (SELECT, INSERT, UPDATE, DELETE).

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON products FOR SELECT USING (status = 'active' OR auth.role() = 'service_role');
CREATE POLICY "Admin write" ON products FOR INSERT WITH CHECK (auth.role() = 'service_role');
```

**Rule of thumb**: Public = SELECT only. Admin = full CRUD via service_role. Customer data = scoped to auth.uid(). Payments = service_role only.

## Client Usage

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

const { data, error } = await supabase.from("products").select("id,name,price").eq("status","active");
if (error) throw new Error(`DatabaseError: ${error.message}`);
return data ?? [];
```

## Edge Functions

```typescript
const { data, error } = await supabase.functions.invoke("create-razorpay-order", { body: { amount, currency, receipt } });
```

## Security

- Never expose service_role key client-side. Validate all inputs server-side. Use parameterized queries (Supabase SDK). Rate limit auth endpoints. Enable MFA for admin accounts. Rotate keys regularly.
