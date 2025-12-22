import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    dealershipId: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { dealershipId } = await context.params;
  // TODO: List all agents for dealership
  return NextResponse.json({ dealershipId, agents: [] });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { dealershipId } = await context.params;
  // TODO: Create new agent
  return NextResponse.json({ dealershipId, agent: null });
}
