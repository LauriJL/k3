import { createSlice } from "@reduxjs/toolkit";

const refreshSlice = createSlice({
  name: "refresh",
  initialState: { needsRefresh: false },
  reducers: {
    triggerRefresh: (state) => {
      state.needsRefresh = true;
    },
    resetRefresh: (state) => {
      state.needsRefresh = false;
    },
  },
});

export const { triggerRefresh, resetRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;
