'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      // Sign up with Supabase Auth
      // For localhost: Set emailRedirectTo to our confirmation page
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm?type=signup`,
          data: {
            username,
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        console.log('Signup successful:', {
          userId: authData.user.id,
          email: authData.user.email,
          emailConfirmed: authData.user.email_confirmed_at,
          hasSession: !!authData.session,
        });

        // Profile and subscription are created automatically by database trigger
        // Wait a moment for trigger to complete, then verify
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify profile was created (trigger should handle it)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authData.user.id)
          .single();

        if (!profile) {
          // Profile doesn't exist - trigger might not be set up
          // Try to create it manually as fallback
          const { error: manualProfileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              username: username || email.split('@')[0],
              email: email,
              first_name: firstName || null,
              last_name: lastName || null,
            });

          if (manualProfileError) {
            // Check if it's a conflict (profile already exists from trigger)
            if (manualProfileError.code === '23505') {
              // Duplicate key - trigger already created it, that's fine
              console.log('Profile already exists (created by trigger)');
            } else {
              console.error('Profile creation error:', {
                message: manualProfileError.message,
                code: manualProfileError.code,
                details: manualProfileError.details,
                hint: manualProfileError.hint,
              });
            }
          }

          // Check if subscription exists
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', authData.user.id)
            .single();

          if (!subscription) {
            // Create subscription if trigger didn't
            const { error: subError } = await supabase
              .from('subscriptions')
              .insert({
                user_id: authData.user.id,
                plan: 'free',
                start_date: new Date().toISOString(),
                is_active: true,
              });

            if (subError) {
              if (subError.code === '23505') {
                console.log('Subscription already exists (created by trigger)');
              } else {
                console.error('Subscription creation error:', {
                  message: subError.message,
                  code: subError.code,
                  details: subError.details,
                });
              }
            }
          }
        }

        // Check if email confirmation is required
        if (authData.session) {
          // User is automatically logged in (email confirmation disabled or auto-confirmed)
          console.log('User auto-confirmed, redirecting to builder');
          router.push('/builder');
        } else {
          // Email confirmation required
          console.log('Email confirmation required, checking if email was sent...');
          
          // Check if email was actually sent
          if (authData.user && !authData.user.email_confirmed_at) {
            // Email not confirmed yet - might need to resend or check Supabase settings
            setError('');
            const message = 'Email confirmation required. ' +
              'If you did not receive an email, please check:\n' +
              '1. Your spam/junk folder\n' +
              '2. Supabase Dashboard → Authentication → Settings (email confirmation must be enabled)\n' +
              '3. Visit /manual-confirm to resend confirmation email';
            alert(message);
            router.push('/login?message=Please check your email to confirm your account. If no email received, visit /manual-confirm');
          } else {
            // Should not happen, but handle it
            router.push('/builder');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">resumebuilder.io</h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

