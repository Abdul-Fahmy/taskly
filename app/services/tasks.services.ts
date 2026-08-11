import { tasksFormData } from "@/app/schemas/newTasksSchema";

type CreateTaskPayload = {
  title: string;
  project_id: string;
  description?: string;
  assignee_id?: string;
  epic_id?: string;
  status?: string;
  due_date?: string;
};

export function buildCreateTaskPayload(
  data: tasksFormData,
): CreateTaskPayload {
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
    payload.due_date = data.due_date;
  }

  return payload;
}

export async function createTask(
  accessToken: string,
  data: tasksFormData,
) {
  const payload = buildCreateTaskPayload(data);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tasks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to create task");
  }

  return response.json();
}
