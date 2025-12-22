import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // TODO: Add authentication when Supabase is set up
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/calls/:path*',
    '/agents/:path*',
    '/setup/:path*',
    '/api/:path*',
  ],
};
