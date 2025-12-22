/**
 * TypeScript types for Supabase database schema
 * Generated from the migration files
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          timezone: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          timezone?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          timezone?: string
          created_at?: string
        }
      }
      dealerships: {
        Row: {
          id: string
          tenant_id: string
          name: string
          phone_e164: string | null
          address: string | null
          hours_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          phone_e164?: string | null
          address?: string | null
          hours_json?: Json
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          phone_e164?: string | null
          address?: string | null
          hours_json?: Json
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          user_id: string
          tenant_id: string
          role: 'owner' | 'admin' | 'agent' | 'viewer'
          created_at: string
        }
        Insert: {
          user_id: string
          tenant_id: string
          role: 'owner' | 'admin' | 'agent' | 'viewer'
          created_at?: string
        }
        Update: {
          user_id?: string
          tenant_id?: string
          role?: 'owner' | 'admin' | 'agent' | 'viewer'
          created_at?: string
        }
      }
      phone_numbers: {
        Row: {
          id: string
          tenant_id: string
          dealership_id: string | null
          phone_e164: string
          twilio_sid: string | null
          webhook_set: boolean
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          dealership_id?: string | null
          phone_e164: string
          twilio_sid?: string | null
          webhook_set?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          dealership_id?: string | null
          phone_e164?: string
          twilio_sid?: string | null
          webhook_set?: boolean
          created_at?: string
        }
      }
      twilio_credentials: {
        Row: {
          tenant_id: string
          account_sid: string
          secret_ref: string
          created_at: string
        }
        Insert: {
          tenant_id: string
          account_sid: string
          secret_ref: string
          created_at?: string
        }
        Update: {
          tenant_id?: string
          account_sid?: string
          secret_ref?: string
          created_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          tenant_id: string
          dealership_id: string
          name: string
          persona_json: Json
          tools_json: Json
          enabled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          dealership_id: string
          name?: string
          persona_json?: Json
          tools_json?: Json
          enabled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          dealership_id?: string
          name?: string
          persona_json?: Json
          tools_json?: Json
          enabled?: boolean
          created_at?: string
        }
      }
      calls: {
        Row: {
          id: string
          tenant_id: string
          dealership_id: string | null
          phone_number_id: string | null
          twilio_call_sid: string | null
          started_at: string
          ended_at: string | null
          duration_s: number | null
          outcome: string | null
          recording_url: string | null
          cost_cents: number | null
          meta: Json
        }
        Insert: {
          id?: string
          tenant_id: string
          dealership_id?: string | null
          phone_number_id?: string | null
          twilio_call_sid?: string | null
          started_at?: string
          ended_at?: string | null
          duration_s?: number | null
          outcome?: string | null
          recording_url?: string | null
          cost_cents?: number | null
          meta?: Json
        }
        Update: {
          id?: string
          tenant_id?: string
          dealership_id?: string | null
          phone_number_id?: string | null
          twilio_call_sid?: string | null
          started_at?: string
          ended_at?: string | null
          duration_s?: number | null
          outcome?: string | null
          recording_url?: string | null
          cost_cents?: number | null
          meta?: Json
        }
      }
      transcripts: {
        Row: {
          id: number
          call_id: string
          tenant_id: string
          turn: number
          role: 'caller' | 'agent'
          text: string
          ts: string
        }
        Insert: {
          id?: number
          call_id: string
          tenant_id: string
          turn: number
          role: 'caller' | 'agent'
          text: string
          ts?: string
        }
        Update: {
          id?: number
          call_id?: string
          tenant_id?: string
          turn?: number
          role?: 'caller' | 'agent'
          text?: string
          ts?: string
        }
      }
      summaries: {
        Row: {
          call_id: string
          tenant_id: string
          summary_text: string
          intents_json: Json
          created_at: string
        }
        Insert: {
          call_id: string
          tenant_id: string
          summary_text: string
          intents_json?: Json
          created_at?: string
        }
        Update: {
          call_id?: string
          tenant_id?: string
          summary_text?: string
          intents_json?: Json
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          tenant_id: string
          dealership_id: string
          customer_name: string | null
          phone: string | null
          appt_start: string
          notes: string | null
          status: string
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          dealership_id: string
          customer_name?: string | null
          phone?: string | null
          appt_start: string
          notes?: string | null
          status?: string
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          dealership_id?: string
          customer_name?: string | null
          phone?: string | null
          appt_start?: string
          notes?: string | null
          status?: string
          source?: string
          created_at?: string
        }
      }
    }
    Functions: {
      start_call: {
        Args: {
          p_tenant: string
          p_dealership: string
          p_phone: string
          p_twilio_sid: string
        }
        Returns: string
      }
      end_call: {
        Args: {
          p_call_id: string
          p_outcome: string
          p_recording_url?: string
          p_cost_cents?: number
        }
        Returns: void
      }
      create_booking: {
        Args: {
          p_tenant: string
          p_dealership: string
          p_customer_name?: string
          p_phone?: string
          p_appt_start: string
          p_notes?: string
          p_call_id?: string
        }
        Returns: string
      }
      tenant_id_for_user: {
        Args: Record<string, never>
        Returns: string
      }
    }
  }
}
