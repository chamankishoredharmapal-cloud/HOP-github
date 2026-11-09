-- Harden product_images public read: only images of published products are public.
-- Admins retain full access via product_images_admin_all.

DROP POLICY IF EXISTS product_images_read_public ON public.product_images;

CREATE POLICY product_images_read_published_public
ON public.product_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.products p
    WHERE p.id = product_images.product_id
      AND p.status = 'published'::public.product_status
  )
  OR public.is_admin()
);
