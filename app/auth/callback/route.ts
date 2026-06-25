import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/builder';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!profile) {
        const email = data.user.email ?? '';
        const metadata = data.user.user_metadata ?? {};

        await supabase.from('profiles').upsert({
          id: data.user.id,
          username: metadata.name || metadata.full_name || email.split('@')[0],
          email,
          first_name: metadata.given_name || metadata.full_name?.split(' ')[0] || null,
          last_name: metadata.family_name || metadata.full_name?.split(' ').slice(1).join(' ') || null,
        });

        await supabase.from('subscriptions').upsert({
          user_id: data.user.id,
          plan: 'free',
          start_date: new Date().toISOString(),
          is_active: true,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?message=Could not authenticate with Google`);
}
