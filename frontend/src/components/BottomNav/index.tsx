import React, { ReactNode } from "react";
import Wallet from "../../assets/images/bottom-nav/wallet.svg";
import Notifications from "../../assets/images/bottom-nav/notifications.svg";
import Discord from "../../assets/images/bottom-nav/discord1.svg";
import Settings from "../../assets/images/bottom-nav/settings.svg";
import Stats from "../../assets/images/bottom-nav/stats.svg";
import Button from "./Button";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { setPortal, setTab } from "@/state/routerSlice";
//import { useDesktopTab } from "@/state/desktopScreen";
type button = {
  icon: ReactNode;
  name: string;
};
const buttons: button[] = [
  { icon: <Wallet />, name: "wallet" },
  { icon: <Stats />, name: "" },
  { icon: <Notifications />, name: "" },
  { icon: <Discord className="discord" />, name: "" },
  { icon: <Settings />, name: "settings" },
];

const BottomNav = () => {
  const user = useSelector((state: any) => state.user);
  const tab = useSelector((state: any) => state.router.tab);
  const dispatch = useDispatch();
  return (
    <div className="_bottom-nav">
      {buttons.map((btn) => (
        <Button
          title={!btn.name && "coming soon"}
          name={btn.name}
          tab={tab}
          setTab={
            user
              ? () => dispatch(setTab(btn.name))
              : () => dispatch(setPortal("login"))
          }
        >
          {" "}
          {btn.icon}
        </Button>
      ))}
    </div>
  );
};

export default BottomNav;
