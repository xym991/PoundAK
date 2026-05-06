import { createSlice } from "@reduxjs/toolkit";

const MAX_HISTORY = 10;
const initialState: any = {
  tab: "home",
  portal: "",
};
const routerSlice = createSlice({
  name: "router",
  initialState,
  reducers: {
    setTab: (state, action) => {
      if (state.tab !== action.payload) {
        state.tab = action.payload;
        state.portal = "";
      }
    },
    setPortal: (state, action) => {
      state.portal = action.payload;
    },
    goBack: (state) => {
      if (state.tab != "home")
        return {
          tab: "home",
          portal: "",
        };
      else
        return {
          tab: "home",
          portal: state.portal == "options" ? "" : "options",
        };
    },
  },
});

export const { setTab, setPortal, goBack } = routerSlice.actions;

export default routerSlice.reducer;
