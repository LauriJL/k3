import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import emailReducer from "./emailSlice";
import yearReducer from "./yearSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
    year: yearReducer,
  },
});
