"use client";

import { configureStore } from "@reduxjs/toolkit";
import activityReducer from "./activitySlice";
import tripReducer from "./tripSlice";

export const store = configureStore({
  reducer: {
    trip: tripReducer,
    activity: activityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
