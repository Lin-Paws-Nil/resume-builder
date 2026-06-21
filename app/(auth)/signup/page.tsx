'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GradientButton } from '@/components/ui/gradient-button';
import { FileText, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Spinner } from '@/components/ui/spinner';

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-blue-400/70 focus-within:bg-blue-500/10">
    {children}
  </div>
);

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden p-4">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] opacity-30"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">createresume.co</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-300">Start building your professional resume today</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Username
              </label>
              <GlassInputWrapper>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-gray-400"
                  required
                />
              </GlassInputWrapper>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  First Name
                </label>
                <GlassInputWrapper>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-gray-400"
                  />
                </GlassInputWrapper>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Last Name
                </label>
                <GlassInputWrapper>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-gray-400"
                  />
                </GlassInputWrapper>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <GlassInputWrapper>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-gray-400"
                  required
                />
              </GlassInputWrapper>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <GlassInputWrapper>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-gray-400"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </GlassInputWrapper>
              <p className="text-xs text-gray-400 mt-2">Minimum 6 characters</p>
            </div>

            <GradientButton
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size={16} invert />
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </GradientButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

