import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMembers } from "@/app/services/member.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await getMembers(projectId);
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch projects" },
      { status: 401 },
    );
  }
}
