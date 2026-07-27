import { PaginationResponse, Project, ProjectState } from "@/app/types/project";
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

export const fetchPagination = createAsyncThunk<
  PaginationResponse,
  { limit: number; page: number }
>("project/fetchPagination", async ({ limit, page }) => {
  const offset = (page - 1) * limit;
  const response = await fetch(
    `/api/pagination?limit=${limit}&offset=${offset}`,
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to fetch pagination");
  }

  const contentRange = response.headers.get("content-range");
  const totalPart = contentRange?.split("/")[1];
  const totalCount = totalPart ? Number(totalPart) : 0;

  if (!Number.isFinite(totalCount)) {
    throw new Error("Pagination response is missing a valid total count");
  }

  const projects = (await response.json()) as Project[];

  return { projects, totalCount };
});

const initialState: ProjectState = {
  projects: [],
  status: "idle",
  error: null,
  currentPage: 1,
  limit: 10,
  totalCount: 0,
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
    setCurrentPage(state,action:PayloadAction<number>){
      state.currentPage = action.payload;
    },
    setTotalCount(state,action:PayloadAction<number>){
      state.totalCount =action.payload
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
      })
      .addCase(fetchPagination.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPagination.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload.projects;
        state.totalCount = action.payload.totalCount;
        state.error = null;
        console.log(action.payload);
        
      })
      .addCase(fetchPagination.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch pagination";
        state.projects = [];
      });
  },
});

export const { setProjects,setCurrentPage,setTotalCount } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;
