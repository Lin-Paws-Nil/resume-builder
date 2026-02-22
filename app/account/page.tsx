'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Settings, LayoutDashboard, CreditCard, LogOut, Camera, User } from 'lucide-react';
import { AccountSettings } from '@/components/account/AccountSettings';
import { Dashboard } from '@/components/account/Dashboard';
import { PaymentInfo } from '@/components/account/PaymentInfo';
import { SubscriptionUpgrade } from '@/components/account/SubscriptionUpgrade';
import { useAuth } from '@/lib/hooks/use-auth';
import { useSubscription } from '@/lib/hooks/use-subscription';
import { createClient } from '@/lib/supabase/client';
import { PLANS } from '@/lib/types/subscription';

type TabType = 'settings' | 'dashboard' | 'payment';

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

  // Redirect if not authenticated (middleware should handle this, but double-check)
  useEffect(() => {
    if (!authLoading && (isGuest || !user)) {
      router.push('/login?redirect=' + encodeURIComponent('/account'));
    }
  }, [authLoading, isGuest, user, router]);

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

  // Show loading while checking auth
  if (!isMounted || authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (isGuest || !user) {
    return null;
  }

  const currentPlan = subscription?.plan || 'free';

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings' as TabType, label: 'Account Settings', icon: Settings },
    { id: 'payment' as TabType, label: 'Payment Information', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-blue-600">resumebuilder.io</h1>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-gray-600">Account</span>
              {isMounted && currentPlan !== 'free' && (
                <>
                  <span className="text-sm text-gray-500">|</span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold">
                    {PLANS[currentPlan].icon} {PLANS[currentPlan].name} Plan
                  </span>
                </>
              )}
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button
              onClick={() => router.push('/builder')}
              variant="outline"
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Builder
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Profile Picture */}
              <div className="mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 border-4 border-gray-200 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors"
                    title="Change profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                <p className="text-center text-sm font-medium text-gray-900">
                  {user?.username || user?.email?.split('@')[0] || 'User'}
                </p>
              </div>

              {/* Vertical Tabs */}
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg
                        ${
                          activeTab === tab.id
                            ? 'text-blue-600 bg-blue-50 border border-blue-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeTab === 'settings' && <AccountSettings />}
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  {currentPlan === 'free' ? (
                    <SubscriptionUpgrade
                      currentPlan={currentPlan}
                      onUpgrade={(plan) => {
                        // Handle upgrade - in real app, this would process payment
                        alert(`Upgrading to ${plan} plan. Payment processing would happen here.`);
                      }}
                    />
                  ) : (
                    <PaymentInfo />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

