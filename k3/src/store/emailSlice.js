import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "eMail",
  initialState: { eMail: "" },
  reducers: {
    setEmailStore: (state, action) => {
      state.eMail = action.payload;
    },
  },
});

export const { setEmailStore } = emailSlice.actions;
export default emailSlice.reducer;
