import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import {
  getEpicDetails,
  UpdateEpicPayload,
  updateEpic,
} from "@/app/services/epic.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string; epicId: string }> },
) {
  const { projectId, epicId } = await params;
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const epic = await getEpicDetails(projectId, epicId);
    return NextResponse.json(epic);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch epic" },
      { status: 401 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string; epicId: string }> },
) {
  const { epicId } = await params;
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!epicId) {
    return NextResponse.json(
      { message: "Epic id is required" },
      { status: 400 },
    );
  }

  try {
    const body = (await req.json()) as UpdateEpicPayload;
    const patch: UpdateEpicPayload = {};

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

    if ("deadline" in body) {
      if (body.deadline === null || body.deadline === "") {
        patch.deadline = null;
      } else if (typeof body.deadline === "string") {
        patch.deadline = body.deadline.trim();
      } else {
        return NextResponse.json(
          { message: "Invalid deadline" },
          { status: 400 },
        );
      }
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 },
      );
    }

    const epic = await updateEpic(epicId, patch);
    return NextResponse.json(epic, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error, "Failed to update epic") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
