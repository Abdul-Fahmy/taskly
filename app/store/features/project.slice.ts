import { Project, ProjectState } from "@/app/types/project";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const fetchProjects = createAsyncThunk<Project[], void>(
  "project/fetchProjects",
  async () => {
    const response = await fetch("/api/project");
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? "Failed to fetch projects");
    }
    return await response.json();
  },
);

const initialState: ProjectState = {
  projects: [],
  status: "idle",
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch projects";
        state.projects = [];
      })
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      });
  },
});

export const { setProjects } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;
