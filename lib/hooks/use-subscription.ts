'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type PlanType = 'free' | 'weekly' | 'monthly' | 'annual';

export interface Subscription {
  plan: PlanType;
  isActive: boolean;
  endDate: string | null;
  canDownload: boolean;
}

export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setSubscription({
        plan: 'free',
        isActive: false,
        endDate: null,
        canDownload: false,
      });
      setLoading(false);
      return;
    }

    loadSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadSubscription = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Don't use timeout - let Supabase query complete naturally
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, plan, is_active, end_date')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Subscription load error:', error);
      }

      if (!data) {
        setSubscription({
          plan: 'free',
          isActive: false,
          endDate: null,
          canDownload: false,
        });
        setLoading(false);
        return;
      }

      // Check if subscription is still valid
      let isActive = data.is_active;
      if (data.end_date) {
        const endDate = new Date(data.end_date);
        const now = new Date();
        if (endDate < now) {
          isActive = false;
          // Update subscription to inactive (don't await to prevent blocking)
          supabase
            .from('subscriptions')
            .update({ is_active: false })
            .eq('user_id', userId)
            .eq('id', data.id)
            .catch(err => console.error('Error updating subscription:', err));
        }
      }

      const canDownload = isActive && data.plan !== 'free';

      setSubscription({
        plan: data.plan as PlanType,
        isActive,
        endDate: data.end_date,
        canDownload,
      });
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading subscription:', error);
      // Set default subscription on error so app can continue
      setSubscription({
        plan: 'free',
        isActive: false,
        endDate: null,
        canDownload: false,
      });
      setLoading(false);
    }
  };

  return {
    subscription,
    loading,
    refresh: loadSubscription,
  };
}

