-- Row Level Security (RLS) policies for tenant isolation
-- Run this migration second, after 01_core.sql

-- Enable RLS on all tables
alter table public.tenants enable row level security;
alter table public.dealerships enable row level security;
alter table public.user_profiles enable row level security;
alter table public.phone_numbers enable row level security;
alter table public.twilio_credentials enable row level security;
alter table public.agents enable row level security;
alter table public.calls enable row level security;
alter table public.transcripts enable row level security;
alter table public.summaries enable row level security;
alter table public.bookings enable row level security;

-- Helper function: get current user's tenant_id
create or replace function public.tenant_id_for_user()
returns uuid language sql stable as $$
  select tenant_id from public.user_profiles where user_id = auth.uid()
$$;

-- Read policies for authenticated dashboard users
create policy "tenant read tenants" on public.tenants
  for select to authenticated
  using (id = public.tenant_id_for_user());

create policy "tenant read dealerships" on public.dealerships
  for select to authenticated
  using (tenant_id = public.tenant_id_for_user());

create policy "tenant read user_profiles" on public.user_profiles
  for select to authenticated
  using (tenant_id = public.tenant_id_for_user());

create policy "tenant read phones" on public.phone_numbers
  for select to authenticated
  using (tenant_id = public.tenant_id_for_user());

create policy "tenant read agents" on public.agents
  for select to authenticated
  using (tenant_id = public.tenant_id_for_user());

create policy "tenant read calls" on public.calls
  for select to authenticated
  using (tenant_id = public.tenant_id_for_user());

create policy "tenant read transcripts" on public.transcripts
  for select to authenticated
  using (tenant_id = public.tenant_id_for_user());

create policy "tenant read summaries" on public.summaries
  for select to authenticated
  using (tenant_id = public.tenant_id_for_user());

create policy "tenant read bookings" on public.bookings
  for select to authenticated
  using (tenant_id = public.tenant_id_for_user());

-- Write policies for dashboard users with admin roles
-- Use check expressions to force row tenant_id match
create policy "tenant write dealerships" on public.dealerships
  for insert to authenticated
  with check (tenant_id = public.tenant_id_for_user());

create policy "tenant update dealerships" on public.dealerships
  for update to authenticated
  using (tenant_id = public.tenant_id_for_user())
  with check (tenant_id = public.tenant_id_for_user());

create policy "tenant write agents" on public.agents
  for insert to authenticated
  with check (tenant_id = public.tenant_id_for_user());

create policy "tenant update agents" on public.agents
  for update to authenticated
  using (tenant_id = public.tenant_id_for_user())
  with check (tenant_id = public.tenant_id_for_user());

create policy "tenant write bookings" on public.bookings
  for insert to authenticated
  with check (tenant_id = public.tenant_id_for_user());

create policy "tenant update bookings" on public.bookings
  for update to authenticated
  using (tenant_id = public.tenant_id_for_user())
  with check (tenant_id = public.tenant_id_for_user());

-- Service role bypasses RLS automatically
-- Explicit server write policies for AWS services using service_role key
create policy "service writes calls" on public.calls
  for insert to service_role
  with check (true);

create policy "service updates calls" on public.calls
  for update to service_role
  using (true)
  with check (true);

create policy "service writes transcripts" on public.transcripts
  for insert to service_role
  with check (true);

create policy "service writes summaries" on public.summaries
  for insert to service_role
  with check (true);

create policy "service writes bookings" on public.bookings
  for insert to service_role
  with check (true);

-- Twilio credentials must NEVER be visible to clients
revoke all on table public.twilio_credentials from anon, authenticated;
grant select on table public.twilio_credentials to service_role;
