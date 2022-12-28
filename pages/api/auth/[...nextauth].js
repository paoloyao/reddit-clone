import NextAuth from "next-auth"
import RedditProvider from "next-auth/providers/reddit"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    RedditProvider({
      clientId: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)