import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { getProjectDetails } from "@/app/services/project.services";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!projectId) {
    return NextResponse.json(
      { message: "projectId is required" },
      { status: 400 },
    );
  }

  try {
    const project = await getProjectDetails(projectId);

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error, "Failed to fetch project") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
