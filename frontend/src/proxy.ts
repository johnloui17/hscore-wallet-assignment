import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const userId = request.cookies.get('pocketfeel_user_id')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';

  // If trying to access protected route without userId, redirect to login
  if (!userId && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login page with userId, redirect to home
  if (userId && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
