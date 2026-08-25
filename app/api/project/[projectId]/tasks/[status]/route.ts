import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { getTasks } from "@/app/services/tasks.services";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; status: string }> },
) {
  const { projectId, status } = await params;
  const searchTerm =
    new URL(request.url).searchParams.get("searchTerm")?.trim() || undefined;
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
  if (!status) {
    return NextResponse.json(
      { message: "status is required" },
      { status: 400 },
    );
  }

  try {
    const result = await getTasks(projectId, status, searchTerm);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error, "Failed to fetch tasks") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
