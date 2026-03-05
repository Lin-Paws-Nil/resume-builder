'use client';

import { useEffect, useState, useRef } from 'react';
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
  const checkingSession = useRef(false); // Prevent duplicate checks

  useEffect(() => {
    // Check initial session
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[useAuth] Auth state changed:', event, !!session);
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
        } else if (event === 'INITIAL_SESSION' && session) {
          // Handle initial session on page load
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
    console.log('[useAuth] checkSession called, checking lock...');
    console.log('[useAuth] Lock status:', { checking: checkingSession.current, hasUser: !!user, isGuest });
    
    // Prevent multiple simultaneous session checks
    if (checkingSession.current) {
      console.log('[useAuth] ⚠️ Session check already in progress, SKIPPING');
      return;
    }
    
    // Skip if user is already loaded
    if (user && !isGuest) {
      console.log('[useAuth] ✅ User already loaded, SKIPPING session check');
      return;
    }
    
    console.log('[useAuth] 🔒 Acquiring lock for session check...');
    checkingSession.current = true;
    
    try {
      console.log('=== [useAuth] CHECKING SESSION (LOCKED) ===');
      console.log('[useAuth] All cookies:', document.cookie);
      console.log('[useAuth] Cookie names:', document.cookie.split(';').map(c => c.trim().split('=')[0]));
      
      // Use getSession() for faster response (reads from cookies)
      console.log('[useAuth] ⏳ Calling supabase.auth.getSession()...');
      const startTime = Date.now();
      const { data: { session }, error } = await supabase.auth.getSession();
      const elapsed = Date.now() - startTime;
      
      console.log(`[useAuth] ✅ getSession() COMPLETE in ${elapsed}ms`);
      console.log('[useAuth] Result:', { 
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        expiresAt: session?.expires_at,
        hasError: !!error,
        errorMessage: error?.message,
      });
      
      if (error) {
        console.error('[useAuth] ❌ getSession() ERROR:', error);
      }
      
      if (error || !session?.user) {
        console.log('[useAuth] ❌ No valid session, setting as guest');
        setUser(null);
        setIsGuest(true);
        setLoading(false);
        return;
      }

      console.log('[useAuth] ✅ Valid session found, loading profile...');
      await loadUserProfile(session.user);
    } catch (error: any) {
      console.error('[useAuth] ❌ Session check EXCEPTION:', error);
      setUser(null);
      setIsGuest(true);
      setLoading(false);
    } finally {
      console.log('[useAuth] 🔓 Releasing lock');
      checkingSession.current = false;
    }
  };

  const loadUserProfile = async (authUser: User) => {
    try {
      console.log('[useAuth] Loading profile for user:', authUser.id);
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

      const userData = {
        id: authUser.id,
        email: authUser.email || profile?.email || '',
        username: profile?.username,
        firstName: profile?.first_name || undefined,
        lastName: profile?.last_name || undefined,
      };
      
      console.log('[useAuth] User profile loaded, setting isGuest=false');
      setUser(userData);
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

