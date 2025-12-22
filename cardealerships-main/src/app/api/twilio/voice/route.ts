import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with service role (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VAPI_API_KEY = process.env.VAPI_API_KEY!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";

interface TenantLookup {
  tenant_id: string;
  tenant_name: string;
  dealership_id: string;
  dealership_name: string;
  agent_config: any;
}

/**
 * Twilio Voice Webhook Handler
 *
 * This endpoint receives incoming calls from Twilio and routes them
 * to the correct tenant's Vapi agent based on the called number.
 *
 * Multi-tenant architecture:
 * 1. Twilio calls this webhook for ANY configured number
 * 2. We lookup which tenant owns the "To" number
 * 3. We load that tenant's agent config
 * 4. We create a Vapi session with tenant context
 * 5. We return TwiML to connect the call
 */
export async function POST(request: NextRequest) {
  try {
    // Parse Twilio's form data
    const formData = await request.formData();
    const callSid = formData.get("CallSid") as string;
    const from = formData.get("From") as string;
    const to = formData.get("To") as string;
    const callStatus = formData.get("CallStatus") as string;

    console.log(`[Twilio Webhook] CallSid: ${callSid}, From: ${from}, To: ${to}, Status: ${callStatus}`);

    // Step 1: Lookup which tenant owns this phone number
    const { data: tenantData, error: lookupError } = await supabase
      .rpc("get_tenant_by_phone", { phone: to });

    if (lookupError || !tenantData || tenantData.length === 0) {
      console.error(`[Twilio Webhook] No tenant found for number: ${to}`, lookupError);
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, this phone number is not configured. Please contact support.</Say>
  <Hangup/>
</Response>`,
        {
          headers: { "Content-Type": "text/xml" },
        }
      );
    }

    const tenant = tenantData[0] as TenantLookup;
    console.log(`[Twilio Webhook] Matched tenant: ${tenant.tenant_name} (${tenant.tenant_id})`);

    // Step 2: Create a call log entry immediately
    const { data: callLog, error: callLogError } = await supabase
      .from("calls")
      .insert({
        tenant_id: tenant.tenant_id,
        dealership_id: tenant.dealership_id,
        twilio_call_sid: callSid,
        started_at: new Date().toISOString(),
        meta: {
          from_number: from,
          to_number: to,
          call_status: callStatus,
        },
      })
      .select()
      .single();

    if (callLogError) {
      console.error(`[Twilio Webhook] Failed to create call log:`, callLogError);
    }

    // Step 3: Build agent configuration for this tenant
    const agentConfig = buildAgentConfig(tenant);

    // Step 4: Create Vapi session
    const vapiSession = await createVapiSession({
      ...agentConfig,
      metadata: {
        tenant_id: tenant.tenant_id,
        dealership_id: tenant.dealership_id,
        call_sid: callSid,
        call_log_id: callLog?.id,
        from_number: from,
        to_number: to,
      },
    });

    // Step 5: Return TwiML to connect to Vapi
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${vapiSession.streamUrl}">
      <Parameter name="tenant_id" value="${tenant.tenant_id}" />
      <Parameter name="call_sid" value="${callSid}" />
      <Parameter name="dealership_id" value="${tenant.dealership_id}" />
    </Stream>
  </Connect>
</Response>`;

    console.log(`[Twilio Webhook] Returning TwiML for Vapi connection`);

    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("[Twilio Webhook] Error:", error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, we encountered an error. Please try again later.</Say>
  <Hangup/>
</Response>`,
      {
        status: 500,
        headers: { "Content-Type": "text/xml" },
      }
    );
  }
}

/**
 * Build agent configuration from tenant data
 */
function buildAgentConfig(tenant: TenantLookup) {
  const config = tenant.agent_config || {};

  return {
    model: {
      provider: "openai",
      model: "gpt-4o",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: config.systemPrompt || getDefaultSystemPrompt(tenant),
        },
      ],
    },
    voice: {
      provider: "cartesia",
      voiceId: config.voiceId || "57dcab65-68ac-45a6-8480-6c4c52ec1cd1",
      model: "sonic-3",
    },
    name: `${tenant.dealership_name} Service Agent`,
    firstMessage: config.greeting || "Hi, thanks for calling! How can I help you today?",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
      endpointing: 150,
    },
    analysisPlan: {
      summaryPlan: {
        enabled: true,
        messages: [
          {
            role: "system",
            content: "Summarize this call in 2-3 sentences. Include caller name, their need, and the outcome.",
          },
        ],
      },
      structuredDataPlan: {
        schema: {
          type: "object",
          properties: {
            caller_name: { type: "string" },
            vehicle_make: { type: "string" },
            vehicle_year: { type: "string" },
            vehicle_model: { type: "string" },
            service_request: { type: "string" },
            final_outcome: {
              type: "string",
              enum: [
                "appointment_booked",
                "transferred_to_human",
                "info_provided",
                "call_ended_no_resolution",
              ],
            },
          },
        },
        messages: [
          {
            role: "system",
            content: "Extract structured data from this call transcript based on the schema provided.",
          },
        ],
      },
    },
  };
}

/**
 * Get default system prompt if none configured
 */
function getDefaultSystemPrompt(tenant: TenantLookup): string {
  return `You are the service agent for ${tenant.dealership_name}.

Your job is to:
- Answer calls professionally and warmly
- Help customers book service appointments
- Answer questions about service hours and availability
- Transfer to a human advisor when needed

Keep responses short and helpful. Speak naturally like a real person.
Ask only necessary questions. Confirm details before booking.`;
}

/**
 * Create a Vapi session (phone call)
 * Note: This is a simplified version. In production, you'd use Vapi's Web SDK
 * or their phone number assignment API.
 */
async function createVapiSession(config: any) {
  // For now, return the session server WebSocket URL
  // In production, you would:
  // 1. Create a Vapi assistant on-the-fly OR
  // 2. Use a pre-configured assistant ID with overrides

  return {
    streamUrl: `wss://session.lance.live/twilio`, // Your session server
    sessionId: config.metadata.call_sid,
  };
}
