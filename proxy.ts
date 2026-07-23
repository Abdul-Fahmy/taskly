import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/sign-up", "/forgot-password"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/project");
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/project", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:path*"],
  matcher: [
    "/project",
    "/project/:path*",
    "/login",
    "/sign-up",
    "/forgot-password",
  ],
};
