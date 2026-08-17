import { getApiErrorMessage, getApiErrorStatus } from "@/app/lib/api";
import { acceptMemberSchema } from "@/app/schemas/acceptInvitationSchema";
import { acceptInvitation } from "@/app/services/member.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ invitationToken: string }> },
) {
  try {
    const { invitationToken } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = acceptMemberSchema.safeParse({
      ...body,
      p_token: body.p_token || invitationToken,
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

    const accept = await acceptInvitation(parsed.data.p_token);
    return NextResponse.json(accept, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error, "Failed to accept invitation") },
      { status: getApiErrorStatus(error, 500) },
    );
  }
}
