import { cookies } from "next/headers";
import { apiFetch } from "../lib/api";
import { Member } from "../types/members";
function getSupabaseConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    throw new Error("Missing Supabase environment variables");
  }

  return { baseUrl };
}
export type InvitationBody = {
  p_email: string;
  p_project_id: string;
  p_app_url: string;
  p_base_url: string;
};

export async function getMembers(projectId: string): Promise<Member[]> {
  const { baseUrl } = getSupabaseConfig();
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Missing access token");
  }

  return apiFetch(
    `${baseUrl}/rest/v1/get_project_members?project_id=eq.${projectId}`,
    {
      method: "GET",
      token,
    },
  );
}

export async function sendInvitation(data: InvitationBody) {
  const { baseUrl } = getSupabaseConfig();
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Missing access token");
  }

  return apiFetch(`${baseUrl}/rest/v1/rpc/invite_member`, {
    method: "POST",
    token,
    body: data,
  });
}

export async function acceptInvitation(invitationToken: string) {
  const { baseUrl } = getSupabaseConfig();
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Missing access token");
  }

  return apiFetch(`${baseUrl}/rest/v1/rpc/accept_invitation`, {
    method: "POST",
    token,
    body: {
      p_token: invitationToken,
    },
  });
}
