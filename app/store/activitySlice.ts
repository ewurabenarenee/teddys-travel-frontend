import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";

interface Activity {
  _id: string;
  name: string;
  description: string;
}

interface ActivityState {
  activitiesByDay: { [dayId: string]: Activity[] };
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activitiesByDay: {},
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk<
  { dayId: string; activities: Activity[] },
  { tripId: string; dayId: string }
>("activity/fetchActivities", async ({ tripId, dayId }) => {
  const session = await getSession();
  const token = session?.accessToken;
  if (!token) {
    throw new Error("Access token not found");
  }
  const response = await fetch(
    `http://localhost:3000/trip/${tripId}/day/${dayId}/activity`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return { dayId, activities: data };
});

export const createActivity = createAsyncThunk<
  { dayId: string; activity: Activity },
  { tripId: string; dayId: string; activityData: Partial<Activity> }
>("activity/createActivity", async ({ tripId, dayId, activityData }) => {
  const session = await getSession();
  const token = session?.accessToken;
  if (!token) {
    throw new Error("Access token not found");
  }
  const response = await fetch(
    `http://localhost:3000/trip/${tripId}/day/${dayId}/activity`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(activityData),
    }
  );
  const data = await response.json();
  return { dayId, activity: data };
});

export const updateActivity = createAsyncThunk<
  { dayId: string; activity: Activity },
  {
    tripId: string;
    dayId: string;
    activityId: string;
    activityData: Partial<Activity>;
  }
>(
  "activity/updateActivity",
  async ({ tripId, dayId, activityId, activityData }) => {
    const session = await getSession();
    const token = session?.accessToken;
    if (!token) {
      throw new Error("Access token not found");
    }
    const response = await fetch(
      `http://localhost:3000/trip/${tripId}/day/${dayId}/activity/${activityId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activityData),
      }
    );
    const data = await response.json();
    return { dayId, activity: data };
  }
);

export const deleteActivity = createAsyncThunk<
  void,
  { tripId: string; dayId: string; activityId: string }
>("activity/deleteActivity", async ({ tripId, dayId, activityId }) => {
  const session = await getSession();
  const token = session?.accessToken;
  if (!token) {
    throw new Error("Access token not found");
  }
  await fetch(
    `http://localhost:3000/trip/${tripId}/day/${dayId}/activity/${activityId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
});

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchActivities.fulfilled,
        (
          state,
          action: PayloadAction<{ dayId: string; activities: Activity[] }>
        ) => {
          state.loading = false;
          state.activitiesByDay[action.payload.dayId] =
            action.payload.activities;
        }
      )
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createActivity.fulfilled,
        (
          state,
          action: PayloadAction<{ dayId: string; activity: Activity }>
        ) => {
          state.loading = false;
          state.activitiesByDay[action.payload.dayId].push(
            action.payload.activity
          );
        }
      )
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(updateActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateActivity.fulfilled,
        (
          state,
          action: PayloadAction<{ dayId: string; activity: Activity }>
        ) => {
          state.loading = false;
          const { dayId, activity } = action.payload;
          const activityIndex = state.activitiesByDay[dayId].findIndex(
            (a) => a._id === activity._id
          );
          if (activityIndex !== -1) {
            state.activitiesByDay[dayId][activityIndex] = activity;
          }
        }
      )
      .addCase(updateActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(deleteActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.loading = false;
        const { dayId, activityId } = action.meta.arg;
        state.activitiesByDay[dayId] = state.activitiesByDay[dayId].filter(
          (activity) => activity._id !== activityId
        );
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default activitySlice.reducer;
