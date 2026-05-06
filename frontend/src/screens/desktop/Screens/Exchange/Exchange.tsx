import React from "react";
import { DailyXP } from "../Home/Home";
import "./Exchange.css";
import Image from "next/image";
import wallet1 from "@/assets/images/wallet/wallet1.png";
import { exchangeItems } from "./ExchangeItems";

type ExchangeItemProps = {
  title: string;
  desc: string;
  cost: number;
  image: any;
};

const Item = ({ title, desc, cost, image }: ExchangeItemProps) => {
  return (
    <div className="_ex-item flex gap-2 flex-col p-3">
      <div className="img">
        <Image src={image} alt={title} width={240} height={240} />
      </div>
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-sm text-[#999] my-[-4px]">{desc}</p>
      <div className="row flex items-center justify-between gap-8">
        <span className="flex items-center gap-1">
          {cost.toString().padStart(3, "0")}{" "}
          <Image
            src={wallet1}
            alt="wallet"
            height={20}
            style={{ position: "relative", top: "-2px" }}
          />
        </span>

        <button className="ex_button">
          <span>Exchange</span>
        </button>
      </div>
    </div>
  );
};

const Exchange = () => {
  return (
    <div className="_exchange w-full flex justify-between flex-1 gap-2 relative screen">
      <h2>
        Pound Exchange <DailyXP />
      </h2>

      <div className="exchnage-items flex-1 h-full w-full flex flex-col gap-6">
        <ul className="tabs w-full flex justify-start items-center gap-2 pt-4">
          <li className="active">
            <span>All</span>
          </li>
          <li>
            <span>Merch</span>
          </li>
          <li>
            <span>Sups</span>
          </li>
          <li>
            <span>Assets</span>
          </li>
        </ul>

        <div className="items flex flex-wrap gap-8 items-center justify-start overflow-y-auto h-full max-h-[475px]">
          {exchangeItems.map((item) => (
            <Item
              key={item.id}
              title={item.title}
              desc={item.desc}
              cost={item.cost}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exchange;
