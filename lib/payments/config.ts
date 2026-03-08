// Razorpay Payment Configuration
// Supports 130+ currencies and international payments

export const PAYMENT_CONFIG = {
  // Gateway
  GATEWAY: 'razorpay' as const,
  
  // Currency support (Razorpay supports 130+ currencies)
  DEFAULT_CURRENCY: 'INR',
  POPULAR_CURRENCIES: ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED'],
  
  // Exchange rates (update periodically or use API)
  // All prices are in INR base, auto-converted by Razorpay
  EXCHANGE_RATES: {
    INR: 1,
    USD: 0.012,   // 1 INR = 0.012 USD (approx)
    EUR: 0.011,   // 1 INR = 0.011 EUR
    GBP: 0.0095,  // 1 INR = 0.0095 GBP
    AUD: 0.018,   // 1 INR = 0.018 AUD
    CAD: 0.016,   // 1 INR = 0.016 CAD
    SGD: 0.016,   // 1 INR = 0.016 SGD
    AED: 0.044,   // 1 INR = 0.044 AED
  },
  
  // Pricing in INR (base currency)
  BASE_PRICES: {
    weekly: 150,
    monthly: 350,
    annual: 3200,
  },
  
  // Razorpay fees
  RAZORPAY_FEES: {
    domestic: 2.0,      // 2% for Indian payments (UPI, Cards, etc.)
    international: 3.0, // 3% for international card payments
  },
} as const;

export type Currency = keyof typeof PAYMENT_CONFIG.EXCHANGE_RATES;
export type PaidPlanType = 'weekly' | 'monthly' | 'annual';

// Convert price from INR to target currency
export function convertPrice(
  priceInINR: number,
  targetCurrency: Currency
): number {
  if (targetCurrency === 'INR') return priceInINR;
  
  const rate = PAYMENT_CONFIG.EXCHANGE_RATES[targetCurrency];
  return Math.round(priceInINR * rate * 100) / 100; // Round to 2 decimals
}

// Get price for a plan in specific currency
export function getPlanPrice(
  plan: PaidPlanType,
  currency: Currency
): { amount: number; currency: Currency; display: string } {
  const basePrice = PAYMENT_CONFIG.BASE_PRICES[plan];
  const convertedPrice = convertPrice(basePrice, currency);
  
  return {
    amount: convertedPrice,
    currency,
    display: formatPrice(convertedPrice, currency),
  };
}

// Format price for display
export function formatPrice(amount: number, currency: Currency): string {
  // Handle zero-exponent currencies (JPY, KRW, etc.)
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

// Convert amount to smallest currency unit (paise, cents, etc.)
export function toSmallestUnit(amount: number, currency: Currency): number {
  // Zero-exponent currencies don't need multiplication
  const zeroExponentCurrencies = ['JPY', 'KRW', 'VND', 'CLP', 'TWD'];
  if (zeroExponentCurrencies.includes(currency)) {
    return Math.round(amount);
  }
  
  // All other currencies use 2 decimal places (cents, paise, etc.)
  return Math.round(amount * 100);
}

// Detect user currency based on locale/location
export function detectUserCurrency(countryCode?: string): Currency {
  if (!countryCode) {
    // Try to detect from browser
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language;
      if (browserLang.includes('IN')) return 'INR';
      if (browserLang.includes('US')) return 'USD';
      if (browserLang.includes('GB')) return 'GBP';
      if (browserLang.includes('AU')) return 'AUD';
      if (browserLang.includes('CA')) return 'CAD';
      if (browserLang.includes('SG')) return 'SGD';
    }
    return 'INR'; // Default to INR
  }
  
  switch (countryCode.toUpperCase()) {
    case 'IN':
      return 'INR';
    case 'US':
      return 'USD';
    case 'GB':
      return 'GBP';
    case 'AU':
      return 'AUD';
    case 'CA':
      return 'CAD';
    case 'SG':
      return 'SGD';
    case 'AE':
      return 'AED';
    default:
      // EU countries
      if (['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE'].includes(countryCode.toUpperCase())) {
        return 'EUR';
      }
      return 'USD'; // Default to USD for other countries
  }
}

// Check if currency is supported by Razorpay
export function isSupportedCurrency(currency: string): currency is Currency {
  return currency in PAYMENT_CONFIG.EXCHANGE_RATES;
}
