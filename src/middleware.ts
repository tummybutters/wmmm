import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Pass pathname to layout via header
  res.headers.set('x-pathname', req.nextUrl.pathname);
  
  const supabase = createMiddlewareClient(req, res);
  
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');
  const isAuthCallback = req.nextUrl.pathname.startsWith('/auth/callback');
  const isLandingPage = req.nextUrl.pathname === '/';

  // Redirect unauthenticated users to login, except for public pages
  if (!user && !isAuthPage && !isAuthCallback && !isLandingPage) {
    const url = req.nextUrl.clone(); 
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  // Redirect authenticated users away from auth pages
  if (user && (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup'))) {
    const url = req.nextUrl.clone(); 
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  
  return res;
}

export const config = { 
  matcher: ['/((?!_next|favicon.ico|public).*)'] 
};

