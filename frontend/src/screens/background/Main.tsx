import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGameStateEmitter from "./hooks/useGameStateEmitter";
import useWindowOpener from "./hooks/useWindowOpener";
import searchAndSetFields from "@/utils/searchAndSetFields";
import statsFields, { metaData } from "@/utils/statsFields";
import { clearInfoData } from "@/state/infoSlice";
import { clearEventData } from "@/state/eventSlice";
import { useLocalStorage } from "react-use";
import { localStorageService } from "@/services/localStorageService";
import useLocalStorageListener from "@/hooks/useLocalStorageListener";
import syncAll from "@/utils/syncAll";

export default function Main() {
  const events = useSelector((state: any) => state.events);
  const info = useSelector((state: any) => state.gameInfo);

  const dispatch = useDispatch();

  useLocalStorageListener("match_end", (current, prev) => {
    if (Boolean(current) && !Boolean(prev)) {
      const data = { meta: {} };
      searchAndSetFields(info, data, statsFields);
      searchAndSetFields(info, data.meta, metaData);

      localStorageService.setItem("_game", JSON.stringify(data));
      localStorage.setItem("match_end", "");

      dispatch(clearInfoData({}));
      dispatch(clearEventData({}));
    }
  });

  const [persistRoot, setPersistRoot] = useState<any>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPersisted = localStorage.getItem("persist:root");

      if (currentPersisted !== persistRoot) {
        setPersistRoot(currentPersisted);
      }
    }, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!persistRoot) return;

    const onStateChangedListener = async (event: any) => {
      if (
        event.window_state_ex === "closed" &&
        event.window_name === "desktop"
      ) {
        try {
          const parsed = JSON.parse(persistRoot);

          const user = localStorage.getItem("token");
          const game = JSON.parse(parsed.game || "{}");
          const fitness = JSON.parse(parsed.fitness || "{}");
          const mental = JSON.parse(parsed.mental || "{}");
          const lifestyle = JSON.parse(parsed.lifestyle || "{}");
          const chat = JSON.parse(parsed.chat || "{}");

          await syncAll({ user, game, fitness, mental, lifestyle, chat });
          overwolf.windows.obtainDeclaredWindow("background", (result) => {
            if (result.success) {
              overwolf.windows.close(result.window.id);
            } else {
              console.error(
                "Failed to obtain background window for closing:",
                result
              );
            }
          });
        } catch (err) {
          console.error("Failed to parse persisted state:", err);
        }
      }
    };

    overwolf.windows.onStateChanged.addListener(onStateChangedListener);

    // Cleanup listener when the component is unmounted or persistRoot changes
    return () => {
      overwolf.windows.onStateChanged.removeListener(onStateChangedListener);
    };
  }, [persistRoot]);
  useLocalStorageListener("match_start", (current, prev) => {
    if (Boolean(current)) {
      localStorageService.setItem("match_start", "");
    }
  });

  useWindowOpener();
  useGameStateEmitter();

  useEffect(() => {
    overwolf.extensions.onAppLaunchTriggered.addListener((data) => {
      try {
        if (data && data.parameter.includes("auth")) {
          const decoded = decodeURIComponent(data.parameter);

          const urlParams = new URLSearchParams(decoded.split("?")[1]);
          const token = urlParams.get("token")!;
          localStorage.setItem("token", token);
          localStorageService.setItem("token", token);

          if (data?.parameter?.includes("login") && token)
            localStorageService.setItem("login-token", "true");

          if (data?.parameter?.includes("register") && token)
            localStorageService.setItem("register-token", "true");
        }

        overwolf.windows.obtainDeclaredWindow("background", (result) => {
          if (result.success) {
            overwolf.windows.restore(result.window.id);
          } else {
            console.error("Failed to obtain background window:", result);
          }
        });

        overwolf.windows.obtainDeclaredWindow("desktop", (result) => {
          if (result.success) {
            overwolf.windows.restore(result.window.id);
            overwolf.windows.bringToFront(result.window.id, () => {});
          } else {
            console.error("Failed to obtain desktop window:", result);
          }
        });
      } catch (err) {
        console.error("Error handling app launch:", err);
      }
    });
    setTimeout(() => {
      overwolf.notifications.showToastNotification(
        {
          header: "Header",
          texts: ["text1", "text2", "text3"],
          logoOverride: {
            url: "overwolf-extension://gngbkedhljnomdiifgaciojdmnpckikpjmnnadgm/84x84.png",
            cropType: overwolf.notifications.enums.AppLogoCrop.Default,
          },
          heroImage:
            "overwolf-extension://gngbkedhljnomdiifgaciojdmnpckikpjmnnadgm/logo_364x180.png",
          inlineImage:
            "overwolf-extension://gngbkedhljnomdiifgaciojdmnpckikpjmnnadgm/logo_364x180.png",
          attribution: "sent from an app",
          buttons: [
            {
              id: "button_1",
              text: "button 1",
            },
            {
              id: "button_2",
              text: "button 2",
            },
          ],
        },
        console.log
      );
    }, 30000);
  }, []);

  return <></>;
}
