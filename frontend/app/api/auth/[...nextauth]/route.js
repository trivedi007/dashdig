import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    async session({ session, user }) {
      // Add user ID to session
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user, account, profile, email }) {
      // Allow all Google sign-ins
      console.log('✅ Google sign-in successful:', user.email);
      
      // Log account linking if it happens
      if (account?.provider === 'google') {
        console.log('🔗 Linking Google account to existing user (if email matches)');
      }
      
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful sign-in
      if (url === baseUrl || url === '/') {
        return `${baseUrl}/?view=dashboard`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

