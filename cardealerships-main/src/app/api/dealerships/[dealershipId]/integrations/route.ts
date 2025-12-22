import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    dealershipId: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { dealershipId } = await context.params;
  // TODO: List all integrations for dealership
  return NextResponse.json({ dealershipId, integrations: [] });
}
