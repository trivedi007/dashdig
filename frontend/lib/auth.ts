import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import AppleProvider from "next-auth/providers/apple"
import FacebookProvider from "next-auth/providers/facebook"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import type { Adapter } from "next-auth/adapters"

// MongoDB client setup
const uri = process.env.MONGODB_URI || ""
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export const authOptions: NextAuthOptions = {
  // Configure MongoDB adapter
  adapter: MongoDBAdapter(clientPromise) as Adapter,

  // Configure authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: {
        appleId: process.env.APPLE_CLIENT_ID || "",
        teamId: process.env.APPLE_TEAM_ID || "",
        privateKey: process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "",
        keyId: process.env.APPLE_KEY_ID || "",
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID || "",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "",
    }),
  ],

  // Configure session strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Redirect errors to signin page
  },

  // Callbacks
  callbacks: {
    async signIn({ user, account, profile }) {
      // Auto-approve OAuth sign-ins
      if (account?.provider === 'google' || account?.provider === 'apple' || account?.provider === 'facebook') {
        return true
      }
      return true
    },

    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful sign-in
      if (url === baseUrl || url === `${baseUrl}/auth/signin`) {
        return `${baseUrl}/dashboard`
      }
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },

    async session({ session, token }) {
      // Include user ID and provider in session
      if (session.user) {
        session.user.id = token.sub || ""
        session.user.provider = token.provider as string || "credentials"
      }
      return session
    },

    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (account && user) {
        token.provider = account.provider
        token.sub = user.id
      }

      // Account merging: link accounts with same email
      if (user && trigger === 'signIn') {
        try {
          const db = (await clientPromise).db()
          const accountsCollection = db.collection('accounts')
          const usersCollection = db.collection('users')

          // Check if user with this email already exists
          const existingUser = await usersCollection.findOne({ email: user.email })

          if (existingUser && existingUser._id.toString() !== user.id && account) {
            // Link the new account to existing user
            await accountsCollection.updateOne(
              {
                provider: account.provider,
                providerAccountId: account.providerAccountId
              },
              {
                $set: { userId: existingUser._id }
              }
            )

            // Update token to use existing user ID
            token.sub = existingUser._id.toString()
          }
        } catch (error) {
          console.error('Error during account linking:', error)
        }
      }

      return token
    },
  },

  // Security settings
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
}

export { clientPromise }
