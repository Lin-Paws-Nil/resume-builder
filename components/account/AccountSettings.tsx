'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Check, Lock, Trash2, AlertTriangle } from 'lucide-react';
import { PLANS, type UserSubscription, getPlanExpiryDate } from '@/lib/types/subscription';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  subscription: UserSubscription;
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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const username = sessionStorage.getItem('username') || 'SwapnilD';
      const savedData = localStorage.getItem(`user_${username}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setUserData(parsed);
      } else {
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
    setIsEditing(true);
  };

  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsPasswordModalOpen(false);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'Delete my account') {
      alert('Please type "Delete my account" to confirm');
      return;
    }
    
    if (typeof window !== 'undefined') {
      const username = sessionStorage.getItem('username') || 'SwapnilD';
      const updatedData = { ...userData, isDeleted: true };
      localStorage.setItem(`user_${username}`, JSON.stringify(updatedData));
    }
    
    alert('Account marked as deleted in database');
    setIsDeleteModalOpen(false);
    setDeleteConfirmText('');
  };

  return (
    <>
      <div className="max-w-4xl">
        <h3 className="text-2xl font-bold text-white mb-8">Account Settings</h3>
        
        {/* Personal Information Section */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-6">Personal Information</h4>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="font-medium text-gray-300">
                  First name
                </Label>
                <Input
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="mt-2 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="font-medium text-gray-300">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="mt-2 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="font-medium text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="mt-2 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500"
              />
              <p className="mt-2 text-sm text-gray-400">
                Use this email to log in to your account and receive notifications
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div>
                <Label className="font-medium text-gray-300">Password</Label>
                <p className="text-sm text-gray-400 mt-1">••••••••••••</p>
              </div>
              <Button
                onClick={() => setIsPasswordModalOpen(true)}
                variant="outline"
                className="border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
              >
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="bg-gradient-to-br from-red-950/50 to-red-900/50 rounded-xl p-6 border border-red-800/50">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Danger Zone
              </h4>
              <p className="text-sm text-red-200 mt-2">
                Once you delete your account, it cannot be undone. This is permanent.
              </p>
            </div>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              variant="outline"
              className="border-red-800 bg-red-950/50 text-red-300 hover:bg-red-900/50 hover:border-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>

        {/* Save Changes Button */}
        {isEditing && (
          <div className="flex justify-end mt-8">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Update Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-white">
              <Lock className="h-5 w-5" />
              Update Password
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="currentPassword" className="text-gray-300">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="mt-2 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label htmlFor="newPassword" className="text-gray-300">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="mt-2 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="mt-2 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2">
            <Button
              onClick={handlePasswordUpdate}
              className="w-full bg-white text-gray-900 hover:bg-gray-100"
            >
              Update Password
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              className="w-full text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border border-red-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-white">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              This action cannot be undone. Please type <span className="font-semibold text-red-400">&quot;Delete my account&quot;</span> to confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="confirmDelete" className="text-gray-300">
              Type to confirm
            </Label>
            <Input
              id="confirmDelete"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="mt-2 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
              placeholder="Delete my account"
            />
          </div>

          <DialogFooter className="flex flex-col gap-2">
            <Button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'Delete my account'}
              className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account Permanently
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteConfirmText('');
              }}
              className="w-full text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
