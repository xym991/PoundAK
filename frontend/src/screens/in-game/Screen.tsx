import GameStateView from "@/features/gameStateView/GameStateView";
// import { NotificationProvider } from "@/services/NotificationService";
import store, { persistor } from "@/state/store";
import { FC } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import FullscreenOverlay from "./Overlay";
import "./index.css";

const Screen: FC = () => (
  <div className="in_game fixed top-0 left-0 w-full h-full">
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <NotificationProvider> */}
        <FullscreenOverlay>
          {" "}
          <GameStateView />
        </FullscreenOverlay>
        {/* </NotificationProvider> */}
      </PersistGate>
    </Provider>
  </div>
);

export default Screen;
