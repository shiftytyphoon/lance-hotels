import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Get current dealership for logged in user
  // - Get user from session
  // - Look up dealership membership
  // - Return dealership data
  return NextResponse.json({ dealership: null });
}

export async function POST() {
  // TODO: Create dealership for logged in user
  // - Create dealership row
  // - Add user as admin member
  return NextResponse.json({ dealership: null });
}
