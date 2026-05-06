import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/utils/axios";
import paths from "@/utils/routes";
import retryRequest from "@/utils/retryRequest";

const initialState: any = { sync: false };

function isDate30DaysOld(enUSDate: string) {
  const [month, day, year] = enUSDate.split("/").map(Number);
  const inputDate: any = new Date(year, month - 1, day);
  const currentDate: any = new Date();

  const diffTime = currentDate - inputDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays >= 30;
}

const syncChat = createAsyncThunk(
  "chat/sync",
  async ({ data, authHeaders }: { data: any; authHeaders: any }) => {
    await retryRequest(() =>
      axios.post(paths.sync + "chat", data, authHeaders)
    );
  }
);

const fetchChat = createAsyncThunk("chat/fetch", async (authHeaders: any) => {
  const res = await retryRequest(() =>
    axios.get(paths.sync + "chat", authHeaders)
  );
  return res.data;
});

export { syncChat, fetchChat };

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state: any, action) => {
      const today = new Date().toLocaleDateString("en-US");
      if (!state[today]) state[today] = [];
      state[today].push(action.payload);

      Object.keys(state).forEach((key) => {
        if (isDate30DaysOld(key)) {
          delete state[key];
        }
      });
      state.timestamp = Date.now();
    },
    clearMessages: (state: any, action) => {
      delete state[action.payload];
      state.timestamp = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChat.fulfilled, (state, action) => {
      return {
        ...action.payload,
        sync: true,
      };
    });
    builder.addCase(syncChat.fulfilled, (state, action) => {
      return {
        ...state,
        sync: true,
      };
    });
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;
