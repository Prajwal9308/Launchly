import type { NextAuthConfig } from "next-auth";

/**
 * Provider-free Auth.js config shared by the proxy and the full auth setup.
 * Sessions are signed, HTTP-only JWT cookies (Secure + __Secure- prefix on HTTPS).
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token.uid && token.role) {
        session.user.id = token.uid;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
