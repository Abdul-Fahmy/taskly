import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser } from "@/app/services/auth.services";

export async function GET() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getUser();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 401 },
    );
  }
}
