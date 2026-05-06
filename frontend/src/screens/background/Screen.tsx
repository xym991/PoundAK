import EventBusEvent from "@/lib/EventBusEvent";
import { ogsEventBus } from "@/lib/overwolf/gameService/GameService";
import { FC, useEffect } from "react";
import { Subject } from "rxjs";

import { Provider } from "react-redux";
import store, { persistor } from "@/state/store";
import Main from "./Main";
import { PersistGate } from "redux-persist/integration/react";
const { log } = console;
declare global {
  interface Window {
    eventBus: Subject<EventBusEvent>;
  }
}

window.eventBus = ogsEventBus;
// overwolf.windows.obtainDeclaredWindow("in_game", (result) => {
//   //console.log("Result:", result);
//   if (result.success) {
//     overwolf.windows.restore(result.window.id);
//   } else {
//     console.error("Failed to obtain in_game window:", result.error);
//   }
// });
const Screen: FC = () => {
  return (
    <div>
      {" "}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <div>
            <Main></Main>
          </div>
        </PersistGate>
      </Provider>
      <script src="./player.js" />
      <script src="./player.js.map" />
    </div>
  );
};

export default Screen;
