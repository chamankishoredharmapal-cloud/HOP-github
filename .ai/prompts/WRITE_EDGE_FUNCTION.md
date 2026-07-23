# Write Edge Function Prompt

## Context
- Read existing Edge Functions in `supabase/functions/` for reference
- Read `.ai/rules/SUPABASE_STANDARDS.md` for Supabase conventions
- Read `.ai/rules/SECURITY_STANDARDS.md` for security requirements

## Edge Function Specification

**Name**: [function-name]
**Purpose**: [What this function does]
**HTTP Method**: [POST/GET/etc.]
**Request Body**: [Expected JSON structure]
**Response**: [Expected JSON structure]
**Authentication**: [Required/Not required, role requirements]

## Steps

### 1. Create Function

```bash
supabase functions new {function-name}
```

### 2. Implement

```typescript
// supabase/functions/{function-name}/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  // Define expected request body
}

interface ResponseBody {
  // Define response structure
}

serve(async (req) => {
  // 1. Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. Parse and validate request
    const body: RequestBody = await req.json();

    // 3. Authenticate (if needed)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 4. Process request
    // ...

    // 5. Return response
    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
```

### 3. Create Shared CORS Handler

```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
```

### 4. Test Locally

```bash
supabase functions serve {function-name} --env-file ./supabase/.env.local
```

### 5. Update Client Integration

```typescript
// In src/services/
const { data, error } = await supabase.functions.invoke(
  "{function-name}",
  { body: { /* request data */ } }
);
```

### 6. Verify
- [ ] Function works locally
- [ ] Input validation is thorough
- [ ] Error handling covers all paths
- [ ] Rate limiting considered
- [ ] CORS headers correct
- [ ] No secrets exposed in responses
- [ ] Logging for debugging
- [ ] Deployed successfully
