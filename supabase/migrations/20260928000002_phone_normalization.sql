-- =============================================================================
-- House of Padmavati — Phone Normalization
-- Migration: 20260928000002
-- Description: Add phone normalization with CHECK constraint for +91XXXXXXXXXX format
-- =============================================================================

-- 1. Update existing phone numbers to normalized format FIRST (before constraints)
-- This handles all common Indian phone number formats
UPDATE customers
SET phone = CASE
  -- Already in +91 format: leave as-is
  WHEN phone LIKE '+91%' THEN phone
  -- 10 digits: prepend +91
  WHEN regexp_replace(phone, '[^0-9]', '', 'g') ~ '^[0-9]{10}$' THEN '+91' || regexp_replace(phone, '[^0-9]', '', 'g')
  -- 11 digits starting with 0: remove 0, prepend +91
  WHEN regexp_replace(phone, '[^0-9]', '', 'g') ~ '^0[0-9]{10}$' THEN '+91' || substring(regexp_replace(phone, '[^0-9]', '', 'g') from 2)
  -- 12 digits starting with 91: prepend +
  WHEN regexp_replace(phone, '[^0-9]', '', 'g') ~ '^91[0-9]{10}$' THEN '+' || regexp_replace(phone, '[^0-9]', '', 'g')
  -- 11 digits starting with 91: prepend + (edge case)
  WHEN regexp_replace(phone, '[^0-9]', '', 'g') ~ '^91[0-9]{9}$' THEN '+' || regexp_replace(phone, '[^0-9]', '', 'g')
  -- Otherwise leave as-is (will be caught by CHECK constraint if invalid)
  ELSE phone
END
WHERE phone IS NOT NULL;

UPDATE shipping_addresses
SET phone = CASE
  WHEN phone LIKE '+91%' THEN phone
  WHEN regexp_replace(phone, '[^0-9]', '', 'g') ~ '^[0-9]{10}$' THEN '+91' || regexp_replace(phone, '[^0-9]', '', 'g')
  WHEN regexp_replace(phone, '[^0-9]', '', 'g') ~ '^0[0-9]{10}$' THEN '+91' || substring(regexp_replace(phone, '[^0-9]', '', 'g') from 2)
  WHEN regexp_replace(phone, '[^0-9]', '', 'g') ~ '^91[0-9]{10}$' THEN '+' || regexp_replace(phone, '[^0-9]', '', 'g')
  WHEN regexp_replace(phone, '[^0-9]', '', 'g') ~ '^91[0-9]{9}$' THEN '+' || regexp_replace(phone, '[^0-9]', '', 'g')
  ELSE phone
END
WHERE phone IS NOT NULL;

-- 2. Add CHECK constraint for phone format on customers table
-- Format: +91XXXXXXXXXX (12 characters: +91 followed by 10 digits)
ALTER TABLE customers
ADD CONSTRAINT customers_phone_format_check
CHECK (phone IS NULL OR phone ~ '^\+91[0-9]{10}$');

-- 3. Add CHECK constraint for phone format on shipping_addresses table
ALTER TABLE shipping_addresses
ADD CONSTRAINT shipping_addresses_phone_format_check
CHECK (phone IS NULL OR phone ~ '^\+91[0-9]{10}$');

-- 4. Create phone normalization function for reuse
CREATE OR REPLACE FUNCTION normalize_phone(p_phone TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_digits TEXT;
BEGIN
  IF p_phone IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Remove all non-digits
  v_digits := regexp_replace(p_phone, '[^0-9]', '', 'g');
  
  -- If already in +91 format, return as-is
  IF p_phone LIKE '+91%' THEN
    RETURN p_phone;
  END IF;
  
  -- If 10 digits, prepend +91
  IF length(v_digits) = 10 THEN
    RETURN '+91' || v_digits;
  END IF;
  
  -- If 12 digits starting with 91, prepend +
  IF length(v_digits) = 12 AND v_digits LIKE '91%' THEN
    RETURN '+' || v_digits;
  END IF;
  
  -- Otherwise return as-is (will be caught by CHECK constraint if invalid)
  RETURN p_phone;
END;
$$;

-- Grant execute on normalize_phone
GRANT EXECUTE ON FUNCTION normalize_phone(TEXT) TO authenticated;