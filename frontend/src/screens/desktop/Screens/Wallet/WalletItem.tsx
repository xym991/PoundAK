import Image from "next/image";
import React from "react";

const WalletItem = ({ img, price, text }: any) => {
  return (
    <div className="_wallet-item h-fit gap-2 flex flex-col w-[160px] text-center items-center justify-center">
      <div className="image">{img}</div>
      <h2>{price}</h2>
      <p>{text}</p>
    </div>
  );
};

export default WalletItem;
