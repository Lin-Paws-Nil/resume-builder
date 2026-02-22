'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, Smartphone, Lock, Check } from 'lucide-react';

type PaymentMethod = 'card' | 'upi';

export function PaymentInfo() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle card payment
    alert('Card payment method saved!');
  };

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle UPI payment
    alert('UPI ID saved!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
        <p className="text-sm text-gray-600 mb-6">
          Add and manage your payment methods for seamless transactions.
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setPaymentMethod('card')}
          className={`flex-1 p-4 border-2 rounded-lg transition-all ${
            paymentMethod === 'card'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard className="h-5 w-5" />
            <span className="font-medium">Credit/Debit Card</span>
          </div>
        </button>
        <button
          onClick={() => setPaymentMethod('upi')}
          className={`flex-1 p-4 border-2 rounded-lg transition-all ${
            paymentMethod === 'upi'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Smartphone className="h-5 w-5" />
            <span className="font-medium">UPI</span>
          </div>
        </button>
      </div>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleCardSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={(e) =>
                    setCardData({ ...cardData, cardNumber: e.target.value })
                  }
                  maxLength={19}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={cardData.cardholderName}
                onChange={(e) =>
                  setCardData({ ...cardData, cardholderName: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={cardData.expiryDate}
                  onChange={(e) =>
                    setCardData({ ...cardData, expiryDate: e.target.value })
                  }
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <Input
                  type="text"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
              <Lock className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Card
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* UPI Payment Form */}
      {paymentMethod === 'upi' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleUpiSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="yourname@paytm or yourname@phonepe"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter your UPI ID (e.g., yourname@paytm, yourname@phonepe, yourname@ybl)
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
              <Lock className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save UPI ID
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Methods Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Secure Payment Processing
            </h3>
            <p className="text-xs text-blue-700">
              We use industry-standard encryption to protect your payment information. All
              transactions are processed securely through our payment partners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

