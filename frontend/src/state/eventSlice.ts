import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "events",
  initialState: [],
  reducers: {
    setEventData: (state: any, action: any) => {
      state.push(action.payload);
      if (state.length > 6) state.shift();
      return state;
    },
    clearEventData: (state, action) => {
      return [];
    },
  },
});

export const { setEventData, clearEventData } = eventSlice.actions;

export default eventSlice.reducer;
