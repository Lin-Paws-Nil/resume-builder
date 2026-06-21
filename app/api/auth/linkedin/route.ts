import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { checkSubscription } from '@/lib/auth/session';
import { createHmac } from 'node:crypto';

// Use OpenID Connect scopes for better data access
const SCOPE = 'openid profile email';

function sign(payload: object, secret: string): string {
  const base = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = createHmac('sha256', secret).update(base).digest('base64url');
  return `${base}.${sig}`;
}

/**
 * GET /api/auth/linkedin
 * Redirects to LinkedIn OAuth using OpenID Connect.
 * Requires auth and premium. State carries signed userId for callback.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { hasActiveSubscription } = await checkSubscription(user.id);
    if (!hasActiveSubscription) {
      const url = new URL('/builder', request.url);
      url.searchParams.set('error', 'linkedin_premium');
      return NextResponse.redirect(url);
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const secret = process.env.LINKEDIN_IMPORT_SECRET || process.env.NEXTAUTH_SECRET;
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;

    if (!clientId || !clientSecret || !secret) {
      const missing = [
        !clientId && 'LINKEDIN_CLIENT_ID',
        !clientSecret && 'LINKEDIN_CLIENT_SECRET',
        !secret && 'LINKEDIN_IMPORT_SECRET or NEXTAUTH_SECRET',
      ].filter(Boolean);
      const url = new URL('/builder', request.url);
      url.searchParams.set('error', 'linkedin_config');
      url.searchParams.set('message', `LinkedIn import is not configured. Add to .env.local and restart: ${missing.join(', ')}`);
      return NextResponse.redirect(url);
    }

    const redirectUri = `${baseUrl}/api/auth/linkedin/callback`;
    const state = sign({ u: user.id }, secret);

    console.log('LinkedIn OAuth Init:', {
      baseUrl,
      redirectUri,
      clientId,
      scope: SCOPE,
    });

    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', SCOPE);
    authUrl.searchParams.set('state', state);

    console.log('Redirecting to LinkedIn:', authUrl.toString());
    return NextResponse.redirect(authUrl.toString());
  } catch (e: unknown) {
    const msg = (e as Error)?.message;
    if (msg === 'Authentication required.' || msg === 'Session expired. Please log in again.') {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', '/builder');
      return NextResponse.redirect(url);
    }
    console.error('LinkedIn OAuth init error:', e);
    const url = new URL('/builder', request.url);
    url.searchParams.set('error', 'linkedin_oauth_error');
    url.searchParams.set('message', msg || 'Failed to start LinkedIn import');
    return NextResponse.redirect(url);
  }
}
