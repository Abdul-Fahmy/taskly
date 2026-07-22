import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { resetPassword } from "@/app/services/auth.services";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { password, access_token } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { msg: "Password is required" },
        { status: 400 },
      );
    }

    if (!access_token || typeof access_token !== "string") {
      return NextResponse.json(
        { msg: "Invalid or expired reset link" },
        { status: 400 },
      );
    }

    await resetPassword({ password, access_token });

    return NextResponse.json({
      msg: "Your password has been updated successfully. You can now log in",
    });
  } catch (error) {
    return NextResponse.json(
      { msg: getApiErrorMessage(error, "Failed to reset password") },
      { status: getApiErrorStatus(error, 400) },
    );
  }
}
