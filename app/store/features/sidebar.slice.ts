import { SidebarState } from "@/app/types/sidebar";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SidebarState = {
  collapsed: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggle(state) {
      state.collapsed = !state.collapsed;
    },
  },
});

export const { toggle } = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;
