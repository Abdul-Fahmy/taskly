import { NextRequest, NextResponse } from "next/server";
import {
  clearAuthCookies,
  isRememberMeEnabled,
  setAuthCookies,
} from "@/app/lib/auth-cookies";
import { refreshSessionTokens } from "@/app/lib/refresh-session";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    const res = NextResponse.json(
      { message: "No refresh token" },
      { status: 401 },
    );
    clearAuthCookies(res);
    return res;
  }

  const tokens = await refreshSessionTokens(refreshToken);

  if (!tokens) {
    const res = NextResponse.json(
      { message: "Refresh failed" },
      { status: 401 },
    );
    clearAuthCookies(res);
    return res;
  }

  const rememberMe = isRememberMeEnabled(
    request.cookies.get("remember_me")?.value,
  );

  const res = NextResponse.json({
    success: true,
  });

  setAuthCookies(res, tokens, rememberMe);

  return res;
}
