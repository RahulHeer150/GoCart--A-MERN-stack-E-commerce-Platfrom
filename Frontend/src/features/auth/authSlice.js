import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";
import sellerApi from "../../api/sellerApi";
import adminApi from "../../api/adminApi";

const initialState = {
  userData: null,
  sellerData: null,
  adminData: null,
  isSeller: false,
  isAdmin: false,
  status: "idle",
};

export const fetchUserAuth = createAsyncThunk(
  "auth/fetchUserAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.get("/users/me");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSellerAuth = createAsyncThunk(
  "auth/fetchSellerAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerApi.get("/sellers/me");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAdminAuth = createAsyncThunk(
  "auth/fetchAdminAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.get("/admin/auth");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
    },
    setSellerData: (state, action) => {
      state.sellerData = action.payload;
      state.isSeller = true;
    },
    clearSellerData: (state) => {
      state.sellerData = null;
      state.isSeller = false;
    },
    setAdminData: (state, action) => {
      state.adminData = action.payload;
      state.isAdmin = true;
    },
    clearAdminData: (state) => {
      state.adminData = null;
      state.isAdmin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userData = action.payload;
      })
      .addCase(fetchUserAuth.rejected, (state) => {
        state.status = "failed";
        state.userData = null;
      })
      .addCase(fetchSellerAuth.fulfilled, (state, action) => {
        state.sellerData = action.payload;
        state.isSeller = true;
      })
      .addCase(fetchSellerAuth.rejected, (state) => {
        state.sellerData = null;
        state.isSeller = false;
      })
      // Admin Auth
      .addCase(fetchAdminAuth.fulfilled, (state, action) => {
        state.adminData = action.payload;
        state.isAdmin = true;
      })
      .addCase(fetchAdminAuth.rejected, (state) => {
        state.adminData = null;
        state.isAdmin = false;
      });
  },
});

export const {
  setUserData,
  clearUserData,
  setSellerData,
  clearSellerData,
  setAdminData,
  clearAdminData,
} = authSlice.actions;

export default authSlice.reducer;
