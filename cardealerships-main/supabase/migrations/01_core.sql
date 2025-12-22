-- Core schema for multi-tenant dealership platform
-- Run this migration first

-- Tenants
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'America/Los_Angeles',
  created_at timestamptz not null default now()
);

-- Dealerships (one per tenant for now, but keep it separate)
create table public.dealerships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  phone_e164 text,
  address text,
  hours_json jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Users linked to tenants via auth.users.uid
create table public.user_profiles (
  user_id uuid primary key,                -- matches auth.users.id
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  role text not null check (role in ('owner','admin','agent','viewer')),
  created_at timestamptz not null default now()
);

-- Phone numbers
create table public.phone_numbers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  dealership_id uuid references public.dealerships(id) on delete set null,
  phone_e164 text not null,
  twilio_sid text,
  webhook_set boolean not null default false,
  created_at timestamptz not null default now(),
  unique (tenant_id, phone_e164)
);

-- Twilio creds reference (no secrets here, only a pointer)
create table public.twilio_credentials (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  account_sid text not null,
  secret_ref text not null,                -- AWS Secrets Manager path
  created_at timestamptz not null default now()
);

-- Agents config
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  dealership_id uuid not null references public.dealerships(id) on delete cascade,
  name text not null default 'Lance',
  persona_json jsonb not null default '{}'::jsonb,
  tools_json jsonb not null default '[]'::jsonb,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- Calls
create table public.calls (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  dealership_id uuid references public.dealerships(id) on delete set null,
  phone_number_id uuid references public.phone_numbers(id) on delete set null,
  twilio_call_sid text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_s int,
  outcome text,                              -- booked, transferred, voicemail, abandoned, error
  recording_url text,
  cost_cents int,
  meta jsonb not null default '{}'::jsonb
);

-- Transcripts (turn level)
create table public.transcripts (
  id bigserial primary key,
  call_id uuid not null references public.calls(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  turn int not null,
  role text not null check (role in ('caller','agent')),
  text text not null,
  ts timestamptz not null default now()
);

-- Summaries and intents
create table public.summaries (
  call_id uuid primary key references public.calls(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  summary_text text not null,
  intents_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  dealership_id uuid not null references public.dealerships(id) on delete cascade,
  customer_name text,
  phone text,
  appt_start timestamptz not null,
  notes text,
  status text not null default 'scheduled',   -- scheduled, canceled, complete
  source text not null default 'voice_agent',
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index on public.calls (tenant_id, started_at desc);
create index on public.transcripts (call_id, turn);
create index on public.bookings (tenant_id, appt_start);
create index on public.phone_numbers (tenant_id);
