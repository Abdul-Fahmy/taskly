export type UpdateTaskPayload = Partial<{
  title: string;
  description: string | null;
  assignee_id: string | null;
  epic_id: string | null;
  due_date: string | null;
  status: string;
}>;
