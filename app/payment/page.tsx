'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Lock, Check, AlertCircle, Loader2, Crown, Zap, Star, CreditCard, Smartphone } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useSubscription } from '@/lib/hooks/use-subscription';
import { PLANS, type PlanType, getRegionFromCountryCode, REGIONAL_PRICING, type RegionCode } from '@/lib/types/subscription';
import { getPlanPrice, toSmallestUnit, type PaidPlanType, PAYMENT_CONFIG } from '@/lib/payments/config';

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, isGuest } = useAuth();
  const { subscription, loading: subLoading } = useSubscription(user?.id || null);

  const [isMounted, setIsMounted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>('INR');
  const [region, setRegion] = useState<RegionCode | 'default'>('default');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const planId = (searchParams.get('plan') || 'monthly') as PlanType;
  const returnUrl = searchParams.get('return') || '/builder';
  const selectedPlan = PLANS[planId];

  useEffect(() => {
    setIsMounted(true);
    
    // Detect user region and currency via IP
    const detectRegion = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const detectedRegion = getRegionFromCountryCode(data.country_code);
        setRegion(detectedRegion);
        setCurrency(REGIONAL_PRICING[detectedRegion].code);
      } catch {
        setRegion('default');
        setCurrency('USD');
      }
    };
    detectRegion();

    // Load Razorpay script only if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Razorpay script loaded successfully');
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
        setError('Failed to load payment gateway. Please refresh the page.');
      };
      document.body.appendChild(script);
    } else {
      // Razorpay already loaded
      console.log('✅ Razorpay already available');
      setRazorpayLoaded(true);
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && (isGuest || !user)) {
      router.push('/login?redirect=' + encodeURIComponent(`/payment?plan=${planId}&return=${encodeURIComponent(returnUrl)}`));
    }
  }, [authLoading, isGuest, user, router, planId, returnUrl]);

  // Validate plan
  useEffect(() => {
    if (isMounted && !selectedPlan) {
      router.push('/subscribe?return=' + encodeURIComponent(returnUrl));
    }
  }, [isMounted, selectedPlan, router, returnUrl]);

  // Validate planId is a paid plan
  const validPlanIds: PaidPlanType[] = ['weekly', 'monthly', 'annual'];
  const isPaidPlan = validPlanIds.includes(planId as any);
  
  if (!isPaidPlan) {
    router.push('/subscribe');
    return null;
  }

  const planPrice = getPlanPrice(planId as PaidPlanType, currency);

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    console.log('💳 Starting Razorpay payment process...');
    setProcessing(true);
    setError(null);

    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay is not loaded. Please refresh the page.');
      }

      console.log('📦 Creating order...');
      
      // Create order
      const response = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          currency,
        }),
      });

      const data = await response.json();
      console.log('📋 Order response:', { orderId: data.orderId, amount: data.amount, currency: data.currency });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      if (!data.keyId) {
        throw new Error('Razorpay Key ID not configured. Check NEXT_PUBLIC_RAZORPAY_KEY_ID in environment variables.');
      }

      console.log('✅ Order created, opening Razorpay checkout...');

      // Get base URL for callback
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

      // Razorpay checkout options (matching official docs)
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'createresume.co',
        description: `${selectedPlan.name} Plan - ${selectedPlan.duration}`,
        image: `${baseUrl}/logo.png`, // Your logo (optional)
        order_id: data.orderId,
        callback_url: `${baseUrl}/payment/success?plan=${planId}&return=${encodeURIComponent(returnUrl)}`,
        prefill: {
          name: user?.username || user?.email?.split('@')[0] || '',
          email: user?.email || '',
          contact: '', // Phone number - can add if you collect it during signup
        },
        notes: {
          plan_id: planId,
          user_id: user?.id || '',
        },
        theme: {
          color: '#2563eb', // Blue-600
        },
        modal: {
          ondismiss: function () {
            console.log('ℹ️ Payment modal dismissed by user');
            setProcessing(false);
          },
        },
        handler: async function (response: any) {
          console.log('✅ Payment successful, verifying...');
          console.log('Payment response:', {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature?.substring(0, 20) + '...',
          });
          
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?.id,
                planId,
              }),
            });

            const verifyData = await verifyResponse.json();
            console.log('✅ Verification response:', verifyData);

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            console.log('🎉 Payment verified, redirecting to success...');
            
            // Redirect to success page
            router.push(`/payment/success?plan=${planId}&return=${encodeURIComponent(returnUrl)}`);
          } catch (err: any) {
            console.error('❌ Verification error:', err);
            setError(err.message || 'Payment verification failed');
            setProcessing(false);
          }
        },
      };

      console.log('🚀 Opening Razorpay modal with options:', {
        key: data.keyId.substring(0, 15) + '...',
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: options.name,
        description: options.description,
      });

      const razorpayInstance = new window.Razorpay(options);
      
      // Handle payment failures as per official docs
      razorpayInstance.on('payment.failed', function (response: any) {
        console.error('❌ Payment failed:', response.error);
        console.error('Error details:', {
          code: response.error.code,
          description: response.error.description,
          source: response.error.source,
          step: response.error.step,
          reason: response.error.reason,
          order_id: response.error.metadata?.order_id,
          payment_id: response.error.metadata?.payment_id,
        });
        
        setError(
          `Payment failed: ${response.error.description || response.error.reason}. ` +
          `Please try again or contact support if issue persists.`
        );
        setProcessing(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error('❌ Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  // Show loading while checking auth
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

  // Don't render if not authenticated or no plan selected
  if (isGuest || !user || !selectedPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push(`/subscribe?return=${encodeURIComponent(returnUrl)}`)}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                disabled={processing}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Plans
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Payment Info */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600 mb-8">Secure payment powered by Razorpay</p>

            {/* Currency Selector */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Globe className="inline h-4 w-4 mr-2" />
                Select Your Currency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PAYMENT_CONFIG.POPULAR_CURRENCIES.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    disabled={processing}
                    className={`p-3 border-2 rounded-lg transition-all text-center ${
                      currency === curr
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold scale-105'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-semibold text-sm">{curr}</div>
                    <div className="text-xs text-gray-600">
                      {getPlanPrice(planId as PaidPlanType, curr).display}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Razorpay supports 130+ currencies. Select the one you prefer.
              </p>
            </div>

            {/* Payment Gateway Info */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://razorpay.com/assets/razorpay-glyph.svg" 
                  alt="Razorpay"
                  className="h-8 w-8"
                />
                <h2 className="text-xl font-bold text-gray-900">
                  {currency === 'INR' ? 'Indian Payment Methods' : 'International Payment'}
                </h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {currency === 'INR'
                  ? 'Choose from UPI, Cards, Net Banking, or Digital Wallets for fast and secure payment.'
                  : 'Pay securely with international credit/debit cards. Razorpay supports Visa, Mastercard, Amex, and more from 180+ countries.'}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  {currency === 'INR' ? 'Available Payment Methods:' : 'Accepted Cards:'}
                </h3>
                <div className="flex flex-wrap gap-2 text-xs text-blue-700">
                  {currency === 'INR' ? (
                    <>
                      <span className="bg-white px-2 py-1 rounded flex items-center gap-1">
                        <Smartphone className="h-3 w-3" /> UPI
                      </span>
                      <span className="bg-white px-2 py-1 rounded flex items-center gap-1">
                        <CreditCard className="h-3 w-3" /> Cards
                      </span>
                      <span className="bg-white px-2 py-1 rounded">Net Banking</span>
                      <span className="bg-white px-2 py-1 rounded">Wallets</span>
                    </>
                  ) : (
                    <>
                      <span className="bg-white px-2 py-1 rounded">Visa</span>
                      <span className="bg-white px-2 py-1 rounded">Mastercard</span>
                      <span className="bg-white px-2 py-1 rounded">Amex</span>
                      <span className="bg-white px-2 py-1 rounded">PayPal</span>
                      <span className="bg-white px-2 py-1 rounded">Discover</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-900 mb-1">Payment Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <Button
              onClick={handleRazorpayPayment}
              disabled={processing || !razorpayLoaded}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl"
            >
              {!razorpayLoaded ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Loading Payment Gateway...
                </>
              ) : processing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Opening Razorpay...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Pay {planPrice.display} Securely
                </>
              )}
            </Button>

            {/* Debug Info - Remove after testing */}
            {!razorpayLoaded && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                <p className="font-semibold mb-1">Debug Info:</p>
                <p>• Razorpay script: {typeof window !== 'undefined' && window.Razorpay ? '✅ Loaded' : '⏳ Loading...'}</p>
                <p>• API Key configured: {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? '✅ Yes' : '❌ No'}</p>
                <p>Check browser console for more details</p>
              </div>
            )}

            {/* Payment Method Info */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {currency === 'INR' 
                  ? 'Razorpay modal will open where you can choose UPI, Cards, or other methods'
                  : 'Razorpay checkout will open for international card payment'}
              </p>
            </div>

            {/* Security Info */}
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 justify-center">
              <Lock className="h-4 w-4 text-green-600" />
              <span>PCI DSS compliant, 3D Secure, 256-bit SSL encrypted</span>
            </div>

            {/* Razorpay Info */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <img 
                  src="https://razorpay.com/assets/razorpay-glyph.svg" 
                  alt="Razorpay"
                  className="h-6 w-6 mt-0.5"
                />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                    Why Razorpay?
                  </h3>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Accepts payments from 180+ countries</li>
                    <li>• Supports 130+ currencies worldwide</li>
                    <li>• Trusted by 100,000+ Indian businesses</li>
                    <li>• Bank-grade security & encryption</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Plan Details */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${
                    planId === 'weekly' ? 'from-blue-500 to-cyan-500' :
                    planId === 'monthly' ? 'from-purple-500 to-pink-500' :
                    'from-yellow-500 to-orange-500'
                  } text-white`}>
                    {planId === 'weekly' ? <Zap className="h-5 w-5" /> :
                     planId === 'monthly' ? <Star className="h-5 w-5" /> :
                     <Crown className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedPlan.name}</h3>
                    <p className="text-xs text-gray-600">{selectedPlan.duration}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">Subscription</span>
                    <span className="font-semibold text-gray-900">{planPrice.display}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                    <span>Currency</span>
                    <span>{currency}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600 mb-3">
                    <span>Payment Gateway</span>
                    <span>Razorpay</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">{planPrice.display}</span>
                  </div>
                </div>
              </div>

              {/* Features Included */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Included:</h3>
                <ul className="space-y-2">
                  {selectedPlan.features.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <div className="bg-green-100 rounded-full p-0.5 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {selectedPlan.features.length > 5 && (
                    <li className="text-xs text-gray-500 pl-5">
                      +{selectedPlan.features.length - 5} more features
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs font-medium text-gray-700">Secure Payment</p>
            <p className="text-xs text-gray-500">PCI DSS Compliant</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs font-medium text-gray-700">Instant Access</p>
            <p className="text-xs text-gray-500">Immediate activation</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl mb-1">🌍</div>
            <p className="text-xs font-medium text-gray-700">Global Support</p>
            <p className="text-xs text-gray-500">180+ countries</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
