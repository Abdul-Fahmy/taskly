import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { getTaskDetails } from "@/app/services/tasks.services";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; taskId: string }> },
) {
  const { projectId, taskId } = await params;
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!projectId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 },
    );
  }

  if (!taskId) {
    return NextResponse.json(
      { message: "Task ID is required" },
      { status: 400 },
    );
  }

  try {
    const task = await getTaskDetails({ projectId, taskId });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error, "Failed to fetch task") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
