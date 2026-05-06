"use client";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store, { persistor } from "../../state/store";
import Main from "./Main";
import { PersistGate } from "redux-persist/integration/react";
import { NotificationProvider } from "@/services/NotificationService";
import Header from "./header/Header";
import { localStorageService } from "@/services/localStorageService";

const Screen = () => {
  useEffect(() => {
    localStorageService.clearStore();
    if (!localStorage.getItem("notifications")) {
      localStorage.setItem(
        "notifications",
        JSON.stringify({
          "Pre-Game Power Up": "Enabled",
          "Post-Game Play Call": "Enabled",
          "In-Game Insight": "Enabled",
        })
      );
    }
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      // Minimize to tray instead of closing
      overwolf.windows.getCurrentWindow((result) => {
        overwolf.windows.minimize(result.window.id);
      });
      return false;
    });
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="text-slate-200 bg-mainBg top-0 left-0 right-0 bottom-0 absolute _screen">
          <NotificationProvider>
            <Header />
            <Main></Main>
          </NotificationProvider>
        </div>
      </PersistGate>
    </Provider>
  );
};

export default Screen;
