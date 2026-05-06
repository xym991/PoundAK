import { useEffect, useRef, useState } from "react";

export default function useReaction(gamestate: any) {
  const [reaction, setReaction] = useState<any>(null);
  const [timestamp, setTimestamp] = useState<any>(null);
  const [arr, setArr] = useState<any>([]);

  useEffect(() => {
    if (arr.length === 0) return;

    let value = Math.min(
      Math.round(
        ((10000 -
          arr.reduce((acc: any, curr: any) => acc + curr, 0) / arr.length) /
          10000) *
          100
      ),
      100
    );

    setReaction(value);
  }, [arr]);

  const current = useRef<any>(
    JSON.parse(gamestate?.match_info?.player_stats || "{}")
  );

  useEffect(() => {
    // console.log("player stats", gamestate?.match_info?.player_stats);
    // if (gamestate?.match_info?.game_type?.toLowerCase() == "practice") {
    //   setReaction(null);
    //   return;
    // }
    if (!gamestate?.match_info?.player_stats) return;
    const stats = JSON.parse(gamestate?.match_info?.player_stats || "{}");
    if (timestamp && Date.now() - timestamp > 10000) {
      current.current = stats;
      setTimestamp(null);
      return;
    }

    if (stats.damage_block > current?.current?.damage_block && !timestamp) {
      setTimestamp(Date.now());
    } else if (
      stats.damage_dealt > current?.current?.damage_dealt &&
      timestamp
    ) {
      setArr((prev: any) => {
        return [...prev, Date.now() - timestamp - 1000];
      });

      setTimestamp(null);
    }
    current.current = stats;
  }, [gamestate?.match_info?.player_stats]);
  return {
    reaction,
    clearReaction: function () {
      setArr([]);
      setReaction(null);
      setTimestamp(null);
      current.current = {};
    },
  };
}
