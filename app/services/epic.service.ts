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

export async function getEpicsPagination({
  projectId,
  limit,
  offset,
}: {
  projectId: string;
  limit: number;
  offset: number;
}): Promise<{ epics: Epic[]; contentRange: string }> {
  const { baseUrl } = getSupabaseConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Missing access token");
  }

  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!apiKey) {
    throw new Error("missing supabase api key");
  }

  const response = await fetch(
    `${baseUrl}/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
        Prefer: "count=exact",
      },
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw {
      status: response.status,
      data,
      message: (data as { message?: string })?.message || response.statusText,
    };
  }

  const epics = Array.isArray(data) ? (data as Epic[]) : null;
  if (!epics) {
    throw new Error("an invalid pagination response");
  }

  const contentRange = response.headers.get("content-range");

  if (!contentRange) {
    throw new Error("response is missing the content-range header");
  }

  return {
    epics,
    contentRange,
  };
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
