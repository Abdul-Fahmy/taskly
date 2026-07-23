import {
  getApiErrorMessage,
  getApiErrorStatus,
  isApiFetchError,
} from "@/app/lib/api";
import { forgotPassword } from "@/app/services/auth.services";
import { NextResponse } from "next/server";

function isMissingUserError(error: unknown): boolean {
  const message = getApiErrorMessage(error, "").toLowerCase();

  return (
    message.includes("user not found") ||
    message.includes("unable to find") ||
    message.includes("email not found") ||
    message.includes("no user found")
  );
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ msg: "Email is required" }, { status: 400 });
    }

    try {
      await forgotPassword({ email: email.trim() });
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error(error);

      if (isMissingUserError(error)) {
        return NextResponse.json({ ok: true });
      }

      const status = isApiFetchError(error)
        ? error.status
        : getApiErrorStatus(error, 500);

      return NextResponse.json(
        { msg: getApiErrorMessage(error, "Failed to send reset link") },
        { status: status >= 400 ? status : 500 },
      );
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { msg: "Failed to send reset link" },
      { status: 500 },
    );
  }
}
