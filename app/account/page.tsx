'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Settings, LayoutDashboard, CreditCard, LogOut, Camera, User, FileText, ArrowLeft, AlertCircle } from 'lucide-react';
import { AccountSettings } from '@/components/account/AccountSettings';
import { Dashboard } from '@/components/account/Dashboard';
import { PaymentInfo } from '@/components/account/PaymentInfo';
import { SubscriptionUpgrade } from '@/components/account/SubscriptionUpgrade';
import { ReportIssue } from '@/components/account/ReportIssue';
import { useAuth } from '@/lib/hooks/use-auth';
import { useSubscription } from '@/lib/hooks/use-subscription';
import { createClient } from '@/lib/supabase/client';
import { PLANS } from '@/lib/types/subscription';
import { ToastProvider } from '@/components/ui/toast';

type TabType = 'settings' | 'dashboard' | 'payment' | 'report';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMounted, setIsMounted] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading, isGuest, signOut } = useAuth();
  const { subscription, loading: subLoading } = useSubscription(user?.id || null);
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile picture from Supabase
  useEffect(() => {
    if (user?.id) {
      const loadProfilePicture = async () => {
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
      };
      loadProfilePicture();
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if there's a default tab preference from navigation
    if (typeof window !== 'undefined') {
      const defaultTab = sessionStorage.getItem('accountDefaultTab');
      if (defaultTab && (defaultTab === 'dashboard' || defaultTab === 'settings' || defaultTab === 'payment')) {
        setActiveTab(defaultTab as TabType);
        // Clear the preference after using it
        sessionStorage.removeItem('accountDefaultTab');
      }
    }
  }, []);

  // TEMPORARY: Disabled authentication redirect for testing
  // TODO: Revert this - restore auth check before deployment
  // useEffect(() => {
  //   if (!authLoading && (isGuest || !user)) {
  //     router.push('/login?redirect=' + encodeURIComponent('/account'));
  //   }
  // }, [authLoading, isGuest, user, router]);

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setProfilePicture(result);
        
        // Save to Supabase
        try {
          // For now, store as data URL in profile table
          // In production, you'd upload to Supabase Storage and store the URL
          await supabase
            .from('profiles')
            .update({ profile_picture_url: result })
            .eq('id', user.id);
        } catch (error) {
          console.error('Error saving profile picture:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  // TEMPORARY: Disabled auth checks for testing
  // TODO: Revert this - restore auth check before deployment
  // Show loading while checking auth
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // TEMPORARY: Disabled - allow rendering without auth
  // Don't render if not authenticated (redirect will happen)
  // if (isGuest || !user) {
  //   return null;
  // }

  const currentPlan = subscription?.plan || 'free';

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings' as TabType, label: 'Account Settings', icon: Settings },
    { id: 'payment' as TabType, label: 'Plan Information', icon: CreditCard },
    { id: 'report' as TabType, label: 'Report an Issue', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      <ToastProvider />
      {/* Animated background grid */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] opacity-20"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* White Header - Full Width */}
      <header className="bg-white border-b border-gray-200 relative z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">resumebuilder.io</h1>
            </div>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-600">Account</span>
            {isMounted && currentPlan !== 'free' && (
              <>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-300 font-semibold">
                  {PLANS[currentPlan].icon} {PLANS[currentPlan].name}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-73px)]">
        {/* Glassmorphism Sidebar */}
        <aside className="w-72 flex-shrink-0 flex flex-col backdrop-blur-xl bg-white/5 border-r border-white/10">
          {/* Profile Section */}
          <div className="p-6 border-b border-white/10">
            <div className="relative w-24 h-24 mx-auto mb-4">
              {profilePicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-indigo-500/50 shadow-lg"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-indigo-500/50 flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10 text-white" />
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
                title="Change profile picture"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-white">
                {user?.username || user?.email?.split('@')[0] || 'User'}
              </p>
              {isMounted && currentPlan !== 'free' && (
                <span className="inline-block mt-2 text-xs bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full border border-yellow-500/30 font-semibold">
                  {PLANS[currentPlan].icon} {PLANS[currentPlan].name}
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-grow p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${
                      activeTab === tab.id
                        ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Button
              onClick={() => router.push('/builder')}
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Builder
            </Button>
          </div>
        </aside>

        {/* Main Content Area - Dark Gradient Background */}
        <main className="flex-grow bg-gradient-to-br from-gray-900 to-gray-800 overflow-auto">
          <div className="p-8">
            {activeTab === 'settings' && <AccountSettings />}
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'payment' && (
              <SubscriptionUpgrade
                currentPlan={currentPlan}
                onUpgrade={(plan) => {
                  alert(`Upgrading to ${plan} plan. Payment processing would happen here.`);
                }}
              />
            )}
            {activeTab === 'report' && <ReportIssue />}
          </div>
        </main>
      </div>
    </div>
  );
}

