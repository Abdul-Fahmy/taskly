import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { addProject } from "@/app/services/project.services";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ msg: "Name is required" }, { status: 400 });
    }

    const project = await addProject({
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : "",
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { msg: getApiErrorMessage(error, "Failed to add project") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
