import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showUserLogin: false,
  searchQuery: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setShowUserLogin: (state, action) => {
      state.showUserLogin = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setShowUserLogin, setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
