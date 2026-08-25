import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { updateTaskStatus } from "@/app/services/tasks.services";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { taskId, status } = await request.json();

    if (!taskId || !status) {
      return NextResponse.json(
        { message: "taskId and status are required" },
        { status: 400 },
      );
    }

    const result = await updateTaskStatus({ taskId, status });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error, "Failed to update task status") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
