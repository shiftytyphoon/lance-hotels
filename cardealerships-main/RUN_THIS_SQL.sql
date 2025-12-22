-- Add columns that are missing
ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS twilio_account_sid text,
  ADD COLUMN IF NOT EXISTS twilio_auth_token_encrypted text,
  ADD COLUMN IF NOT EXISTS twilio_configured boolean DEFAULT false;

ALTER TABLE public.phone_numbers
  ADD COLUMN IF NOT EXISTS webhook_url text,
  ADD COLUMN IF NOT EXISTS status_callback_url text;

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS vapi_assistant_id text,
  ADD COLUMN IF NOT EXISTS is_default boolean DEFAULT false;

-- Drop unique constraint (tenant can have multiple numbers)
ALTER TABLE public.phone_numbers
  DROP CONSTRAINT IF EXISTS phone_numbers_tenant_id_phone_e164_key;

-- Add index for fast lookup
CREATE INDEX IF NOT EXISTS phone_numbers_phone_e164_idx ON public.phone_numbers(phone_e164);

-- One default agent per dealership
CREATE UNIQUE INDEX IF NOT EXISTS agents_dealership_default_idx
  ON public.agents(dealership_id, is_default)
  WHERE is_default = true;

-- Function to lookup tenant by phone number
CREATE OR REPLACE FUNCTION public.get_tenant_by_phone(phone text)
RETURNS TABLE (
  tenant_id uuid,
  tenant_name text,
  dealership_id uuid,
  dealership_name text,
  agent_config jsonb
) LANGUAGE sql STABLE AS $$
  SELECT
    t.id as tenant_id,
    t.name as tenant_name,
    d.id as dealership_id,
    d.name as dealership_name,
    a.persona_json as agent_config
  FROM public.phone_numbers pn
  JOIN public.tenants t ON t.id = pn.tenant_id
  LEFT JOIN public.dealerships d ON d.id = pn.dealership_id
  LEFT JOIN public.agents a ON a.dealership_id = d.id AND a.is_default = true
  WHERE pn.phone_e164 = phone
  LIMIT 1;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_tenant_by_phone(text) TO service_role;
