import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { requireAuth } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Force Vercel rebuild - params are async in Next.js 15+

/**
 * GET /api/dealerships/[dealershipId]/phone-numbers
 * List all phone numbers for a dealership
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dealershipId: string }> }
) {
  try {
    await requireAuth();
    const supabase = await createClient();
    const { dealershipId } = await params;

    // Get tenant for this dealership
    const { data: dealership } = await supabase
      .from("dealerships")
      .select("tenant_id")
      .eq("id", dealershipId)
      .single();

    if (!dealership) {
      return NextResponse.json({ error: "Dealership not found" }, { status: 404 });
    }

    // Get phone numbers for this tenant
    const { data: phoneNumbers, error } = await supabase
      .from("phone_numbers")
      .select("*")
      .eq("tenant_id", dealership.tenant_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Phone Numbers GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch phone numbers" },
        { status: 500 }
      );
    }

    return NextResponse.json({ phoneNumbers: phoneNumbers || [] });
  } catch (error) {
    console.error("[Phone Numbers GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch phone numbers" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/dealerships/[dealershipId]/phone-numbers
 * Add a phone number to a dealership
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dealershipId: string }> }
) {
  try {
    await requireAuth();
    const supabase = await createClient();
    const body = await request.json();
    const { dealershipId } = await params;

    const { phoneNumber, twilioSid } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Get tenant for this dealership
    const { data: dealership } = await supabase
      .from("dealerships")
      .select("tenant_id")
      .eq("id", dealershipId)
      .single();

    if (!dealership) {
      return NextResponse.json({ error: "Dealership not found" }, { status: 404 });
    }

    // Get tenant Twilio credentials
    const { data: tenant } = await supabase
      .from("tenants")
      .select("twilio_account_sid, twilio_auth_token_encrypted")
      .eq("id", dealership.tenant_id)
      .single();

    if (!tenant?.twilio_account_sid) {
      return NextResponse.json(
        { error: "Twilio credentials not configured" },
        { status: 400 }
      );
    }

    // Format phone number to E.164
    const phoneE164 = formatPhoneToE164(phoneNumber);

    // Check if phone number already exists
    const { data: existing } = await supabase
      .from("phone_numbers")
      .select("id")
      .eq("phone_e164", phoneE164)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Phone number already exists in system" },
        { status: 400 }
      );
    }

    // Configure webhook on Twilio if twilioSid is provided
    let webhookConfigured = false;
    if (twilioSid && tenant.twilio_auth_token_encrypted) {
      webhookConfigured = await configureTwilioWebhook(
        tenant.twilio_account_sid,
        tenant.twilio_auth_token_encrypted,
        twilioSid
      );
    }

    // Insert phone number
    const webhookUrl = `${BASE_URL}/api/twilio/voice`;
    const { data: phoneNumberData, error: insertError } = await supabase
      .from("phone_numbers")
      .insert({
        tenant_id: dealership.tenant_id,
        dealership_id: dealershipId,
        phone_e164: phoneE164,
        twilio_sid: twilioSid || null,
        webhook_set: webhookConfigured,
        webhook_url: webhookUrl,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Phone Numbers POST] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to add phone number" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      phoneNumber: phoneNumberData,
      webhookUrl: webhookUrl,
      message: webhookConfigured
        ? "Phone number added and webhook configured"
        : "Phone number added. Configure webhook manually in Twilio console.",
    });
  } catch (error) {
    console.error("[Phone Numbers POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to add phone number" },
      { status: 500 }
    );
  }
}

/**
 * Format phone number to E.164 format
 */
function formatPhoneToE164(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // Add +1 if it's a 10-digit US number
  if (cleaned.length === 10) {
    cleaned = "1" + cleaned;
  }

  // Add + prefix if not present
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }

  return cleaned;
}

/**
 * Configure webhook on Twilio phone number
 * Vercel cache clear attempt
 */
async function configureTwilioWebhook(
  accountSid: string,
  encryptedToken: string,
  phoneSid: string
): Promise<boolean> {
  try {
    // Decrypt token (in production, use proper encryption)
    const authToken = Buffer.from(encryptedToken, "base64").toString();

    const webhookUrl = `${BASE_URL}/api/twilio/voice`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers/${phoneSid}.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          VoiceUrl: webhookUrl,
          VoiceMethod: "POST",
          StatusCallback: `${BASE_URL}/api/twilio/status`,
          StatusCallbackMethod: "POST",
        }),
      }
    );

    if (!response.ok) {
      console.error("[Twilio Webhook Config] Failed:", await response.text());
      return false;
    }

    console.log(`[Twilio Webhook Config] Configured webhook for ${phoneSid}`);
    return true;
  } catch (error) {
    console.error("[Twilio Webhook Config] Error:", error);
    return false;
  }
}
