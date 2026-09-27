import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { rateLimits } from "@/providers/rate-limit";
import { findOAuthUser, signInWithOAuth, verifyCredentials } from "@/services/accounts";
import { authConfig } from "./auth.config";

function clientIp(request: Request | undefined) {
  const forwarded = request?.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request?.headers.get("x-real-ip") || "unknown";
}

/** Google sign-in is enabled only when its credentials are configured. */
export const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

const providers: Provider[] = [
  Credentials({
    credentials: { email: {}, password: {} },
    async authorize(credentials, request) {
      const email = String(credentials?.email ?? "").toLowerCase().trim();
      const password = String(credentials?.password ?? "");
      // Rate limit per email and per IP. Applies to any caller of the credentials endpoint.
      const [byEmail, byIp] = await Promise.all([
        rateLimits.login().limit(`email:${email}`),
        rateLimits.login().limit(`ip:${clientIp(request)}`),
      ]);
      if (!byEmail.success || !byIp.success) return null;

      const user = await verifyCredentials(email, password);
      if (user) await rateLimits.login().reset(`email:${email}`);
      return user;
    },
  }),
];
if (googleEnabled) providers.push(Google);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  pages: { ...authConfig.pages, error: "/login" },
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return true;
      const user = await signInWithOAuth({
        provider: "google",
        providerAccountId: account.providerAccountId,
        email: String(profile?.email ?? ""),
        emailVerified: profile?.email_verified === true,
        firstName: String(profile?.given_name ?? profile?.name ?? ""),
        lastName: String(profile?.family_name ?? ""),
      });
      return Boolean(user);
    },
    async jwt(params) {
      const { token, account } = params;
      // OAuth sign-ins carry the provider's user id; swap in our own user id and role.
      if (account && account.type !== "credentials") {
        const user = await findOAuthUser(account.provider, account.providerAccountId);
        if (!user) return null;
        token.uid = user.id;
        token.role = user.role;
        return token;
      }
      return authConfig.callbacks.jwt(params);
    },
  },
});
