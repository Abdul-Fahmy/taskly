import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { setAuthCookies } from "@/app/lib/auth-cookies";
import { signup } from "@/app/services/auth.services";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, data } = body;

    if (!email || !password || !data?.name) {
      return NextResponse.json(
        { msg: "Email, password, and name are required" },
        { status: 400 },
      );
    }

    const result = await signup({ email, password, data });

    const accessToken =
      result.access_token ?? result.session?.access_token;
    const refreshToken =
      result.refresh_token ?? result.session?.refresh_token;
    const expiresIn = result.expires_in ?? result.session?.expires_in;
    const hasSession = Boolean(accessToken && refreshToken);

    const response = NextResponse.json({
      user: result.user,
      hasSession,
    });

    if (accessToken && refreshToken) {
      setAuthCookies(response, {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { msg: getApiErrorMessage(error, "Signup failed") },
      { status: getApiErrorStatus(error, 400) },
    );
  }}
