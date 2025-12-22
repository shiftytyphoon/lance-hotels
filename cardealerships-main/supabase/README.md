# Supabase Setup Guide

Complete guide to setting up your multi-tenant dealership backend with Supabase.

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/sign in
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `car-dealerships` (or your preferred name)
   - **Database Password**: Create a strong password and save it securely
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier works for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

## 2. Get API Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon) → **API**
2. Copy these three values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - **Keep this secret!**

## 3. Configure Environment Variables

1. Open `.env.local` in this project
2. Replace the placeholder values with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

3. Restart your Next.js dev server after updating

## 4. Run Database Migrations

Run migrations in the Supabase SQL Editor in this exact order:

### Step 1: Core Schema
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy/paste contents of `migrations/01_core.sql`
4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. Verify: "Success. No rows returned" message

### Step 2: RLS Policies
1. Click **"New Query"** again
2. Copy/paste contents of `migrations/02_rls.sql`
3. Click **"Run"**
4. Verify success message

### Step 3: Storage Buckets
1. Click **"New Query"**
2. Copy/paste contents of `migrations/03_storage.sql`
3. Click **"Run"**
4. Verify success message

### Step 4: RPC Functions & Triggers
1. Click **"New Query"**
2. Copy/paste contents of `migrations/04_rpc.sql`
3. Click **"Run"**
4. Verify success message

### Step 5: Seed Data (Development Only)
1. Click **"New Query"**
2. Copy/paste contents of `migrations/05_seed.sql`
3. **IMPORTANT**: Before running, you need to create a user first (see below)
4. After creating a user, uncomment and update the `user_profiles` insert with your auth user ID
5. Click **"Run"**
6. Verify success message

## 5. Create Your First User

### Option A: Email/Password (Recommended for Testing)
1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter email and password
4. Click **"Create user"**
5. Copy the **User UID** (UUID)

### Option B: Sign Up via Your App
1. Implement a sign-up page in your Next.js app
2. Use Supabase Auth to create a user
3. Find the user ID in Authentication → Users

### Link User to Tenant
1. Go back to **SQL Editor**
2. Run this query (replace `YOUR-USER-ID` with the actual UUID):

```sql
insert into public.user_profiles(user_id, tenant_id, role) values
  ('YOUR-USER-ID-HERE', '00000000-0000-0000-0000-000000000001', 'owner');
```

## 6. Enable Realtime (Optional but Recommended)

1. Go to **Database** → **Replication** in Supabase dashboard
2. Enable replication for these tables:
   - `calls`
   - `bookings`
   - `summaries`
3. This allows live updates in your dashboard

## 7. Verify Setup

Run these queries in SQL Editor to verify everything works:

```sql
-- Check tenant exists
select * from tenants;

-- Check dealership exists
select * from dealerships;

-- Check seed call data
select * from calls;

-- Check RLS is enabled
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
and tablename in ('calls', 'bookings', 'tenants');
```

All queries should return data without errors.

## 8. Test Client Connection

In your Next.js app, create a test page:

```typescript
// app/test-supabase/page.tsx
import { supabase } from '@/lib/supabase/client';

export default async function TestPage() {
  const { data: calls, error } = await supabase
    .from('calls')
    .select('*')
    .limit(10);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Supabase Connection Test</h1>
      <pre>{JSON.stringify(calls, null, 2)}</pre>
    </div>
  );
}
```

Visit `http://localhost:3000/test-supabase` - you should see call data or an empty array.

## Architecture Overview

### Client-Side (Browser)
- Uses **anon key** with RLS enforcement
- Import from `@/lib/supabase/client`
- All queries automatically filtered by user's tenant
- Can only read/write data belonging to their tenant

### Server-Side (AWS/API Routes)
- Uses **service_role key** with RLS bypass
- Import from `@/lib/supabase/server`
- Has full database access
- Use helper functions like `startCall()`, `endCall()`, etc.

### Security Model
- **Row Level Security (RLS)**: Every table is tenant-isolated
- **Service Role**: AWS services write with full permissions
- **Anon Key**: Dashboard users read their own tenant's data only
- **Twilio Creds**: Never exposed to clients, service role only

## Common Issues

### "relation does not exist"
- You forgot to run a migration
- Run migrations in order: 01, 02, 03, 04, 05

### "permission denied for table"
- RLS is enabled but user isn't linked to a tenant
- Create a user_profile row linking auth.users.id to tenant_id

### "JWT expired" or "Invalid JWT"
- Restart your dev server after updating .env.local
- Check that you copied the full key (they're very long)

### Can't see any data in dashboard
- Verify your user has a row in `user_profiles`
- Check that `tenant_id_for_user()` returns a valid UUID
- Test: `select public.tenant_id_for_user();` in SQL Editor

### Storage bucket errors
- Make sure you ran migration 03_storage.sql
- Check bucket exists: go to Storage in Supabase dashboard

## Next Steps

1. Build your dashboard pages using `@/lib/supabase/client`
2. Set up AWS Lambda functions with `@/lib/supabase/server`
3. Configure Twilio webhooks to call your API routes
4. Implement real-time subscriptions for live call updates
5. Add user authentication and sign-up flow

## Support

- Supabase Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub Issues: Create an issue in this repo
