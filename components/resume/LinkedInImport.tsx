'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Link2, Lock, ChevronDown, ChevronUp, Crown, FileArchive, Upload, Loader2 } from 'lucide-react';
import { useResumeStore } from '@/store/resume-store';
import { useAuth } from '@/lib/hooks/use-auth';
import { useSubscription } from '@/lib/hooks/use-subscription';
import { Notification } from '@/components/ui/notification';

const LINKEDIN_EXPORT_HELP =
  'https://www.linkedin.com/help/linkedin/answer/a427660/get-a-copy-of-your-linkedin-data';

export function LinkedInImport() {
  const router = useRouter();
  const { resume, setParsedResume, setPreviewResume } = useResumeStore();
  const { user, isGuest } = useAuth();
  const { subscription } = useSubscription(user?.id || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isPremium = !!(user && !isGuest && subscription?.canDownload);

  async function saveDraftIfNeeded() {
    if (!resume || !user) return;
    const draftTitle = `Draft - ${resume.title || 'My Resume'} - ${new Date().toISOString().slice(0, 10)}`;
    const draftResume = {
      ...resume,
      id: crypto.randomUUID(),
      title: draftTitle,
      updatedAt: new Date().toISOString(),
    };
    try {
      const r = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: draftResume,
          title: draftTitle,
          templateId: resume.templateId || 'aurora',
        }),
      });
      if (!r.ok) console.warn('Could not save current resume as draft');
    } catch {
      console.warn('Could not save current resume as draft');
    }
  }

  function onImportSuccess(data: unknown) {
    setParsedResume(data as any);
    setPreviewResume(data as any);
    setShowSuccess(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleImportFromExport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setExportLoading(true);
    try {
      await saveDraftIfNeeded();
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/linkedin/import-from-export', { method: 'POST', body: form });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || `Import failed (${res.status})`);
        return;
      }
      if (!json.data) {
        setError('Invalid response from server');
        return;
      }
      onImportSuccess(json.data);
    } catch (e: any) {
      setError(e?.message || 'Failed to import from LinkedIn export');
    } finally {
      setExportLoading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      {showSuccess && (
        <Notification
          message="Imported from LinkedIn! Click 'Preview and Save' to apply to your editor."
          onClose={() => setShowSuccess(false)}
          duration={6000}
        />
      )}
      <div className="border rounded-lg bg-card mt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-[#0A66C2]" />
            <h3 className="font-semibold">Import from LinkedIn</h3>
            {isPremium ? (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Premium</span>
            ) : (
              <Lock className="h-4 w-4 text-amber-600" />
            )}
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-4">
            {!user || isGuest ? (
              <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 space-y-3">
                <p className="text-sm text-blue-900">
                  This feature is only available for logged in users.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    window.location.href = '/login?redirect=' + encodeURIComponent('/builder');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Log In
                </Button>
              </div>
            ) : !isPremium ? (
              <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 space-y-3">
                <p className="text-sm text-amber-900">
                  Import your resume from your LinkedIn profile. This feature is available on paid plans.
                </p>
                <Button
                  onClick={() => router.push('/subscribe?return=' + encodeURIComponent('/builder'))}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to use
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Sign in with LinkedIn to import your <strong>name, email, and profile picture</strong>. For experience, education, and skills, add them manually or upload a LinkedIn data export (ZIP).
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    window.location.href = '/api/auth/linkedin';
                  }}
                  className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white"
                >
                  Sign in with LinkedIn to import
                </Button>

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                    <FileArchive className="h-4 w-4" />
                    Or import from your LinkedIn data export
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    <a href={LINKEDIN_EXPORT_HELP} target="_blank" rel="noopener noreferrer" className="underline">
                      LinkedIn → Settings &amp; Privacy → Data Privacy → Get a copy of your data
                    </a>
                    . Choose &quot;Download larger data archive&quot; and upload the ZIP here.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip,application/zip,application/x-zip-compressed"
                    onChange={handleImportFromExport}
                    disabled={exportLoading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={exportLoading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    {exportLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload LinkedIn export (ZIP)
                      </>
                    )}
                  </Button>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
