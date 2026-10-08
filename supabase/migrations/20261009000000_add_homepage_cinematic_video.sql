-- =============================================================================
-- House of Padmavati — Add Homepage Cinematic Video to Settings
-- Migration: 20261009000000_add_homepage_cinematic_video
-- Description: Extends settings table and RPC to include homepage cinematic video configuration
-- =============================================================================

-- 1. The settings table already exists with key-value JSONB structure
-- We just need to ensure the store_settings key can hold the new field
-- No schema change needed - JSONB is flexible

-- 2. Update the get_public_store_settings RPC to include homepage_cinematic_video
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

GRANT EXECUTE ON FUNCTION public.get_public_store_settings() TO anon, authenticated, service_role;

-- 3. Add check for media usage of homepage cinematic video
-- This will be handled in the media service checkMediaUsage function