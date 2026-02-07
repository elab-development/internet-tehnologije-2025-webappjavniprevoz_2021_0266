import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose'; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const token = request.cookies.get('auth')?.value;

  let isAdmin = false;
  if (token) {
    try {
      const payload = decodeJwt(token) as { admin?: boolean };
      isAdmin = !!payload.admin;
    } catch (e) {
      if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin') || pathname.startsWith('/api/korisnik')) {
        return NextResponse.json({ error: "Nevalidan ili istekao token. Prijavite se ponovo." }, { status: 401 });
      }
    }
  }


  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!token) {
      if (!pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }
    if (!isAdmin) {
      return NextResponse.json({ error: "Pristup odbijen: Niste admin" }, { status: 403 });
    }
  }

  if (pathname.includes('omiljen')) {
    if (isAdmin) {
      return NextResponse.json(
        { error: "Administratori ne mogu koristiti omiljene stavke." }, 
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  const isGlobalResource = 
    pathname.startsWith('/api/linije') || 
    pathname.startsWith('/api/stajalista') || 
    pathname.startsWith('/api/tipPrevoza') ||
    pathname.startsWith('/api/linije-stajalista');

  const isWriteAction = ['POST', 'PUT', 'DELETE'].includes(method);

  if (isGlobalResource && isWriteAction) {
    if (!token) return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    if (!isAdmin) return NextResponse.json({ error: "Pristup odbijen: Niste admin" }, { status: 403 });
  }

  if (pathname.startsWith('/api/korisnik') && !pathname.includes('omiljen')) {
    if (!token) return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    if (!isAdmin) return NextResponse.json({ error: "Pristup odbijen: Niste admin" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/linije/:path*',
    '/api/stajalista/:path*',
    '/api/tipPrevoza/:path*',
    '/api/linije-stajalista/:path*',
    '/api/korisnik/:path*',
    '/api/admin/:path*', 
    '/admin/:path*',     
  ],
};