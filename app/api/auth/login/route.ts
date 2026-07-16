import { setAuthCookies } from "@/app/lib/auth-cookies";
import { login } from "@/app/services/auth.services";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { msg: "Email and password are required" },
        { status: 400 },
      );
    }

    const data = await login({ email, password });

    if (!data.access_token || !data.refresh_token) {
      return NextResponse.json(
        { msg: "Login succeeded but no session was returned" },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      user: data.user,
    });

    setAuthCookies(
      response,
      {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      },
      Boolean(rememberMe),
    );

    return response;
  } catch {
    return NextResponse.json(
      { msg: "Invalid email or password" },
      { status: 401 },
    );
  }
}
