import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { getAllTasksPagination } from "@/app/services/tasks.services";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const token = (await cookies()).get("access_token")?.value;
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const offsetParam = searchParams.get("offset");
  const searchTerm = searchParams.get("searchTerm")?.trim() || undefined;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!projectId) {
    return NextResponse.json(
      { message: "projectId is required" },
      { status: 400 },
    );
  }

  const limit = Number(limitParam ?? 10);
  const offset = Number(offsetParam ?? 0);

  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    !Number.isInteger(offset) ||
    offset < 0
  ) {
    return NextResponse.json(
      { message: "limit must be 1-100 and offset must be 0 or greater" },
      { status: 400 },
    );
  }

  try {
    const result = await getAllTasksPagination({
      projectId,
      limit,
      offset,
      searchTerm,
    });

    return NextResponse.json(result.tasks, {
      headers: {
        "Content-Range": result.contentRange,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error, "Failed to fetch tasks") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
