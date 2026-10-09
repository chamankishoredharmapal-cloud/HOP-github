-- HOP Phase 2: Content Pipeline & Settings Remediation Migration
-- Reconciles shipping rate settings, updates get_public_store_settings(), and aligns create_order()

-- 1. Update legacy scalar standard_shipping_cost to ₹99 (9900 paise)
UPDATE public.settings
SET value = '9900'
WHERE key = 'standard_shipping_cost';

-- 2. Update canonical store_settings standard_rate to ₹99 if it exists
UPDATE public.settings
SET value = jsonb_set(
  value,
  '{shipping,standard_rate}',
  '99'::jsonb
)
WHERE key = 'store_settings'
  AND value ? 'shipping';

-- 3. Update public store settings RPC to expose standard_shipping_rate (in ₹) safely
CREATE OR REPLACE FUNCTION public.get_public_store_settings()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings JSONB;
BEGIN
  SELECT value INTO v_settings
  FROM public.settings
  WHERE key = 'store_settings';

  IF v_settings IS NULL THEN
    RETURN jsonb_build_object(
      'brand', jsonb_build_object(
        'store_name', 'House of Padmavati',
        'tagline', 'To the woman who wove my world.',
        'business_email', 'concierge@houseofpadmavati.com',
        'business_address', 'Bangalore, Karnataka'
      ),
      'contact', jsonb_build_object(
        'instagram_url', 'https://instagram.com/houseofpadmavati',
        'pinterest_url', 'https://pinterest.com/houseofpadmavati',
        'support_email', 'concierge@houseofpadmavati.com',
        'support_phone', '',
        'whatsapp_number', '',
        'atelier_address', 'Bangalore, Karnataka'
      ),
      'shipping', jsonb_build_object(
        'standard_shipping_rate', 99,
        'free_shipping_threshold', 5000,
        'currency', 'INR'
      ),
      'homepage_cinematic_video', jsonb_build_object(
        'video_url', '',
        'poster_url', '',
        'alt_text', 'House of Padmavati — Homepage cinematic film'
      )
    );
  END IF;

  RETURN jsonb_build_object(
    'brand', jsonb_build_object(
      'store_name', COALESCE(v_settings->'brand'->>'store_name', 'House of Padmavati'),
      'tagline', COALESCE(v_settings->'brand'->>'tagline', 'To the woman who wove my world.'),
      'business_email', COALESCE(v_settings->'brand'->>'business_email', 'concierge@houseofpadmavati.com'),
      'business_address', COALESCE(v_settings->'brand'->>'business_address', 'Bangalore, Karnataka')
    ),
    'contact', jsonb_build_object(
      'instagram_url', COALESCE(v_settings->'contact'->>'instagram_url', 'https://instagram.com/houseofpadmavati'),
      'pinterest_url', COALESCE(v_settings->'contact'->>'pinterest_url', 'https://pinterest.com/houseofpadmavati'),
      'support_email', COALESCE(v_settings->'contact'->>'support_email', 'concierge@houseofpadmavati.com'),
      'support_phone', COALESCE(v_settings->'contact'->>'support_phone', ''),
      'whatsapp_number', COALESCE(v_settings->'contact'->>'whatsapp_number', ''),
      'atelier_address', COALESCE(v_settings->'contact'->>'atelier_address', 'Bangalore, Karnataka')
    ),
    'shipping', jsonb_build_object(
      'standard_shipping_rate', COALESCE((v_settings->'shipping'->>'standard_rate')::numeric, 99),
      'free_shipping_threshold', COALESCE((v_settings->'shipping'->>'free_shipping_threshold')::numeric, 5000),
      'currency', COALESCE(v_settings->'shipping'->>'currency', 'INR')
    ),
    'homepage_cinematic_video', jsonb_build_object(
      'video_url', COALESCE(v_settings->'homepage_cinematic_video'->>'video_url', ''),
      'poster_url', COALESCE(v_settings->'homepage_cinematic_video'->>'poster_url', ''),
      'alt_text', COALESCE(v_settings->'homepage_cinematic_video'->>'alt_text', 'House of Padmavati — Homepage cinematic film')
    )
  );
END;
$$;

-- Grant EXECUTE to anon and authenticated for public storefront reads
GRANT EXECUTE ON FUNCTION public.get_public_store_settings() TO anon, authenticated;

-- 4. Reconcile create_order() to use canonical standard shipping cost
CREATE OR REPLACE FUNCTION public.create_order(
  p_customer_email TEXT,
  p_customer_full_name TEXT,
  p_customer_phone TEXT,
  p_shipping_recipient_name TEXT,
  p_shipping_phone TEXT,
  p_shipping_address TEXT,
  p_shipping_city TEXT,
  p_shipping_state TEXT,
  p_shipping_postal_code TEXT,
  p_shipping_country TEXT DEFAULT 'India',
  p_shipping_landmark TEXT DEFAULT NULL,
  p_shipping_option TEXT DEFAULT 'standard',
  p_notes TEXT DEFAULT NULL,
  p_items JSONB DEFAULT NULL,
  p_amount INTEGER DEFAULT NULL,
  p_payment_model TEXT DEFAULT 'full'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_order_id UUID;
  v_order_number TEXT;
  v_order_total INTEGER;
  v_shipping_cost INTEGER := 0;
  v_subtotal INTEGER;
  v_shipping_address_id UUID;
  v_address_snapshot JSONB;
  v_eligibility JSONB;
  v_standard_shipping_cost INTEGER := 9900;
  v_is_deposit BOOLEAN := false;
BEGIN
  -- Validate inputs
  IF p_customer_email IS NULL OR p_customer_full_name IS NULL OR p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'missing_required_fields';
  END IF;

  -- Get standard shipping cost from settings (canonical store_settings -> standard_rate in ₹ converted to paise)
  SELECT COALESCE(
    (value->'shipping'->>'standard_rate')::NUMERIC * 100,
    9900
  )::INTEGER INTO v_standard_shipping_cost
  FROM settings
  WHERE key = 'store_settings';

  IF v_standard_shipping_cost IS NULL OR v_standard_shipping_cost = 0 THEN
    SELECT COALESCE(value::INTEGER, 9900) INTO v_standard_shipping_cost
    FROM settings
    WHERE key = 'standard_shipping_cost';
  END IF;

  IF v_standard_shipping_cost IS NULL OR v_standard_shipping_cost = 0 THEN
    v_standard_shipping_cost := 9900;
  END IF;

  -- Check first-order eligibility
  v_eligibility := check_first_order_eligibility(p_customer_email, p_customer_phone);
  
  -- Find or create customer
  INSERT INTO customers (email, full_name, phone)
  VALUES (p_customer_email, p_customer_full_name, p_customer_phone)
  ON CONFLICT (LOWER(email)) DO UPDATE SET full_name = EXCLUDED.full_name
  RETURNING id INTO v_customer_id;

  -- Create shipping address (always create new for historical immutability)
  INSERT INTO shipping_addresses (
    customer_id, recipient_name, phone, address, city, state, postal_code, country, landmark
  ) VALUES (
    v_customer_id, p_shipping_recipient_name, p_shipping_phone, p_shipping_address,
    p_shipping_city, p_shipping_state, p_shipping_postal_code, p_shipping_country, p_shipping_landmark
  ) RETURNING id INTO v_shipping_address_id;

  -- Build address snapshot for immutable historical record
  v_address_snapshot := jsonb_build_object(
    'recipient_name', p_shipping_recipient_name,
    'phone', p_shipping_phone,
    'address', p_shipping_address,
    'city', p_shipping_city,
    'state', p_shipping_state,
    'postal_code', p_shipping_postal_code,
    'country', p_shipping_country,
    'landmark', p_shipping_landmark
  );

  -- Calculate order totals
  SELECT COALESCE(SUM(p.selling_price * i.quantity), 0) INTO v_subtotal
  FROM jsonb_array_elements(p_items) AS i(item)
  JOIN products p ON p.id = (i.item->>'product_id')::UUID;

  -- Calculate shipping cost based on option AND first-order eligibility
  CASE p_shipping_option
    WHEN 'express' THEN v_shipping_cost := 20000; -- ₹200
    WHEN 'standard' THEN 
      -- Free shipping for first-order eligible customers, otherwise standard cost
      IF (v_eligibility->>'eligible')::BOOLEAN THEN
        v_shipping_cost := 0;
      ELSE
        v_shipping_cost := v_standard_shipping_cost;
      END IF;
    ELSE v_shipping_cost := 0;
  END CASE;

  v_order_total := v_subtotal + v_shipping_cost;

  -- Determine payment model
  IF p_amount IS NOT NULL AND p_amount > 0 AND p_amount < v_order_total THEN
    -- Explicit deposit amount provided
    IF p_amount != 20000 THEN
      RAISE EXCEPTION 'invalid_deposit_amount';
    END IF;
    IF v_order_total <= 20000 THEN
      RAISE EXCEPTION 'order_total_too_low';
    END IF;
    v_is_deposit := true;
  END IF;

  -- Generate order number
  SELECT generate_order_number() INTO v_order_number;

  -- Create order with address snapshot and shipping cost
  INSERT INTO orders (
    customer_id, shipping_address_id, order_number, status, payment_status,
    subtotal, shipping_cost, total, notes, shipping_address_snapshot
  ) VALUES (
    v_customer_id, v_shipping_address_id, v_order_number, 'pending_payment', 'pending',
    v_subtotal, v_shipping_cost, v_order_total, p_notes, v_address_snapshot
  ) RETURNING id INTO v_order_id;

  -- Create order items
  INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, image_url)
  SELECT 
    v_order_id,
    (i.item->>'product_id')::UUID,
    p.name,
    p.selling_price,
    (i.item->>'quantity')::INTEGER,
    p.image_url
  FROM jsonb_array_elements(p_items) AS i(item)
  JOIN products p ON p.id = (i.item->>'product_id')::UUID;

  -- Reserve inventory
  PERFORM adjust_product_stock(
    (i.item->>'product_id')::UUID,
    - (i.item->>'quantity')::INTEGER,
    'order_created',
    v_order_id
  ) FROM jsonb_array_elements(p_items) AS i(item);

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total', v_order_total,
    'subtotal', v_subtotal,
    'shipping_cost', v_shipping_cost,
    'first_order_eligible', (v_eligibility->>'eligible')::BOOLEAN,
    'first_order_reason', v_eligibility->>'reason'
  );
END;
$$;

-- Grant EXECUTE on create_order to authenticated
GRANT EXECUTE ON FUNCTION public.create_order(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, INTEGER, TEXT
) TO authenticated;
