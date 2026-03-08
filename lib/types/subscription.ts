export type PlanType = 'free' | 'weekly' | 'monthly' | 'annual';

export interface SubscriptionPlan {
  id: PlanType;
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  icon: string;
  color: string;
}

export interface UserSubscription {
  plan: PlanType;
  startDate: string;
  endDate: string | null; // null for free plan
  isActive: boolean;
}

export const PLANS: Record<PlanType, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'View and edit resumes, but cannot download',
    price: 'Free',
    duration: 'Forever',
    features: [
      'View previous resumes',
      'Fill in resume details',
      'Generate resume preview',
      'Use multiple templates',
      'No PDF downloads',
      'No AI features',
      'No LinkedIn import',
    ],
    icon: '📄',
    color: 'gray',
  },
  weekly: {
    id: 'weekly',
    name: 'Weekly',
    description: 'Full access for 7 days',
    price: '₹150',
    duration: '7 days',
    features: [
      'Unlimited PDF downloads',
      'AI-powered text enhancement',
      'AI spelling & grammar correction',
      'Upload existing resume (PDF/DOCX)',
      'Import from LinkedIn',
      'Priority support',
      'All templates included',
    ],
    icon: '⚡',
    color: 'blue',
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    description: 'Full access for 30 days',
    price: '₹350',
    duration: '30 days',
    features: [
      'Unlimited PDF downloads',
      'AI-powered text enhancement',
      'AI spelling & grammar correction',
      'Upload existing resume (PDF/DOCX)',
      'Import from LinkedIn',
      'Priority support',
      'All templates included',
      'Resume analytics',
    ],
    icon: '⭐',
    color: 'purple',
  },
  annual: {
    id: 'annual',
    name: 'Annual',
    description: 'Full access for 365 days - Best Value',
    price: '₹3,200',
    duration: '365 days',
    features: [
      'Unlimited PDF downloads',
      'AI-powered text enhancement',
      'AI spelling & grammar correction',
      'Upload existing resume (PDF/DOCX)',
      'Import from LinkedIn',
      'Priority support',
      'All templates included',
      'Resume analytics',
      'Cover letter builder',
      'Job application tracker',
    ],
    icon: '👑',
    color: 'gold',
  },
};

export function canDownloadPDF(plan: PlanType): boolean {
  return plan !== 'free';
}

export function getPlanExpiryDate(plan: PlanType, startDate: string): string | null {
  if (plan === 'free') return null;
  
  const start = new Date(startDate);
  let days = 0;
  
  switch (plan) {
    case 'weekly':
      days = 7;
      break;
    case 'monthly':
      days = 30;
      break;
    case 'annual':
      days = 365;
      break;
  }
  
  const expiry = new Date(start);
  expiry.setDate(expiry.getDate() + days);
  return expiry.toISOString();
}

export function isSubscriptionActive(subscription: UserSubscription): boolean {
  if (subscription.plan === 'free') return true;
  if (!subscription.endDate) return false;
  return new Date(subscription.endDate) > new Date();
}

