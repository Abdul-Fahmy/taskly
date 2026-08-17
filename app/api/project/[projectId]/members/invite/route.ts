import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { inviteMemberSchema } from "@/app/schemas/invitationSchema";
import { sendInvitation } from "@/app/services/member.service";
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
      const parsed = inviteMemberSchema.safeParse({
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
  
      const invite = await sendInvitation(parsed.data);
      return NextResponse.json(invite, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { message: getApiErrorMessage(error, "Failed to send invitation") },
        { status: getApiErrorStatus(error, 500) },
      );
    }
  }
  