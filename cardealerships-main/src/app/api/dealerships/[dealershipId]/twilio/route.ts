import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/dealerships/[dealershipId]/twilio
 * Get Twilio configuration for a dealership
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

    // Get tenant info
    const { data: tenant } = await supabase
      .from("tenants")
      .select("twilio_account_sid, twilio_configured")
      .eq("id", dealership.tenant_id)
      .single();

    // Get phone numbers for this tenant
    const { data: phoneNumbers } = await supabase
      .from("phone_numbers")
      .select("*")
      .eq("tenant_id", dealership.tenant_id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      configured: tenant?.twilio_configured || false,
      accountSid: tenant?.twilio_account_sid || null,
      phoneNumbers: phoneNumbers || [],
    });
  } catch (error) {
    console.error("[Twilio Config GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Twilio configuration" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/dealerships/[dealershipId]/twilio
 * Save Twilio credentials for a dealership
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

    const { accountSid, authToken } = body;

    if (!accountSid || !authToken) {
      return NextResponse.json(
        { error: "Account SID and Auth Token are required" },
        { status: 400 }
      );
    }

    // Validate credentials by making a test call to Twilio
    const isValid = await validateTwilioCredentials(accountSid, authToken);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid Twilio credentials" },
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

    // TODO: In production, encrypt the auth token using Supabase Vault or AWS Secrets Manager
    // For now, we'll store it with basic encryption (NOT production-ready)
    const encryptedToken = Buffer.from(authToken).toString("base64");

    // Update tenant with Twilio credentials
    const { error: updateError } = await supabase
      .from("tenants")
      .update({
        twilio_account_sid: accountSid,
        twilio_auth_token_encrypted: encryptedToken,
        twilio_configured: true,
      })
      .eq("id", dealership.tenant_id);

    if (updateError) {
      console.error("[Twilio Config POST] Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to save Twilio credentials" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Twilio credentials saved successfully",
    });
  } catch (error) {
    console.error("[Twilio Config POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to save Twilio credentials" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/dealerships/[dealershipId]/twilio
 * Remove Twilio credentials
 */
export async function DELETE(
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

    // Remove Twilio credentials
    const { error: updateError } = await supabase
      .from("tenants")
      .update({
        twilio_account_sid: null,
        twilio_auth_token_encrypted: null,
        twilio_configured: false,
      })
      .eq("id", dealership.tenant_id);

    if (updateError) {
      console.error("[Twilio Config DELETE] Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to remove Twilio credentials" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Twilio credentials removed successfully",
    });
  } catch (error) {
    console.error("[Twilio Config DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to remove Twilio credentials" },
      { status: 500 }
    );
  }
}

/**
 * Validate Twilio credentials by making a test API call
 * Vercel cache clear attempt
 */
async function validateTwilioCredentials(
  accountSid: string,
  authToken: string
): Promise<boolean> {
  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error("[Twilio Validation] Error:", error);
    return false;
  }
}
