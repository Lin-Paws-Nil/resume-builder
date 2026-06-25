'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Star, Check, ArrowLeft, Sparkles, Upload, FileDown, Link2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useSubscription } from '@/lib/hooks/use-subscription';
import { PLANS, type PlanType, type RegionCode, getRegionFromCountryCode, getRegionalPlanPrice } from '@/lib/types/subscription';

function SubscribePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, isGuest } = useAuth();
  const { subscription, loading: subLoading } = useSubscription(user?.id || null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [region, setRegion] = useState<RegionCode | 'default'>('default');

  const returnUrl = searchParams.get('return') || '/builder';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const detectRegion = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setRegion(getRegionFromCountryCode(data.country_code));
      } catch {
        setRegion('default');
      }
    };
    detectRegion();
  }, []);

  useEffect(() => {
    if (!authLoading && (isGuest || !user)) {
      router.push('/login?redirect=' + encodeURIComponent('/subscribe?return=' + encodeURIComponent(returnUrl)));
    }
  }, [authLoading, isGuest, user, router, returnUrl]);

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === 'free') return;
    setSelectedPlan(planId);
  };

  const handleProceedToPayment = () => {
    if (!selectedPlan) return;
    router.push(`/payment?plan=${selectedPlan}&return=${encodeURIComponent(returnUrl)}`);
  };

  if (!isMounted || authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isGuest || !user) {
    return null;
  }

  const currentPlan = subscription?.plan || 'free';
  const plansToShow: PlanType[] = ['weekly', 'monthly', 'annual'];

  const getPlanIcon = (planId: PlanType) => {
    switch (planId) {
      case 'weekly':
        return <Zap className="h-8 w-8" />;
      case 'monthly':
        return <Star className="h-8 w-8" />;
      case 'annual':
        return <Crown className="h-8 w-8" />;
      default:
        return null;
    }
  };

  const getPlanGradient = (planId: PlanType) => {
    switch (planId) {
      case 'weekly':
        return 'from-blue-500 to-cyan-500';
      case 'monthly':
        return 'from-purple-500 to-pink-500';
      case 'annual':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push(returnUrl)}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <span className="text-sm text-gray-400">|</span>
              <h1 className="text-xl font-bold text-blue-600">createresume.co</h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, {user?.username || user?.email?.split('@')[0]}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">Unlock Premium Features</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upgrade to unlock AI-powered features, unlimited downloads, and professional resume tools
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What You'll Get with Premium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl mb-4">
                <FileDown className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Unlimited Downloads</h3>
              <p className="text-sm text-gray-600">
                Download your resume as PDF anytime, unlimited times
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Tools</h3>
              <p className="text-sm text-gray-600">
                Fix spelling & grammar, enhance text with AI suggestions
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-2xl mb-4">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Import</h3>
              <p className="text-sm text-gray-600">
                Upload existing resume or import from LinkedIn automatically
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plansToShow.map((planId) => {
            const plan = PLANS[planId];
            const isSelected = selectedPlan === planId;
            const isCurrent = currentPlan === planId;
            const isPopular = planId === 'monthly';

            return (
              <div
                key={planId}
                className={`
                  relative bg-white rounded-2xl shadow-xl border-2 transition-all transform hover:scale-105
                  ${
                    isSelected
                      ? 'border-blue-600 ring-4 ring-blue-100 scale-105'
                      : isCurrent
                      ? 'border-green-500'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-2xl'
                  }
                  ${isPopular ? 'md:-mt-4 md:mb-4' : ''}
                `}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                      ⭐ MOST POPULAR
                    </div>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-6 right-6">
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border-2 border-green-300">
                      ✓ Current Plan
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${getPlanGradient(planId)} text-white mb-4`}>
                      {getPlanIcon(planId)}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>

                  <div className="mb-6 pb-6 border-b">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900">{getRegionalPlanPrice(planId, region)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">for {plan.duration}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <div className="bg-green-100 rounded-full p-0.5 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(planId)}
                    disabled={isCurrent}
                    className={`
                      w-full h-12 font-semibold text-base
                      ${
                        isCurrent
                          ? 'bg-gray-300 cursor-not-allowed'
                          : isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                          : isPopular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }
                    `}
                  >
                    {isCurrent ? '✓ Current Plan' : isSelected ? '✓ Selected' : 'Select Plan'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedPlan && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-blue-600 p-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                You've Selected the {PLANS[selectedPlan].name} Plan
              </h2>
              <p className="text-gray-600">
                {getRegionalPlanPrice(selectedPlan, region)} for {PLANS[selectedPlan].duration}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                  <span>Review your selected plan details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                  <span>Enter your payment information securely</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                  <span>Get instant access to all premium features</span>
                </li>
              </ol>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setSelectedPlan(null)}
                variant="outline"
                className="flex-1"
              >
                Choose Different Plan
              </Button>
              <Button
                onClick={handleProceedToPayment}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
              >
                Proceed to Payment →
              </Button>
            </div>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="font-semibold text-gray-900 mb-1">Secure Payment</h4>
            <p className="text-sm text-gray-600">Bank-grade encryption</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="font-semibold text-gray-900 mb-1">Instant Access</h4>
            <p className="text-sm text-gray-600">Features activate immediately</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">💯</div>
            <h4 className="font-semibold text-gray-900 mb-1">Cancel Anytime</h4>
            <p className="text-sm text-gray-600">No long-term commitment</p>
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-gray-600">
                We accept all major credit/debit cards and UPI payments for your convenience.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-sm text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time from your account settings.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens when my subscription expires?
              </h3>
              <p className="text-sm text-gray-600">
                Your resumes are saved, but premium features will be locked. You can renew anytime to regain access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SubscribePageContent />
    </Suspense>
  );
}
