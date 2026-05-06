import React, { useState } from "react";
import banner from "@/assets/images/banner.png";
import Image from "next/image";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { setPortal, setTab } from "@/state/routerSlice";
import useLocalStorageListener from "@/hooks/useLocalStorageListener";

const WideBottom = () => {
  const dispatch = useDispatch();
  const [preview, setPreview] = useState<any>(
    localStorage.getItem("preview") || false
  );
  const user = useSelector((state: any) => state.user);

  useLocalStorageListener("preview", (value) => {
    setPreview(value);
  });
  return (
    <div
      className="_ad_wide_bottom w-full flex justify-between items-center px-4"
      id="ad_wide_bottom"
    >
      <Image src={banner} alt="banner" />
      <Button
        onClick={() =>
          preview || user
            ? dispatch(setTab("exchange"))
            : dispatch(setPortal("login"))
        }
      >
        {" "}
        CHECK IT OUT!
      </Button>
    </div>
  );
};

export default WideBottom;
