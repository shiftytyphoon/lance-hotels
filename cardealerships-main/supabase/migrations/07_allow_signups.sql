-- Allow signups by enabling insert policies
-- Run this in Supabase SQL Editor NOW

-- Allow authenticated users to create tenants
DROP POLICY IF EXISTS "authenticated create tenants" ON public.tenants;
CREATE POLICY "authenticated create tenants" ON public.tenants
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow users to create their own profile
DROP POLICY IF EXISTS "users create own profile" ON public.user_profiles;
CREATE POLICY "users create own profile" ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Allow users to create dealerships
DROP POLICY IF EXISTS "users create dealerships" ON public.dealerships;
CREATE POLICY "users create dealerships" ON public.dealerships
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow users to store Twilio credentials
DROP POLICY IF EXISTS "users store twilio" ON public.twilio_credentials;
CREATE POLICY "users store twilio" ON public.twilio_credentials
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow users to add phone numbers
DROP POLICY IF EXISTS "users add phones" ON public.phone_numbers;
CREATE POLICY "users add phones" ON public.phone_numbers
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Verify policies were created
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('tenants', 'user_profiles', 'dealerships', 'twilio_credentials', 'phone_numbers')
AND cmd = 'INSERT';
