export type UserInfo = {
  sub: string;
  name: string;
  email: string;
  department: string;
};

export type Epic = {
  id: string;
  epic_id: string;
  title: string;
  description?: string;
  deadline: string; // ISO date (YYYY-MM-DD)
  created_at: string; // ISO datetime
  created_by: UserInfo;
  assignee: UserInfo | null;
};
export type EpicState = {
  epics: Epic[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentPage: number;
  limit: number;
  totalCount: number;
};

export type PaginationResponse = {
  epics: Epic[];
  totalCount: number;
};
