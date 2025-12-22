import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    dealershipId: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { dealershipId } = await context.params;
  // TODO: Get telephony config for dealership
  // - Phone numbers
  // - SIP configuration
  // - Transfer numbers
  return NextResponse.json({ dealershipId, telephony: null });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { dealershipId } = await context.params;
  // TODO: Update telephony config
  // - Main phone, SIP settings
  return NextResponse.json({ dealershipId, success: true });
}
