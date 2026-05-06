import { addPercentages, trackData } from "@/repositories/track.repository";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import paths from "@/utils/routes";
import retryRequest from "@/utils/retryRequest";
import getWeeklyData from "@/utils/getWeeklyData";

const initialState: any = {
  name: "mental",
  description: `
        How sharp, stable, and focused were you today?`,
  data: {
    [new Date().toLocaleDateString("en-US")]: trackData[2],
  },
  timestamp: Date.now(),
  sync: false,
};

const syncData = createAsyncThunk(
  "mental/sync",
  async ({ data, authHeaders }: { data: any; authHeaders: any }) => {
    await retryRequest(() =>
      axios.post(paths.sync + "mental", data, authHeaders)
    );
  }
);
const fetchData = createAsyncThunk("mental/fetch", async (authHeaders: any) => {
  const res = await retryRequest(() =>
    axios.get(paths.sync + "mental", authHeaders)
  );
  return res.data;
});

export { syncData as syncMental, fetchData as fetchMental };

const mentalSlice = createSlice({
  name: "mental",
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
    revert3(state) {
      if (!state.data) return { ...initialState, sync: state.sync };
      const data: Record<string, Record<any, any>> = {};
      const { curr, prev } = getWeeklyData();

      curr.forEach((i: string) => {
        if (state?.data[i]) data[i] = JSON.parse(JSON.stringify(state.data[i]));
      });
      prev.forEach((i: string) => {
        if (state?.data[i]) data[i] = JSON.parse(JSON.stringify(state.data[i]));
      });

      const today = new Date().toLocaleDateString("en-US");
      if (!data[today]) data[today] = JSON.parse(JSON.stringify(trackData[2]));

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

export const { updateTasks, clearTask, setRendered, revert3 } =
  mentalSlice.actions;

export default mentalSlice.reducer;
