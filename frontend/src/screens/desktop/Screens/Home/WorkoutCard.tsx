import Image from "next/image";
import React from "react";
import wallet1 from "@/assets/images/wallet/wallet1.png";
import wallet2 from "@/assets/images/wallet/wallet2.png";
import Lock from "@/assets/images/track/lock.svg";
const WorkoutCard = ({
  recommended,
  title,
  duration,
  xp,
  tokens,
  icon1,
  icon2,
  description,
  locked,
}: {
  recommended?: boolean;
  title: string;
  duration: string;
  xp: number;
  tokens: number;
  icon1: any;
  icon2: any;
  locked?: any;
  description: string;
}) => (
  <div className="workout-card">
    {recommended && <div className="recommended-badge">Recommended</div>}
    <div className="flex items-center justify-between text-sm text-[#999]">
      <span>{duration}</span>
      <span className="flex gap-1 items-center justify-center">
        +{xp}
        <Image
          src={wallet2}
          alt="XP"
          height={14}
          width={14}
          style={{ marginBottom: "2px" }}
        />
      </span>
    </div>
    <div className="workout-title">{title}</div>
    <div className="workout-play-row flex gap-2">
      <div className="play-button relative overflow-hidden">
        <div className="overlay p-4 gap-1 min-h-fit">
          <Lock />
          {locked}
        </div>
        ▶
      </div>
      <div className="workout-meta">
        <p className="text-xs">{description}</p>
      </div>
    </div>
  </div>
);

export default WorkoutCard;
