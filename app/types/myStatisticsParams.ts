import { TaskStatus } from "./task";

export type TaskStatisticsParams = {
    p_start_date: string;
    p_end_date: string;
    p_project_id?: string;
    p_status?: TaskStatus;
  };

export type DailyTaskStatistics = {
  day: string; // YYYY-MM-DD
  statuses: Partial<Record<TaskStatus, number>>;
};

export type TaskStatisticsResponse = {
  daily: DailyTaskStatistics[];
  totals: Partial<Record<TaskStatus, number>>;
  total_tasks: number;
  done_tasks: number;
  overdue_tasks: number;
};

export type TaskStatisticsProject = {
  p_start_date: string;
  p_end_date: string;

};
export type TasksByProjectResponse = {
  project_id: string;
  project_name: string;
  tasks_count: number;
}[];