import { createSlice } from "@reduxjs/toolkit";

const routerSlice = createSlice({
  name: "volume",
  initialState: 0.5,
  reducers: {
    setVolume(state, action) {
      return action.payload;
    },
  },
});

export const { setVolume } = routerSlice.actions;

export default routerSlice.reducer;
