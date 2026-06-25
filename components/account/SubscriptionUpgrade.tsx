'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PLANS, type PlanType, type RegionCode, REGIONAL_PRICING, getRegionFromCountryCode, getRegionalPlanPrice } from '@/lib/types/subscription';
import { Crown, Zap, Star, FileText, Check, CreditCard } from 'lucide-react';

interface SubscriptionUpgradeProps {
  currentPlan: PlanType;
  onUpgrade?: (plan: PlanType) => void;
}

function getPlanIcon(plan: PlanType) {
  switch (plan) {
    case 'free':
      return <FileText className="h-6 w-6" />;
    case 'weekly':
      return <Zap className="h-6 w-6" />;
    case 'monthly':
      return <Star className="h-6 w-6" />;
    case 'annual':
      return <Crown className="h-6 w-6" />;
  }
}

export function SubscriptionUpgrade({ currentPlan, onUpgrade }: SubscriptionUpgradeProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [region, setRegion] = useState<RegionCode | 'default'>('default');
  const [pendingPlan, setPendingPlan] = useState<PlanType | null>(null);

  useEffect(() => {
    const detectRegion = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        setRegion(getRegionFromCountryCode(countryCode));
      } catch (error) {
        console.error('Error detecting location:', error);
        setRegion('default');
      }
    };

    detectRegion();
  }, []);

  const getPriceDisplay = (planId: PlanType) => {
    return getRegionalPlanPrice(planId, region);
  };

  const handleSelectPlan = (plan: PlanType) => {
    if (plan === currentPlan) return;
    setPendingPlan(plan);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSelection = () => {
    if (pendingPlan) {
      setSelectedPlan(pendingPlan);
      if (onUpgrade) {
        onUpgrade(pendingPlan);
      }
    }
    setIsConfirmModalOpen(false);
  };

  const plansToShow: PlanType[] = ['weekly', 'monthly', 'annual'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
        <p className="text-gray-300 mb-6">Upgrade to unlock unlimited downloads and premium features</p>
        
        {/* Common Features List */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
          <h4 className="text-base font-semibold text-white mb-4">All plans include:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
              Unlimited PDF downloads
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
              AI-powered text enhancement
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
              AI spelling & grammar correction
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
              Upload existing resume (PDF/DOCX)
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
              Import from LinkedIn
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
              Priority support
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
              All templates included
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plansToShow.map((planId) => {
          const plan = PLANS[planId];
          const isSelected = selectedPlan === planId;
          const isCurrent = currentPlan === planId;
          const isPopular = planId === 'monthly';

          return (
            <div
              key={planId}
              className={`
                relative border-2 rounded-lg p-6 transition-all bg-black
                ${
                  isSelected
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/30 scale-105'
                    : isCurrent
                    ? 'border-gray-600'
                    : 'border-gray-700 hover:border-gray-600 hover:shadow-md'
                }
                ${isPopular ? 'md:-mt-2 md:mb-2' : ''}
              `}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500/20 text-green-300 text-xs font-semibold px-2 py-1 rounded border border-green-500/30">
                    Current
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <div
                  className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-full mb-3
                  ${
                    planId === 'weekly'
                      ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/30'
                      : planId === 'monthly'
                      ? 'bg-purple-500/20 text-purple-400 border-2 border-purple-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/30'
                  }
                `}
                >
                  {getPlanIcon(planId)}
                </div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-white">{getPriceDisplay(planId)}</span>
                  <span className="text-gray-400 text-sm ml-1">/{plan.duration}</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">{plan.description}</p>
              </div>

              <Button
                onClick={() => handleSelectPlan(planId)}
                disabled={isCurrent}
                className={`
                  w-full mt-4
                  ${
                    isCurrent
                      ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                      : isPopular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                  }
                `}
              >
                {isCurrent ? 'Current Plan' : 'Select Plan'}
              </Button>
            </div>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
          <p className="text-sm text-indigo-300">
            You&apos;ve selected the <strong>{PLANS[selectedPlan].name}</strong> plan. Proceed to
            payment to complete your subscription.
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-white">
              <CreditCard className="h-5 w-5" />
              Confirm Plan Selection
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              You&apos;re about to upgrade to the <span className="font-semibold text-indigo-400">{pendingPlan ? PLANS[pendingPlan].name : ''}</span> plan.
            </DialogDescription>
          </DialogHeader>

          {pendingPlan && (
            <div className="py-4 space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Plan</span>
                  <span className="text-white font-semibold">{PLANS[pendingPlan].name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Price</span>
                  <span className="text-white font-semibold">{getPriceDisplay(pendingPlan)}/{PLANS[pendingPlan].duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Currency</span>
                  <span className="text-white font-semibold">{REGIONAL_PRICING[region].code}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2">
            <Button
              onClick={handleConfirmSelection}
              className="w-full bg-white text-gray-900 hover:bg-gray-100"
            >
              Confirm & Proceed to Payment
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsConfirmModalOpen(false);
                setPendingPlan(null);
              }}
              className="w-full text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
