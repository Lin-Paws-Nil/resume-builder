'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import { LinkedInImport } from '@/components/resume/LinkedInImport';
import { SectionEditor } from '@/components/resume/SectionEditor';
import { TemplateBar } from '@/components/resume/TemplateBar';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Download, LogOut, Undo, Redo, Eye, GripVertical, User, Lock } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useSubscription } from '@/lib/hooks/use-subscription';
import { SessionWarning } from '@/components/ui/session-warning';
import { Notification } from '@/components/ui/notification';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

function BuilderPageContent() {
  const { 
    resume, 
    setResume, 
    saveResume, 
    setSelectedTemplate,
    parsedResume,
    setParsedResume,
    setPreviewResume,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useResumeStore();
  
  const { user, loading: authLoading, isGuest, signOut } = useAuth();
  const { subscription, loading: subLoading } = useSubscription(user?.id || null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(640);
  const [isResizing, setIsResizing] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const [forceRender, setForceRender] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  // Load profile picture from Supabase
  const loadProfilePicture = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_picture_url')
        .eq('id', user.id)
        .single();
      
      if (profile?.profile_picture_url) {
        setProfilePicture(profile.profile_picture_url);
      }
    } catch (error) {
      console.error('Error loading profile picture:', error);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    if (user?.id) {
      loadProfilePicture();
    } else if (isGuest) {
      // Try to load from localStorage for backward compatibility
      const savedPicture = localStorage.getItem('profile_picture_guest');
      if (savedPicture) {
        setProfilePicture(savedPicture);
      }
    }
  }, [user, isGuest, loadProfilePicture]);

  // Track session time remaining
  useEffect(() => {
    if (!user || isGuest) return;

    const checkSessionTime = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.expires_at) {
        const now = Math.floor(Date.now() / 1000);
        const remaining = session.expires_at - now;
        setSessionTimeRemaining(Math.max(0, remaining));
      }
    };

    checkSessionTime();
    const interval = setInterval(checkSessionTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, [user, isGuest, supabase]);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    
    // Load left panel width from localStorage
    const savedWidth = localStorage.getItem('leftPanelWidth');
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (!isNaN(width) && width >= 250) {
        setLeftPanelWidth(width);
      }
    }
  }, []);

  // Handle template selection from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const templateFromUrl = urlParams.get('template');
      if (templateFromUrl) {
        setSelectedTemplate(templateFromUrl);
      }
    }
  }, [setSelectedTemplate]);

  // Handle LinkedIn OAuth import: ?token= from /api/auth/linkedin/callback
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const errorMessage = searchParams.get('message');
    
    if (error) {
      let message = 'An error occurred with LinkedIn import.';
      if (error === 'linkedin_premium') {
        message = 'LinkedIn import requires a premium subscription. Please upgrade to use this feature.';
      } else if (error === 'linkedin_config') {
        message = errorMessage || 'LinkedIn import is not configured. Please check your environment variables.';
      } else if (error === 'linkedin_oauth_error') {
        message = errorMessage || 'Failed to start LinkedIn import. Please try again.';
      }
      
      setNotification({ message, type: 'error' });
      // Remove error from URL
      const u = new URL(window.location.href);
      u.searchParams.delete('error');
      u.searchParams.delete('message');
      window.history.replaceState({}, '', u.pathname + u.search);
      return;
    }
    
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`/api/linkedin/oauth-import-data?token=${encodeURIComponent(token)}`);
        const json = (await res.json().catch(() => ({}))) as { data?: unknown; error?: string };
        if (json?.data) {
          setParsedResume(json.data as any);
          setPreviewResume(json.data as any);
          setNotification({ message: "Imported from LinkedIn. Click 'Preview and Save' to apply.", type: 'success' });
        } else if (json?.error) {
          setNotification({ message: json.error, type: 'error' });
        }
      } catch {
        // ignore
      } finally {
        // Remove token from URL
        const u = new URL(window.location.href);
        u.searchParams.delete('token');
        u.searchParams.delete('error');
        window.history.replaceState({}, '', u.pathname + u.search);
      }
    })();
  }, [searchParams, setParsedResume, setPreviewResume]);

  // Initialize resume if it doesn't exist
  useEffect(() => {
    if (!resume) {
      const initialResume = {
        id: crypto.randomUUID(),
        title: 'My Resume',
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
        },
        summary: '',
        experiences: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        hobbies: [],
        customSections: [],
        sectionOrder: ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'hobbies'],
        sectionNames: {
          personalInfo: 'Personal Information',
          summary: 'Summary',
          experiences: 'Experience',
          education: 'Education',
          skills: 'Skills',
          projects: 'Projects',
          certifications: 'Certifications',
          hobbies: 'Hobbies',
        },
        templateId: 'aurora',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setResume(initialResume);
      setPreviewResume(initialResume);
    }
  }, [resume, setResume, setPreviewResume]);

  // Save resume to Supabase when user is logged in
  const saveResumeToSupabase = async () => {
    if (!user || !resume) return;

    try {
      const response = await fetch('/api/resumes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: resume.id,
          resumeData: resume,
          title: resume.title,
          templateId: resume.templateId || 'aurora',
        }),
      });

      if (!response.ok) {
        // If resume doesn't exist, create it
        if (response.status === 404) {
          await fetch('/api/resumes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resumeData: resume,
              title: resume.title,
              templateId: resume.templateId || 'aurora',
            }),
          });
        }
      }
    } catch (error) {
      console.error('Error saving resume to Supabase:', error);
    }
  };

  const handleDownload = async () => {
    if (!resume) {
      alert('No resume data to download. Please add some content first.');
      return;
    }

    // Check if user is logged in
    if (isGuest || !user) {
      const shouldLogin = confirm('You need to log in to download your resume. Would you like to go to the login page?');
      if (shouldLogin) {
        window.location.href = '/login?redirect=' + encodeURIComponent('/builder');
      }
      return;
    }

    // Check subscription
    if (!subscription?.canDownload) {
      const shouldUpgrade = confirm('PDF download requires an active subscription. Would you like to upgrade your plan?');
      if (shouldUpgrade) {
        router.push('/subscribe?return=' + encodeURIComponent('/builder'));
      }
      return;
    }

    setIsDownloading(true);
    try {
      const { downloadResumeAsPDF } = await import('@/lib/utils/download-pdf');
      // Generate filename from user's name if available
      const filename = resume.personalInfo?.fullName 
        ? `${resume.personalInfo.fullName.replace(/[^a-z0-9]/gi, '_')}_Resume.pdf`
        : 'resume.pdf';
      await downloadResumeAsPDF(resume, filename);
      setNotification({ message: 'Resume downloaded successfully!', type: 'success' });
    } catch (error: any) {
      console.error('Download error:', error);
      setNotification({ message: error.message || 'Failed to download resume. Please try again.', type: 'error' });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreviewAndSave = async () => {
    if (parsedResume) {
      setResume(parsedResume);
      setPreviewResume(parsedResume);
      setParsedResume(null);
    } else if (resume) {
      setPreviewResume(resume);
      saveResume(); // Save to localStorage
      
      // Also save to Supabase if user is logged in
      if (user) {
        await saveResumeToSupabase();
      }
    }
  };

  const handleExtendSession = async () => {
    await supabase.auth.refreshSession();
    setSessionTimeRemaining(900); // Reset to 15 minutes
  };

  // Handle panel resizing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = e.clientX;
    const minWidth = 250;
    if (newWidth >= minWidth) {
      setLeftPanelWidth(newWidth);
      localStorage.setItem('leftPanelWidth', newWidth.toString());
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Add a timeout to prevent infinite loading (graceful degradation)
  useEffect(() => {
    if (authLoading || subLoading) {
      const timeout = setTimeout(() => {
        // Silently force render if loading takes too long (network may be slow)
        setForceRender(true);
      }, 8000); // 8 second timeout - render anyway if auth/subscription is slow
      return () => clearTimeout(timeout);
    } else {
      setForceRender(false);
    }
  }, [authLoading, subLoading]);

  // If loading takes too long, render anyway (graceful degradation)
  if ((authLoading || subLoading) && !forceRender) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          <p className="text-xs text-gray-400 mt-2">If this takes too long, check the browser console</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Debug Panel - Always visible */}
      <div className="bg-yellow-100 border-b-2 border-yellow-400 px-4 py-2 text-xs font-mono z-50">
        <strong>DEBUG:</strong> User: {user ? `✅ ${user.email}` : '❌ null'} | 
        IsGuest: {isGuest ? '❌ TRUE' : '✅ FALSE'} | 
        AuthLoading: {authLoading ? 'YES' : 'NO'} | 
        SubLoading: {subLoading ? 'YES' : 'NO'} |
        Premium: {subscription?.canDownload ? '✅ YES' : '❌ NO'} |
        Mounted: {isMounted ? 'YES' : 'NO'}
      </div>
      
      {/* Session Warning */}
      {user && !isGuest && sessionTimeRemaining > 0 && (
        <SessionWarning
          onExtend={handleExtendSession}
          onLogout={signOut}
          timeRemaining={sessionTimeRemaining}
        />
      )}


      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                if (isGuest || !user) {
                  window.location.href = '/login?redirect=' + encodeURIComponent('/account');
                  return;
                }
                router.push('/account');
              }}
              variant="ghost"
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              title={isGuest ? 'Log in to access profile' : 'Profile'}
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-gray-600" />
              )}
            </Button>
            <h1 className="text-2xl font-bold text-blue-600">resumebuilder.io</h1>
            <span className="text-sm text-gray-500">|</span>
            <span className="text-sm text-gray-600">Resume Builder</span>
            {isGuest && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Guest Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border-r pr-3 mr-1">
              <Button
                onClick={undo}
                disabled={!isMounted || !canUndo()}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                onClick={redo}
                disabled={!isMounted || !canRedo()}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleDownload}
              disabled={!isMounted || isDownloading || !resume}
              variant="default"
              className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
              title={isGuest ? 'Log in to download' : !subscription?.canDownload ? 'Upgrade to download' : 'Download PDF'}
            >
              {isDownloading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
            {user && !isGuest && (
              <Button
                onClick={signOut}
                variant="ghost"
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
            {(!user || isGuest) && (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('=== LOGIN BUTTON CLICKED ===');
                  console.log('User:', user);
                  console.log('IsGuest:', isGuest);
                  console.log('AuthLoading:', authLoading);
                  console.log('==========================');
                  alert('Login button clicked! Check console for details.');
                  window.location.href = '/login?redirect=' + encodeURIComponent('/builder');
                }}
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Template Bar */}
      <TemplateBar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center bg-gray-50 overflow-hidden" style={{ marginLeft: `${leftPanelWidth}px` }}>
          <div className="bg-white shadow-lg overflow-auto" style={{ width: '210mm', height: '100%' }}>
            <ResumePreview />
          </div>
        </div>

        <div 
          className="bg-white overflow-hidden flex flex-col border-r shadow-xl absolute left-0 top-0 bottom-0 z-10"
          style={{ width: `${leftPanelWidth}px`, minWidth: '250px' }}
        >
          <div className="p-4 border-b space-y-0">
            <ResumeUpload />
            <LinkedInImport />
          </div>
          
          <div className="px-4 py-4 bg-green-50 shadow-sm">
            <Button
              onClick={handlePreviewAndSave}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md py-2.5"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview and Save
            </Button>
            {parsedResume && (
              <p className="text-xs text-green-700 mt-2 text-center font-medium">
                Click to apply the imported resume to your editor
              </p>
            )}
          </div>
          
          <div className="flex-1 min-h-0 overflow-y-auto">
            <SectionEditor />
          </div>
        </div>

        <div
          ref={resizeRef}
          onMouseDown={handleMouseDown}
          className={`absolute left-0 top-0 bottom-0 w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors z-20 ${
            isResizing ? 'bg-blue-500' : ''
          }`}
          style={{ 
            cursor: 'col-resize',
            left: `${leftPanelWidth}px`
          }}
        >
          <div className="h-full w-full flex items-center justify-center">
            <GripVertical className="h-6 w-6 text-gray-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          onClose={() => setNotification(null)}
          type={notification.type || 'success'}
        />
      )}
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BuilderPageContent />
    </Suspense>
  );
}
