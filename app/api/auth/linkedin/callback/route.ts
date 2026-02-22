import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { mapIdentityMeToResume } from '@/lib/services/linkedin-to-resume';
import type { IdentityMeResponse } from '@/lib/services/linkedin-to-resume';
import type { ResumeData } from '@/lib/types/resume';

const LINKEDIN_VERSION = '202509';

function verifyState(state: string, secret: string): { u: string } | null {
  const i = state.lastIndexOf('.');
  if (i <= 0) return null;
  const base = state.slice(0, i);
  const sig = state.slice(i + 1);
  const expected = createHmac('sha256', secret).update(base).digest('base64url');
  if (sig !== expected) return null;
  try {
    const raw = Buffer.from(base, 'base64url').toString('utf8');
    const payload = JSON.parse(raw) as { u?: string };
    return typeof payload?.u === 'string' ? { u: payload.u } : null;
  } catch {
    return null;
  }
}

function createImportToken(resume: ResumeData, userId: string, secret: string): string {
  const payload = {
    r: resume,
    u: userId,
    exp: Date.now() + 5 * 60 * 1000,
  };
  const base = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = createHmac('sha256', secret).update(base).digest('base64url');
  return `${base}.${sig}`;
}

/**
 * GET /api/auth/linkedin/callback
 * LinkedIn OAuth callback: exchange code, call /identityMe, redirect to /builder?token=...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const errorParam = searchParams.get('error');

  const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
  const redirectBase = `${baseUrl}/builder`;

  if (errorParam) {
    const url = new URL(redirectBase);
    url.searchParams.set('error', `linkedin_oauth_${errorParam}`);
    return NextResponse.redirect(url.toString());
  }

  if (!code || !state) {
    const url = new URL(redirectBase);
    url.searchParams.set('error', 'linkedin_callback_missing');
    return NextResponse.redirect(url.toString());
  }

  const secret = process.env.LINKEDIN_IMPORT_SECRET || process.env.NEXTAUTH_SECRET;
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!secret || !clientId || !clientSecret) {
    const url = new URL(redirectBase);
    url.searchParams.set('error', 'linkedin_not_configured');
    return NextResponse.redirect(url.toString());
  }

  const parsed = verifyState(state, secret);
  if (!parsed) {
    const url = new URL(redirectBase);
    url.searchParams.set('error', 'linkedin_invalid_state');
    return NextResponse.redirect(url.toString());
  }

  const redirectUri = `${baseUrl}/api/auth/linkedin/callback`;

  // Exchange code for access token
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!tokenRes.ok) {
    const t = await tokenRes.text();
    console.error('LinkedIn token exchange failed:', tokenRes.status, t);
    const url = new URL(redirectBase);
    url.searchParams.set('error', 'linkedin_token_failed');
    return NextResponse.redirect(url.toString());
  }

  let tokenJson: { access_token?: string };
  try {
    tokenJson = (await tokenRes.json()) as { access_token?: string };
  } catch {
    const url = new URL(redirectBase);
    url.searchParams.set('error', 'linkedin_token_invalid');
    return NextResponse.redirect(url.toString());
  }

  const accessToken = tokenJson.access_token;
  if (!accessToken) {
    const url = new URL(redirectBase);
    url.searchParams.set('error', 'linkedin_no_token');
    return NextResponse.redirect(url.toString());
  }

  // GET /identityMe (Verified on LinkedIn)
  const meRes = await fetch('https://api.linkedin.com/rest/identityMe', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'LinkedIn-Version': LINKEDIN_VERSION,
    },
  });

  if (!meRes.ok) {
    const t = await meRes.text();
    console.error('LinkedIn identityMe failed:', meRes.status, t);
    const url = new URL(redirectBase);
    url.searchParams.set('error', 'linkedin_identity_failed');
    return NextResponse.redirect(url.toString());
  }

  let me: IdentityMeResponse;
  try {
    me = (await meRes.json()) as IdentityMeResponse;
  } catch {
    const url = new URL(redirectBase);
    url.searchParams.set('error', 'linkedin_identity_invalid');
    return NextResponse.redirect(url.toString());
  }

  const resume = mapIdentityMeToResume(me, undefined);
  const token = createImportToken(resume, parsed.u, secret);

  const url = new URL(redirectBase);
  url.searchParams.set('token', token);
  return NextResponse.redirect(url.toString());
}
