/**
 * Client-side Supabase client for Next.js browser
 * Uses anon key with RLS enforcement
 * Safe to use in client components
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

/**
 * Browser client with anon key and RLS enforcement
 * Use this in client components and pages
 */
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Helper hook for Realtime subscriptions by tenant
 */
export function subscribeToTenantChannel(
  tenantId: string,
  handlers: {
    onCallUpdate?: (payload: any) => void;
    onBookingUpdate?: (payload: any) => void;
    onSummaryUpdate?: (payload: any) => void;
  }
) {
  const channel = supabase.channel(`tenant:${tenantId}`);

  if (handlers.onCallUpdate) {
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'calls',
        filter: `tenant_id=eq.${tenantId}`,
      },
      handlers.onCallUpdate
    );
  }

  if (handlers.onBookingUpdate) {
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `tenant_id=eq.${tenantId}`,
      },
      handlers.onBookingUpdate
    );
  }

  if (handlers.onSummaryUpdate) {
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'summaries',
        filter: `tenant_id=eq.${tenantId}`,
      },
      handlers.onSummaryUpdate
    );
  }

  channel.subscribe();

  return () => {
    channel.unsubscribe();
  };
}
