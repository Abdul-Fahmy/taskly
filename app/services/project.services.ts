import { cookies } from "next/headers";
import { apiFetch } from "../lib/api";
import { AddProjectForm } from "../types/addProjectForm";
import { Project } from "../types/project";

function getSupabaseConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    throw new Error("Missing Supabase environment variables");
  }

  return { baseUrl };
}

export async function addProject(data: AddProjectForm) {
  const { baseUrl } = getSupabaseConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Missing access token");
  }

  return apiFetch(`${baseUrl}/rest/v1/projects`, {
    method: "POST",
    token,
    headers: {
      Prefer: "return=representation",
    },
    body: data,
  });
}

export async function getProjects(): Promise<Project[]> {
  const { baseUrl } = getSupabaseConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Missing access token");
  }

  return apiFetch(`${baseUrl}/rest/v1/rpc/get_projects`, {
    method: "GET",
    token,
  });
}

export async function editProject(data: AddProjectForm, projectId: string) {
  const { baseUrl } = getSupabaseConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Missing access token");
  }

  return apiFetch(`${baseUrl}/rest/v1/projects?id=eq.${projectId}`, {
    method: "PATCH",
    token,
    headers: {
      Prefer: "return=representation",
    },
    body: data,
  });
}

export async function getProjectsPagination({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<{ projects: Project[]; contentRange: string }> {
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
    `${baseUrl}/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
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
  const projects = Array.isArray(data) ? (data as Project[]) : null;
  if (!projects) {
    throw new Error("an invaild pagination response");
  }

  const contentRange = response.headers.get("content-range");

  if (!contentRange) {
    throw new Error("response is missing the content-range header");
  }

  return {
    projects,
    contentRange,
  };
}

export async function getProjectDetails(projectId: string): Promise<Project> {
  const { baseUrl } = getSupabaseConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Missing access token");
  }
  if (!projectId) {
    throw new Error("Project id is required");
  }

  const rows = await apiFetch<Project[]>(
    `${baseUrl}/rest/v1/projects?id=eq.${projectId}&select=id,name,description,created_by,created_at`,
    {
      method: "GET",
      token,
    },
  );

  const project = rows.find((row) => row.id === projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}
