'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ConfirmForm() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const type = searchParams.get('type') || 'signup';

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing confirmation token');
        return;
      }

      try {
        const supabase = createClient();

        // Verify the token
        const { data, error } = await supabase.auth.verifyOtp({
          token: token,
          type: type as 'signup' | 'email',
        });

        if (error) {
          setStatus('error');
          setMessage(error.message || 'Confirmation failed');
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('Email confirmed successfully! Redirecting to builder...');
          
          // Wait a moment, then redirect
          setTimeout(() => {
            router.push('/builder');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Confirmation failed - no user data received');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'An error occurred during confirmation');
      }
    };

    confirmEmail();
  }, [token, type, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">resumebuilder.io</h1>
            <p className="text-gray-600">Email Confirmation</p>
          </div>

          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Confirming your email...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 font-semibold mb-4">{message}</p>
                <p className="text-sm text-gray-500">You will be redirected shortly...</p>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-semibold mb-4">{message}</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => router.push('/login')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Go to Login
                  </Button>
                  <Link
                    href="/signup"
                    className="block text-sm text-blue-600 hover:text-blue-700"
                  >
                    Create a new account
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ConfirmForm />
    </Suspense>
  );
}

