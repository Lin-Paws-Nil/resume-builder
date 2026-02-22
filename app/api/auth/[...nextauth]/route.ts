import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { createAdminClient } from '@/lib/supabase/admin';

// For now, we'll use JWT strategy until we set up the database adapter properly
// This allows us to get started quickly and migrate to database sessions later

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // For now, support legacy login (SwapnilD/SwapnilD)
        // Later, we'll migrate to proper password auth with Supabase
        if (credentials.username === 'SwapnilD' && credentials.password === 'SwapnilD') {
          const supabase = createAdminClient();
          
          // Check if user exists in Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', credentials.username)
            .single();

          if (profile) {
            // Get auth user
            const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
            if (authUser?.user) {
              return {
                id: authUser.user.id,
                email: authUser.user.email || profile.email,
                name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || credentials.username,
              };
            }
          }

          // If user doesn't exist, return null (we'll handle migration separately)
          return null;
        }

        return null;
      },
    }),
    // Google OAuth (optional - configure if needed)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

