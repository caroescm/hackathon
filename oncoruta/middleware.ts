import { NextResponse, type NextRequest } from "next/server";

// Middleware no-op: auth is handled at the page/layout level via createClient()
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
