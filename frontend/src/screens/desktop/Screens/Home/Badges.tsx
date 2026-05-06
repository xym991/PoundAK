import { over } from "lodash";
import Image from "next/image";
import React from "react";

const Badges = ({ badges }: { badges?: string[] }) => {
  return (
    <div className="flex items-center gap-2">
      {badges?.includes("tester") ? (
        <div className="badge-item flex items-center justify-center rounded-sm p-1 text-sm font-medium h-6 w-6 ">
          <Image
            src={process.env.NEXT_PUBLIC_API_URL + "/images/discord-gray.svg"}
            alt=""
            width={18}
            height={18}
            onClick={() =>
              overwolf.utils.openUrlInDefaultBrowser(
                "https://discord.gg/zxAP8vk4Kd"
              )
            }
          />
        </div>
      ) : (
        <div className="badge-item flex items-center justify-center rounded-sm p-1 text-sm font-medium h-6 w-6 ">
          <Image
            src={process.env.NEXT_PUBLIC_API_URL + "/images/discord-gray.svg"}
            alt=""
            width={18}
            height={18}
            onClick={() =>
              overwolf.utils.openUrlInDefaultBrowser(
                "https://discord.gg/zxAP8vk4Kd"
              )
            }
          />
        </div>
      )}
      {badges
        ?.filter((badge) => badge !== "discord")
        .map((badge, index) => (
          <div
            key={index}
            className="badge-item flex items-center justify-center rounded-sm p-1 text-sm font-medium h-6 w-6 "
          >
            <Image
              src={
                process.env.NEXT_PUBLIC_API_URL + "/images/" + badge + ".svg"
              }
              alt=""
              width={18}
              height={18}
            />
          </div>
        ))}
    </div>
  );
};

export default Badges;
