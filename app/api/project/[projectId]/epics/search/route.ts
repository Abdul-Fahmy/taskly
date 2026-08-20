import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { getEpicsBySearchTerm } from "@/app/services/epic.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ projectId: string }> },
  ) {
    const { projectId } = await params;
    const token = (await cookies()).get("access_token")?.value;
    const { searchParams } = new URL(request.url);
   
    const searchTerm = searchParams.get("searchTerm");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    if (!projectId) {
      return NextResponse.json(
        { message: "projectId is required" },
        { status: 400 },
      );
    }
  
   
  
 
  if (!searchTerm || searchTerm.length === 0) {
    return NextResponse.json(
      { message: "searchTerm is required" },
      { status: 400 },
    );
  }
    try {
      const result = await getEpicsBySearchTerm({ projectId,searchTerm});
  
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