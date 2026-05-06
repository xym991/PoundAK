import EventBusEvent from "@/lib/EventBusEvent";
import { Subject } from "rxjs";
import EventType from "../../EventType";
import gameFeatures from "../gameFeatures";
import setOverwolfRequiredFeatures from "./setRequiredFeatures";
import { GameState, GameStateUpdateEvent } from "./types";
import parseIfJSON from "@/utils/parseIfJson";
import store from "@/state/store";
import { setInfoData } from "@/state/infoSlice";

type InfoUpdateEvent = overwolf.games.events.InfoUpdates2Event<
  string,
  overwolf.games.events.InfoUpdate2
>;

export const ogsEventBus = new Subject<EventBusEvent>();

class GameService {
  private static _instance: GameService;

  private constructor() {}

  public static getInstance = (): GameService => {
    if (!GameService._instance) {
      GameService._instance = new GameService();
    }
    return GameService._instance;
  };

  private _state: GameState = {};

  public handleNewGame = (gameClassId: number) => {
    const features = gameFeatures.get(gameClassId);
    if (features === undefined) {
      console.warn("Features set", gameFeatures);
      throw new Error(`No features set for game class ID ${gameClassId}`);
    }

    setOverwolfRequiredFeatures(features);
  };

  private mergeWithCurrentState = (
    stateUpdate: Partial<GameState>
  ): GameState =>
    Object.entries(stateUpdate).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...acc[key],
          ...value,
        },
      }),
      structuredClone(this._state)
    );

  public handleInfoUpdates = (event: InfoUpdateEvent | any) => {
    // console.log("Info update:", event.info);
    let layer1 = event["info"];
    let layer2 = layer1[Object.keys(layer1)[0]];
    let layer3 = layer2[Object.keys(layer2)[0]];

    store.dispatch(
      setInfoData({
        [Object.keys(layer2)[0]]: parseIfJSON(layer3),
      })
    );

    const partialUpdate = event.info as Partial<GameState>;
    const updatedState: GameState = this.mergeWithCurrentState(partialUpdate);

    ogsEventBus.next({
      type: EventType.GAME_STATE_UPDATE,
      payload: {
        partialUpdate,
        updatedState,
        previousState: this._state,
      } as GameStateUpdateEvent,
    });

    this._state = updatedState;
  };

  public handleGameEvents = (event: overwolf.games.events.NewGameEvents) => {
    ogsEventBus.next({
      type: EventType.GAME_EVENT, // New event type for game events
      payload: event, // Send raw event data to the event bus
    });
  };
}

export default GameService;
