import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const roleCookie = request.cookies.get('role')?.value;
  const authCookie = request.cookies.get('authToken')?.value;
  
  const { pathname } = request.nextUrl;
  
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if ((pathname.startsWith('/organizer') || pathname.startsWith('/volunteer')) && (!authCookie || !roleCookie)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/organizer') && roleCookie !== 'organizer') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/volunteer') && roleCookie !== 'volunteer') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if ((pathname === '/' || pathname === '/login') && authCookie && roleCookie) {
    if (roleCookie === 'organizer') {
      return NextResponse.redirect(new URL('/organizer', request.url));
    } else if (roleCookie === 'volunteer') {
      return NextResponse.redirect(new URL('/volunteer', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
