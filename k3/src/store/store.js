import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import emailReducer from "./emailSlice";
import yearReducer from "./yearSlice";
import refreshReducer from "./refreshSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
    refresh: refreshReducer,
    year: yearReducer,
  },
});
