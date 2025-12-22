import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with service role (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Vapi Webhook Handler
 *
 * Receives events from Vapi about ongoing calls.
 * All events include metadata with tenant_id for proper scoping.
 *
 * Events:
 * - assistant-request: Before call starts, can modify assistant config
 * - call.started: Call has begun
 * - transcript: Real-time transcript updates
 * - tool-calls: Agent wants to call a tool (calendar, transfer, etc)
 * - end-of-call-report: Call ended with full analysis
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.message?.type || body.type;

    console.log(`[Vapi Webhook] Event: ${eventType}`, {
      callId: body.message?.call?.id,
      timestamp: body.message?.timestamp,
    });

    switch (eventType) {
      case "assistant-request":
        return handleAssistantRequest(body);

      case "status-update":
        if (body.message?.status === "started") {
          return handleCallStarted(body);
        }
        break;

      case "transcript":
        return handleTranscript(body);

      case "tool-calls":
        return handleToolCalls(body);

      case "end-of-call-report":
        return handleCallEnded(body);

      default:
        console.log(`[Vapi Webhook] Unhandled event type: ${eventType}`);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Vapi Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handle assistant request - can inject tenant-specific config
 */
async function handleAssistantRequest(body: any) {
  const metadata = body.message?.call?.metadata;

  if (!metadata?.tenant_id) {
    return NextResponse.json({
      assistant: body.message?.assistant || {},
    });
  }

  // Could load additional tenant config here and override assistant settings
  console.log(`[Vapi Webhook] Assistant request for tenant: ${metadata.tenant_id}`);

  return NextResponse.json({
    assistant: body.message?.assistant || {},
  });
}

/**
 * Handle call started event
 */
async function handleCallStarted(body: any) {
  const call = body.message?.call;
  const metadata = call?.metadata;

  if (!metadata?.call_log_id) {
    console.error("[Vapi Webhook] No call_log_id in metadata");
    return NextResponse.json({ success: true });
  }

  // Update call log with Vapi call ID
  await supabase
    .from("calls")
    .update({
      meta: {
        ...metadata,
        vapi_call_id: call.id,
        status: "in_progress",
      },
    })
    .eq("id", metadata.call_log_id);

  console.log(`[Vapi Webhook] Call started: ${call.id}`);
  return NextResponse.json({ success: true });
}

/**
 * Handle transcript updates
 */
async function handleTranscript(body: any) {
  const message = body.message;
  const metadata = message?.call?.metadata;
  const transcript = message?.transcript;

  if (!metadata?.call_log_id || !transcript) {
    return NextResponse.json({ success: true });
  }

  // Store transcript turns in database
  await supabase.from("transcripts").insert({
    call_id: metadata.call_log_id,
    tenant_id: metadata.tenant_id,
    turn: transcript.turn || 0,
    role: transcript.role === "assistant" ? "agent" : "caller",
    text: transcript.text,
    ts: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

/**
 * Handle tool calls from the agent
 */
async function handleToolCalls(body: any) {
  const toolCalls = body.message?.toolCalls || [];
  const metadata = body.message?.call?.metadata;

  console.log(`[Vapi Webhook] Tool calls:`, toolCalls);

  // Handle each tool call
  const results = await Promise.all(
    toolCalls.map((toolCall: any) => handleToolCall(toolCall, metadata))
  );

  return NextResponse.json({ results });
}

/**
 * Handle individual tool call
 */
async function handleToolCall(toolCall: any, metadata: any) {
  const { function: fn, id } = toolCall;

  switch (fn.name) {
    case "transfer_call":
      // Return transfer instructions
      return {
        toolCallId: id,
        result: {
          success: true,
          message: "Transferring to human advisor",
        },
      };

    case "book_appointment":
      // Create booking in database
      const params = JSON.parse(fn.arguments);
      await supabase.from("bookings").insert({
        tenant_id: metadata.tenant_id,
        dealership_id: metadata.dealership_id,
        customer_name: params.customer_name,
        phone: params.phone,
        appt_start: params.appointment_time,
        notes: params.service_request,
        status: "scheduled",
        source: "voice_agent",
      });

      return {
        toolCallId: id,
        result: {
          success: true,
          message: `Appointment booked for ${params.customer_name} at ${params.appointment_time}`,
        },
      };

    case "check_availability":
      // Mock availability check
      return {
        toolCallId: id,
        result: {
          available_slots: [
            "Today at 2:00 PM",
            "Tomorrow at 10:00 AM",
            "Tomorrow at 3:00 PM",
          ],
        },
      };

    default:
      return {
        toolCallId: id,
        result: {
          error: `Unknown tool: ${fn.name}`,
        },
      };
  }
}

/**
 * Handle call ended event with full analysis
 */
async function handleCallEnded(body: any) {
  const report = body.message;
  const metadata = report?.call?.metadata;

  if (!metadata?.call_log_id) {
    console.error("[Vapi Webhook] No call_log_id in end-of-call-report");
    return NextResponse.json({ success: true });
  }

  // Calculate duration
  const startTime = new Date(report.call?.startedAt);
  const endTime = new Date(report.call?.endedAt || new Date());
  const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

  // Determine outcome from structured data
  const structuredData = report.analysis?.structuredData;
  const outcome = structuredData?.final_outcome || "unknown";

  // Update call log with final data
  await supabase
    .from("calls")
    .update({
      ended_at: report.call?.endedAt || new Date().toISOString(),
      duration_s: durationSeconds,
      outcome: outcome,
      meta: {
        ...metadata,
        vapi_call_id: report.call?.id,
        ended_reason: report.endedReason,
        analysis: report.analysis,
        costs: report.costs,
      },
    })
    .eq("id", metadata.call_log_id);

  // Save summary if available
  if (report.analysis?.summary) {
    await supabase.from("summaries").insert({
      call_id: metadata.call_log_id,
      tenant_id: metadata.tenant_id,
      summary_text: report.analysis.summary,
      intents_json: structuredData || {},
    });
  }

  console.log(`[Vapi Webhook] Call ended: ${report.call?.id}, outcome: ${outcome}, duration: ${durationSeconds}s`);

  return NextResponse.json({ success: true });
}
