import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import paths from "@/utils/routes";
import retryRequest from "@/utils/retryRequest";
import getWeeklyData from "@/utils/getWeeklyData";

function getLast10Days(): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 9; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toLocaleDateString("en-US"));
  }

  return dates;
}

const initialState: any = {
  game: "marvel rivals",
  image: "",
  stats: {},
  data: {
    [new Date().toLocaleDateString("en-US")]: {
      tacticalIQ: [],
      reaction: [],
      adaptability: [],
    },
  },
  sync: false,
};

const syncGame = createAsyncThunk(
  "game/sync",
  async ({ data, authHeaders }: { data: any; authHeaders: any }) => {
    await retryRequest(() =>
      axios.post(paths.sync + "game", data, authHeaders)
    );
  }
);
const fetchGame = createAsyncThunk("game/fetch", async (authHeaders: any) => {
  const res = await retryRequest(() =>
    axios.get(paths.sync + "game", authHeaders)
  );
  return res.data;
});
export { syncGame, fetchGame };

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    createDates(state) {
      const date = new Date().toLocaleDateString("en-US");
      const newStats = { ...state.stats };
      const last10Days = getLast10Days();

      last10Days.forEach((d) => {
        if (!(d in newStats)) newStats[d] = [];
      });

      Object.keys(newStats).forEach((key) => {
        if (!last10Days.includes(key)) {
          delete newStats[key];
        }
      });

      return {
        ...state,
        stats: newStats,
        timestamp: Date.now(),
      };
    },
    updateStats(state: any, action) {
      const date = new Date().toLocaleDateString("en-US");
      const newStats = { ...state.stats };
      const last10Days = getLast10Days();

      last10Days.forEach((d) => {
        if (!(d in newStats)) newStats[d] = [];
      });

      Object.keys(newStats).forEach((key) => {
        if (!last10Days.includes(key)) {
          delete newStats[key];
        }
      });

      newStats[date] = [...(newStats[date] || []), action.payload];

      return {
        ...state,
        stats: newStats,
        timestamp: Date.now(),
      };
    },
    changeGame(state, action) {
      const name = action.payload;
      localStorage[`game_${state.game.toLowerCase()}`] = JSON.stringify(state);
      return (
        JSON.parse(localStorage[`game_${name.toLowerCase()}`] || "null") || {
          ...initialState,
          game: name.toLowerCase(),
        }
      );
    },
    clearStats(state) {
      state.stats = {};
      state.timestamp = Date.now();
      return state;
    },
    updateMetrics: (state, action) => {
      const { tacticalIQ, reaction, adaptability } = action.payload;
      const today = new Date().toLocaleDateString("en-US");
      if (!state.data?.[today])
        state.data[today] = {
          tacticalIQ: [],
          reaction: [],
          adaptability: [],
        };
      tacticalIQ && state.data?.[today].tacticalIQ.push(tacticalIQ);
      reaction && state.data?.[today].reaction.push(reaction);
      adaptability &&
        state.data?.[today].adaptability.push(action.payload.adaptability);

      if (state.data?.[today].tacticalIQ.length > 10) {
        state.data?.[today].tacticalIQ.shift();
      }
      if (state.data?.[today].reaction.length > 10) {
        state.data?.[today].reaction.shift();
      }
      if (state.data?.[today].adaptability.length > 10) {
        state.data?.[today].adaptability.shift();
      }
      state.timestamp = Date.now();
    },

    revertMetrics: (state) => {
      if (!state.data)
        return {
          ...initialState,
          sync: state.sync,
          game: state.game,
          image: state.image,
          stats: state.stats,
        };
      const data: Record<string, Record<any, any> | null> = {};
      const { curr, prev } = getWeeklyData();
      curr.forEach((i: string) => (data[i] = state?.data[i] || null));
      prev.forEach((i: string) => (data[i] = state?.data[i] || null));
      const today = new Date().toLocaleDateString("en-US");
      data[today] = { tacticalIQ: [], reaction: [], adaptability: [] };
      return { ...state, timestamp: Date.now(), data };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGame.fulfilled, (state, action) => {
      return {
        ...action.payload,
        sync: true,
      };
    });
    builder.addCase(syncGame.fulfilled, (state, action) => {
      return {
        ...state,
        sync: true,
      };
    });
  },
});

export const {
  updateStats,
  changeGame,
  clearStats,
  createDates,
  updateMetrics,
  revertMetrics,
} = gameSlice.actions;

export function previewGame() {
  const dates = getLast10Days();

  const characters = ["ULTRON", "Loki", "Iron Man", "Storm", "Hela"];
  const maps = ["Central park", "Wakanda Ruins", "Sakaar Arena", "Xandar City"];
  const modes = ["Convergence", "Payload", "Domination"];
  const outcomes = ["Victory", "Defeat"];

  const stats: Record<string, any[]> = {};
  const data: Record<string, any> = {};

  let matchIdCounter = 1217000;

  const randomAround = (
    mean: number,
    spread: number,
    min = 0,
    max = Infinity
  ) => {
    const value = mean + Math.floor((Math.random() - 0.5) * 2 * spread);
    return Math.max(min, Math.min(value, max));
  };

  for (const date of dates) {
    const matchCount = 3 + Math.floor(Math.random() * 4);
    stats[date] = [];
    data[date] = {
      tacticalIQ: [],
      reaction: [],
      adaptability: [],
    };

    for (let i = 0; i < matchCount; i++) {
      const match = {
        meta: {
          game_mode: modes[Math.floor(Math.random() * modes.length)],
          game_type: "Quick match",
          map: maps[Math.floor(Math.random() * maps.length)],
          match_id: `4859999_1750866818_${matchIdCounter++}_11001_32`,
          match_outcome: outcomes[Math.floor(Math.random() * outcomes.length)],
          character_name:
            characters[Math.floor(Math.random() * characters.length)],
        },
        kills: randomAround(10, 5, 0, 25),
        deaths: randomAround(4, 2, 0, 15),
        assists: randomAround(5, 4, 0, 20),
        damage_dealt: randomAround(1500, 500, 500, 5000),
        "damage taken": randomAround(1200, 400, 300, 4000),
        healing: randomAround(700, 300, 0, 2500),
      };

      stats[date].push(match);

      data[date].tacticalIQ.push(randomAround(70, 30, 0, 100));
      data[date].reaction.push(randomAround(100, 10, 50, 130));
      if (Math.random() < 0.7) {
        data[date].adaptability.push(randomAround(4, 1, 1, 7));
      }
    }
  }

  return {
    game: "marvel rivals",
    image: "",
    stats,
    data,
    sync: true,
    timestamp: Date.now(),
  };
}

export default gameSlice.reducer;
