import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import {
  dateInputToApiDueDate,
  validateDueDate,
} from "@/app/schemas/updateTaskSchema";
import {
  getTaskDetails,
  UpdateTaskPayload,
  updateTask,
} from "@/app/services/tasks.services";
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

const ALLOWED_STATUSES = new Set([
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE",
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; taskId: string }> },
) {
  const { projectId, taskId } = await params;
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!projectId || !taskId) {
    return NextResponse.json(
      { message: "Project ID and task ID are required" },
      { status: 400 },
    );
  }

  try {
    const body = (await request.json()) as UpdateTaskPayload;
    const patch: UpdateTaskPayload = {};

    if ("title" in body) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return NextResponse.json(
          { message: "Title is required" },
          { status: 400 },
        );
      }
      patch.title = body.title.trim();
    }

    if ("description" in body) {
      if (body.description === null) {
        patch.description = null;
      } else if (typeof body.description === "string") {
        patch.description = body.description.trim() || null;
      } else {
        return NextResponse.json(
          { message: "Invalid description" },
          { status: 400 },
        );
      }
    }

    if ("assignee_id" in body) {
      if (body.assignee_id === null || body.assignee_id === "") {
        patch.assignee_id = null;
      } else if (typeof body.assignee_id === "string") {
        patch.assignee_id = body.assignee_id.trim();
      } else {
        return NextResponse.json(
          { message: "Invalid assignee" },
          { status: 400 },
        );
      }
    }

    if ("epic_id" in body) {
      if (body.epic_id === null || body.epic_id === "") {
        patch.epic_id = null;
      } else if (typeof body.epic_id === "string") {
        patch.epic_id = body.epic_id.trim();
      } else {
        return NextResponse.json(
          { message: "Invalid epic" },
          { status: 400 },
        );
      }
    }

    if ("due_date" in body) {
      if (body.due_date === null || body.due_date === "") {
        patch.due_date = null;
      } else if (typeof body.due_date === "string") {
        const dateInput = body.due_date.includes("T")
          ? body.due_date.slice(0, 10)
          : body.due_date.trim();
        const validation = validateDueDate(dateInput);
        if (!validation.valid) {
          return NextResponse.json(
            { message: validation.message ?? "Invalid due date" },
            { status: 400 },
          );
        }
        patch.due_date = dateInputToApiDueDate(dateInput);
      } else {
        return NextResponse.json(
          { message: "Invalid due date" },
          { status: 400 },
        );
      }
    }

    if ("status" in body) {
      if (typeof body.status !== "string" || !ALLOWED_STATUSES.has(body.status)) {
        return NextResponse.json(
          { message: "Invalid status" },
          { status: 400 },
        );
      }
      patch.status = body.status;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 },
      );
    }

    await getTaskDetails({ projectId, taskId });
    const result = await updateTask({ taskId, patch });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error, "Failed to update task") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
