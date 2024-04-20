import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";
import { RootState } from "./store";
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

export const updateTripImage = createAsyncThunk<
  Trip,
  { tripId: string; file: File }
>("trip/updateTripImage", async ({ tripId, file }) => {
  const session = await getSession();
  const token = session?.accessToken;
  if (!token) {
    throw new Error("Access token not found");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`http://localhost:3000/trip/${tripId}/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  return data;
});

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

export const updateTrip = createAsyncThunk<
  Trip,
  { tripId: string; tripData: Partial<Trip> }
>("trip/updateTrip", async ({ tripId, tripData }) => {
  const session = await getSession();
  const token = session?.accessToken;
  if (!token) {
    throw new Error("Access token not found");
  }
  const response = await fetch(`http://localhost:3000/trip/${tripId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tripData),
  });
  const data = await response.json();
  return data;
});

export const createTrip = createAsyncThunk<Trip, Partial<Trip>>(
  "trip/createTrip",
  async (tripData) => {
    const session = await getSession();
    const token = session?.accessToken;
    if (!token) {
      throw new Error("Access token not found");
    }
    const response = await fetch(`http://localhost:3000/trip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tripData),
    });
    const data = await response.json();
    return data;
  }
);

export const shareTrip = createAsyncThunk<
  void,
  { tripId: string; recipientName: string; recipientEmail: string }
>("trip/shareTrip", async ({ tripId, recipientName, recipientEmail }) => {
  const session = await getSession();
  const token = session?.accessToken;
  if (!token) {
    throw new Error("Access token not found");
  }
  const response = await fetch(`http://localhost:3000/trip/${tripId}/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipientName, recipientEmail }),
  });
  if (!response.ok) {
    throw new Error("Failed to share the trip");
  }
});

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
      })
      .addCase(updateTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trip = action.payload;
      })
      .addCase(updateTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(createTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips.push(action.payload);
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(updateTripImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTripImage.fulfilled, (state, action) => {
        state.loading = false;
        state.trip = action.payload;
      })
      .addCase(updateTripImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(shareTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareTrip.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(shareTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default tripSlice.reducer;
