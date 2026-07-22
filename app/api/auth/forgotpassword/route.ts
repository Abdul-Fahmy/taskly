import { forgotPassword } from "@/app/services/auth.services";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ msg: "Email is required" }, { status: 400 });
    }

    try {
      await forgotPassword({ email: email.trim() });
    } catch {}

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { msg: "Failed to send reset link" },
      { status: 500 },
    );
  }
}
