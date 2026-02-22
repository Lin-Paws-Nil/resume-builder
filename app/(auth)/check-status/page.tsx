'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, CheckCircle, XCircle, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

/**
 * Check user status in Supabase
 * Useful for debugging signup issues
 */
export default function CheckStatusPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState('');

  const checkUser = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError('');
    setUserInfo(null);

    try {
      const supabase = createClient();

      // Check if user exists in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Check subscription
      let subscription = null;
      if (profile) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', profile.id)
          .eq('is_active', true)
          .single();
        subscription = subData;
      }

      // Try to get auth user info (this might fail if not admin)
      let authUser = null;
      try {
        // Note: This requires admin access, might not work from client
        // But we can check session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email === email) {
          authUser = {
            id: session.user.id,
            email: session.user.email,
            email_confirmed_at: session.user.email_confirmed_at,
          };
        }
      } catch (e) {
        // Can't access auth.users from client, that's expected
      }

      setUserInfo({
        profile,
        subscription,
        authUser,
        exists: !!profile,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to check user status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">resumebuilder.io</h1>
            <p className="text-gray-600">Check User Status</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="flex-1"
                />
                <Button
                  onClick={checkUser}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? 'Checking...' : 'Check Status'}
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {userInfo && (
              <div className="space-y-4">
                {userInfo.exists ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">User Found</h3>
                      </div>
                      
                      {userInfo.profile && (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Username:</span>
                            <span>{userInfo.profile.username || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Email:</span>
                            <span>{userInfo.profile.email}</span>
                          </div>
                          <div>
                            <span className="font-medium">Name:</span>
                            <span> {userInfo.profile.first_name || ''} {userInfo.profile.last_name || ''}</span>
                          </div>
                          <div>
                            <span className="font-medium">Created:</span>
                            <span> {new Date(userInfo.profile.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      {userInfo.subscription && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="text-sm">
                            <span className="font-medium">Subscription:</span>
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {userInfo.subscription.plan} Plan
                            </span>
                            {userInfo.subscription.is_active && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {userInfo.authUser && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="text-sm">
                            <span className="font-medium">Email Confirmed:</span>
                            <span className={`ml-2 ${userInfo.authUser.email_confirmed_at ? 'text-green-600' : 'text-yellow-600'}`}>
                              {userInfo.authUser.email_confirmed_at ? 'Yes' : 'No (needs confirmation)'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {userInfo.authUser && !userInfo.authUser.email_confirmed_at && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800 mb-2">
                          Email not confirmed. You can:
                        </p>
                        <div className="space-y-2">
                          <Link href="/manual-confirm">
                            <Button variant="outline" className="w-full">
                              Resend Confirmation Email
                            </Button>
                          </Link>
                          <p className="text-xs text-yellow-700">
                            Or disable email confirmation in Supabase Dashboard → Authentication → Settings
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-gray-500" />
                      <h3 className="font-semibold text-gray-900">User Not Found</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      No user found with this email address.
                    </p>
                    <Link href="/signup">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Back to Login
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

