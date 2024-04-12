import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";
import { Trip } from "./tripTypes";

interface TripState {
  trips: Trip[];
  trip: Trip | null;
  loading: boolean;
  error: string | null;
}

const initialState: TripState = {
  trips: [],
  trip: null,
  loading: false,
  error: null,
};

export const fetchTrips = createAsyncThunk<Trip[]>(
  "trip/fetchTrips",
  async () => {
    const session = await getSession();
    const token = session?.accessToken;
    if (!token) {
      throw new Error("Access token not found");
    }
    const response = await fetch(`http://localhost:3000/trip`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  }
);

export const fetchTrip = createAsyncThunk<Trip>(
  "trip/fetchTrip",
  async (tripId) => {
    const session = await getSession();
    const token = session?.accessToken;
    if (!token) {
      throw new Error("Access token not found");
    }
    const response = await fetch(`http://localhost:3000/trip/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  }
);

export const deleteTrip = createAsyncThunk<Trip>(
  "trip/deleteTrip",
  async (tripId) => {
    const session = await getSession();
    const token = session?.accessToken;
    if (!token) {
      throw new Error("Access token not found");
    }
    const response = await fetch(`http://localhost:3000/trip/${tripId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  }
);

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(fetchTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trip = action.payload;
      })
      .addCase(fetchTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(deleteTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trip = action.payload;
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default tripSlice.reducer;
