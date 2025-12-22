-- Check if profile exists for caleb@lance.live
SELECT
  u.id as user_id,
  u.email,
  up.user_id as has_profile,
  up.tenant_id,
  up.role
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.email = 'caleb@lance.live';

-- If no profile exists, let's check if a tenant was created
SELECT id, name, created_at
FROM tenants
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Check for any orphaned auth users without profiles
SELECT
  u.id,
  u.email,
  u.created_at
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE up.user_id IS NULL;
