import {
  isRememberMeEnabled,
  setAuthCookies,
} from "@/app/lib/auth-cookies";
import { refreshSessionTokens } from "@/app/lib/refresh-session";
import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/sign-up", "/forgot-password"];

async function refreshAndContinue(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) return null;

  const tokens = await refreshSessionTokens(refreshToken);
  if (!tokens) return null;

  const rememberMe = isRememberMeEnabled(
    request.cookies.get("remember_me")?.value,
  );

  request.cookies.set("access_token", tokens.access_token);
  request.cookies.set("refresh_token", tokens.refresh_token);

  const response = NextResponse.next({ request });
  setAuthCookies(response, tokens, rememberMe);
  return response;
}

async function refreshAndRedirect(request: NextRequest, path: string) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) return null;

  const tokens = await refreshSessionTokens(refreshToken);
  if (!tokens) return null;

  const rememberMe = isRememberMeEnabled(
    request.cookies.get("remember_me")?.value,
  );

  const response = NextResponse.redirect(new URL(path, request.url));
  setAuthCookies(response, tokens, rememberMe);
  return response;
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/project");
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtectedRoute && !accessToken) {
    if (refreshToken) {
      const refreshed = await refreshAndContinue(request);
      if (refreshed) return refreshed;
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/project", request.url));
  }

  if (isAuthRoute && !accessToken && refreshToken) {
    const redirected = await refreshAndRedirect(request, "/project");
    if (redirected) return redirected;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/project",
    "/project/:path*",
    "/login",
    "/sign-up",
    "/forgot-password",
  ],
};
