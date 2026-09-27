import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/server/auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Optimistic route protection only — every page, action and route handler
 * re-checks the session and permissions on the server.
 */
export const proxy = auth((request) => {
  const { pathname, search } = request.nextUrl;
  const user = request.auth?.user;

  if (!user) {
    const login = new URL("/login", request.nextUrl);
    login.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }
  if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/start-project/:path+"],
};
