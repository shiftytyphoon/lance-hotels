# Supabase Quick Start

## Setup Checklist

- [ ] Create Supabase project at https://supabase.com
- [ ] Copy Project URL, anon key, and service_role key
- [ ] Update `.env.local` with your credentials
- [ ] Run migration `01_core.sql` in SQL Editor
- [ ] Run migration `02_rls.sql` in SQL Editor
- [ ] Run migration `03_storage.sql` in SQL Editor
- [ ] Run migration `04_rpc.sql` in SQL Editor
- [ ] Create a user in Authentication → Users
- [ ] Update `05_seed.sql` with your user ID
- [ ] Run migration `05_seed.sql` in SQL Editor
- [ ] Enable Realtime on calls, bookings, summaries tables
- [ ] Restart Next.js dev server

## File Structure

```
supabase/
├── migrations/
│   ├── 01_core.sql          # Tables, indexes
│   ├── 02_rls.sql           # Row Level Security policies
│   ├── 03_storage.sql       # Storage buckets
│   ├── 04_rpc.sql           # Functions and triggers
│   └── 05_seed.sql          # Demo data
└── README.md                # Full setup guide

src/lib/supabase/
├── client.ts                # Browser client (anon key)
├── server.ts                # Server client (service_role key)
└── types.ts                 # TypeScript types
```

## Quick Code Examples

### Client-Side (Dashboard)

```typescript
import { supabase } from '@/lib/supabase/client';

// List recent calls
const { data: calls } = await supabase
  .from('calls')
  .select('*')
  .order('started_at', { ascending: false })
  .limit(50);

// Subscribe to live updates
import { subscribeToTenantChannel } from '@/lib/supabase/client';

const unsubscribe = subscribeToTenantChannel(tenantId, {
  onCallUpdate: (payload) => {
    console.log('Call updated:', payload);
  }
});
```

### Server-Side (AWS Lambda)

```typescript
import {
  startCall,
  addTranscriptTurn,
  endCall
} from '@/lib/supabase/server';

// Start a call
const callId = await startCall({
  tenantId: '...',
  dealershipId: '...',
  phoneNumberId: '...',
  twilioCallSid: 'CA123...'
});

// Add transcript turn
await addTranscriptTurn({
  callId,
  tenantId: '...',
  turn: 1,
  role: 'agent',
  text: 'Hello, how can I help?'
});

// End call
await endCall({
  callId,
  outcome: 'booked',
  recordingUrl: 'recordings/call-123.mp3',
  costCents: 25
});
```

## Database Schema

**Core tables:**
- `tenants` - Multi-tenant isolation
- `dealerships` - Dealership locations
- `user_profiles` - Links auth users to tenants
- `phone_numbers` - Twilio numbers
- `agents` - AI agent configurations
- `calls` - Call records
- `transcripts` - Turn-by-turn conversation
- `summaries` - AI-generated summaries
- `bookings` - Scheduled appointments

**All tables have tenant_id for RLS filtering**

## RPC Functions

- `start_call(tenant, dealership, phone, twilio_sid)` → uuid
- `end_call(call_id, outcome, recording_url, cost_cents)` → void
- `create_booking(...)` → uuid
- `tenant_id_for_user()` → uuid (helper for RLS)

## Environment Variables

```env
# Client (browser-safe)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Server (secret - AWS only)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Key Security Rules

1. **Never** expose service_role key in browser
2. **Always** use client.ts for frontend code
3. **Always** use server.ts for backend code
4. RLS automatically filters by tenant_id
5. twilio_credentials table blocked from clients

## Testing

```sql
-- Verify RLS is working (run as authenticated user)
select * from calls;  -- Should only see your tenant's calls

-- Test RPC function
select start_call(
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000101'::uuid,
  '00000000-0000-0000-0000-000000000201'::uuid,
  'CA_test_123'
);
```

## Troubleshooting

**No data showing in dashboard?**
→ Check that your user has a `user_profiles` row

**Permission denied errors?**
→ Verify RLS policies ran (02_rls.sql)

**Can't import types?**
→ Restart TypeScript server in your editor

**Realtime not working?**
→ Enable replication in Database → Replication

## Next Steps

1. Read the full setup guide: `supabase/README.md`
2. Run all 5 migrations in SQL Editor
3. Test connection with a simple page
4. Build your dashboard UI
5. Set up AWS Lambda for call handling
