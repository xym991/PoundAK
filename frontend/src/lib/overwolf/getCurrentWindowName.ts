import { WINDOW_NAMES } from "@/lib/overwolf/windowNames";
import isDev from "../isDev";

async function getCurrentWindow() {
  if (isDev) {
    const windowName = WINDOW_NAMES.DESKTOP;

    return Promise.resolve(windowName);
  }
  return new Promise<string>((resolve, reject) => {
    overwolf.windows.getCurrentWindow((result) => {
      if (result.success) {
        resolve(result.window.name);
      } else {
        reject(result.error);
      }
    });
  });
}

export default getCurrentWindow;
