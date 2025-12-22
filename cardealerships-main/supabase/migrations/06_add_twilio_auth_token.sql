-- Add auth_token column to twilio_credentials table
-- Run this in Supabase SQL Editor

ALTER TABLE public.twilio_credentials
ADD COLUMN IF NOT EXISTS auth_token text;

-- Note: In production, you should encrypt this field or use AWS Secrets Manager
-- For now, we're storing it directly for development purposes
