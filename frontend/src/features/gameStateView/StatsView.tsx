import useGameState from "@/hooks/useGameState";
import { FC, useEffect, useState } from "react";

const StatsView: FC = () => {
  const gameState = useGameState();
  
  // ✅ State to store live stats
  const [stats, setStats] = useState({
    kills: 0,
    deaths: 0,
    assists: 0,
    damageDealt: 0,
    damageBlock: 0,
  });

  // ✅ Watch game state changes
  useEffect(() => {
    if (!gameState) return;

    // 🟢 Extract Player Stats from GameState
    const playerStats = gameState?.match_info?.roster_0?.player_stats || {};

    setStats({
      kills: playerStats?.kills || 0,
      deaths: playerStats?.deaths || 0,
      assists: playerStats?.assists || 0,
      damageDealt: playerStats?.damage_dealt || 0,
      damageBlock: playerStats?.damage_block || 0,
    });

  }, [gameState]); // 🔥 Re-run when `gameState` changes

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-lg font-bold mb-2 text-white">Player Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <StatBox label="Kills" value={stats.kills} color="text-green-400" />
        <StatBox label="Deaths" value={stats.deaths} color="text-red-400" />
        <StatBox label="Assists" value={stats.assists} color="text-blue-400" />
        <StatBox label="Damage Dealt" value={stats.damageDealt} color="text-yellow-400" />
        <StatBox label="Damage Block" value={stats.damageBlock} color="text-purple-400" />
      </div>
    </div>
  );
};

// ✅ Reusable Stat Box Component
const StatBox = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="bg-gray-800 p-4 rounded-md">
    <p className="text-gray-400">{label}:</p>
    <p className={`${color} font-bold`}>{value}</p>
  </div>
);

export default StatsView;
