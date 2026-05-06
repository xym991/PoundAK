import { setTab } from "@/state/routerSlice";
import React from "react";
import { useDispatch } from "react-redux";

const AdFree = () => {
  const dispatch = useDispatch();
  return (
    <div
      className="_ad_free w-full flex justify-center items-center gap-2 "
      style={{ visibility: "hidden", pointerEvents: "none" }}
    >
      Ad-free
      <button onClick={() => dispatch(setTab("settings|membership"))}>
        GO PREMIUM
      </button>
    </div>
  );
};

export default AdFree;
