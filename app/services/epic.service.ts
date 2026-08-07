import { cookies } from "next/headers";
import { apiFetch } from "../lib/api";
import { Epic } from "../types/epicResponse";

export type CreateEpicPayload = {
  title: string;
  project_id: string;
  description?: string;
  assignee_id?: string;
  deadline?: string;
};

export type UpdateEpicPayload = {
  title?: string;
  description?: string | null;
  assignee_id?: string | null;
  deadline?: string | null;
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

export async function getEpics(projectId: string): Promise<Epic[]> {
  const { baseUrl } = getSupabaseConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    throw new Error("Missing access token");
  }
  return apiFetch(
    `${baseUrl}/rest/v1/project_epics?project_id=eq.${projectId}`,
    {
      method: "GET",
      token,
    },
  );
}
export async function getEpicDetails(projectId: string, epicId: string) {
  const { baseUrl } = getSupabaseConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    throw new Error("Missing access token");
  }
  return apiFetch(
    `${baseUrl}/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`,
    {
      method: "GET",
      token,
    },
  );
}

export async function updateEpic(epicId: string, data: UpdateEpicPayload) {
  const { baseUrl } = getSupabaseConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    throw new Error("Missing access token");
  }

  return apiFetch(`${baseUrl}/rest/v1/epics?id=eq.${epicId}`, {
    method: "PATCH",
    token,
    headers: {
      Prefer: "return=representation",
    },
    body: data,
  });
}
