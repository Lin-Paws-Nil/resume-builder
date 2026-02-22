import type { PlanType, UserSubscription } from '@/lib/types/subscription';
import { getPlanExpiryDate, isSubscriptionActive } from '@/lib/types/subscription';

export function getUserSubscription(username: string): UserSubscription {
  if (typeof window === 'undefined') {
    return {
      plan: 'free',
      startDate: new Date().toISOString(),
      endDate: null,
      isActive: true,
    };
  }

  const savedData = localStorage.getItem(`user_${username}`);
  if (savedData) {
    const userData = JSON.parse(savedData);
    if (userData.subscription) {
      return userData.subscription;
    }
  }

  // Default: SwapnilD has Annual, others have Free
  const isSwapnilD = username === 'SwapnilD';
  const startDate = new Date().toISOString();
  
  if (isSwapnilD) {
    return {
      plan: 'annual',
      startDate,
      endDate: getPlanExpiryDate('annual', startDate),
      isActive: true,
    };
  }

  return {
    plan: 'free',
    startDate,
    endDate: null,
    isActive: true,
  };
}

export function canDownloadPDF(username: string): boolean {
  const subscription = getUserSubscription(username);
  if (subscription.plan === 'free') return false;
  return isSubscriptionActive(subscription);
}

export function getCurrentPlan(username: string): PlanType {
  const subscription = getUserSubscription(username);
  return subscription.plan;
}

