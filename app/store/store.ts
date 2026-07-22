import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./features/user.slice";
import { sidebarReducer } from "./features/sidebar.slice";
import { projectReducer } from "./features/project.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    sidebar: sidebarReducer,
    project: projectReducer
  },
});

type AppStore = typeof store;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
