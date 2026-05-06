import paths from "./routes";
import { fetchGame, syncGame } from "@/state/gameSlice";
import { fetchFitness, syncFitness } from "@/state/fitnessSlice";
import { fetchMental, syncMental } from "@/state/mentalSlice";
import { fetchLifestyle, syncLifestyle } from "@/state/lifestyleSlice";
import { fetchChat, syncChat } from "@/state/chatSlice";

import axios from "axios";
import store from "@/state/store";

const safeTimestamp = (ts: any): number => {
  return parseInt(ts) || 0;
};

const maybeSync = async (
  key: string,
  local: any,
  remote: any,
  fetchAction: any,
  syncAction: any,
  authHeaders?: any
) => {
  const dispatch = store.dispatch;

  const localTs = safeTimestamp(local?.timestamp);
  const remoteTs = safeTimestamp(remote?.timestamp);
  const localSyncFlag = local?.sync ?? true;

  if (remoteTs > localTs || (!localSyncFlag && remoteTs)) {
    await dispatch(fetchAction(authHeaders) as any);
  } else if ((remoteTs < localTs || !remoteTs) && local) {
    await dispatch(syncAction({ data: local, authHeaders }) as any);
  }
};

const syncAll = async ({
  user,
  game,
  fitness,
  mental,
  lifestyle,
  chat,
  retries = 2,
}: any) => {
  if (!user) return;
  const token = localStorage.getItem("token");
  if (!token) return;

  const authHeaders = { headers: { Authorization: token } };

  try {
    const res = await axios.get(paths.sync, authHeaders);
    const serverData = res.data;
    if (!serverData) {
      if (retries)
        return await syncAll({
          user,
          game,
          fitness,
          mental,
          lifestyle,
          chat,
          retries: retries - 1,
        });
      else return;
    }

    await maybeSync(
      "game",
      game,
      serverData.game,
      fetchGame,
      syncGame,
      authHeaders
    );
    await maybeSync(
      "fitness",
      fitness,
      serverData.fitness,
      fetchFitness,
      syncFitness,
      authHeaders
    );
    await maybeSync(
      "mental",
      mental,
      serverData.mental,
      fetchMental,
      syncMental,
      authHeaders
    );
    await maybeSync(
      "lifestyle",
      lifestyle,
      serverData.lifestyle,
      fetchLifestyle,
      syncLifestyle,
      authHeaders
    );
    await maybeSync(
      "chat",
      chat,
      serverData.chat,
      fetchChat,
      syncChat,
      authHeaders
    );
  } catch (err) {
    console.error("syncAll failed:", err);
  }
};

export default syncAll;
