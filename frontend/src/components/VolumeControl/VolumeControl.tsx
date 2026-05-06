import { setVolume } from "@/state/volumeSlice";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./VolumeControl.css";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";

export default function VolumeControl() {
  const [volume, setVol] = useState(0.5);
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => dispatch(setVolume(volume), 100));

    return () => clearTimeout(timeout);
  }, [volume]);

  return (
    <div className="_vol flex flex-col items-center gap-2">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e: any) => setVol(e.target.value)}
      />
      <span onClick={(e: any) => setVol(volume ? 0 : 0.75)}>
        {Number(volume) ? <VolumeUpIcon /> : <VolumeMuteIcon />}
      </span>
    </div>
  );
}
