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
import { SparkleButton } from '@/components/ui/sparkle-button';
import { Spinner } from '@/components/ui/spinner';
import { Download, LogOut, Undo, Redo, Eye, GripVertical, User, Lock, FileText, ZoomIn, ZoomOut } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { useAuth } from '@/lib/hooks/use-auth';
import { useSubscription } from '@/lib/hooks/use-subscription';
import { SessionWarning } from '@/components/ui/session-warning';
import { Notification } from '@/components/ui/notification';
import { ToastProvider, showToast } from '@/components/ui/toast';
import { useConfirmDialog } from '@/components/ui/confirm-dialog';
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
  const { confirm, ConfirmDialog } = useConfirmDialog();
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(640);
  const [isResizing, setIsResizing] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const [forceRender, setForceRender] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const resizeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

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
      showToast({
        title: 'No Resume Data',
        description: 'Please add some content first.',
        type: 'error'
      });
      return;
    }

    // Check if user is logged in
    if (isGuest || !user) {
      const shouldLogin = await confirm({
        title: 'Login Required',
        description: 'You need to log in to download your resume. Would you like to go to the login page?',
        confirmText: 'Go to Login',
        cancelText: 'Not now',
        type: 'info',
        confirmVariant: 'default',
      });
      
      if (shouldLogin) {
        window.open('/login?redirect=' + encodeURIComponent('/builder'), '_blank');
      }
      return;
    }

    // Check subscription
    if (!subscription?.canDownload) {
      const shouldUpgrade = await confirm({
        title: 'Premium Feature',
        description: 'PDF download requires an active subscription. Would you like to upgrade your plan?',
        confirmText: 'Upgrade Now',
        cancelText: 'Maybe later',
        type: 'warning',
        confirmVariant: 'green',
      });
      
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
      showToast({ 
        title: 'Download Failed', 
        description: error.message || 'Failed to download resume. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreviewAndSave = async () => {
    if (parsedResume) {
      setResume(parsedResume);
      setPreviewResume(parsedResume);
      setParsedResume(null);
      showToast({ 
        title: 'Applied!', 
        description: 'Imported resume has been applied', 
        type: 'success' 
      });
    } else if (resume) {
      setPreviewResume(resume);
      saveResume();
      
      if (user) {
        await saveResumeToSupabase();
      }
      showToast({ 
        title: 'Saved!', 
        description: 'Resume saved successfully', 
        type: 'success' 
      });
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
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Spinner size={48} className="mx-auto mb-4" />
          <p className="text-gray-600">Loading builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Debug Panel - Always visible */}
      <div className="bg-yellow-100 border-b-2 border-yellow-400 px-4 py-2 text-xs font-mono z-50 relative">
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
      <header className="border-b border-gray-200 bg-white px-6 py-4 relative z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                // TEMPORARY: Direct navigation to /account without auth check
                // TODO: Revert this - restore auth check before deployment
                router.push('/account');
              }}
              variant="ghost"
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              title="Profile"
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
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">resumebuilder.io</h1>
            </div>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-600">Resume Builder</span>
            {isGuest && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full border border-yellow-300">
                Guest Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-1">
              <Button
                onClick={undo}
                disabled={!isMounted || !canUndo()}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                onClick={redo}
                disabled={!isMounted || !canRedo()}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            <GradientButton
              onClick={handleDownload}
              disabled={!isMounted || isDownloading || !resume}
              className="px-6 py-2.5 text-sm min-w-[140px]"
              title={isGuest ? 'Log in to download' : !subscription?.canDownload ? 'Upgrade to download' : 'Download PDF'}
            >
              {isDownloading ? (
                <>
                  <Spinner size={16} invert className="mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </GradientButton>
            {user && !isGuest && (
              <GradientButton
                onClick={signOut}
                variant="secondary"
                className="px-4 py-2 text-sm min-w-[100px]"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </GradientButton>
            )}
            {(!user || isGuest) && (
              <GradientButton
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = '/login?redirect=' + encodeURIComponent('/builder');
                }}
                variant="secondary"
                className="px-4 py-2 text-sm min-w-[100px]"
              >
                Log In
              </GradientButton>
            )}
          </div>
        </div>
      </header>

      {/* Template Bar */}
      <TemplateBar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-auto relative" style={{ marginLeft: `${leftPanelWidth}px` }}>
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] opacity-20 pointer-events-none"></div>
          <div className="min-h-full flex items-start justify-center py-8 relative z-10">
            <div 
              className="bg-white shadow-2xl" 
              style={{ 
                width: '210mm',
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.3s ease-out'
              }}
            >
              <ResumePreview />
            </div>
          </div>

          {/* Zoom Controls - Bottom Right */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-20">
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 150}
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
              title="Zoom In"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 rounded-full px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-200 text-xs font-semibold border border-gray-200"
              title="Reset Zoom"
            >
              {zoomLevel}%
            </button>
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
              title="Zoom Out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div 
          className="bg-white overflow-hidden flex flex-col border-r border-gray-200 shadow-xl absolute left-0 top-0 bottom-0 z-10"
          style={{ width: `${leftPanelWidth}px`, minWidth: '250px' }}
        >
          <div className="p-4 border-b border-gray-200 space-y-0">
            <ResumeUpload />
            <LinkedInImport />
          </div>
          
          <div className="px-4 py-4 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-200">
            <SparkleButton
              onClick={handlePreviewAndSave}
              className="w-full text-sm px-3 py-1.5"
            >
              Preview and Save
            </SparkleButton>
            {parsedResume && (
              <p className="text-xs text-blue-700 mt-2 text-center font-medium">
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
      
      <ToastProvider />
      <ConfirmDialog />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Spinner size={48} className="mx-auto mb-4" />
          <p className="text-gray-600">Loading builder...</p>
        </div>
      </div>
    }>
      <BuilderPageContent />
    </Suspense>
  );
}
