import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { editProject } from "@/app/services/project.services";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await params;
    const { name, description } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { msg: "Project id is required" },
        { status: 400 },
      );
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ msg: "Name is required" }, { status: 400 });
    }

    const project = await editProject(
      {
        name: name.trim(),
        description: typeof description === "string" ? description.trim() : "",
      },
      projectId,
    );

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { msg: getApiErrorMessage(error, "Failed to edit project") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
