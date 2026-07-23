import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProjects } from "@/app/services/project.services";

export async function GET() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch projects" },
      { status: 401 },
    );
  }
}
