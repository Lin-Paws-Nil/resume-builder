import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/payments/razorpay';
import { createClient } from '@/lib/supabase/server';
import type { PlanType } from '@/lib/types/subscription';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      planId,
    } = body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      userId: string;
      planId: PlanType;
    };

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Create subscription in database
    const supabase = await createClient();
    
    // Get authenticated user to ensure we use the correct user_id
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      console.error('Auth error during subscription creation:', authError);
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    // Ensure user has a profile entry (create if doesn't exist)
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authUser.id)
      .single();
    
    if (profileCheckError || !existingProfile) {
      console.log('Creating profile for user:', authUser.id);
      // Create profile if it doesn't exist
      const { error: profileCreateError } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          email: authUser.email,
          username: authUser.user_metadata?.username || authUser.email?.split('@')[0],
        }, { onConflict: 'id' });
      
      if (profileCreateError) {
        console.error('Profile creation error:', profileCreateError);
      }
    }
    
    const calculateEndDate = (plan: PlanType): string => {
      const now = new Date();
      const days = plan === 'weekly' ? 7 : plan === 'monthly' ? 30 : plan === 'annual' ? 365 : 30;
      now.setDate(now.getDate() + days);
      return now.toISOString();
    };

    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: authUser.id, // Use authenticated user's ID
        plan: planId,
        is_active: true,
        start_date: new Date().toISOString(),
        end_date: calculateEndDate(planId),
        payment_provider: 'razorpay',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error: any) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
