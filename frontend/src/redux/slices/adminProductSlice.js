import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchProducts", 
    async () => {
        const response = await axios.get(`${API_URL}/api/admin/products`, {
            headers: {
                Authorization: USER_TOKEN,
            }
        });
        return response.data;
    }
);

export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("userToken");
            const response = await axios.post(
                `${API_URL}/api/products`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create product");
        }
    }
);

export const createPublicProduct = createAsyncThunk(
    "adminProducts/createPublicProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/products/public`,
                productData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create public product");
        }
    }
);

export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }) => {
        const response = await axios.put(`${API_URL}/api/admin/products/${id}`, productData, {
            headers: {
                Authorization: USER_TOKEN,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
);

export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id, { rejectWithValue }) => {
      try {
        await axios.delete(`${API_URL}/api/admin/products/${id}`, {
          headers: {
            Authorization: USER_TOKEN,
          },
        });
        return id; // Returning the ID of the deleted product
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete product");
      }
    }
);





const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },

    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createPublicProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPublicProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(createPublicProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateProduct.fulfilled, (state, action) => {
                state.products = state.products.map((product) =>
                    product._id === action.payload._id ? action.payload : product
                );
            })

            .addCase(deleteProduct.fulfilled, (state, action) => {
                // Remove the deleted product from the state
                state.products = state.products.filter(
                  (product) => product._id !== action.payload
                );
              });
    }
});

export default adminProductSlice.reducer;