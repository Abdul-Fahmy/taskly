import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { addEpic, getEpics, getEpicsPagination } from "@/app/services/epic.service";
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

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!projectId) {
    return NextResponse.json(
      { message: "projectId is required" },
      { status: 400 },
    );
  }

  const isPaginated = limitParam !== null || offsetParam !== null;

  if (!isPaginated) {
    try {
      const epics = await getEpics(projectId);
      return NextResponse.json(epics);
    } catch {
      return NextResponse.json(
        { message: "Failed to fetch epics" },
        { status: 401 },
      );
    }
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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const token = (await cookies()).get("access_token")?.value;
  const { projectId } = await params;

  if (!token) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  if (!projectId) {
    return NextResponse.json(
      { msg: "Project id is required" },
      { status: 400 },
    );
  }

  try {
    const { title, description, assignee_id, deadline } = await req.json();

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ msg: "Title is required" }, { status: 400 });
    }

    const trimmedDescription =
      typeof description === "string" ? description.trim() : "";
    const trimmedAssigneeId =
      typeof assignee_id === "string" ? assignee_id.trim() : "";
    const trimmedDeadline =
      typeof deadline === "string" ? deadline.trim() : "";

    const epic = await addEpic({
      title: title.trim(),
      project_id: projectId,
      ...(trimmedDescription && { description: trimmedDescription }),
      ...(trimmedAssigneeId && { assignee_id: trimmedAssigneeId }),
      ...(trimmedDeadline && { deadline: trimmedDeadline }),
    });

    return NextResponse.json(epic, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { msg: getApiErrorMessage(error, "Failed to add epic") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
