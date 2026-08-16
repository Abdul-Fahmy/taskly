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
  currentPage: number;
  limit: number;
  totalCount: number;
  isFetched: boolean;
  project: Project | null;
  detailsStatus: "idle" | "loading" | "succeeded" | "failed";
  detailsProjectId: string | null;
};

export type PaginationResponse = {
  projects: Project[];
  totalCount: number;
};
