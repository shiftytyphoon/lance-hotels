/**
 * Server-side Supabase client for AWS services
 * Uses service_role key to bypass RLS
 * NEVER expose this in client-side code
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

/**
 * Server client with service role permissions
 * Use this for AWS Lambda functions, API routes, and server actions
 */
export const supabaseServer = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Helper functions for common server operations
 * These can be used in AWS Lambda functions and API routes
 */

export async function endCall(params: {
  callId: string;
  outcome: string;
  recordingUrl?: string;
  costCents?: number;
}): Promise<void> {
  const { error } = await supabaseServer.rpc('end_call', {
    p_call_id: params.callId,
    p_outcome: params.outcome,
    p_recording_url: params.recordingUrl || null,
    p_cost_cents: params.costCents || null,
  } as any); // Type assertion for RPC params

  if (error) throw error;
}

export async function addTranscriptTurn(params: {
  callId: string;
  tenantId: string;
  turn: number;
  role: 'caller' | 'agent';
  text: string;
}): Promise<void> {
  const { error } = await supabaseServer.from('transcripts').insert({
    call_id: params.callId,
    tenant_id: params.tenantId,
    turn: params.turn,
    role: params.role,
    text: params.text,
  } as any); // Type assertion for insert

  if (error) throw error;
}

export async function createSummary(params: {
  callId: string;
  tenantId: string;
  summaryText: string;
  intents: string[];
}): Promise<void> {
  const { error } = await supabaseServer.from('summaries').insert({
    call_id: params.callId,
    tenant_id: params.tenantId,
    summary_text: params.summaryText,
    intents_json: params.intents,
  } as any); // Type assertion for insert

  if (error) throw error;
}

export async function createBooking(params: {
  tenantId: string;
  dealershipId: string;
  customerName?: string;
  phone?: string;
  apptStart: string;
  notes?: string;
  callId?: string;
}): Promise<string> {
  const { data, error } = await supabaseServer.rpc('create_booking', {
    p_tenant: params.tenantId,
    p_dealership: params.dealershipId,
    p_customer_name: params.customerName || null,
    p_phone: params.phone || null,
    p_appt_start: params.apptStart,
    p_notes: params.notes || null,
    p_call_id: params.callId || null,
  } as any); // Type assertion for RPC params

  if (error) throw error;
  return data;
}
