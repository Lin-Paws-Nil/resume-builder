/**
 * Script to update a user's subscription in Supabase
 * 
 * Usage:
 *   npm exec tsx scripts/update-subscription.ts <email> <plan> [days]
 * 
 * Examples:
 *   npm exec tsx scripts/update-subscription.ts user@example.com monthly 30
 *   npm exec tsx scripts/update-subscription.ts user@example.com annual 365
 *   npm exec tsx scripts/update-subscription.ts user@example.com free
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

type PlanType = 'free' | 'weekly' | 'monthly' | 'annual';

interface UpdateSubscriptionOptions {
  email: string;
  plan: PlanType;
  days?: number;
  activate?: boolean;
  deactivateOld?: boolean;
}

async function updateSubscription(options: UpdateSubscriptionOptions) {
  const { email, plan, days, activate = true, deactivateOld = false } = options;

  try {
    // 1. Get user profile to find user_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      console.error('❌ User not found:', email);
      console.error('Error:', profileError);
      return;
    }

    console.log('✅ Found user:', profile.email, profile.first_name, profile.last_name);

    // 2. If deactivateOld, deactivate all existing subscriptions
    if (deactivateOld) {
      const { error: deactivateError } = await supabase
        .from('subscriptions')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', profile.id);

      if (deactivateError) {
        console.error('⚠️  Error deactivating old subscriptions:', deactivateError);
      } else {
        console.log('✅ Deactivated old subscriptions');
      }
    }

    // 3. Calculate end_date based on plan and days
    let endDate: Date | null = null;
    if (days) {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + days);
    } else {
      // Default durations based on plan
      endDate = new Date();
      switch (plan) {
        case 'weekly':
          endDate.setDate(endDate.getDate() + 7);
          break;
        case 'monthly':
          endDate.setDate(endDate.getDate() + 30);
          break;
        case 'annual':
          endDate.setDate(endDate.getDate() + 365);
          break;
        case 'free':
          endDate = null; // Free plan has no end date
          break;
      }
    }

    // 4. Check if active subscription exists
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_active', true)
      .single();

    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          plan,
          start_date: new Date().toISOString(),
          end_date: endDate?.toISOString() || null,
          is_active: activate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSubscription.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating subscription:', error);
        return;
      }

      console.log('✅ Updated existing subscription:');
      console.log('   Plan:', data.plan);
      console.log('   Active:', data.is_active);
      console.log('   End Date:', data.end_date || 'No end date');
    } else {
      // Create new subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: profile.id,
          plan,
          start_date: new Date().toISOString(),
          end_date: endDate?.toISOString() || null,
          is_active: activate,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating subscription:', error);
        return;
      }

      console.log('✅ Created new subscription:');
      console.log('   Plan:', data.plan);
      console.log('   Active:', data.is_active);
      console.log('   End Date:', data.end_date || 'No end date');
    }

    // 5. Verify the update
    const { data: verification } = await supabase
      .from('subscriptions')
      .select('*, profiles:user_id(email, first_name, last_name)')
      .eq('user_id', profile.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (verification) {
      console.log('\n📋 Current active subscription:');
      console.log('   User:', verification.profiles?.email);
      console.log('   Plan:', verification.plan);
      console.log('   Start:', verification.start_date);
      console.log('   End:', verification.end_date || 'No end date');
      console.log('   Active:', verification.is_active);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: npm exec tsx scripts/update-subscription.ts <email> <plan> [days]');
  console.log('');
  console.log('Plans: free, weekly, monthly, annual');
  console.log('');
  console.log('Examples:');
  console.log('  npm exec tsx scripts/update-subscription.ts user@example.com monthly 30');
  console.log('  npm exec tsx scripts/update-subscription.ts user@example.com annual 365');
  console.log('  npm exec tsx scripts/update-subscription.ts user@example.com free');
  process.exit(1);
}

const [email, plan, daysStr] = args;

if (!['free', 'weekly', 'monthly', 'annual'].includes(plan)) {
  console.error('❌ Invalid plan. Must be: free, weekly, monthly, or annual');
  process.exit(1);
}

const days = daysStr ? parseInt(daysStr, 10) : undefined;

if (daysStr && isNaN(days!)) {
  console.error('❌ Days must be a number');
  process.exit(1);
}

updateSubscription({
  email,
  plan: plan as PlanType,
  days,
  activate: true,
  deactivateOld: true, // Deactivate old subscriptions when creating/updating
});

