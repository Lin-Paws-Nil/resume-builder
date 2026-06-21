'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Crown, Zap, Star } from 'lucide-react';
import { PLANS, type PlanType } from '@/lib/types/subscription';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const planId = (searchParams.get('plan') || 'monthly') as PlanType;
  const returnUrl = searchParams.get('return') || '/builder';
  const selectedPlan = PLANS[planId];

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(returnUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, returnUrl]);

  const getPlanIcon = () => {
    switch (planId) {
      case 'weekly':
        return <Zap className="h-12 w-12" />;
      case 'monthly':
        return <Star className="h-12 w-12" />;
      case 'annual':
        return <Crown className="h-12 w-12" />;
      default:
        return <Check className="h-12 w-12" />;
    }
  };

  const getPlanGradient = () => {
    switch (planId) {
      case 'weekly':
        return 'from-blue-500 to-cyan-500';
      case 'monthly':
        return 'from-purple-500 to-pink-500';
      case 'annual':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${getPlanGradient()} text-white mb-4 animate-bounce`}>
            {getPlanIcon()}
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your <span className="font-semibold text-blue-600">{selectedPlan.name}</span> subscription is now active
        </p>

        {/* Features Unlocked */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Premium Features Unlocked:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {selectedPlan.features.slice(0, 6).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-left">
                <div className="bg-green-100 rounded-full p-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Redirect Info */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting in {countdown} seconds...
          </div>
        </div>

        {/* Manual Redirect Button */}
        <Button
          onClick={() => router.push(returnUrl)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8"
        >
          Continue to createresume.co
        </Button>

        {/* Receipt Info */}
        <p className="text-sm text-gray-500 mt-6">
          A payment receipt has been sent to your email
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
