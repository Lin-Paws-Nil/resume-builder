// Razorpay Payment Configuration
// Razorpay supports 100+ currencies for international payments

import { type RegionCode, REGIONAL_PRICING, getRegionFromCountryCode } from '@/lib/types/subscription';

export const PAYMENT_CONFIG = {
  GATEWAY: 'razorpay' as const,
  DEFAULT_CURRENCY: 'INR',
  POPULAR_CURRENCIES: ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED'] as const,
  SUPPORTED_CURRENCIES: ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED', 'MYR', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'NZD', 'ZAR', 'HKD', 'JPY', 'KRW', 'THB', 'PHP', 'IDR', 'BDT', 'LKR', 'NPR'] as const,
} as const;

export type Currency = typeof PAYMENT_CONFIG.SUPPORTED_CURRENCIES[number];
export type PaidPlanType = 'weekly' | 'monthly' | 'annual';

// Regional pricing amounts (fixed whole numbers per region)
const REGIONAL_AMOUNTS: Record<RegionCode | 'default', Record<PaidPlanType, number>> = {
  IN: { weekly: 150, monthly: 350, annual: 1500 },
  US: { weekly: 5, monthly: 10, annual: 50 },
  GB: { weekly: 5, monthly: 10, annual: 40 },
  EU: { weekly: 5, monthly: 10, annual: 45 },
  AE: { weekly: 18, monthly: 45, annual: 180 },
  AU: { weekly: 8, monthly: 15, annual: 70 },
  CA: { weekly: 7, monthly: 13, annual: 65 },
  SG: { weekly: 7, monthly: 13, annual: 60 },
  default: { weekly: 5, monthly: 10, annual: 50 },
};

// Map currency code to region for pricing
function getRegionForCurrency(currency: string): RegionCode | 'default' {
  switch (currency) {
    case 'INR': return 'IN';
    case 'USD': return 'US';
    case 'GBP': return 'GB';
    case 'EUR': return 'EU';
    case 'AED': return 'AE';
    case 'AUD': return 'AU';
    case 'CAD': return 'CA';
    case 'SGD': return 'SG';
    case 'MYR': return 'SG';
    case 'SAR': return 'AE';
    case 'QAR': return 'AE';
    default: return 'default';
  }
}

// Get price for a plan in a specific currency
export function getPlanPrice(
  plan: PaidPlanType,
  currency: string
): { amount: number; currency: string; display: string } {
  const region = getRegionForCurrency(currency);
  const amount = REGIONAL_AMOUNTS[region][plan];

  return {
    amount,
    currency,
    display: formatPrice(amount, currency),
  };
}

// Format price for display
export function formatPrice(amount: number, currency: string): string {
  const zeroExponentCurrencies = ['JPY', 'KRW', 'VND', 'CLP', 'TWD'];
  const decimals = zeroExponentCurrencies.includes(currency) ? 0 :
                   currency === 'INR' ? 0 : 2;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(amount);
}

// Convert amount to smallest currency unit (paise, cents, fils, etc.)
export function toSmallestUnit(amount: number, currency: string): number {
  const zeroExponentCurrencies = ['JPY', 'KRW', 'VND', 'CLP', 'TWD'];
  if (zeroExponentCurrencies.includes(currency)) {
    return Math.round(amount);
  }
  // Bahraini Dinar, Kuwaiti Dinar, Omani Rial use 3 decimal places
  const threeDecimalCurrencies = ['BHD', 'KWD', 'OMR'];
  if (threeDecimalCurrencies.includes(currency)) {
    return Math.round(amount * 1000);
  }
  return Math.round(amount * 100);
}

// Detect user currency based on country code
export function detectUserCurrency(countryCode?: string): string {
  if (!countryCode) {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language;
      if (browserLang.includes('IN')) return 'INR';
      if (browserLang.includes('US')) return 'USD';
      if (browserLang.includes('GB')) return 'GBP';
      if (browserLang.includes('AU')) return 'AUD';
      if (browserLang.includes('CA')) return 'CAD';
      if (browserLang.includes('SG')) return 'SGD';
    }
    return 'INR';
  }

  const region = getRegionFromCountryCode(countryCode);
  return REGIONAL_PRICING[region].code;
}

// Check if currency is supported by Razorpay
export function isSupportedCurrency(currency: string): boolean {
  return (PAYMENT_CONFIG.SUPPORTED_CURRENCIES as readonly string[]).includes(currency);
}
