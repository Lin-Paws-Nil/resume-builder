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
    price: '₹1,500',
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

export type RegionCode = 'IN' | 'US' | 'GB' | 'EU' | 'AE' | 'AU' | 'CA' | 'SG';

export interface RegionalPrice {
  symbol: string;
  code: string;
  weekly: number;
  monthly: number;
  annual: number;
}

export const REGIONAL_PRICING: Record<RegionCode | 'default', RegionalPrice> = {
  IN: { symbol: '₹', code: 'INR', weekly: 150, monthly: 350, annual: 1500 },
  US: { symbol: '$', code: 'USD', weekly: 5, monthly: 10, annual: 50 },
  GB: { symbol: '£', code: 'GBP', weekly: 5, monthly: 10, annual: 40 },
  EU: { symbol: '€', code: 'EUR', weekly: 5, monthly: 10, annual: 45 },
  AE: { symbol: 'AED ', code: 'AED', weekly: 18, monthly: 45, annual: 180 },
  AU: { symbol: 'A$', code: 'AUD', weekly: 8, monthly: 15, annual: 70 },
  CA: { symbol: 'C$', code: 'CAD', weekly: 7, monthly: 13, annual: 65 },
  SG: { symbol: 'S$', code: 'SGD', weekly: 7, monthly: 13, annual: 60 },
  default: { symbol: '$', code: 'USD', weekly: 5, monthly: 10, annual: 50 },
};

export function getRegionFromCountryCode(countryCode: string): RegionCode | 'default' {
  const code = countryCode.toUpperCase();
  if (code === 'IN') return 'IN';
  if (code === 'US') return 'US';
  if (code === 'GB') return 'GB';
  if (code === 'AU') return 'AU';
  if (code === 'CA') return 'CA';
  if (code === 'AE') return 'AE';
  if (code === 'SG') return 'SG';
  if (['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'PT', 'FI', 'GR'].includes(code)) return 'EU';
  if (['SA', 'QA', 'KW', 'BH', 'OM'].includes(code)) return 'AE';
  if (code === 'NZ') return 'AU';
  if (['MY', 'PH', 'TH', 'ID', 'VN'].includes(code)) return 'SG';
  return 'default';
}

export function getRegionalPlanPrice(
  plan: PlanType,
  region: RegionCode | 'default'
): string {
  if (plan === 'free') return 'Free';
  const pricing = REGIONAL_PRICING[region];
  const amount = pricing[plan as 'weekly' | 'monthly' | 'annual'];
  return `${pricing.symbol}${amount.toLocaleString()}`;
}


