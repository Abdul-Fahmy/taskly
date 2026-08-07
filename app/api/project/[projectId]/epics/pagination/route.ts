import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { getEpicsPagination } from "@/app/services/epic.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 10);
  const offset = Number(searchParams.get("offset") ?? 0);
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
    const result = await getEpicsPagination({ projectId, limit, offset });

    return NextResponse.json(result.epics, {
      headers: {
        "Content-Range": result.contentRange,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error, "Failed to fetch epics") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
