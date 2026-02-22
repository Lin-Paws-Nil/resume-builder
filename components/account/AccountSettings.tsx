'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Crown, Calendar, Zap, Star, FileText } from 'lucide-react';
import { PLANS, type PlanType, type UserSubscription, isSubscriptionActive, getPlanExpiryDate } from '@/lib/types/subscription';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  subscription: UserSubscription;
}

function getPlanIcon(plan: PlanType) {
  switch (plan) {
    case 'free':
      return <FileText className="h-6 w-6 text-gray-600" />;
    case 'weekly':
      return <Zap className="h-6 w-6 text-blue-600" />;
    case 'monthly':
      return <Star className="h-6 w-6 text-purple-600" />;
    case 'annual':
      return <Crown className="h-6 w-6 text-yellow-600" />;
  }
}

function getPlanColor(plan: PlanType) {
  switch (plan) {
    case 'free':
      return 'bg-gray-100 text-gray-600';
    case 'weekly':
      return 'bg-blue-100 text-blue-600';
    case 'monthly':
      return 'bg-purple-100 text-purple-600';
    case 'annual':
      return 'bg-yellow-100 text-yellow-600';
  }
}

export function AccountSettings() {
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    subscription: {
      plan: 'free',
      startDate: new Date().toISOString(),
      endDate: null,
      isActive: true,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    if (typeof window !== 'undefined') {
      const username = sessionStorage.getItem('username') || 'SwapnilD';
      const savedData = localStorage.getItem(`user_${username}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setUserData(parsed);
      } else {
        // Default data - SwapnilD has Annual membership
        const isSwapnilD = username === 'SwapnilD';
        const startDate = new Date().toISOString();
        const subscription: UserSubscription = isSwapnilD
          ? {
              plan: 'annual',
              startDate,
              endDate: getPlanExpiryDate('annual', startDate),
              isActive: true,
            }
          : {
              plan: 'free',
              startDate,
              endDate: null,
              isActive: true,
            };

        const defaultData: UserData = {
          firstName: isSwapnilD ? 'Swapnil' : '',
          lastName: isSwapnilD ? 'D' : '',
          email: isSwapnilD ? 'swapnilbilimale32@gmail.com' : '',
          subscription,
        };
        setUserData(defaultData);
        localStorage.setItem(`user_${username}`, JSON.stringify(defaultData));
      }
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      const username = sessionStorage.getItem('username') || 'SwapnilD';
      localStorage.setItem(`user_${username}`, JSON.stringify(userData));
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleChange = (field: 'firstName' | 'lastName' | 'email', value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const currentPlan = PLANS[userData.subscription.plan];
  const subscriptionActive = isSubscriptionActive(userData.subscription);

  return (
    <div className="space-y-8">
      {/* Current Plan Section */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
          YOUR CURRENT PLAN
        </h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${getPlanColor(userData.subscription.plan)}`}>
                {getPlanIcon(userData.subscription.plan)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {currentPlan.name} Plan
                  {userData.subscription.plan !== 'free' && subscriptionActive && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Active
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{currentPlan.description}</p>
              </div>
            </div>
            {userData.subscription.plan === 'free' && (
              <Button variant="link" className="text-blue-600 hover:text-blue-700">
                Upgrade
              </Button>
            )}
          </div>
          
          {userData.subscription.plan !== 'free' && userData.subscription.endDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
              <Calendar className="h-4 w-4" />
              <span>
                {subscriptionActive
                  ? `Expires on ${new Date(userData.subscription.endDate).toLocaleDateString()}`
                  : `Expired on ${new Date(userData.subscription.endDate).toLocaleDateString()}`}
              </span>
            </div>
          )}

          {/* Plan Features */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Plan Features:</h4>
            <ul className="space-y-1">
              {currentPlan.features.map((feature, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
          ACCOUNT
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {/* First Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
            <div className="relative">
              <Input
                value={userData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                onFocus={() => setIsEditing(true)}
                className="pr-10"
              />
              {saved && !isEditing && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
            </div>
          </div>

          {/* Last Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
            <div className="relative">
              <Input
                value={userData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                onFocus={() => setIsEditing(true)}
                className="pr-10"
              />
              {saved && !isEditing && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Input
                type="email"
                value={userData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onFocus={() => setIsEditing(true)}
                className="pr-10"
              />
              {saved && !isEditing && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Use this email to log in to your resumebuilder.io account and receive notifications.
            </p>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Membership Section */}
      {userData.subscription.plan === 'free' && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            MEMBERSHIP
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-100 p-4 rounded-full">
                <Crown className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Need downloads and advanced editing?
            </h3>
            <p className="text-gray-600 mb-6">
              Upgrade your account to unlock unlimited downloads, priority support, and other helpful tools.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Subscribe now
            </Button>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
          DANGER ZONE
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Once you delete your account, it cannot be undone. This is permanent.
          </p>
          <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700">
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}
