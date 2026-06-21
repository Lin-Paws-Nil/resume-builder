import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Missing Supabase environment variables:', {
      hasUrl: !!url,
      hasKey: !!key,
    });
    throw new Error('Missing Supabase environment variables');
  }

  // Use default cookie handling - @supabase/ssr handles this automatically
  return createBrowserClient(url, key);
}

