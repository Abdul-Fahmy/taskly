import { Epic, EpicState, PaginationResponse } from "@/app/types/epicResponse";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const fetchEpics = createAsyncThunk<Epic[], { projectId: string }>(
  "epics/fetchEpics",
  async ({ projectId }, { signal }) => {
    const response = await fetch(`/api/project/${projectId}/epics`, {
      signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? "Failed to fetch epics");
    }

    const epics = (await response.json()) as Epic[];
    return Array.isArray(epics) ? epics : [];
  },
);

export const fetchEpicsPagination = createAsyncThunk<
  PaginationResponse,
  { projectId: string; limit?: number; page?: number; append?: boolean }
>("epics/fetchPagination", async ({ projectId, limit, page }, { signal }) => {
  const offset = (page! - 1) * limit!;
  const response = await fetch(
    `/api/project/${projectId}/epics?limit=${limit}&offset=${offset}`,
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

  const epics = (await response.json()) as Epic[];

  return { epics, totalCount };
});

export const fetchEpicsBySearchTerm = createAsyncThunk<
  PaginationResponse,
  { projectId: string; append?: boolean; searchTerm: string }
>("epics/fetchBySearchTerm", async ({ projectId, searchTerm }, { signal }) => {
  const response = await fetch(
    `/api/project/${projectId}/epics/search?searchTerm=${encodeURIComponent(searchTerm)}`,
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

  const epics = (await response.json()) as Epic[];

  return { epics, totalCount };
});

const initialState: EpicState = {
  epics: [],
  status: "idle",
  error: null,
  currentPage: 1,
  limit: 10,
  totalCount: 0,
};

const epicsSlice = createSlice({
  name: "epics",
  initialState,
  reducers: {
    setEpics(state, action: PayloadAction<Epic[]>) {
      state.epics = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setTotalCount(state, action: PayloadAction<number>) {
      state.totalCount = action.payload;
    },
    resetEpicsState() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchEpics.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEpics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.epics = action.payload;
        state.totalCount = action.payload.length;
        state.error = null;
      })
      .addCase(fetchEpics.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch epics";
        state.epics = [];
      })
      .addCase(fetchEpicsPagination.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEpicsPagination.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.meta.arg.append) {
          const existingIds = new Set(state.epics.map((epic) => epic.id));
          state.epics.push(
            ...action.payload.epics.filter((epic) => !existingIds.has(epic.id)),
          );
        } else {
          state.epics = action.payload.epics;
        }
        state.totalCount = action.payload.totalCount;
        state.error = null;
      })
      .addCase(fetchEpicsPagination.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch pagination";
        if (!action.meta.arg.append) {
          state.epics = [];
        }
      })
      .addCase(fetchEpicsBySearchTerm.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEpicsBySearchTerm.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.epics = action.payload.epics;
        state.totalCount = action.payload.totalCount;
        state.error = null;
      })
      .addCase(fetchEpicsBySearchTerm.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch by search term";
        state.epics = [];
      })
  },
});

export const { setEpics, setCurrentPage, setTotalCount, resetEpicsState } =
  epicsSlice.actions;
export const epicsReducer = epicsSlice.reducer;
