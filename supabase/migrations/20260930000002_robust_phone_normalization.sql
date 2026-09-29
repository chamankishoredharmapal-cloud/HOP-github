-- =============================================================================
-- House of Padmavati — Robust Phone Normalization
-- Migration: 20260930000002
-- Description: Improve normalize_phone RPC to strip spaces/hyphens from phones
-- already carrying +91 prefix and support 0-prefixed 11-digit numbers.
-- =============================================================================

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
  
  -- If 10 digits, prepend +91
  IF length(v_digits) = 10 THEN
    RETURN '+91' || v_digits;
  END IF;

  -- If 11 digits starting with 0, drop leading 0 and prepend +91
  IF length(v_digits) = 11 AND v_digits LIKE '0%' THEN
    RETURN '+91' || substring(v_digits FROM 2);
  END IF;
  
  -- If 12 digits starting with 91, prepend +
  IF length(v_digits) = 12 AND v_digits LIKE '91%' THEN
    RETURN '+' || v_digits;
  END IF;
  
  -- Otherwise return as-is
  RETURN p_phone;
END;
$$;

GRANT EXECUTE ON FUNCTION normalize_phone(TEXT) TO authenticated, anon;
