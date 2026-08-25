import { Task, TaskStatus } from "@/app/types/task";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type FetchStatus = "idle" | "loading" | "succeeded" | "failed";

type AllTasksPaginationResponse = {
  tasks: Task[];
  totalCount: number;
};

interface TaskState {
  tasks: Task[];
  allTasks: Task[];
  tasksByStatus: Partial<Record<TaskStatus, Task[]>>;
  statusByColumn: Partial<Record<TaskStatus, FetchStatus>>;
  boardProjectId: string | null;
  boardSearchTerm: string;
  allTasksStatus: FetchStatus;
  allTasksProjectId: string | null;
  allTasksSearchTerm: string;
  allTasksCurrentPage: number;
  allTasksLimit: number;
  allTasksTotalCount: number;
}

const initialState: TaskState = {
  tasks: [],
  allTasks: [],
  tasksByStatus: {},
  statusByColumn: {},
  boardProjectId: null,
  boardSearchTerm: "",
  allTasksStatus: "idle",
  allTasksProjectId: null,
  allTasksSearchTerm: "",
  allTasksCurrentPage: 1,
  allTasksLimit: 5,
  allTasksTotalCount: 0,
};

export const fetchTasks = createAsyncThunk<
  Task[],
  { projectId: string; status: TaskStatus; searchTerm?: string }
>("tasks/fetchTasks", async ({ projectId, status, searchTerm }, { signal }) => {
  const params = new URLSearchParams();
  const trimmedSearchTerm = searchTerm?.trim();
  if (trimmedSearchTerm) {
    params.set("searchTerm", trimmedSearchTerm);
  }
  const query = params.toString();

  const response = await fetch(
    `/api/project/${projectId}/tasks/${status}${query ? `?${query}` : ""}`,
    { signal },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to fetch tasks");
  }

  const data = await response.json();
  const tasks = Array.isArray(data) ? data : data?.tasks;

  return Array.isArray(tasks) ? tasks : [];
});

export const fetchAllTasks = createAsyncThunk<
  AllTasksPaginationResponse,
  {
    projectId: string;
    limit?: number;
    page?: number;
    append?: boolean;
    searchTerm?: string;
  }
>("tasks/fetchAllTasks", async ({ projectId, limit, page, searchTerm }, { signal }) => {
  const pageLimit = limit ?? 10;
  const currentPage = page ?? 1;
  const offset = (currentPage - 1) * pageLimit;
  const params = new URLSearchParams({
    limit: String(pageLimit),
    offset: String(offset),
  });
  const trimmedSearchTerm = searchTerm?.trim();
  if (trimmedSearchTerm) {
    params.set("searchTerm", trimmedSearchTerm);
  }

  const response = await fetch(
    `/api/project/${projectId}/tasks/allTasks?${params.toString()}`,
    { signal },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to fetch tasks");
  }

  const contentRange = response.headers.get("content-range");
  const totalPart = contentRange?.split("/")[1];
  const totalCount = totalPart ? Number(totalPart) : Number.NaN;

  if (!Number.isFinite(totalCount)) {
    throw new Error("Pagination response is missing a valid total count");
  }

  const tasks = (await response.json()) as Task[];

  return {
    tasks: Array.isArray(tasks) ? tasks : [],
    totalCount,
  };
});

export const fetchTasksForEpic = createAsyncThunk<
  Task[],
  { projectId: string; epicId: string }
>("tasks/fetchTasksForEpic", async ({ projectId, epicId }, { signal }) => {
  const response = await fetch(
    `/api/project/${projectId}/epicDetails/${epicId}`,
    {
      signal,
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to fetch tasks");
  }

  const data = await response.json();
  const tasks = Array.isArray(data) ? data : data?.tasks;

  return Array.isArray(tasks) ? tasks : [];
});

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setAllTasksCurrentPage(state, action: PayloadAction<number>) {
      state.allTasksCurrentPage = action.payload;
    },
    resetBoardTasksState(state) {
      state.tasksByStatus = {};
      state.statusByColumn = {};
      state.boardProjectId = null;
      state.boardSearchTerm = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        const { projectId, status, searchTerm } = action.meta.arg;
        const normalizedSearchTerm = searchTerm?.trim() ?? "";

        if (
          state.boardProjectId !== projectId ||
          state.boardSearchTerm !== normalizedSearchTerm
        ) {
          state.tasksByStatus = {};
          state.statusByColumn = {};
        }

        state.boardProjectId = projectId;
        state.boardSearchTerm = normalizedSearchTerm;
        state.statusByColumn[status] = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.boardProjectId = action.meta.arg.projectId;
        state.statusByColumn[action.meta.arg.status] = "succeeded";
        state.tasksByStatus[action.meta.arg.status] = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.statusByColumn[action.meta.arg.status] = "failed";
        state.tasksByStatus[action.meta.arg.status] = [];
      })
      .addCase(fetchTasksForEpic.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasks.pending, (state, action) => {
        const { projectId, searchTerm } = action.meta.arg;
        const normalizedSearchTerm = searchTerm?.trim() ?? "";

        if (
          state.allTasksProjectId !== projectId ||
          state.allTasksSearchTerm !== normalizedSearchTerm
        ) {
          state.allTasks = [];
          state.allTasksTotalCount = 0;
          state.allTasksCurrentPage = 1;
        }

        state.allTasksProjectId = projectId;
        state.allTasksSearchTerm = normalizedSearchTerm;
        state.allTasksStatus = "loading";
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.allTasksProjectId = action.meta.arg.projectId;
        state.allTasksSearchTerm = action.meta.arg.searchTerm?.trim() ?? "";
        state.allTasksStatus = "succeeded";
        if (action.meta.arg.append) {
          const existingIds = new Set(state.allTasks.map((task) => task.id));
          state.allTasks.push(
            ...action.payload.tasks.filter((task) => !existingIds.has(task.id)),
          );
        } else {
          state.allTasks = action.payload.tasks;
        }
        state.allTasksTotalCount = action.payload.totalCount;
        state.allTasksLimit = action.meta.arg.limit ?? state.allTasksLimit;
        state.allTasksCurrentPage =
          action.meta.arg.page ?? state.allTasksCurrentPage;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.allTasksStatus = "failed";
        if (!action.meta.arg.append) {
          state.allTasks = [];
        }
      });
  },
});

export const { setAllTasksCurrentPage, resetBoardTasksState } =
  taskSlice.actions;
export const tasksReducer = taskSlice.reducer;
