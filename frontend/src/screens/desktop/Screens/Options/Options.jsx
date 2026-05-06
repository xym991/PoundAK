import React, { use, useState } from "react";
import "./Options.css";
import Button from "../../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/state/userSlice";
import { setPortal, setTab } from "@/state/routerSlice";
import { localStorageService } from "@/services/localStorageService";
import useLocalStorageListener from "@/hooks/useLocalStorageListener";

const Options = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [preview, setPreview] = useState(
    localStorage.getItem("preview") || false
  );

  useLocalStorageListener("preview", (value) => {
    setPreview(value);
  });
  return (
    <>
      <Button onClick={() => dispatch(setTab("settings"))}>Settings</Button>
      <Button
        onClick={() =>
          user ? dispatch(setTab("wallet")) : dispatch(setPortal("login"))
        }
      >
        Wallet
      </Button>
      <Button
        onClick={() =>
          // user ? dispatch(setTab("wallet")) : dispatch(setPortal("login"))
          preview || user
            ? dispatch(setTab("exchange"))
            : dispatch(setPortal("login"))
        }
      >
        Pound Exchange
      </Button>
      <Button onClick={() => document.querySelector("._minimize").click()}>
        Minimize
      </Button>
      <Button onClick={() => document.querySelector("._close").click()}>
        Close
      </Button>

      {user && (
        <Button
          onClick={() => {
            localStorageService.setItem("logout", "true");
          }}
        >
          Logout
        </Button>
      )}
    </>
  );
};

export default Options;
