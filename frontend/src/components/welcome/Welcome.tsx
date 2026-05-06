"use client";
import React from "react";
import Logo from "../../assets/images/Logo.svg";
import "../Login/Login.css";
import DiscordIcon from "@/assets/images/discord-blue.svg";
import { setPortal } from "@/state/routerSlice";
import { useDispatch } from "react-redux";

const Welcome = () => {
  const dispatch = useDispatch();
  return (
    <div className="_login min-w-[700px]">
      {/* <Logo /> */}

      <h1
        style={{
          marginTop: "-12px",
          fontWeight: "bold",
          fontSize: "2.5rem",
          color: "white",
          textAlign: "center",
        }}
      >
        You’re all set!
      </h1>

      <p
        style={{
          marginTop: "-1rem",
          marginBottom: "1.5rem",
          fontSize: "1.5rem",
          fontWeight: "400",
          textAlign: "center",
          color: "white",
          width: "500px",
        }}
      >
        Start your first Track to begin earning XP and connect with other
        testers in the Squad.
      </p>

      <button
        className="px-6 py-3 bg-[#c44420] text-white rounded-md text-md font-semibold login-discord max-w-[500px]"
        onClick={() => {
          dispatch(setPortal(""));
        }}
      >
        Start Earning XP
      </button>

      <p
        className="info flex items-center justify-center gap-4"
        style={{ marginTop: "0.5rem", color: "white", textAlign: "center" }}
        onClick={() => {
          overwolf.utils.openUrlInDefaultBrowser(
            "https://discord.gg/zxAP8vk4Kd"
          );
        }}
      >
        Join the <span className="font-bold ">POUND AK</span> Tester Discord{" "}
        <DiscordIcon
          style={{ height: "24px", width: "24px", marginBottom: "2px" }}
        />
      </p>
    </div>
  );
};

export default Welcome;
