-- Fix missing profile for caleb@lance.live
-- Run this in Supabase SQL Editor

-- 1. Create a tenant for this user
INSERT INTO public.tenants (name)
VALUES ('Lance Organization')
RETURNING id;

-- Note the tenant ID from above, then use it below (or run as a transaction)

-- 2. Create the user profile (replace YOUR_TENANT_ID with the ID from step 1)
WITH new_tenant AS (
  INSERT INTO public.tenants (name)
  VALUES ('Lance Organization')
  RETURNING id
)
INSERT INTO public.user_profiles (user_id, tenant_id, role)
SELECT
  '15ddee83-4692-4b6c-9d14-94295f0b9682'::uuid,
  id,
  'owner'
FROM new_tenant;

-- 3. Create a dealership for this tenant
WITH user_tenant AS (
  SELECT tenant_id
  FROM user_profiles
  WHERE user_id = '15ddee83-4692-4b6c-9d14-94295f0b9682'
)
INSERT INTO public.dealerships (tenant_id, name)
SELECT
  tenant_id,
  'Lance Dealership'
FROM user_tenant;

-- 4. Verify the fix
SELECT
  u.id as user_id,
  u.email,
  up.user_id as has_profile,
  up.role,
  t.name as tenant_name,
  d.name as dealership_name
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN tenants t ON up.tenant_id = t.id
LEFT JOIN dealerships d ON d.tenant_id = t.id
WHERE u.email = 'caleb@lance.live';
