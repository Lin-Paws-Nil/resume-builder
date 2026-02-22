import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export interface SessionUser {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export async function getSession(): Promise<{ user: SessionUser | null; isExpired: boolean }> {
  const supabase = await createClient();
  
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return { user: null, isExpired: false };
  }

  // Check session expiry
  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    return { user: null, isExpired: true };
  }

  const expiresAt = session.data.session.expires_at;
  if (expiresAt) {
    const now = Math.floor(Date.now() / 1000);
    if (expiresAt < now) {
      // Session expired
      await supabase.auth.signOut();
      return { user: null, isExpired: true };
    }
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, first_name, last_name, email')
    .eq('id', authUser.id)
    .single();

  return {
    user: {
      id: authUser.id,
      email: authUser.email || profile?.email || '',
      username: profile?.username,
      firstName: profile?.first_name || undefined,
      lastName: profile?.last_name || undefined,
    },
    isExpired: false,
  };
}

export async function requireAuth(): Promise<SessionUser> {
  const { user, isExpired } = await getSession();
  
  if (isExpired) {
    throw new Error('Session expired. Please log in again.');
  }
  
  if (!user) {
    throw new Error('Authentication required.');
  }
  
  return user;
}

export async function checkSubscription(userId: string): Promise<{
  hasActiveSubscription: boolean;
  plan: 'free' | 'weekly' | 'monthly' | 'annual' | null;
}> {
  const supabase = await createClient();
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, plan, is_active, end_date')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!subscription) {
    return { hasActiveSubscription: false, plan: 'free' };
  }

  // Check if subscription is still valid
  if (subscription.end_date) {
    const endDate = new Date(subscription.end_date);
    const now = new Date();
    if (endDate < now) {
      // Subscription expired
      await supabase
        .from('subscriptions')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('id', subscription.id);
      
      return { hasActiveSubscription: false, plan: 'free' };
    }
  }

  return {
    hasActiveSubscription: subscription.plan !== 'free',
    plan: subscription.plan as 'free' | 'weekly' | 'monthly' | 'annual',
  };
}

