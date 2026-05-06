import React, { ReactNode, useEffect, useState } from "react";
import "./Settings.css";

import Profile from "./Profile";
import cn from "@/utils/classname";
import Membership from "./Membership";
import Security from "./Security";
import Preferences from "./Preferences";
import Targets from "./Targets";

import { useDispatch, useSelector } from "react-redux";

import { setPortal, setTab } from "@/state/routerSlice";
import Notifications from "./Notifications";
import Audio from "./Audio";
import { localStorageService } from "@/services/localStorageService";

const svg = (
  <div className="arrow">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="19"
      viewBox="0 0 11 19"
      fill="none"
    >
      <path
        className="path"
        d="M10.5234 9.08721L2.63213 1.21628L2.63213 16.9581L10.5234 9.08721Z"
        fill="#666"
      />
      <path
        d="M5.66406 9.09002L2.62895 6.27897L2.62895 11.9011L5.66406 9.09002Z"
        fill="#1F1F1F"
      />
    </svg>
  </div>
);
export type settingsPage = {
  name: string;
  gap?: boolean;
  components: ReactNode[];
  onClick?: () => void;
};

const Settings = () => {
  const tab = useSelector((state: any) => state.router.tab);
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  if (!user) {
    dispatch(setTab("home"));
    dispatch(setPortal("login"));
    return <></>;
  }

  const pages: settingsPage[] = [
    { name: "profile", components: [<Profile />] },
    // { name: "membership", components: [<Membership />] },
    { name: "Security", components: [<Security />] },
    { name: "preferences", components: [<Preferences />] },
    { name: "targets", components: [<Targets />] },
    // { name: "ad preferences", components: [<Profile />, <></>] },
    // { name: "connections", components: [<></>, <></>] },
    {
      name: "notifications",
      components: [<Notifications></Notifications>],
    },
    {
      name: "audio",
      components: [<Audio />],
    },
    // { name: "hot keys", components: [<Hotkeys />] },
    // { name: "help", gap: true, components: [<Profile />, <></>] },
    // { name: "send feedback", components: [<></>, <></>] },
    {
      name: "logout",
      gap: true,
      components: [],
      onClick: () => {
        localStorageService.setItem("logout", "true");
      },
    },
  ];

  const [page, setPage] = useState(
    Math.max(
      pages.findIndex((p) => p.name == tab.split("|")[1]),
      0
    )
  );
  const [slide, setSlide] = useState(0);

  useEffect(() => setSlide(0), [page]);

  return (
    <div className="_settings">
      <div className="select">
        <h2>Settings</h2>
        <div className="buttons">
          {pages.map((p, index) => (
            <>
              {p.gap && <br />}
              <button
                key={index}
                className={cn(
                  "settings-select",
                  p.name,
                  index == page ? "active" : ""
                )}
                onClick={(_) => (p.onClick && p.onClick()) || setPage(index)}
                // onMouseEnter={() => audio.play()}
              >
                {p.name} {p.name !== "logout" && svg}
              </button>
            </>
          ))}
        </div>
      </div>
      <div className="main">
        {/* <Controls
          slides={pages[page].components}
          slide={slide}
          setSlide={setSlide}
        /> */}
        {pages[page].components[slide]}
      </div>
    </div>
  );
};

export default Settings;
