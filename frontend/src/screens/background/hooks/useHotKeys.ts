import { useEffect } from "react";
const { log } = console;

export default function useHotKeys() {
  try {
    if (!overwolf) return null;
    useEffect(() => {
      overwolf.settings.hotkeys.onPressed.addListener((e) => {
        //this log is never called, no matter if we use the default key dinding or assign and use a custom one , the key bindings are assigned just fine and we get successful results and the keys are read properly as well
        log(e);
        if (e.name === "toggle_app") {
          overwolf.windows.obtainDeclaredWindow("desktop", (result) => {
            if (result.success) {
              console.log(result);
              overwolf.windows.getWindowState("desktop", (stateResult) => {
                const isVisible =
                  stateResult.window_state === "normal" ||
                  stateResult.window_state === "maximized";

                if (isVisible) {
                  overwolf.windows.hide("desktop");
                } else {
                  overwolf.windows.restore("desktop");
                }
              });
            }
          });
        }
        if (e.name === "toggle_ingame") {
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

            overwolf.windows.obtainDeclaredWindow("in_game", (result) => {
              if (!result.success) return;

              overwolf.windows.getWindowState("in_game", (state) => {
                if (
                  state.window_state === "normal" ||
                  state.window_state === "maximized"
                ) {
                  overwolf.windows.hide("in_game");
                } else {
                  overwolf.windows.restore("in_game");
                }
              });
            });
          });
        }
      });
    }, []);
  } catch (e) {
    log("useHotKeys error", e);
  }
}
