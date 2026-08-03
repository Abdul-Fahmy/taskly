import { NextResponse } from "next/server";

type AuthTokens = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
};

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthCookies(
  response: NextResponse,
  tokens: AuthTokens,
  rememberMe = false,
) {
  const accessTokenMaxAge = tokens.expires_in;
  const refreshTokenMaxAge = rememberMe
    ? 60 * 60 * 24 * 30
    : 60 * 60 * 24;

  response.cookies.set("access_token", tokens.access_token, {
    ...cookieBase,
    ...(accessTokenMaxAge ? { maxAge: accessTokenMaxAge } : {}),
  });

  response.cookies.set("refresh_token", tokens.refresh_token, {
    ...cookieBase,
    maxAge: refreshTokenMaxAge,
  });

  response.cookies.set("remember_me", rememberMe ? "1" : "0", {
    ...cookieBase,
    maxAge: refreshTokenMaxAge,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set("access_token", "", {
    ...cookieBase,
    maxAge: 0,
  });

  response.cookies.set("refresh_token", "", {
    ...cookieBase,
    maxAge: 0,
  });

  response.cookies.set("remember_me", "", {
    ...cookieBase,
    maxAge: 0,
  });
}

export function isRememberMeEnabled(
  rememberMeCookie: string | undefined,
): boolean {
  return rememberMeCookie === "1";
}
