import { cookies } from "next/headers";
import { apiFetch } from "../lib/api";
import { AddProjectForm } from "../types/addProjectForm";

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
    body: data,
  });
}
