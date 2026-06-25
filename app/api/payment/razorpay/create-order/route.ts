import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/payments/razorpay';
import { getPlanPrice, toSmallestUnit, isSupportedCurrency } from '@/lib/payments/config';
import { createClient } from '@/lib/supabase/server';
import type { PlanType } from '@/lib/types/subscription';

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay keys are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Razorpay keys not configured on server');
      return NextResponse.json(
        { 
          error: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.' 
        },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.error('❌ Public Razorpay key not configured');
      return NextResponse.json(
        { 
          error: 'Payment gateway public key not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID to environment variables.' 
        },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ Authentication failed:', authError);
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

    console.log('📝 Order request:', { planId, currency, userId: user.id });

    if (!planId || !['weekly', 'monthly', 'annual'].includes(planId)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Validate currency
    const curr = isSupportedCurrency(currency) ? currency : 'INR';

    // Get plan price in requested currency
    const planPrice = getPlanPrice(planId as 'weekly' | 'monthly' | 'annual', curr);
    const amountInSmallestUnit = toSmallestUnit(planPrice.amount, curr);

    console.log('💰 Order details:', { 
      plan: planId, 
      currency: curr, 
      amount: planPrice.amount, 
      amountInSmallestUnit 
    });

    // Create Razorpay order
    const order = await createRazorpayOrder({
      amount: amountInSmallestUnit,
      currency: curr,
      planId,
      userId: user.id,
      userEmail: user.email || '',
    });

    console.log('✅ Order created:', order);

    // Return order details and Razorpay key for client-side
    return NextResponse.json({
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('❌ Razorpay order creation error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
