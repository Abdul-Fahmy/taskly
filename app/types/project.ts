export type Project = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
};

export type ProjectState = {
  projects: Project[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};
