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
    const hasSession = Boolean(result.access_token && result.refresh_token);

    const response = NextResponse.json({
      user: result.user,
      hasSession,
    });

    if (result.access_token && result.refresh_token) {
      setAuthCookies(response, {
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        expires_in: result.expires_in,
      });
    }

    return response;
  } catch (error) {
    const message =
      typeof error === "object" &&
      error !== null &&
      "msg" in error &&
      typeof error.msg === "string"
        ? error.msg
        : "Signup failed";

    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 400;

    return NextResponse.json({ msg: message }, { status });
  }
}
