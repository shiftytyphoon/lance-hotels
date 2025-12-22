import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/twilio/test
 * Simple test endpoint to verify webhooks can reach the server
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "ok",
    message: "Webhook endpoint is reachable",
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/twilio/test
 * Test POST endpoint
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  console.log("[Twilio Test] Received POST:", body);

  return NextResponse.json({
    status: "ok",
    message: "POST received",
    receivedBody: body,
    timestamp: new Date().toISOString(),
  });
}
