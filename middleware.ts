import { createServerClient, type CookieOptions } from '@supabase/ssr';
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
          // For OAuth flows, we need SameSite=None to preserve cookies during cross-site redirects
          // Only apply this for auth tokens to maintain security
          const isAuthToken = name.includes('auth-token');
          response.cookies.set(name, value, {
            ...options,
            sameSite: isAuthToken ? 'none' : 'lax',
            secure: true, // Required for SameSite=None
          });
        });
      },
    },
  });

  // IMPORTANT: Use getUser() instead of getSession() for validation
  // This validates the JWT and refreshes the session if needed
  const { data: { user }, error } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public routes (no auth required)
  const publicRoutes = ['/', '/login', '/signup', '/templates'];
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));
  
  // Allow OAuth callback routes to pass through without auth checks
  if (pathname.startsWith('/api/auth/linkedin')) {
    return response;
  }

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

  // TEMPORARY: Disabled account auth check for testing
  // TODO: Revert this - restore auth check before deployment
  // If user is not logged in and tries to access protected routes
  // if (!user && isProtectedRoute) {
  //   // Allow /builder for guest mode, but redirect /account
  //   if (pathname.startsWith('/account')) {
  //     return NextResponse.redirect(new URL('/login?redirect=' + encodeURIComponent(pathname), request.url));
  //   }
  //   // /builder is allowed for guests
  // }

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





