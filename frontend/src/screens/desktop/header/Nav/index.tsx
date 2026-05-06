import React, { useState } from "react";
import Button from "../../../../components/Button";
import "./index.css";
import { tabs } from "../../Main";
import { useDispatch, useSelector } from "react-redux";
import { setPortal, setTab } from "@/state/routerSlice";
import { useLocalStorage } from "react-use";
import Image from "next/image";
import prevImg from "@/assets/images/preview.png";
import useLocalStorageListener from "@/hooks/useLocalStorageListener";
import { resetApp } from "@/state/store";

const Nav = () => {
  const { tab, portal } = useSelector((state: any) => state.router);
  const user = useSelector((state: any) => state.user);

  const [preview, setPreview] = useState<any>(
    localStorage.getItem("preview") || false
  );
  const dispatch = useDispatch();

  useLocalStorageListener("preview", (value) => {
    console.log("preview", value);
    setPreview(value);
  });
  return (
    <div className="_nav">
      {tabs.map((t, i) => (
        <Button
          active={t == tab}
          onClick={() => {
            if (!user && !preview) return dispatch(setPortal("login"));
            portal == "" && dispatch(setTab(t));
          }}
        >
          {t}
        </Button>
      ))}
      {preview && (
        <div className="preview">
          <Image src={prevImg} alt="preview" height={30} />

          <button
            onClick={() => {
              dispatch(setPortal("login"));
            }}
            className="px-4 py-2 bg-indigo-600 text-white  login-preview"
          >
            Join as a Tester{" "}
            <img src={process.env.NEXT_PUBLIC_API_URL + "/images/tester.svg"} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Nav;
