DO $$
DECLARE
  v_customers uuid[] := ARRAY['a0a858ba-a982-480a-92f9-eb97df4e86ad','2e2f333a-cb06-44b2-843f-804768f043cf']::uuid[];
  v_products uuid[] := ARRAY['5215d2f7-82b1-4b98-8d5b-e5d68e3bf034','3d123e03-be1b-4454-a0c3-14e809146d92']::uuid[];
BEGIN
  DELETE FROM public.product_images WHERE product_id = ANY(v_products);
  DELETE FROM public.products WHERE id = ANY(v_products);
  DELETE FROM public.payments WHERE order_id IN (SELECT id FROM public.orders WHERE customer_id = ANY(v_customers));
  DELETE FROM public.order_items WHERE order_id IN (SELECT id FROM public.orders WHERE customer_id = ANY(v_customers));
  DELETE FROM public.order_events WHERE order_id IN (SELECT id FROM public.orders WHERE customer_id = ANY(v_customers));
  DELETE FROM public.orders WHERE customer_id = ANY(v_customers);
  DELETE FROM public.shipping_addresses WHERE customer_id = ANY(v_customers);
  DELETE FROM public.customers WHERE id = ANY(v_customers);
END $$;