import { Epic, EpicState, PaginationResponse } from "@/app/types/epicResponse";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";




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
    name: "project",
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
    },
    extraReducers(builder) {
      builder
        .addCase(fetchPagination.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchPagination.fulfilled, (state, action) => {
          state.status = "succeeded";
          if (action.meta.arg.append) {
            const existingIds = new Set(state.epics.map((epic) => epic.id));
            state.epics.push(
              ...action.payload.epics.filter(
                (epic) => !existingIds.has(epic.id),
              ),
            );
          } else {
            state.epics = action.payload.epics;
          }
          state.totalCount = action.payload.totalCount;
          state.error = null;
        })
        .addCase(fetchPagination.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message ?? "Failed to fetch pagination";
          if (!action.meta.arg.append) {
            state.epics = [];
          }
        });
    },
  });
  
  export const { setEpics, setCurrentPage, setTotalCount } =
    epicsSlice.actions;
  export const epicsReducer = epicsSlice.reducer;