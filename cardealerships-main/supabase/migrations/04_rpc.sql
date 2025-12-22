-- RPC functions and triggers
-- Run this migration fourth, after 03_storage.sql

-- RPC: Start a new call (used by AWS session server)
create or replace function public.start_call(
  p_tenant uuid,
  p_dealership uuid,
  p_phone uuid,
  p_twilio_sid text
) returns uuid
language plpgsql security definer as $$
declare
  v_id uuid;
begin
  insert into public.calls(tenant_id, dealership_id, phone_number_id, twilio_call_sid)
  values (p_tenant, p_dealership, p_phone, p_twilio_sid)
  returning id into v_id;
  return v_id;
end;
$$;

-- RPC: End a call with outcome and recording
create or replace function public.end_call(
  p_call_id uuid,
  p_outcome text,
  p_recording_url text default null,
  p_cost_cents int default null
) returns void
language plpgsql security definer as $$
begin
  update public.calls
  set
    ended_at = now(),
    outcome = p_outcome,
    recording_url = p_recording_url,
    cost_cents = p_cost_cents
  where id = p_call_id;
end;
$$;

-- RPC: Create a booking from call data
create or replace function public.create_booking(
  p_tenant uuid,
  p_dealership uuid,
  p_customer_name text,
  p_phone text,
  p_appt_start timestamptz,
  p_notes text default null,
  p_call_id uuid default null
) returns uuid
language plpgsql security definer as $$
declare
  v_id uuid;
begin
  insert into public.bookings(
    tenant_id,
    dealership_id,
    customer_name,
    phone,
    appt_start,
    notes,
    source
  )
  values (
    p_tenant,
    p_dealership,
    p_customer_name,
    p_phone,
    p_appt_start,
    p_notes,
    case when p_call_id is not null then 'voice_agent' else 'manual' end
  )
  returning id into v_id;
  return v_id;
end;
$$;

-- Trigger: Automatically calculate call duration when ended_at is set
create or replace function public.set_call_duration()
returns trigger language plpgsql as $$
begin
  if new.ended_at is not null and old.ended_at is null then
    new.duration_s := extract(epoch from (new.ended_at - new.started_at))::int;
  end if;
  return new;
end;
$$;

create trigger calls_duration_trg
  before update of ended_at on public.calls
  for each row
  execute function public.set_call_duration();

-- Grant execute permissions to service_role
grant execute on function public.start_call to service_role;
grant execute on function public.end_call to service_role;
grant execute on function public.create_booking to service_role;
grant execute on function public.create_booking to authenticated;
