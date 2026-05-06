"use client"; // Ensure it runs only on the client-side

import { useEffect } from "react";
import "./index.css";

const FullscreenOverlay = ({ children }: any) => {
  useEffect(() => {
    if (typeof window !== "undefined" && "overwolf" in window) {
      overwolf.windows.getCurrentWindow((result) => {
        if (result.success) {
          const { id } = result.window;
          overwolf.windows.changeSize(
            id,
            window.screen.width,
            window.screen.height
          );
          overwolf.windows.changePosition(id, 0, 0);
        }
      });
    }
  }, []);

  return (
    <div className="ingame-overlay fixed inset-0 pointer-events-none">
      {children}
    </div>
  );
};

export default FullscreenOverlay;
