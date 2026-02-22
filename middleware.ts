import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If environment variables are missing, skip auth and allow request to continue
  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase environment variables not set in middleware');
    }
    return response;
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.error('Invalid Supabase URL format:', supabaseUrl);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Try to get session, but handle errors gracefully
  // If fetch fails (network issues, invalid credentials, etc.), treat as unauthenticated
  // Using getSession() instead of getUser() as it's lighter and more reliable in edge runtime
  let user = null;
  
  // First check if there are any auth cookies to avoid unnecessary requests
  const hasAuthCookies = request.cookies.getAll().some(
    (cookie) => cookie.name.includes('sb-') && cookie.name.includes('auth-token')
  );
  
  // Only attempt to get session if auth cookies are present
  if (hasAuthCookies) {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      
      // Only set user if there's no error and session exists with a user
      if (!error && session?.user) {
        user = session.user;
      }
    } catch (error: any) {
      // If fetch fails or any other error occurs, silently continue
      // This allows the middleware to continue processing the request
      // The error is already logged by Supabase internally
      user = null;
    }
  }

  const { pathname } = request.nextUrl;

  // Public routes (no auth required)
  const publicRoutes = ['/', '/login', '/signup', '/templates'];
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));

  // Protected routes (require auth)
  const protectedRoutes = ['/account', '/builder'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Auth routes (redirect if already logged in)
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(pathname);

  // If user is logged in and tries to access auth pages, redirect to builder
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/builder', request.url));
  }

  // If user is not logged in and tries to access protected routes
  if (!user && isProtectedRoute) {
    // Allow /builder for guest mode, but redirect /account
    if (pathname.startsWith('/account')) {
      return NextResponse.redirect(new URL('/login?redirect=' + encodeURIComponent(pathname), request.url));
    }
    // /builder is allowed for guests
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};





