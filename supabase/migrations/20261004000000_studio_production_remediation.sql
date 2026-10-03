-- =============================================================================
-- House of Padmavati — Studio Production Remediation
-- Migration: 20261004000000
--
-- Fixes confirmed production findings from Studio certification:
--   1. Atomic adjust_product_stock RPC with authorization and pessimistic locking
--   2. public.journal_articles table with RLS and initial seed
--   3. public.studio_activities table with admin RLS for shared audit trail
--   4. public.get_public_store_settings() RPC exposing safe brand/contact fields
-- =============================================================================

-- #############################################################################
-- 1. ATOMIC INVENTORY ADJUSTMENT RPC (adjust_product_stock)
-- #############################################################################

CREATE OR REPLACE FUNCTION public.adjust_product_stock(
  p_product_id     UUID,
  p_quantity       INTEGER,
  p_reason         TEXT,
  p_notes          TEXT DEFAULT NULL,
  p_allow_negative BOOLEAN DEFAULT FALSE
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_previous_stock INTEGER;
  v_new_stock      INTEGER;
BEGIN
  -- Strict authorization check:
  -- Allowed for:
  --   1) Direct DB / superuser (postgres)
  --   2) Service role (edge functions, webhooks)
  --   3) Authenticated admins (HOP Studio administrators via public.is_admin())
  IF NOT (current_user = 'postgres' OR auth.role() = 'service_role' OR public.is_admin()) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.'
      USING ERRCODE = '42501';
  END IF;

  -- Pessimistic locking: lock the target product row
  SELECT stock INTO v_previous_stock
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'product_not_found'
    );
  END IF;

  v_new_stock := v_previous_stock + p_quantity;

  IF NOT p_allow_negative AND v_new_stock < 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'insufficient_stock',
      'available', v_previous_stock,
      'requested', -p_quantity
    );
  END IF;

  UPDATE public.products
  SET stock = v_new_stock,
      updated_at = now()
  WHERE id = p_product_id;

  INSERT INTO public.inventory_history (
    product_id,
    change,
    previous_stock,
    new_stock,
    reason,
    notes,
    created_by,
    created_at
  ) VALUES (
    p_product_id,
    p_quantity,
    v_previous_stock,
    v_new_stock,
    p_reason,
    p_notes,
    auth.uid(),
    now()
  );

  RETURN jsonb_build_object(
    'success', true,
    'previous_stock', v_previous_stock,
    'new_stock', v_new_stock
  );
END;
$$;

-- Secure execution permissions
REVOKE EXECUTE ON FUNCTION public.adjust_product_stock(UUID, INTEGER, TEXT, TEXT, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.adjust_product_stock(UUID, INTEGER, TEXT, TEXT, BOOLEAN) TO authenticated, service_role;

-- #############################################################################
-- 2. JOURNAL ARTICLES TABLE (public.journal_articles)
-- #############################################################################

CREATE TABLE IF NOT EXISTS public.journal_articles (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT        NOT NULL UNIQUE,
  title        TEXT        NOT NULL,
  tag          TEXT        NOT NULL DEFAULT 'Weave',
  img          TEXT        NOT NULL,
  asset_path   TEXT,
  dek          TEXT        NOT NULL,
  content      TEXT,
  status       TEXT        NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_journal_articles_slug ON public.journal_articles (slug);
CREATE INDEX IF NOT EXISTS idx_journal_articles_status ON public.journal_articles (status);
CREATE INDEX IF NOT EXISTS idx_journal_articles_published_at ON public.journal_articles (published_at DESC);

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS trg_journal_articles_updated_at ON public.journal_articles;
CREATE TRIGGER trg_journal_articles_updated_at
  BEFORE UPDATE ON public.journal_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.journal_articles ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated visitors can view published articles
DROP POLICY IF EXISTS "journal_articles_public_read" ON public.journal_articles;
CREATE POLICY "journal_articles_public_read" ON public.journal_articles
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Studio administrators have full CRUD access
DROP POLICY IF EXISTS "journal_articles_admin_all" ON public.journal_articles;
CREATE POLICY "journal_articles_admin_all" ON public.journal_articles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed canonical initial articles from static collection if not already seeded
INSERT INTO public.journal_articles (slug, title, tag, img, asset_path, dek, content, status, published_at)
VALUES
  (
    'how-morning-light-reads-a-weave',
    'How morning light reads a weave.',
    'Light',
    '/src/assets/hop-fabric.jpg',
    'src/assets/hop-fabric.jpg',
    'On the soft hour between five and seven, when zari forgets to shine.',
    'On the soft hour between five and seven, when zari forgets to shine.\n\nField notes recorded from the looms and weavers of House of Padmavati.',
    'published',
    now() - INTERVAL '30 days'
  ),
  (
    'five-drapes-for-a-quiet-wedding',
    'Five drapes for a quiet wedding.',
    'Drape',
    '/src/assets/hop-collection-pattu.jpg',
    'src/assets/hop-collection-pattu.jpg',
    'An intimate ceremony asks for restraint — here are five.',
    'An intimate ceremony asks for restraint — here are five.\n\nField notes recorded from the looms and weavers of House of Padmavati.',
    'published',
    now() - INTERVAL '25 days'
  ),
  (
    'linen-and-the-art-of-doing-less',
    'Linen, and the art of doing less.',
    'Linen',
    '/src/assets/hop-collection-linen.jpg',
    'src/assets/hop-collection-linen.jpg',
    'Why our linens are washed, then washed again, then forgotten.',
    'Why our linens are washed, then washed again, then forgotten.\n\nField notes recorded from the looms and weavers of House of Padmavati.',
    'published',
    now() - INTERVAL '20 days'
  ),
  (
    'organza-in-the-rain',
    'Organza in the rain.',
    'Weather',
    '/src/assets/hop-collection-organza.jpg',
    'src/assets/hop-collection-organza.jpg',
    'Notes from a wet July afternoon in Pondicherry.',
    'Notes from a wet July afternoon in Pondicherry.\n\nField notes recorded from the looms and weavers of House of Padmavati.',
    'published',
    now() - INTERVAL '15 days'
  ),
  (
    'a-keepsake-card-printed-in-jasmine',
    'A keepsake card, printed in jasmine.',
    'Ritual',
    '/src/assets/hop-gift.jpg',
    'src/assets/hop-gift.jpg',
    'On the small ceremony of wrapping a gift.',
    'On the small ceremony of wrapping a gift.\n\nField notes recorded from the looms and weavers of House of Padmavati.',
    'published',
    now() - INTERVAL '10 days'
  ),
  (
    'padmavati-the-name-behind-the-house',
    'Padmavati — the name behind the house.',
    'House',
    '/src/assets/hop-hero.jpg',
    'src/assets/hop-hero.jpg',
    'A short letter to the woman who wove our world.',
    'A short letter to the woman who wove our world.\n\nField notes recorded from the looms and weavers of House of Padmavati.',
    'published',
    now() - INTERVAL '5 days'
  )
ON CONFLICT (slug) DO NOTHING;

-- #############################################################################
-- 3. STUDIO SHARED ACTIVITIES TABLE (public.studio_activities)
-- #############################################################################

CREATE TABLE IF NOT EXISTS public.studio_activities (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  action      TEXT        NOT NULL,
  entity_type TEXT        NOT NULL,
  entity_id   TEXT,
  entity_name TEXT        NOT NULL,
  user_email  TEXT,
  details     JSONB       DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_studio_activities_created_at
  ON public.studio_activities (created_at DESC);

ALTER TABLE public.studio_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "studio_activities_admin_all" ON public.studio_activities;
CREATE POLICY "studio_activities_admin_all" ON public.studio_activities
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- #############################################################################
-- 4. PUBLIC STORE SETTINGS PROJECTION RPC (get_public_store_settings)
-- #############################################################################

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
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_store_settings() TO anon, authenticated, service_role;
