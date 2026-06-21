'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GradientButton } from '@/components/ui/gradient-button';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-blue-400/70 focus-within:bg-blue-500/10">
    {children}
  </div>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/confirm?type=recovery`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-white tracking-tighter mb-2">
            Reset Password
          </h1>
          <p className="text-gray-400 text-sm">
            Enter your email and we&apos;ll send you a link to reset your password
          </p>
        </div>

        {success ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
            <p className="text-green-300 font-medium mb-2">Check your email</p>
            <p className="text-gray-400 text-sm">
              We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>. 
              Check your inbox and follow the link to reset your password.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 mt-4 text-sm text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <GlassInputWrapper>
              <div className="flex items-center gap-3 px-4">
                <Mail className="h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent py-3.5 text-white placeholder:text-gray-500 outline-none text-sm"
                />
              </div>
            </GlassInputWrapper>

            <GradientButton
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 text-sm"
            >
              {loading ? (
                <>
                  <Spinner size={16} invert className="mr-2" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </GradientButton>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
