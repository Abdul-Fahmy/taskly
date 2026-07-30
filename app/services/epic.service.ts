import { cookies } from "next/headers";
import { apiFetch } from "../lib/api";

export type CreateEpicPayload = {
  title: string;
  project_id: string;
  description?: string;
  assignee_id?: string;
  deadline?: string;
};

function getSupabaseConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    throw new Error("Missing Supabase environment variables");
  }

  return { baseUrl };
}

export async function addEpic(data: CreateEpicPayload) {
  const { baseUrl } = getSupabaseConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    throw new Error("Missing access token");
  }

  return apiFetch(`${baseUrl}/rest/v1/epics`, {
    method: "POST",
    token,
    headers: {
      Prefer: "return=representation",
    },
    body: data,
  });
}
