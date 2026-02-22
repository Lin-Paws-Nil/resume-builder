'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check initial session
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' && session) {
          await loadUserProfile(session.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsGuest(true);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          await loadUserProfile(session.user);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    });

    // Set up session timeout check
    const timeoutInterval = setInterval(() => {
      checkSessionTimeout();
    }, 60000); // Check every minute

    // Activity tracking for session timeout
    let lastActivity = Date.now();
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const updateActivity = () => {
      lastActivity = Date.now();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      subscription.unsubscribe();
      clearInterval(timeoutInterval);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  const checkSession = async () => {
    try {
      // Don't use timeout for session check - let it complete naturally
      // If Supabase is slow, it's better to wait than to timeout
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setUser(null);
        setIsGuest(true);
        setLoading(false);
        return;
      }

      // Check if session is expired
      const expiresAt = session.expires_at;
      if (expiresAt) {
        const now = Math.floor(Date.now() / 1000);
        if (expiresAt < now) {
          supabase.auth.signOut().catch(err => console.error('Sign out error:', err));
          setUser(null);
          setIsGuest(true);
          setLoading(false);
          return;
        }
      }

      await loadUserProfile(session.user);
    } catch (error: any) {
      console.error('Session check error:', error);
      // Allow app to continue even if session check fails
      setUser(null);
      setIsGuest(true);
      setLoading(false);
    }
  };

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, first_name, last_name, email')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile load error:', error);
        // If profile doesn't exist, still allow user to proceed with basic info
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          username: undefined,
          firstName: undefined,
          lastName: undefined,
        });
        setIsGuest(false);
        setLoading(false);
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || profile?.email || '',
        username: profile?.username,
        firstName: profile?.first_name || undefined,
        lastName: profile?.last_name || undefined,
      });
      setIsGuest(false);
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      // Even on error, set basic user info so app can continue
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        username: undefined,
        firstName: undefined,
        lastName: undefined,
      });
      setIsGuest(false);
      setLoading(false);
    }
  };

  const checkSessionTimeout = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return;
    }

    const expiresAt = session.expires_at;
    if (expiresAt) {
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = (expiresAt - now) * 1000; // Convert to milliseconds
      
      // If session expires in less than 1 minute, refresh it
      if (timeUntilExpiry < 60000 && timeUntilExpiry > 0) {
        await supabase.auth.refreshSession();
      }
      
      // If session is expired, sign out
      if (expiresAt < now) {
        await signOut();
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsGuest(true);
    router.push('/login');
  };

  return {
    user,
    loading,
    isGuest,
    signOut,
    refreshSession: checkSession,
  };
}

