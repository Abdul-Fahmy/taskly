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
  totalCountByColumn: Partial<Record<TaskStatus, number>>;
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
  totalCountByColumn: {},
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
  AllTasksPaginationResponse,
  {
    projectId: string;
    status: TaskStatus;
    searchTerm?: string;
    limit?: number;
    page?: number;
    append?: boolean;
  }
>(
  "tasks/fetchTasks",
  async ({ projectId, status, searchTerm, limit, page }, { signal }) => {
    const pageLimit = limit ?? 5;
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
      `/api/project/${projectId}/tasks/${status}?${params.toString()}`,
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

    const data = await response.json();
    const tasks = Array.isArray(data) ? data : data?.tasks;

    return {
      tasks: Array.isArray(tasks) ? tasks : [],
      totalCount,
    };
  },
);

export const fetchAllTasks = createAsyncThunk<
  AllTasksPaginationResponse,
  {
    projectId: string;
    limit?: number;
    page?: number;
    append?: boolean;
    searchTerm?: string;
  }
>(
  "tasks/fetchAllTasks",
  async ({ projectId, limit, page, searchTerm }, { signal }) => {
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
  },
);

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

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({
    taskId,
    status,
    projectId,
  }: {
    projectId: string;
    taskId: string;
    status: TaskStatus;
  }) => {
    const response = await fetch(
      `/api/project/${projectId}/tasks/updateStatus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, status }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update task status");
    }
    return response.json();
  },
);

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
      state.totalCountByColumn = {};
      state.boardProjectId = null;
      state.boardSearchTerm = "";
    },
    moveTaskOptimistically: (
      state,
      action: PayloadAction<{
        taskId: string;
        fromStatus: TaskStatus;
        toStatus: TaskStatus;
      }>,
    ) => {
      const { taskId, fromStatus, toStatus } = action.payload;

      // Don't do anything if the status didn't change
      if (fromStatus === toStatus) return;

      const sourceTasks = state.tasksByStatus[fromStatus] ?? [];

      // Find the task in the old column
      const taskIndex = sourceTasks.findIndex((task) => task.id === taskId);

      if (taskIndex === -1) return;

      // Remove task from old column
      const [task] = sourceTasks.splice(taskIndex, 1);

      // Update its status
      task.status = toStatus;

      // Make sure destination column exists
      if (!state.tasksByStatus[toStatus]) {
        state.tasksByStatus[toStatus] = [];
      }

      // Add task to destination column
      state.tasksByStatus[toStatus].unshift(task);

      // Update counts
      state.totalCountByColumn[fromStatus] = Math.max(
        0,
        (state.totalCountByColumn[fromStatus] ?? 0) - 1,
      );

      state.totalCountByColumn[toStatus] =
        (state.totalCountByColumn[toStatus] ?? 0) + 1;
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
          state.totalCountByColumn = {};
        }

        state.boardProjectId = projectId;
        state.boardSearchTerm = normalizedSearchTerm;
        state.statusByColumn[status] = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        const { projectId, status, append } = action.meta.arg;

        state.boardProjectId = projectId;
        state.statusByColumn[status] = "succeeded";
        if (append) {
          const existingTasks = state.tasksByStatus[status] ?? [];
          const existingIds = new Set(existingTasks.map((task) => task.id));
          state.tasksByStatus[status] = [
            ...existingTasks,
            ...action.payload.tasks.filter((task) => !existingIds.has(task.id)),
          ];
        } else {
          state.tasksByStatus[status] = action.payload.tasks;
        }
        state.totalCountByColumn[status] = action.payload.totalCount;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.statusByColumn[action.meta.arg.status] = "failed";
        if (!action.meta.arg.append) {
          state.tasksByStatus[action.meta.arg.status] = [];
          state.totalCountByColumn[action.meta.arg.status] = 0;
        }
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

export const {
  setAllTasksCurrentPage,
  resetBoardTasksState,
  moveTaskOptimistically,
} = taskSlice.actions;
export const tasksReducer = taskSlice.reducer;
