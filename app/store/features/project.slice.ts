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
  { limit: number; page: number; append?: boolean }
>("project/fetchPagination", async ({ limit, page }, { signal }) => {
  const offset = (page - 1) * limit;
  const response = await fetch(
    `/api/pagination?limit=${limit}&offset=${offset}`,
    { signal },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to fetch pagination");
  }

  const contentRange = response.headers.get("content-range");
  const totalPart = contentRange?.split("/")[1];
  const totalCount = totalPart ? Number(totalPart) : Number.NaN;

  if (!Number.isFinite(totalCount)) {
    throw new Error("Pagination response is missing a valid total count");
  }

  const projects = (await response.json()) as Project[];

  return { projects, totalCount };
});

export const fetchProjectDetails = createAsyncThunk<
  Project,
  { projectId: string }
>(
  "project/fetchProjectDetails",
  async ({ projectId }) => {
    const response = await fetch(`/api/project/${projectId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? "Failed to fetch project");
    }

    const data = await response.json();
    const rows = Array.isArray(data) ? data : data ? [data] : [];
    const result = rows.find((row) => row?.id === projectId) ?? rows[0];

    if (!result?.id) {
      throw new Error("Project not found");
    }

    return result as Project;
  },
  {
    condition({ projectId }, { getState }) {
      const { project } = getState() as { project: ProjectState };

      if (project.project?.id === projectId) {
        return false;
      }

      if (
        project.detailsProjectId === projectId &&
        (project.detailsStatus === "loading" ||
          project.detailsStatus === "succeeded")
      ) {
        return false;
      }

      return true;
    },
  },
);

const initialState: ProjectState = {
  projects: [],
  status: "idle",
  error: null,
  currentPage: 1,
  limit: 10,
  totalCount: 0,
  isFetched: false,
  project: null,
  detailsStatus: "idle",
  detailsProjectId: null,
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
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setTotalCount(state, action: PayloadAction<number>) {
      state.totalCount = action.payload;
    },
    setIsFetched(state, action: PayloadAction<boolean>) {
      state.isFetched = action.payload;
    },
    setProject(state, action: PayloadAction<Project | null>) {
      state.project = action.payload;
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
        if (action.meta.arg.append) {
          const existingIds = new Set(
            state.projects.map((project) => project.id),
          );
          state.projects.push(
            ...action.payload.projects.filter(
              (project) => !existingIds.has(project.id),
            ),
          );
        } else {
          state.projects = action.payload.projects;
        }
        state.totalCount = action.payload.totalCount;
        state.error = null;
      })
      .addCase(fetchPagination.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch pagination";
        if (!action.meta.arg.append) {
          state.projects = [];
        }
      })
      .addCase(fetchProjectDetails.pending, (state, action) => {
        state.detailsStatus = "loading";
        state.detailsProjectId = action.meta.arg.projectId;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.project = action.payload;
        state.error = null;
        state.isFetched = true;
        state.detailsStatus = "succeeded";
        state.detailsProjectId = action.payload.id;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        if (action.meta.aborted || action.meta.condition) {
          if (state.detailsProjectId === action.meta.arg.projectId) {
            state.detailsStatus = "idle";
          }
          return;
        }

        state.error = action.error.message ?? "Failed to fetch project";
        state.isFetched = true;
        state.detailsStatus = "failed";
        state.detailsProjectId = action.meta.arg.projectId;
      });
  },
});

export const {
  setProjects,
  setCurrentPage,
  setTotalCount,
  setIsFetched,
  setProject,
} = projectSlice.actions;
export const projectReducer = projectSlice.reducer;
