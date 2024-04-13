"use client";

import { configureStore } from "@reduxjs/toolkit";
import activityReducer from "./activitySlice";
import expenseReducer from "./expenseSlice";
import tripReducer from "./tripSlice";

export const store = configureStore({
  reducer: {
    trip: tripReducer,
    activity: activityReducer,
    expense: expenseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
