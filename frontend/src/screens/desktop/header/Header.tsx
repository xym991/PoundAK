import Image from "next/image";
import dynamic from "next/dynamic";
import { FC } from "react";
import Logo from "../../../assets/images/Logo.svg";
import Games from "./Games/Games";
import "./index.css";
import VolumeControl from "@/components/VolumeControl/VolumeControl";
// import Toolbar from "./toolbar/Toolbar";
import { useDrag } from "overwolf-hooks";
const Toolbar = dynamic(() => import("./toolbar/Toolbar"), {
  ssr: false,
  loading: () => <p></p>,
});

export default function Header({ tab, setTab }: any) {
  const { onDragStart, onMouseMove } = useDrag("desktop");
  // useDragHandler();

  return (
    <div
      className="bg-headerBg flex justify-between _header cursor-move"
      // style={{ position: "relative" }}
    >
      <div
        className="pl-3 pt-3 self-center flex-1"
        onMouseDown={onDragStart}
        onMouseMove={onMouseMove}
      >
        <Logo className="__logo" alt="Logo" height={120} width={320} priority />
      </div>
      <Games />
      <div className="place-items-end">
        <Toolbar />
        {/* <VolumeControl /> */}
      </div>
    </div>
  );
}
