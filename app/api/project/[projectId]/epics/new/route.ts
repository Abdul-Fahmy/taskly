import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { addEpic } from "@/app/services/epic.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
