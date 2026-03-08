import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpayWebhook } from '@/lib/payments/razorpay';
import { createAdminClient } from '@/lib/supabase/admin';
import type { PlanType } from '@/lib/types/subscription';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = verifyRazorpayWebhook(body, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle the event
    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        const userId = payment.notes?.userId;
        const planId = payment.notes?.planId as PlanType;

        if (!userId || !planId) {
          console.error('Missing notes in payment');
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        // Create subscription
        const supabase = createAdminClient();
        
        const calculateEndDate = (plan: PlanType): string => {
          const now = new Date();
          const days = plan === 'weekly' ? 7 : plan === 'monthly' ? 30 : 365;
          now.setDate(now.getDate() + days);
          return now.toISOString();
        };

        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan: planId,
            is_active: true,
            start_date: new Date().toISOString(),
            end_date: calculateEndDate(planId),
            payment_provider: 'razorpay',
            payment_id: payment.id,
            order_id: payment.order_id,
          });

        if (subscriptionError) {
          console.error('Subscription creation error:', subscriptionError);
          return NextResponse.json(
            { error: 'Failed to create subscription' },
            { status: 500 }
          );
        }

        break;
      }

      case 'payment.failed': {
        console.log('Payment failed:', event.payload.payment.entity.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
