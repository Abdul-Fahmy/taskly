import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskState {
  selectedEpicId: string | null;
}

const initialState: TaskState = {
  selectedEpicId: null,
};

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
  },
});

export const { setSelectedEpicId, clearSelectedEpicId } = taskSlice.actions;

export const tasksReducer = taskSlice.reducer;
