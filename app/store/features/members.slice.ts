import { Member, MembersState } from "@/app/types/members";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const fetchMembers = createAsyncThunk<Member[], { projectId: string }>(
  "members/fetchMembers",
  async ({ projectId }, { signal }) => {
    const response = await fetch(`/api/project/${projectId}/members`, {
      signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? "Failed to fetch members");
    }

    const members = (await response.json()) as Member[];
    return Array.isArray(members) ? members : [];
  },
);

const initialState: MembersState = {
  members: [],
  status: "idle",
  error: null,
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMembers(state, action: PayloadAction<Member[]>) {
      state.members = action.payload;
      state.status = "success";
      state.error = null;
    },
    resetMembersState() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.status = "success";
        state.members = action.payload;
        state.error = null;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.status = "error";
        state.error = action.error.message ?? "Failed to fetch members";
        state.members = [];
      });
  },
});

export const { setMembers, resetMembersState } = membersSlice.actions;
export const membersReducer = membersSlice.reducer;
