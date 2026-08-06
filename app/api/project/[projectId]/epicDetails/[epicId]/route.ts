import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEpicDetails } from "@/app/services/epic.service";

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
