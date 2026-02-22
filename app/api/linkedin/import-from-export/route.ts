import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { checkSubscription } from '@/lib/auth/session';
import { mapLinkedInExportToResume, type LinkedInExportData } from '@/lib/services/linkedin-to-resume';
import AdmZip from 'adm-zip';
import { parse } from 'csv-parse/sync';

const MAX_ZIP_BYTES = 50 * 1024 * 1024; // 50MB

function findInZip(zip: AdmZip, ...names: string[]): Buffer | null {
  for (const entry of zip.getEntries()) {
    if (!entry.isDirectory) {
      const n = (entry.entryName || '').split('/').pop() || '';
      for (const name of names) {
        if (n === name || n.toLowerCase() === name.toLowerCase()) return entry.getData();
      }
    }
  }
  return null;
}

function parseCsv(buf: Buffer): Record<string, string>[] {
  const text = buf.toString('utf-8');
  const rows = parse(text, { columns: true, skip_empty_lines: true, trim: true, relax_column_count: true });
  return Array.isArray(rows) ? rows : [];
}

/**
 * POST /api/linkedin/import-from-export
 * FormData: { file: File } (ZIP from LinkedIn "Get a copy of your data")
 * - Requires auth and premium. No third-party API key.
 * - Parses Profile.csv, Positions.csv, Education.csv, Skills.csv and returns ResumeData.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { hasActiveSubscription } = await checkSubscription(user.id);
    if (!hasActiveSubscription) {
      return NextResponse.json(
        { error: 'LinkedIn import is a premium feature. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    const formData = await request.formData().catch(() => null);
    const file = formData?.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Upload a LinkedIn data export ZIP. Use LinkedIn → Settings → Data Privacy → Get a copy of your data.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_ZIP_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Max 50MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let zip: AdmZip;
    try {
      zip = new AdmZip(buffer);
    } catch {
      return NextResponse.json(
        { error: 'Invalid or corrupted ZIP. Download a fresh export from LinkedIn: Settings → Data Privacy → Get a copy of your data.' },
        { status: 400 }
      );
    }

    const profileBuf = findInZip(zip, 'Profile.csv', 'Profile.CSV');
    const positionsBuf = findInZip(zip, 'Positions.csv', 'Position.csv', 'Positions.CSV');
    const educationBuf = findInZip(zip, 'Education.csv', 'Education.CSV');
    const skillsBuf = findInZip(zip, 'Skills.csv', 'Skills.CSV');

    const exportData: LinkedInExportData = {};

    if (profileBuf) {
      const rows = parseCsv(profileBuf);
      exportData.profile = rows[0] || {};
    }
    if (positionsBuf) {
      exportData.positions = parseCsv(positionsBuf);
    }
    if (educationBuf) {
      exportData.education = parseCsv(educationBuf);
    }
    if (skillsBuf) {
      exportData.skills = parseCsv(skillsBuf);
    }

    if (!exportData.profile && !(exportData.positions?.length) && !(exportData.education?.length)) {
      return NextResponse.json(
        {
          error:
            'No LinkedIn profile data found in the ZIP. Ensure you chose "Download larger data archive" and the ZIP contains Profile.csv, Positions.csv, or Education.csv. See: Settings → Data Privacy → Get a copy of your data.',
        },
        { status: 400 }
      );
    }

    const resume = mapLinkedInExportToResume(exportData, user.email ?? undefined);
    return NextResponse.json({ data: resume });
  } catch (e: any) {
    if (e?.message === 'Authentication required.' || e?.message === 'Session expired. Please log in again.') {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    console.error('LinkedIn import-from-export error:', e);
    return NextResponse.json(
      { error: e?.message || 'Failed to import from LinkedIn export' },
      { status: 500 }
    );
  }
}
