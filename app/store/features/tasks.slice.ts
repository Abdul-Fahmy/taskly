import { Task, TaskStatus } from "@/app/types/task";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskState {
  selectedEpicId: string | null;
  tasks: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  selectedTaskStatus: TaskStatus | null;
}

const initialState: TaskState = {
  selectedEpicId: null,
  tasks: [],
  status: "idle",
  selectedTaskStatus: null,
};

export const fetchTasks = createAsyncThunk<Task[], { projectId: string }>(
  "tasks/fetchTasks",
  async ({ projectId }, { signal }) => {
    const response = await fetch(`/api/project/${projectId}/tasks`, {
      signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? "Failed to fetch tasks");
    }

    const data = await response.json();
    const tasks = Array.isArray(data) ? data : data?.tasks;

    return Array.isArray(tasks) ? tasks : [];
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

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setSelectedEpicId: (state, action: PayloadAction<string | null>) => {
      state.selectedEpicId = action.payload;
    },
    clearSelectedEpicId: (state) => {
      state.selectedEpicId = null;
    },
    setSelectedTaskStatus: (
      state,
      action: PayloadAction<TaskStatus | null>,
    ) => {
      state.selectedTaskStatus = action.payload;
    },
    clearSelectedTaskStatus: (state) => {
      state.selectedTaskStatus = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchTasks.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
    builder.addCase(fetchTasksForEpic.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTasksForEpic.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  },
});

export const {
  setSelectedEpicId,
  clearSelectedEpicId,
  setSelectedTaskStatus,
  clearSelectedTaskStatus,
} = taskSlice.actions;

export const tasksReducer = taskSlice.reducer;
