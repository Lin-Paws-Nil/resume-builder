'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

/**
 * Manual email confirmation page for localhost development
 * Use this when email confirmation links don't work
 */
export default function ManualConfirmPage() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleResendConfirmation = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm`,
        },
      });

      if (error) {
        setStatus('error');
        setMessage(error.message);
      } else {
        setStatus('success');
        setMessage('Confirmation email sent! Check your inbox (and spam folder).');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to resend confirmation email');
    }
  };

  const handleManualConfirm = async () => {
    if (!token) {
      setMessage('Please enter the confirmation token');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Try to verify the token using token hash method
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
      });

      if (error) {
        setStatus('error');
        setMessage(error.message || 'Invalid or expired token');
      } else if (data.user) {
        setStatus('success');
        setMessage('Email confirmed successfully! Redirecting...');
        setTimeout(() => {
          router.push('/builder');
        }, 2000);
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Confirmation failed');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">createresume.co</h1>
            <p className="text-gray-600">Manual Email Confirmation</p>
            <p className="text-xs text-gray-500 mt-2">For localhost development</p>
          </div>

          <div className="space-y-4">
            {/* Resend Confirmation Email */}
            <div className="border-b pb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Resend Confirmation Email</h3>
              <div className="space-y-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
                <Button
                  onClick={handleResendConfirmation}
                  disabled={status === 'loading'}
                  className="w-full"
                  variant="outline"
                >
                  {status === 'loading' ? 'Sending...' : 'Resend Confirmation Email'}
                </Button>
              </div>
            </div>

            {/* Manual Token Confirmation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Or Confirm with Token</h3>
              <p className="text-xs text-gray-500 mb-2">
                Get token from Supabase Dashboard → Authentication → Users → Your User → Copy confirmation token
              </p>
              <div className="space-y-2">
                <Input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste confirmation token here"
                />
                <Button
                  onClick={handleManualConfirm}
                  disabled={status === 'loading'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {status === 'loading' ? 'Confirming...' : 'Confirm Email'}
                </Button>
              </div>
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {message}
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                {message}
              </div>
            )}

            <div className="pt-4 border-t">
              <Link
                href="/login"
                className="block text-center text-sm text-blue-600 hover:text-blue-700"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





