import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    dealershipId: string;
    agentType: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { dealershipId, agentType } = await context.params;
  // agentType will be "reception" | "service" | "sales"
  // TODO: Get agent configuration
  // - Enabled status
  // - Persona settings
  // - Tool call settings
  return NextResponse.json({ dealershipId, agentType, config: null });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { dealershipId, agentType } = await context.params;
  // agentType will be "reception" | "service" | "sales"
  // TODO: Update agent configuration
  // - Update in database
  // - Sync with Vapi agent
  return NextResponse.json({ dealershipId, agentType, success: true });
}
