import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch Users
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch users");
  }
});

// Add User
export const addUser = createAsyncThunk("admin/addUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, userData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to add user");
  }
});

// Update User
export const updateUser = createAsyncThunk("admin/updateUser", async ({ id, role }, { rejectWithValue }) => {
  try {
    await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, { role }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
    return { id, role };
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to update user");
  }
});

// Delete User
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to delete user");
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: { users: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addUser.fulfilled, (state, action) => { state.users.push(action.payload.user); })
      .addCase(updateUser.fulfilled, (state, action) => {
        const user = state.users.find((user) => user._id === action.payload.id);
        if (user) user.role = action.payload.role;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
  },
});

export default adminSlice.reducer;
