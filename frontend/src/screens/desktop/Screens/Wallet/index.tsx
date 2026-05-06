import Button from "@/components/Button";
import React, { useState } from "react";
import "./index.css";
import WalletItem from "./WalletItem";
import wallet1 from "@/assets/images/wallet/wallet1.png";
import wallet2 from "@/assets/images/wallet/wallet2.png";
import Image from "next/image";
const Wallet = () => {
  const [state, setState] = useState("wallet");
  return (
    <div className="_wallet w-full flex flex-1 gap-2 relative screen items-center">
      <h2 className="flex justify-between items-center">
        <span className="mr-auto"> Your wallet </span>
        <div className="flex">
          {/* <Button onClick={() => {}} active={state == "wallet"}>
            Wallet
          </Button> */}
          {/* <Button
            onClick={() => {}}
            active={state == "skins"}
            title="comingn soon"
          >
            Skins
          </Button> */}
        </div>
        <div className="w-[150px] ml-auto"></div>
      </h2>

      <div className="main w-full gap-20 flex h-fit items-center justify-center">
        <WalletItem
          img={<Image src={wallet1} alt=""></Image>}
          text={<>POUND Energy Token</>}
          price={0o0}
        ></WalletItem>
        {/* <WalletItem
          img={<Image src={wallet2} alt=""></Image>}
          text={<>PERFORMANCE XP</>}
          price={120}
        ></WalletItem> */}
      </div>
    </div>
  );
};

export default Wallet;
