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