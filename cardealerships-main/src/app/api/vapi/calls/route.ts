import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/vapi/calls
 *
 * Fetches calls from YOUR Supabase database with tenant isolation.
 * RLS automatically filters to only show the current user's tenant's calls.
 */
export async function GET() {
  try {
    // Require authentication
    const user = await requireAuth();

    // Create Supabase client (RLS will auto-filter by tenant)
    const supabase = await createClient();

    // Get user's tenant_id
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("tenant_id")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Fetch calls - RLS automatically filters by tenant_id
    const { data: calls, error } = await supabase
      .from("calls")
      .select(`
        id,
        twilio_call_sid,
        started_at,
        ended_at,
        duration_s,
        outcome,
        meta
      `)
      .eq("tenant_id", profile.tenant_id)
      .order("started_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching calls:", error);
      return NextResponse.json({ error: "Failed to fetch calls" }, { status: 500 });
    }

    // Transform to match Vapi format for the frontend
    const transformedCalls = (calls || []).map((call) => ({
      id: call.meta?.vapi_call_id || call.id,
      orgId: "self-hosted",
      type: "inboundPhoneCall",
      phoneCallProvider: "twilio",
      phoneCallTransport: "pstn",
      status: call.ended_at ? "ended" : "in-progress",
      endedReason: call.meta?.ended_reason,
      startedAt: call.started_at,
      endedAt: call.ended_at,
      customer: {
        number: call.meta?.from_number || "Unknown",
      },
      analysis: call.meta?.analysis || {},
    }));

    return NextResponse.json(transformedCalls);
  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch calls" },
      { status: 500 }
    );
  }
}
