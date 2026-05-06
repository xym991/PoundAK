import React from "react";
import "./Track.css";
import Card from "./Card";
import Fitness from "../../../../assets/images/pillars/Pillar-Fitness-Icon.svg";
import Lifestyle from "../../../../assets/images/pillars/Pillar-Lifestyle-Icon.svg";
import Mental from "../../../../assets/images/pillars/Pillar-Mental-Icon.svg";
import { DailyXP } from "../Home/Home";

const Track = () => {
  const trackItems: any = {
    fitness: <Fitness />,
    lifestyle: <Lifestyle />,
    mental: <Mental />,
  };

  return (
    <div className="_track screen w-full flex justify-between flex-1 gap-2 relative">
      <h2>
        Performance track <DailyXP />
      </h2>
      <div className="cards">
        {Object.keys(trackItems).map(
          (key: any) =>
            key && <Card name={key} key={key} img={trackItems[key]} />
        )}
      </div>
    </div>
  );
};

export default Track;
