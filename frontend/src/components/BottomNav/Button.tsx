import React, { ReactNode, useMemo, useState } from "react";
import "./index.css";
// import { useDesktopTab } from "@/state/desktopScreen";
import cn from "@/utils/classname";
import { useSelector } from "react-redux";

const Button = ({ children, name, tab, setTab, title }: any) => {
  const volume = useSelector((state: any) => state.volume);
  const audio = useMemo(() => {
    const audio = new Audio("/assets/audio/tick.aac");
    audio.volume = volume;
    return audio;
  }, [volume]);

  return (
    <button
      className={cn(name === tab ? "active" : "")}
      onClick={() => name && setTab(name)}
      title={title}
      onMouseEnter={() => audio.play()}
      style={{
        transition: "transform 0.2s ease-in-out",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {children}
    </button>
  );
};

export default Button;
