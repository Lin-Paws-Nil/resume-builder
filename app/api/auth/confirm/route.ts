import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Handle email confirmation for localhost development
 * This route accepts confirmation tokens and verifies the user's email
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const type = searchParams.get('type') || 'signup';
  const redirectTo = searchParams.get('redirect_to') || '/builder';

  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?error=Missing confirmation token`, request.url)
    );
  }

  try {
    const supabase = await createClient();

    // Verify the token and confirm the email using token hash method
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as 'signup' | 'email',
    });

    if (error) {
      console.error('Email confirmation error:', error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }

    if (data.user) {
      // Email confirmed successfully
      return NextResponse.redirect(
        new URL(`${redirectTo}?message=Email confirmed successfully`, request.url)
      );
    }

    return NextResponse.redirect(
      new URL('/login?error=Confirmation failed', request.url)
    );
  } catch (error: any) {
    console.error('Confirmation error:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message || 'Confirmation failed')}`, request.url)
    );
  }
}

