import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./features/user.slice";
import { sidebarReducer } from "./features/sidebar.slice";
import { projectReducer } from "./features/project.slice";
import { epicsReducer } from "./features/epics.slice";
import { membersReducer } from "./features/members.slice";
import { tasksReducer } from "./features/tasks.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    sidebar: sidebarReducer,
    project: projectReducer,
    epics:epicsReducer,
    members:membersReducer,
    tasks:tasksReducer,
  },
});

type AppStore = typeof store;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
