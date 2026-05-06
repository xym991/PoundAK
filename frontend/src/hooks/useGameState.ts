import EventBusEvent from "@/lib/EventBusEvent";
import EventType from "@/lib/EventType";
import {
  GameState,
  GameStateUpdateEvent,
} from "@/lib/overwolf/gameService/types";
import { useEffect, useState } from "react";
import { filter, map } from "rxjs";

const useGameState = (): GameState | undefined => {
  const [gameState, setGameState] = useState<GameState>();

  useEffect(() => {
    const eventBus = overwolf.windows.getMainWindow().window.eventBus;

    const listener = eventBus
      .pipe(
        // filter(({ type }) => {
        //   return (
        //     true ||
        //     type === EventType.GAME_STATE_UPDATE ||
        //     type === EventType.GAME_EVENT
        //   );
        // }),
        map(({ payload }: EventBusEvent) => payload as GameStateUpdateEvent),
        map(({ updatedState }) => updatedState as GameState)
      )
      .subscribe(setGameState);

    return () => listener.unsubscribe();
  }, []);

  return gameState;
};

export default useGameState;
