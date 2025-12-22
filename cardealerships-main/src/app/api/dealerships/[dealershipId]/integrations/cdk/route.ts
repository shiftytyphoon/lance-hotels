import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    dealershipId: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { dealershipId } = await context.params;
  // TODO: Get CDK integration status
  return NextResponse.json({ dealershipId, cdk: null });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { dealershipId } = await context.params;
  // TODO: Connect CDK integration
  // - Validate credentials
  // - Save to integrations table
  return NextResponse.json({ dealershipId, success: true });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { dealershipId } = await context.params;
  // TODO: Disconnect CDK integration
  return NextResponse.json({ dealershipId, success: true });
}
