import React from "react";

const SVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="270"
      height="48"
      viewBox="0 0 270 48"
      fill="none"
    >
      <mask id="path-1-inside-1_3235_2" fill="white">
        <path d="M0 0H270V48H10L0 38.6866V0Z" />
      </mask>
      <path
        d="M0 0H270V48H10L0 38.6866V0Z"
        fill="url(#paint0_linear_3235_2)"
        stroke="url(#gradient1)"
        stroke-width="3"
        mask="url(#path-1-inside-1_3235_2)"
        className="stroked"
      />
      <path d="M4 3H11V44L4 37.409V3Z" fill="#C4C4C4" className="filled" />
      <defs>
        <linearGradient
          id="gradient1"
          x1="0.714288"
          y1="23.6418"
          x2="270"
          y2="23.6418"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#C4C4C4" />
          <stop offset="1" stop-color="#C4C4C4" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="gradient2"
          x1="0.714288"
          y1="23.6418"
          x2="270"
          y2="23.6418"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#C4C4C4" />
          <stop offset="1" stop-color="#C4C4C4" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SVG;
