import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Missing Supabase environment variables:', {
      hasUrl: !!url,
      hasKey: !!key,
    });
    // Create a client with empty strings - it will fail gracefully on API calls
    // This prevents the app from crashing during initialization
    return createBrowserClient(url || '', key || '');
  }

  try {
    return createBrowserClient(url, key, {
      cookies: {
        get(name: string) {
          return document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1];
        },
        set(name: string, value: string, options: any) {
          document.cookie = `${name}=${value}; path=/; max-age=${options.maxAge || 31536000}; SameSite=Lax; Secure`;
        },
        remove(name: string) {
          document.cookie = `${name}=; path=/; max-age=0`;
        },
      },
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    // Return a client with empty strings as fallback
    return createBrowserClient('', '');
  }
}

