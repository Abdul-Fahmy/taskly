import { Task, TaskStatus } from "@/app/types/task";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TaskState {
  tasks: Task[];
  tasksByStatus: Partial<Record<TaskStatus, Task[]>>;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: TaskState = {
  tasks: [],
  tasksByStatus: {},
  status: "idle",
};

export const fetchTasks = createAsyncThunk<
  Task[],
  { projectId: string; status: TaskStatus }
>("tasks/fetchTasks", async ({ projectId, status }, { signal }) => {
  const response = await fetch(`/api/project/${projectId}/tasks/${status}`, {
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to fetch tasks");
  }

  const data = await response.json();
  const tasks = Array.isArray(data) ? data : data?.tasks;

  return Array.isArray(tasks) ? tasks : [];
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
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchTasks.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasksByStatus[action.meta.arg.status] = action.payload;
    });
    builder.addCase(fetchTasksForEpic.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTasksForEpic.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  },
});

export const tasksReducer = taskSlice.reducer;
