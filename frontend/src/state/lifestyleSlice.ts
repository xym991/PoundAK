import { addPercentages, trackData } from "@/repositories/track.repository";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import paths from "@/utils/routes";
import retryRequest from "@/utils/retryRequest";
import getWeeklyData from "@/utils/getWeeklyData";

const initialState: any = {
  name: "lifestyle",
  description: `
        Gauge your sleep, nutrition, and hydration.`,
  data: {
    [new Date().toLocaleDateString("en-US")]: trackData[1],
  },
  timestamp: Date.now(),
  sync: false,
};

const syncData = createAsyncThunk(
  "lifestyle/sync",
  async ({ data, authHeaders }: { data: any; authHeaders: any }) => {
    await retryRequest(() =>
      axios.post(paths.sync + "lifestyle", data, authHeaders)
    );
  }
);
const fetchData = createAsyncThunk(
  "lifestyle/fetch",
  async (authHeaders: any) => {
    const res = await retryRequest(() =>
      axios.get(paths.sync + "lifestyle", authHeaders)
    );
    return res.data;
  }
);

export { syncData as syncLifestyle, fetchData as fetchLifestyle };

const lifestyleSlice = createSlice({
  name: "lifestyle",
  initialState,
  reducers: {
    updateTasks(
      state,
      { payload }: { payload: { taskId: string; optionIndex: number } }
    ) {
      const today = new Date().toLocaleDateString("en-US");
      const { taskId, optionIndex } = payload;
      const task: any = state.data?.[today]?.tasks.find(
        (task: any) => task.id == taskId
      );
      if (!task) return;

      let clear = false;
      if (
        task.options.reduce(
          (acc: any, o: any, i: number) =>
            (o.clear && (i == optionIndex || o.selected)) || acc,
          false
        )
      )
        clear = true;
      for (let i = 0; i < task.options.length; i++) {
        if (i == optionIndex) {
          task.options[i].selected = !task.options[i].selected;
          continue;
        }
        if (!task.multiple || clear) task.options[i].selected = false;
      }
      state.timestamp = Date.now();
      return state;
    },
    clearTask(state, action) {
      const today = new Date().toLocaleDateString("en-US");
      state.data?.[today]?.tasks
        .filter((task: any) => {
          return task.id == action.payload;
        })?.[0]
        .options.forEach((option: any) => {
          option.selected = false;
        });
      state.timestamp = Date.now();
    },
    setRendered(
      state,
      action: { payload: { taskId: string; value: boolean } }
    ) {
      const today = new Date().toLocaleDateString("en-US");
      const task: any = state?.data?.[today]?.tasks?.find(
        (task: any) => task.id == action.payload.taskId
      );
      task.rendered = action.payload.value;
    },
    revert2(state) {
      if (!state.data) return { ...initialState, sync: state.sync };
      const data: Record<string, Record<any, any>> = {};
      const { curr, prev } = getWeeklyData();

      // Only copy over days that exist in state.data, avoid nulls and deep clone
      curr.forEach((i: string) => {
        if (state?.data[i]) data[i] = JSON.parse(JSON.stringify(state.data[i]));
      });
      prev.forEach((i: string) => {
        if (state?.data[i]) data[i] = JSON.parse(JSON.stringify(state.data[i]));
      });

      const today = new Date().toLocaleDateString("en-US");
      // Only set today's data if it doesn't already exist
      if (!data[today]) data[today] = JSON.parse(JSON.stringify(trackData[1]));

      return { ...state, timestamp: Date.now(), data };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      return {
        ...action.payload,
        sync: true,
      };
    });
    builder.addCase(syncData.fulfilled, (state, action) => {
      return {
        ...state,
        sync: true,
      };
    });
  },
});

export const { updateTasks, clearTask, setRendered, revert2 } =
  lifestyleSlice.actions;

export default lifestyleSlice.reducer;
