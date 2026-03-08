import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/payments/razorpay';
import { getPlanPrice, toSmallestUnit } from '@/lib/payments/config';
import { createClient } from '@/lib/supabase/server';
import type { PlanType } from '@/lib/types/subscription';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, currency = 'INR' } = body as {
      planId: PlanType;
      currency?: string;
    };

    if (!planId || !['weekly', 'monthly', 'annual'].includes(planId)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Validate currency
    const validCurrencies = ['INR', 'USD', 'EUR', 'GBP'] as const;
    type ValidCurrency = typeof validCurrencies[number];
    const curr = (validCurrencies.includes(currency as any) ? currency : 'INR') as ValidCurrency;

    // Get plan price in requested currency
    const planPrice = getPlanPrice(planId as 'weekly' | 'monthly' | 'annual', curr);
    const amountInSmallestUnit = toSmallestUnit(planPrice.amount, curr);

    // Create Razorpay order
    const order = await createRazorpayOrder({
      amount: amountInSmallestUnit,
      currency: curr,
      planId,
      userId: user.id,
      userEmail: user.email || '',
    });

    // Return order details and Razorpay key for client-side
    return NextResponse.json({
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
