# Supabase Standards — House of Padmavati

## Database Design

### Naming Conventions
- Tables: `snake_case`, plural (`customers`, `orders`, `order_items`)
- Columns: `snake_case` (`first_name`, `created_at`)
- Primary keys: `id` (UUID, `gen_random_uuid()` default)
- Foreign keys: `{table_name}_id` (`customer_id`, `order_id`)
- Timestamps: `created_at`, `updated_at` (with triggers)
- Soft delete: `deleted_at` (nullable timestamp)

### Migration Standards
- One migration file per logical change
- File name: `YYYYMMDDHHmmss_description.sql`
- All migrations must be reversible (include down migration in comments)
- Never edit existing migrations after they've been applied
- Test migrations locally before deploying

```sql
-- 20260719000000_create_products.sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in paise
  compare_at_price INTEGER,
  images JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Down: DROP TABLE IF EXISTS products;
```

### Row Level Security (RLS)
- Enable RLS on all tables
- Create policies for each operation (SELECT, INSERT, UPDATE, DELETE)
- Storefront tables: public read, authenticated admin write
- Customer tables: own data only

```sql
-- Products: public read, admin write
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING (auth.role() = 'service_role');
```

## Client Usage

### Client Instantiation
```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

### Query Patterns
```typescript
// SELECT with type safety
const { data, error } = await supabase
  .from("products")
  .select("id, name, price, images")
  .eq("status", "active")
  .order("created_at", { ascending: false });

// Single row
const { data, error } = await supabase
  .from("products")
  .select("*")
  .eq("slug", slug)
  .single();

// INSERT
const { data, error } = await supabase
  .from("orders")
  .insert({ customer_id, total, status: "pending" })
  .select()
  .single();

// UPDATE
const { data, error } = await supabase
  .from("orders")
  .update({ status: "confirmed" })
  .eq("id", orderId);
```

### Edge Functions
```typescript
// Calling an Edge Function
const { data, error } = await supabase.functions.invoke(
  "create-razorpay-order",
  { body: { amount, currency, receipt } }
);
```

### Error Handling
```typescript
const { data, error } = await supabase
  .from("products")
  .select("*");

if (error) {
  console.error("Failed to fetch products:", error);
  throw new Error(`DatabaseError: ${error.message}`);
}

if (!data || data.length === 0) {
  return [];
}

return data;
```

## Security

- Never expose `service_role` key on the client
- Use RLS policies for all access control
- Validate all inputs server-side (Edge Functions)
- Use parameterized queries (Supabase SDK handles this)
- Rate limit auth endpoints via Supabase settings
- Enable MFA for admin accounts
- Rotate anon/service keys on a regular schedule
