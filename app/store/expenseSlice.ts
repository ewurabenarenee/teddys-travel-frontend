import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";

interface Expense {
  _id: string;
  description: string;
  amount: number;
}

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk<Expense[], string>(
  "expense/fetchExpenses",
  async (tripId) => {
    const session = await getSession();
    const token = session?.accessToken;
    if (!token) {
      throw new Error("Access token not found");
    }
    const response = await fetch(
      `http://localhost:3000/trip/${tripId}/expense`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();

    return data;
  }
);

export const createExpense = createAsyncThunk<
  Expense,
  { tripId: string; expenseData: Partial<Expense> }
>("expense/createExpense", async ({ tripId, expenseData }) => {
  const session = await getSession();
  const token = session?.accessToken;
  if (!token) {
    throw new Error("Access token not found");
  }
  const response = await fetch(`http://localhost:3000/trip/${tripId}/expense`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expenseData),
  });
  const data = await response.json();
  return data;
});

export const deleteExpense = createAsyncThunk<
  void,
  { tripId: string; expenseId: string }
>("expense/deleteExpense", async ({ tripId, expenseId }) => {
  const session = await getSession();
  const token = session?.accessToken;
  if (!token) {
    throw new Error("Access token not found");
  }
  await fetch(`http://localhost:3000/trip/${tripId}/expense/${expenseId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
});

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        const { expenseId } = action.meta.arg;
        state.expenses = state.expenses.filter(
          (expense) => expense._id !== expenseId
        );
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default expenseSlice.reducer;
