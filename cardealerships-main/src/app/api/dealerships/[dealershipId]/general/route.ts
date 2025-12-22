import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    dealershipId: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { dealershipId } = await context.params;
  // TODO: Get general settings for dealership
  return NextResponse.json({ dealershipId, settings: null });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { dealershipId } = await context.params;
  // TODO: Update general settings for dealership
  // - Name, address, hours, timezone
  return NextResponse.json({ dealershipId, success: true });
}
