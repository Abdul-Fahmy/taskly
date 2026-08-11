import { createTask } from "@/app/services/tasks.services";
import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { tasksSchema } from "@/app/schemas/newTasksSchema";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = tasksSchema.safeParse({
      ...body,
      project_id: body.project_id || projectId,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const task = await createTask(accessToken, parsed.data);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error, "Failed to create task") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
