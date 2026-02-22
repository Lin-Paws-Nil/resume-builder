'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PLANS, type PlanType } from '@/lib/types/subscription';
import { Crown, Zap, Star, FileText, Check } from 'lucide-react';

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

  const handleSelectPlan = (plan: PlanType) => {
    if (plan === currentPlan) return;
    setSelectedPlan(plan);
    if (onUpgrade) {
      onUpgrade(plan);
    }
  };

  const plansToShow: PlanType[] = ['weekly', 'monthly', 'annual'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">Upgrade to unlock unlimited downloads and premium features</p>
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
                relative border-2 rounded-lg p-6 transition-all
                ${
                  isSelected
                    ? 'border-blue-600 shadow-lg scale-105'
                    : isCurrent
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }
                ${isPopular ? 'md:-mt-2 md:mb-2' : ''}
              `}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute top-4 right-4">
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
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
                      ? 'bg-blue-100 text-blue-600'
                      : planId === 'monthly'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }
                `}
                >
                  {getPlanIcon(planId)}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 text-sm ml-1">/{plan.duration}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(planId)}
                disabled={isCurrent}
                className={`
                  w-full
                  ${
                    isCurrent
                      ? 'bg-gray-300 cursor-not-allowed'
                      : isPopular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-600 hover:bg-gray-700'
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            You've selected the <strong>{PLANS[selectedPlan].name}</strong> plan. Proceed to
            payment to complete your subscription.
          </p>
        </div>
      )}
    </div>
  );
}
