import GameService from "@/lib/overwolf/gameService/GameService";
import { localStorageService } from "@/services/localStorageService";
import { setEventData } from "@/state/eventSlice";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type RunningGameInfo = overwolf.games.RunningGameInfo;

const { onGameLaunched } = overwolf.games;
const { onInfoUpdates2, onNewEvents, onInfoUpdates, onError } =
  overwolf.games.events;

const gameService = GameService.getInstance();

const useGameStateEmitter = () => {
  const handleGameLaunched = (info: RunningGameInfo) => {
    try {
      overwolf.windows.obtainDeclaredWindow("in_game", (result) => {
        if (result.success) {
          overwolf.windows.restore(result.window.id);
        } else {
          console.error("Failed to obtain in_game window:", result.error);
        }
      });
      localStorageService.setItem("game_changed", info.title);
      gameService.handleNewGame(info.classId);
    } catch (err) {
      console.error("Error in handleGameLaunched:", err);
    }
  };

  const handleGameEvents = (event: overwolf.games.events.NewGameEvents) => {
    try {
      // console.log("Game Event received:", event);
      gameService.handleGameEvents(event);
    } catch (err) {
      // console.error("Error in handleGameEvents:", err);
    }
  };

  const handleEventFired = (info: any) => {
    try {
      info?.events?.forEach((e: any) => {
        // console.log("event", e);
        if (e.name === "match_start") {
          overwolf.games.getRunningGameInfo((gameInfo: any) => {
            if (!gameInfo || !gameInfo.isRunning) {
              return;
            }

            if (gameInfo && gameInfo.isRunning) {
              const gameWidth = gameInfo.width;
              const gameHeight = gameInfo.height;
              const gameX = gameInfo?.x;
              const gameY = gameInfo?.y;

              overwolf.windows.changeSize("in_game", gameWidth, gameHeight);
              overwolf.windows.changePosition("in_game", gameX, gameY);
            }

            localStorageService.setItem("is_in_match", "true");
          });
        } else if (e.name === "round_start") {
          localStorageService.setItem("round_start", "true");
        } else if (e.name === "match_end") {
          localStorageService.setItem("match_end", "true");
          return localStorageService.setItem("is_in_match", "");
        } else if (e.name.includes("death")) {
          localStorageService.setItem("death", "true");
        } else if (e.name.includes("start") || e.name.includes("end")) {
          return;
        }

        try {
          const events = JSON.parse(localStorage.events || "[]");
          localStorageService.setItem("events", JSON.stringify([...events, e]));
        } catch (parseErr) {
          console.error("Error parsing localStorage.events:", parseErr);
        }
      });
    } catch (err) {
      console.error("Error in handleEventFired:", err);
    }
  };

  useEffect(() => {
    let gameCheckInterval: NodeJS.Timeout;

    try {
      onGameLaunched.addListener(handleGameLaunched);
      onInfoUpdates2.addListener(gameService.handleInfoUpdates);

      if (onInfoUpdates) {
        onInfoUpdates.addListener(gameService.handleInfoUpdates);
      }

      if (onError) {
        onError.addListener((err) => {
          console.error("Overwolf Game Event Error:", err);
        });
      }

      overwolf.games.events.getInfo((info) => {
        try {
          // console.log("getInfo", info);
        } catch (err) {
          console.error("Error in getInfo callback:", err);
        }
      });

      onNewEvents.addListener((info) => {
        try {
          handleEventFired(info);
        } catch (err) {
          console.error("Error handling onNewEvents:", err);
        }
      });

      return () => {
        onGameLaunched.removeListener(handleGameLaunched);
        onInfoUpdates2.removeListener(gameService.handleInfoUpdates);
        onInfoUpdates?.removeListener(gameService.handleInfoUpdates);
        onNewEvents.removeListener(handleGameEvents);
        onError?.removeListener(() => {});
        // clearInterval(gameCheckInterval); // 👈 clear interval on unmount
      };
    } catch (err) {
      console.error("Error in useEffect:", err);
    }
  }, []);
};

export default useGameStateEmitter;
