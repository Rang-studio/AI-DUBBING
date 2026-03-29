import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isWhitelisted, seedRequiredWhitelistUser } from "@/lib/whitelist";

export function isAuthConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
  );
}

const secret = process.env.NEXTAUTH_SECRET || "dev-only-secret-change-me";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret,
  trustHost: true,
  providers: isAuthConfigured()
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
      ]
    : [],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/"
  },
  callbacks: {
    async signIn({ profile }) {
      if (!isAuthConfigured()) return false;
      await seedRequiredWhitelistUser();
      const email = profile?.email;
      return await isWhitelisted(email);
    },
    async jwt({ token, profile }) {
      if (profile?.email) {
        token.email = profile.email;
        token.isWhitelisted = await isWhitelisted(profile.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        (session.user as typeof session.user & { isWhitelisted?: boolean }).isWhitelisted =
          Boolean(token.isWhitelisted);
      }
      return session;
    }
  }
});