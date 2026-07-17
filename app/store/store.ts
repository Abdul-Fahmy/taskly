import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./features/user.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

type AppStore = typeof store;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
