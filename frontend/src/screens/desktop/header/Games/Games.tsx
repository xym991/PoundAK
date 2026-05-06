import React, { useState, useMemo } from "react";
import Image from "next/image";
import rivals from "../../../../assets/images/games/rivals.png";
import apex from "../../../../assets/images/games/apex.png";
import overwatch from "../../../../assets/images/games/overwatch.png";
import valorant from "../../../../assets/images/games/valorant.png";
import counterstrike from "../../../../assets/images/games/counterstrike.png";
import rainbowsix from "../../../../assets/images/games/rainbowsix.png";
import left from "@/assets/images/settings/left";
import right from "@/assets/images/settings/right";
import "./Games.css";
import { useDispatch, useSelector } from "react-redux";
import { changeGame } from "@/state/gameSlice";

const games: any = {
  rivals: { logo: rivals, name: "Marvel Rivals" },
  apex: { logo: apex, name: "Apex Legends" },
  valorant: { logo: valorant, name: "VALORANT" },
  counterstrike: { logo: counterstrike, name: "Counter-Strike 2" },
  rainbowsix: { logo: rainbowsix, name: "Rainbow Six Siege" },
  overwatch: { logo: overwatch, name: "Overwatch 2" },
};

const Games = () => {
  const dispatch = useDispatch();
  const game = useSelector((state: any) => state.game.game);
  const volume = useSelector((state: any) => state.volume);
  const [offset, setOffset] = useState(0);

  const audio1 = useMemo(() => {
    const audio = new Audio("/assets/audio/tick.aac");
    audio.volume = volume;
    return audio;
  }, [volume]);

  const audio2 = useMemo(() => {
    const audio = new Audio("/assets/audio/light-tick.aac");
    audio.volume = volume;
    return audio;
  }, [volume]);

  return (
    <div className="_games flex justtify-center items-center gap-2">
      <span
        onClick={(_) => offset > 0 && setOffset(offset - 1)}
        onMouseEnter={() => audio2.play()}
      >
        {right}
      </span>
      <div className="coming-soon">coming soon...</div>
      <div className="w-[340px] overflow-x-scroll relative flex gap-2">
        {Object.keys(games).map((k, i) => (
          <Image
            key={i}
            src={games[k].logo}
            alt={games[k].name}
            className={
              game?.toLowerCase() === games[k].name.toLowerCase()
                ? "active"
                : ""
            }
            onClick={(_) => dispatch(changeGame(games[k].name))}
            onMouseEnter={() => audio1.play()}
            style={{
              left: `${56 * offset}px`,
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          />
        ))}
      </div>

      <span
        onClick={(_) => offset < 0 && setOffset(offset + 1)}
        onMouseEnter={() => audio2.play()}
      >
        {left}
      </span>
    </div>
  );
};

export default Games;
