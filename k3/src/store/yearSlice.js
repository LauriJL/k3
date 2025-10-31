import { createSlice, current } from "@reduxjs/toolkit";

// Current year selection
const d = new Date();
let currentYear = d.getFullYear();

const yearSlice = createSlice({
  name: "selectedYear",
  initialState: { selectedYear: currentYear },
  reducers: {
    setSelectedYear: (state, action) => {
      state.selectedYear = action.payload;
    },
  },
});

export const { setSelectedYear } = yearSlice.actions;
export default yearSlice.reducer;
