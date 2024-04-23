import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "next-auth";
import { getSession } from "next-auth/react";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<User>(
  "user/fetchUserProfile",
  async () => {
    const session = await getSession();
    const token = session?.accessToken;
    if (!token) {
      throw new Error("Access token not found");
    }
    const response = await fetch(`http://localhost:3000/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  }
);

export const updateUser = createAsyncThunk<User, Partial<User>>(
  "user/updateUser",
  async (userData) => {
    const session = await getSession();
    const token = session?.accessToken;
    if (!token) {
      throw new Error("Access token not found");
    }
    const response = await fetch(`http://localhost:3000/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  }
);

export const updateUserImage = createAsyncThunk<User, { file: File }>(
  "user/updateUserImage",
  async ({ file }) => {
    const session = await getSession();
    const token = session?.accessToken;
    if (!token) {
      throw new Error("Access token not found");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`http://localhost:3000/user/profile/picture`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    return data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(updateUserImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserImage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default userSlice.reducer;
