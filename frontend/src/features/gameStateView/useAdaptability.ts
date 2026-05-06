import { useCallback, useEffect, useRef, useState } from "react";
function percentageDiff(from: number, to: number): number {
  if (from === 0) return to === 0 ? 0 : 100;
  return ((to - from) / Math.abs(from)) * 100;
}
export default function useAdaptability(
  matchInfo: any,
  gamestart?: number | null
) {
  const [snapshots, setSnapshots] = useState<any[]>([]);

  const getPlayerStats = useCallback((matchInfo: any): Record<string, any> => {
    const baseStats = JSON.parse(matchInfo?.player_stats || "{}");
    const localStats =
      Object.keys(matchInfo)
        .map((k) => {
          let val = null;
          try {
            val = JSON.parse(matchInfo[k] || "{}");
          } catch (err) {
            console.warn("Failed to parse:", k, err);
            return null;
          }
          if (!val || !val.is_local) return null;
          return val;
        })
        .filter((v) => v !== null)[0] || {};

    const combinedStats = { ...baseStats, ...localStats };
    // console.log("getPlayerStats result:", combinedStats);
    return combinedStats;
  }, []);

  const updateSnapshots = useCallback(() => {
    if (!gamestart || !matchInfo) {
      //   console.warn("Skipping snapshot update: gamestart is null");
      return;
    }

    const playerStats = getPlayerStats(matchInfo);
    if (!playerStats || Object.keys(playerStats).length === 0) {
      //   console.warn("Skipping snapshot update: playerStats is empty");
      return;
    }

    const snapshot = {
      ...playerStats,
      time: Date.now() - gamestart,
    };

    // console.log("Adding new snapshot:", snapshot);

    setSnapshots((prev) => [...prev, snapshot]);
  }, [matchInfo, gamestart, getPlayerStats]);
  const updateRef = useRef(updateSnapshots);

  // keep ref updated
  useEffect(() => {
    updateRef.current = updateSnapshots;
  }, [updateSnapshots]);
  useEffect(() => {
    // console.log("Setting up snapshot interval from gamestart:", gamestart);
    const interval = setInterval(() => {
      updateRef.current();
    }, 60000); // every 1 minute

    return () => {
      //   console.log("Clearing snapshot interval");
      clearInterval(interval);
    };
  }, []);

  const calculateAdaptability = useCallback(
    (gameEnd: number) => {
      if (matchInfo?.game_type?.toLowerCase() == "practice") {
        return null;
      }
      if (!snapshots || snapshots.length < 2 || !gamestart) {
        console.warn("Not enough data to calculate adaptability", snapshots);
        return 0;
      }

      const duration = gameEnd - gamestart;
      const midpoint = duration / 2;

      const reference = snapshots.reduce((prev, curr) =>
        Math.abs(curr.time - midpoint) < Math.abs(prev.time - midpoint)
          ? curr
          : prev
      );

      const current = getPlayerStats(matchInfo);
      let score = 0;
      if (
        percentageDiff(
          reference.damage_dealt,
          current.damage_dealt - reference.damage_dealt
        ) > -10
      )
        score += 12;

      if (
        percentageDiff(
          reference.damage_dealt,
          current.damage_dealt - reference.damage_dealt
        ) > 20
      )
        score += 10;

      if (
        percentageDiff(
          reference.damage_dealt,
          current.damage_dealt - reference.damage_dealt
        ) > 50
      )
        score += 10;

      if (
        percentageDiff(
          reference.total_heal,
          current.total_heal - reference.total_heal
        ) > -10
      )
        score += 12;

      if (
        percentageDiff(
          reference.total_heal,
          current.total_heal - reference.total_heal
        ) > 20
      )
        score += 10;

      if (
        percentageDiff(
          reference.total_heal,
          current.total_heal - reference.total_heal
        ) > 50
      )
        score += 10;

      if (
        percentageDiff(
          reference.damage_block,
          current.damage_block - reference.damage_block
        ) > -10
      )
        score += 12;

      if (
        percentageDiff(
          reference.damage_block,
          current.damage_block - reference.damage_block
        ) > 20
      )
        score += 10;

      if (
        percentageDiff(
          reference.damage_block,
          current.damage_block - reference.damage_block
        ) > 50
      )
        score += 10;

      if (
        percentageDiff(reference.kills, current.kills - reference.kills) > -10
      )
        score += 10;

      if (percentageDiff(reference.kills, current.kills - reference.kills) > 20)
        score += 10;

      if (percentageDiff(reference.kills, current.kills - reference.kills) > 50)
        score += 10;

      if (
        percentageDiff(reference.deaths, current.deaths - reference.deaths) < 10
      )
        score += 10;

      if (
        percentageDiff(reference.deaths, current.deaths - reference.deaths) <
        -20
      )
        score += 10;

      if (
        percentageDiff(reference.deaths, current.deaths - reference.deaths) <
        -50
      )
        score += 10;

      if (
        percentageDiff(reference.assists, current.assists - reference.assists) >
        -10
      )
        score += 10;
      if (
        percentageDiff(reference.assists, current.assists - reference.assists) >
        20
      )
        score += 10;
      if (
        percentageDiff(reference.assists, current.assists - reference.assists) >
        50
      )
        score += 10;

      //   console.log("Adaptability score:", score);

      //   console.log("Snapshots:", snapshots);
      //   console.log("Current stats:", current);
      //   console.log("Reference snapshot (closest to midpoint):", reference);

      setSnapshots([]);

      return Math.min(score, 100); // Return the calculated adaptability score

      // Implement actual adaptability calculation logic here if needed
    },
    [snapshots, matchInfo, gamestart, getPlayerStats]
  );

  return calculateAdaptability;
}
