import React, { useEffect, useState } from "react";
import { Field } from "./Profile";
import { useDispatch, useSelector } from "react-redux";
import { setVolume } from "@/state/volumeSlice";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";

const Audio = () => {
  const [volume, setVol] = useState(useSelector((state: any) => state.volume));
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => dispatch(setVolume(volume), 100));

    return () => clearTimeout(timeout);
  }, [volume]);

  return (
    <div className="_settings-page">
      <h2>Audio</h2>
      <div className="_vol section gap-4 flex _field">
        <h2> Button Effects </h2>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e: any) => setVol(e.target.value)}
        />
        <p>{volume * 100 + "%"}</p>
      </div>
    </div>
  );
};

export default Audio;
