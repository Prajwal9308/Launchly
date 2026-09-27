import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { rateLimits } from "@/providers/rate-limit";
import { verifyCredentials } from "@/services/accounts";
import { authConfig } from "./auth.config";

function clientIp(request: Request | undefined) {
  const forwarded = request?.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request?.headers.get("x-real-ip") || "unknown";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
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
  ],
});
