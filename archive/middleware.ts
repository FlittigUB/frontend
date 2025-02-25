/*
PASSWORD PROTECT
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PASSWORD = process.env.LAUNCH_PASSWORD || 'FlittigEKkkg';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const cookie = req.cookies.get('portal_auth');

  // Apply only for /portal and subpaths
  if (url.pathname.startsWith('/portal')) {
    if (cookie?.value === PASSWORD) {
      return NextResponse.next(); // Allow access if authenticated
    }
    return NextResponse.redirect(new URL('/portal-password', req.url)); // Redirect to password page
  }

  return NextResponse.next(); // Allow access to other pages
}

export const config = {
  matcher: '/portal/:path*', // Apply only to /portal and subpaths
};
*/
