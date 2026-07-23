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
