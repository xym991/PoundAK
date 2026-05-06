import React, { useEffect, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { goBack, setPortal, setTab } from "@/state/routerSlice";
import useLocalStorageListener from "@/hooks/useLocalStorageListener";

const Back = () => {
  const dispatch = useDispatch();
  const { portal, tab } = useSelector((state: any) => state.router);
  const user = useSelector((state: any) => state.user);
  const [preview, setPreview] = useState<any>(
    localStorage.getItem("preview") || false
  );

  useLocalStorageListener("preview", (value) => {
    setPreview(value);
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!user && portal !== "options" && !preview) {
          return dispatch(setPortal("options"));
        }
        if (!user && portal !== "login" && !preview) {
          return dispatch(setPortal("login"));
        }
        dispatch(goBack());
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dispatch, portal]);

  return (
    <div
      className="_back"
      onClick={() => {
        if (!user && portal !== "options" && !preview) {
          return dispatch(setPortal("options"));
        }
        if (!user && portal !== "login" && !preview) {
          return dispatch(setPortal("login"));
        }
        dispatch(goBack());
      }}
    >
      <span>ESC</span>
      {portal == "options" || tab != "home" ? "Back" : "Options"}
    </div>
  );
};

export default Back;
