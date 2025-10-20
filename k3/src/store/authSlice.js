import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { logged: false },
  reducers: {
    logIn: (state) => {
      state.logged = true;
    },
    logOut: (state) => {
      state.logged = false;
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;
