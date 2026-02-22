import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { createHmac } from 'node:crypto';
import type { ResumeData } from '@/lib/types/resume';

function verifyImportToken(token: string, secret: string): { r: ResumeData; u: string } | null {
  const i = token.lastIndexOf('.');
  if (i <= 0) return null;
  const base = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = createHmac('sha256', secret).update(base).digest('base64url');
  if (sig !== expected) return null;
  try {
    const raw = Buffer.from(base, 'base64url').toString('utf8');
    const payload = JSON.parse(raw) as { r?: ResumeData; u?: string; exp?: number };
    if (typeof payload?.u !== 'string' || !payload?.r || typeof payload?.exp !== 'number') return null;
    if (payload.exp < Date.now()) return null;
    return { r: payload.r, u: payload.u };
  } catch {
    return null;
  }
}

/**
 * GET /api/linkedin/oauth-import-data?token=...
 * One-time exchange: verify token from /builder?token=... (set by LinkedIn OAuth callback), ensure userId matches, return { data: resume }.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const token = request.nextUrl.searchParams.get('token');
    const secret = process.env.LINKEDIN_IMPORT_SECRET || process.env.NEXTAUTH_SECRET;

    if (!token || !secret) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    const parsed = verifyImportToken(token, secret);
    if (!parsed || parsed.u !== user.id) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data: parsed.r });
  } catch (e: unknown) {
    const msg = (e as Error)?.message;
    if (msg === 'Authentication required.' || msg === 'Session expired. Please log in again.') {
      return NextResponse.json({ error: msg }, { status: 401 });
    }
    return NextResponse.json({ data: null }, { status: 200 });
  }
}
