type User = {
  id: string;
  name: string;
  email: string;
  department: string | null;
};

type Epic = {
  id: string;
  title: string;
  epic_id: string;
};
export type TaskStatus =
  | "TO_DO"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "IN_REVIEW"
  | "READY_FOR_QA"
  | "REOPENED"
  | "READY_FOR_PRODUCTION"
  | "DONE";

export type Task = {
  id: string;
  project_id: string;
  epic_id: string | null;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  due_date: string | null;
  task_id: string;

  epic: Epic | null;

  created_by: User;
  assignee: User | null;
};
