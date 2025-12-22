-- Seed data for development and testing
-- Run this migration last, after 04_rpc.sql
-- NOTE: Replace the user_id UUID with your actual auth user ID from Supabase

-- Demo tenant
insert into public.tenants(id, name, timezone) values
  ('00000000-0000-0000-0000-000000000001', 'Demo Motors Group', 'America/Los_Angeles');

-- Demo dealership
insert into public.dealerships(id, tenant_id, name, phone_e164, address, hours_json) values
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    'Demo Motors',
    '+15555551234',
    '123 Main Street, San Francisco, CA 94102',
    '{
      "monday": {"open": "09:00", "close": "18:00"},
      "tuesday": {"open": "09:00", "close": "18:00"},
      "wednesday": {"open": "09:00", "close": "18:00"},
      "thursday": {"open": "09:00", "close": "18:00"},
      "friday": {"open": "09:00", "close": "18:00"},
      "saturday": {"open": "10:00", "close": "16:00"},
      "sunday": {"closed": true}
    }'::jsonb
  );

-- Demo phone number
insert into public.phone_numbers(id, tenant_id, dealership_id, phone_e164, webhook_set) values
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    '+15555551234',
    false
  );

-- Demo agent configuration
insert into public.agents(id, tenant_id, dealership_id, name, persona_json, tools_json, enabled) values
  (
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    'Lance',
    '{
      "greeting": "Hi, this is Lance from Demo Motors. How can I help you today?",
      "personality": "friendly, professional, knowledgeable about cars",
      "guidelines": [
        "Always be polite and helpful",
        "Collect customer name and phone number",
        "Offer to book service appointments",
        "Transfer to human if requested"
      ]
    }'::jsonb,
    '[
      {"name": "book_appointment", "enabled": true},
      {"name": "check_inventory", "enabled": true},
      {"name": "transfer_call", "enabled": true}
    ]'::jsonb,
    true
  );

-- IMPORTANT: Replace this UUID with your actual Supabase auth user ID
-- To find your user ID:
-- 1. Sign up in your Supabase project (Authentication > Users)
-- 2. Copy the user UUID
-- 3. Replace the UUID below

-- Demo user profile (REPLACE THE USER_ID!)
-- Uncomment and update the line below after you create a user in Supabase Auth:
-- insert into public.user_profiles(user_id, tenant_id, role) values
--   ('YOUR-AUTH-USER-UUID-HERE', '00000000-0000-0000-0000-000000000001', 'owner');

-- Demo call (for testing)
insert into public.calls(id, tenant_id, dealership_id, phone_number_id, twilio_call_sid, started_at, ended_at, duration_s, outcome, cost_cents) values
  (
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000201',
    'CA00000000000000000000000000000001',
    now() - interval '1 hour',
    now() - interval '1 hour' + interval '3 minutes',
    180,
    'booked',
    25
  );

-- Demo transcript
insert into public.transcripts(call_id, tenant_id, turn, role, text, ts) values
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 1, 'agent', 'Hi, this is Lance from Demo Motors. How can I help you today?', now() - interval '1 hour'),
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 2, 'caller', 'Hi, I need to schedule a service appointment for my car.', now() - interval '1 hour' + interval '5 seconds'),
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 3, 'agent', 'I''d be happy to help you with that. What type of service do you need?', now() - interval '1 hour' + interval '10 seconds'),
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 4, 'caller', 'Just an oil change, please.', now() - interval '1 hour' + interval '15 seconds'),
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 5, 'agent', 'Perfect. I have availability tomorrow at 2 PM. Does that work for you?', now() - interval '1 hour' + interval '20 seconds'),
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 6, 'caller', 'Yes, that works great!', now() - interval '1 hour' + interval '25 seconds'),
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 7, 'agent', 'Great! Can I get your name and phone number for the appointment?', now() - interval '1 hour' + interval '30 seconds'),
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 8, 'caller', 'Sure, it''s John Smith, and my number is 555-123-4567.', now() - interval '1 hour' + interval '35 seconds'),
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 9, 'agent', 'Perfect! I''ve booked you for tomorrow at 2 PM for an oil change. See you then!', now() - interval '1 hour' + interval '40 seconds');

-- Demo summary
insert into public.summaries(call_id, tenant_id, summary_text, intents_json) values
  (
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000001',
    'Customer called to schedule an oil change service appointment. Successfully booked for tomorrow at 2 PM. Customer name: John Smith, Phone: 555-123-4567.',
    '["book_appointment", "service_inquiry"]'::jsonb
  );

-- Demo booking
insert into public.bookings(id, tenant_id, dealership_id, customer_name, phone, appt_start, notes, status, source) values
  (
    '00000000-0000-0000-0000-000000000501',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    'John Smith',
    '555-123-4567',
    (date_trunc('day', now()) + interval '1 day' + interval '14 hours')::timestamptz,
    'Oil change - booked via voice agent',
    'scheduled',
    'voice_agent'
  );
