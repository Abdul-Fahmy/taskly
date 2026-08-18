import { apiFetch } from "@/app/lib/api";
import { tasksFormData } from "@/app/schemas/newTasksSchema";
import { Task } from "@/app/types/task";
import { cookies } from "next/headers";
type CreateTaskPayload = {
  title: string;
  project_id: string;
  description?: string;
  assignee_id?: string;
  epic_id?: string;
  status?: string;
  due_date?: string;
};

export function buildCreateTaskPayload(data: tasksFormData): CreateTaskPayload {
  const payload: CreateTaskPayload = {
    title: data.title.trim(),
    project_id: data.project_id,
  };

  if (data.description?.trim()) {
    payload.description = data.description.trim();
  }
  if (data.assignee_id) {
    payload.assignee_id = data.assignee_id;
  }
  if (data.epic_id) {
    payload.epic_id = data.epic_id;
  }
  if (data.status) {
    payload.status = data.status;
  }
  if (data.due_date) {
    payload.due_date = new Date(data.due_date).toISOString();
  }

  return payload;
}

export async function createTask(accessToken: string, data: tasksFormData) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) {
    throw new Error("Missing Supabase environment variables");
  }

  const payload = buildCreateTaskPayload(data);

  return apiFetch(`${baseUrl}/rest/v1/tasks`, {
    method: "POST",
    token: accessToken,
    headers: {
      Prefer: "return=representation",
    },
    body: payload,
  });
}

export async function getTasks(projectId: string, status: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;
  if (!baseUrl) {
    throw new Error("Missing Supabase environment variables");
  }
  if (!token) {
    throw new Error("Missing access token");
  }

  return apiFetch(
    `${baseUrl}/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}`,
    {
      method: "GET",
      token,
    },
  );
}

export async function getAllTasksPagination({
  projectId,
  limit,
  offset,
}: {
  projectId: string;
  limit: number;
  offset: number;
}): Promise<{ tasks: Task[]; contentRange: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;

  if (!baseUrl) {
    throw new Error("Missing Supabase environment variables");
  }
  if (!token) {
    throw new Error("Missing access token");
  }

  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!apiKey) {
    throw new Error("missing supabase api key");
  }

  const response = await fetch(
    `${baseUrl}/rest/v1/project_tasks?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
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

  const tasks = Array.isArray(data) ? (data as Task[]) : null;
  if (!tasks) {
    throw new Error("an invalid pagination response");
  }

  const contentRange = response.headers.get("content-range");

  if (!contentRange) {
    throw new Error("response is missing the content-range header");
  }

  return {
    tasks,
    contentRange,
  };
}
export async function getTasksForEpic(epicId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;
  if (!baseUrl) {
    throw new Error("Missing Supabase environment variables");
  }
  if (!token) {
    throw new Error("Missing access token");
  }

  return apiFetch(`${baseUrl}/rest/v1/project_tasks?epic_id=eq.${epicId}`, {
    method: "GET",
    token,
  });
}
