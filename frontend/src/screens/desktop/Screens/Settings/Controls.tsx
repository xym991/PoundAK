import React, { ReactNode } from "react";
import left from "@/assets/images/settings/left";
import right from "@/assets/images/settings/right";
import cn from "@/utils/classname";
const Controls = ({
  slides,
  slide,
  setSlide,
}: {
  slides: ReactNode[];
  slide: number;
  setSlide: (slide: number) => void;
}) => {
  // const audio = new Audio("/assets/audio/light-tick.aac");
  return (
    <div className="_controls">
      <span
        onClick={() => slide - 1 >= 0 && setSlide(slide - 1)}
        // onMouseEnter={() => audio.play()}
      >
        {" "}
        {left}
      </span>
      {slides.map((p, i) => (
        <div
          className={cn("page", slide == i ? "active" : "")}
          onClick={() => setSlide(i)}
          // onMouseEnter={() => audio.play()}
        ></div>
      ))}
      <span
        onClick={() => slide + 1 < slides.length && setSlide(slide + 1)}
        // onMouseEnter={() => audio.play()}
      >
        {right}
      </span>
    </div>
  );
};

export default Controls;
