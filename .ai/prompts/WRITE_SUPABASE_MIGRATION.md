# Write Supabase Migration Prompt

## Context
- Read `.ai/rules/SUPABASE_STANDARDS.md` for database conventions
- Read existing migrations in `supabase/migrations/` for style reference
- Read `src/integrations/supabase/types.ts` for existing type definitions

## Migration Specification

**Purpose**: [What this migration does]
**Tables affected**: [Table names]
**Changes**: [CREATE, ALTER, DROP, etc.]

## Steps

### 1. Plan the Migration

- Check existing schema for conflicts
- Plan backward compatibility
- Consider data migration needs
- Plan rollback (down migration)

### 2. Create Migration File

```bash
# Generate timestamp
Get-Date -Format "yyyyMMddHHmmss"
```

File: `supabase/migrations/{timestamp}_{description}.sql`

### 3. Write Migration

```sql
-- {timestamp}_{description}.sql
-- Description: [Brief description]
-- Backward compatible: [Yes/No]

-- Up Migration
BEGIN;

CREATE TABLE IF NOT EXISTS {table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  {column_name} {type} {constraints},
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "{policy_description}"
  ON {table_name}
  FOR SELECT
  USING (true);

-- Create index for performance
CREATE INDEX idx_{table_name}_{column} ON {table_name}({column});

COMMIT;

-- Down Migration
-- BEGIN;
-- DROP TABLE IF EXISTS {table_name};
-- COMMIT;
```

### 4. Regenerate Types

```bash
# After migration is applied
npx supabase gen types typescript --linked > src/integrations/supabase/types.ts
```

### 5. Update Type Definitions

```typescript
// Update src/integrations/supabase/types.ts if regenerated
// Or manually add new type definitions if not using auto-generation

// Add storefacing types in src/types/
export interface {TableName} {
  id: string;
  // ...
}
```

### 6. Update Service Layer

```typescript
// Update or create service files that interact with the new table
```

### 7. Verify
- [ ] Migration applies cleanly (no errors)
- [ ] Migration is reversible (down migration works)
- [ ] RLS policies are correct
- [ ] Indexes are appropriate for query patterns
- [ ] Types are updated
- [ ] Existing queries still work (backward compatibility)
- [ ] Test with sample data
