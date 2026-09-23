-- Update test user credentials and confirmation on staging
UPDATE auth.users 
SET 
  encrypted_password = crypt('StagingTestPass123!', gen_salt('bf')),
  email_confirmed_at = now(),
  raw_user_meta_data = jsonb_build_object('full_name', 'Staging Customer', 'email_verified', true, 'phone_verified', false)
WHERE email = 'staging_test_customer@gmail.com';

-- Ensure customers profile exists in public.customers
INSERT INTO public.customers (id, email, full_name, phone)
VALUES (
  '09b9c5c9-b5d1-48fe-8be0-59f8fb2c70a7',
  'staging_test_customer@gmail.com',
  'Staging Customer',
  '+919876543210'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone;
