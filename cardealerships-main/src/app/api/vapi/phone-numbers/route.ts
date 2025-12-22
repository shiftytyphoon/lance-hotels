import { NextRequest, NextResponse } from "next/server";

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_BASE_URL = "https://api.vapi.ai";

// Get all phone numbers
export async function GET() {
  if (!VAPI_API_KEY) {
    return NextResponse.json({ error: "VAPI_API_KEY not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(`${VAPI_BASE_URL}/phone-number`, {
      headers: {
        Authorization: `Bearer ${VAPI_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Vapi API error: ${response.statusText}`);
    }

    const phoneNumbers = await response.json();
    return NextResponse.json(phoneNumbers);
  } catch (error) {
    console.error("Error fetching phone numbers:", error);
    return NextResponse.json({ error: "Failed to fetch phone numbers" }, { status: 500 });
  }
}

// Import/create a phone number
export async function POST(request: NextRequest) {
  if (!VAPI_API_KEY) {
    return NextResponse.json({ error: "VAPI_API_KEY not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { provider, twilioAccountSid, twilioAuthToken, phoneNumber, sipUri, assistantId } = body;

    let payload: Record<string, unknown> = {};

    if (provider === "twilio") {
      payload = {
        provider: "twilio",
        number: phoneNumber,
        twilioAccountSid,
        twilioAuthToken,
        assistantId,
      };
    } else if (provider === "vonage") {
      payload = {
        provider: "vonage",
        number: phoneNumber,
        assistantId,
      };
    } else if (provider === "vapi") {
      // For Vapi-owned numbers, we'd use a different endpoint to buy
      payload = {
        provider: "vapi",
        assistantId,
      };
    } else if (provider === "byosip") {
      payload = {
        provider: "byosip",
        sipUri,
        assistantId,
      };
    }

    const response = await fetch(`${VAPI_BASE_URL}/phone-number`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vapi API error: ${error}`);
    }

    const phoneNumberData = await response.json();
    return NextResponse.json(phoneNumberData);
  } catch (error) {
    console.error("Error creating phone number:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create phone number" },
      { status: 500 }
    );
  }
}
