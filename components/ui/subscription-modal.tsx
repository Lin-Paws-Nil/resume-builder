'use client';

import { X, Lock, Crown, Sparkles } from 'lucide-react';
import { Button } from './button';
import { useRouter } from 'next/navigation';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'upgrade';
  onConfirm?: () => void;
}

export function SubscriptionModal({ isOpen, onClose, type, onConfirm }: SubscriptionModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === 'login') {
      router.push(`/login?redirect=${encodeURIComponent('/builder')}`);
    } else {
      router.push('/account?tab=payment');
    }
    onClose();
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {type === 'login' ? (
                <div className="bg-blue-100 p-2 rounded-full">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
              ) : (
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">
                {type === 'login' ? 'Login Required' : 'Upgrade Required'}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4 leading-relaxed">
              {type === 'login' ? (
                <>
                  You need to log in to download your resume. Sign in to access all features and save your work.
                </>
              ) : (
                <>
                  PDF download requires an active subscription. Upgrade your plan to unlock unlimited downloads and premium features.
                </>
              )}
            </p>
            
            {type === 'upgrade' && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Premium Features Include:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Unlimited PDF downloads</li>
                      <li>• Priority support</li>
                      <li>• Advanced editing tools</li>
                      <li>• Resume templates library</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {type === 'login' ? 'Go to Login' : 'Upgrade Plan'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
