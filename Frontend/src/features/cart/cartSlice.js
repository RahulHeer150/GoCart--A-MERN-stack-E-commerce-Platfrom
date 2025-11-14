import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";
import toast from "react-hot-toast";

const loadGuestCart = () => {
  try {
    const localCart = localStorage.getItem("cartItems");
    return localCart ? JSON.parse(localCart) : [];
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return [];
  }
};

const initialState = {
  items: loadGuestCart(),
  status: "idle",
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await userApi.get("/cart");
  return response.data.data;
});

export const addAndUpdateCart = createAsyncThunk(
  "cart/addAndUpdateCart",
  async (
    { product, quantity, seller },
    { getState, rejectWithValue, dispatch }
  ) => {

    if (quantity <= 0) {
      const action = await dispatch(removeFromCart(product._id));
      return action.payload;
    }

    const { userData } = getState().auth;
    const productId = product._id;
    const sellerId = seller || product.seller._id || product.seller;

    if (userData) {
      try {
        const response = await userApi.post("/cart", {
          productId,
          quantity,
          seller: sellerId,
        });
        toast.success(response.data.message);
        return response.data.data;
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update cart");
        return rejectWithValue(error.response.data);
      }
    } else {
      toast.success("Cart Updated");
      return { product, quantity, seller: sellerId, isLocal: true };
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { getState, rejectWithValue }) => {
    const { userData } = getState().auth;
    if (userData) {
      try {
        const response = await userApi.delete(`/cart/${productId}`);
        toast.success(response.data.message);
        return response.data.data;
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to remove item");
        return rejectWithValue(error.response.data);
      }
    } else {
      toast.success("Item removed from cart");
      return { productId, isLocal: true };
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    const { userData } = getState().auth;
    if (userData) {
      try {
        const response = await userApi.delete("/cart");
        toast.success(response.data.message);
        return response.data.data;
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to clear cart");
        return rejectWithValue(error.response.data);
      }
    } else {
      toast.success("Cart Cleared");
      return { isLocal: true };
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(addAndUpdateCart.fulfilled, (state, action) => {
        const payload = action.payload;
        if (!payload.isLocal) {
          state.items = payload;
        } else if (payload.isLocal && payload.product) {
          const { product, quantity } = action.payload;
          const itemIndex = state.items.findIndex(
            (item) => item.product._id === product._id
          );
          if (itemIndex !== -1) {
            state.items[itemIndex].quantity = quantity;
          } else {
            state.items.push({
              product,
              quantity,
              seller: product.seller._id || product.seller,
            });
          }
        } else if (payload.isLocal && payload.productId) {
          state.items = state.items.filter(
            (item) => item.product._id !== payload.productId
          );
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (!action.payload.isLocal) {
          state.items = action.payload;
        } else {
          state.items = state.items.filter(
            (item) => item.product._id !== action.payload.productId
          );
        }
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { setCartItems } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};
export const selectCartTotal = (state) => {
  const totalAmount = state.cart.items.reduce((total, item) => {
    if (item.product) {
      const price = item.product.offerPrice || item.product.price;
      return total + price * item.quantity;
    } else {
      return total;
    }
  }, 0);
  return Math.floor(totalAmount * 100) / 100;
};
