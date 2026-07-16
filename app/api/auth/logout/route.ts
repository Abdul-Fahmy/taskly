import { clearAuthCookies } from "@/app/lib/auth-cookies";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}
