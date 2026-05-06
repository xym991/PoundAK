export function getPlayerRolesFromMatch(matchInfo) {
  const players = [];

  for (const key of Object.keys(matchInfo)) {
    if (key.startsWith("roster_")) {
      const value = matchInfo[key];
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;

        if (parsed?.is_local || parsed?.is_teammate === true || parsed?.is_teammate === false) {
          players.push(parsed);
        }
      } catch {
        console.warn("❌ Failed to parse roster value:", value);
      }
    }
  }

  const player = players.find(p => p.is_local) || null;
  const teammates = players.filter(p => p.is_teammate && !p.is_local);
  const enemies = players.filter(p => !p.is_teammate && !p.is_local);

  return {
    player,
    teammates,
    enemies,
  };
}
export const formatPlayerName = (p) => {
  if (!p) return "Unknown";
  if (p.character_name && p.name) return `${p.character_name} (${p.name})`;
  if (p.character_name) return p.character_name;
  if (p.name) return p.name;
  return "Unnamed Player";
};










export function parsePlayerStats(playerStatsRaw) {
  if (!playerStatsRaw || typeof playerStatsRaw !== "string") {
    return {
      damage_dealt: 0,
      damage_block: 0,
      total_heal: 0,
    };
  }

  try {
    const stats = JSON.parse(playerStatsRaw);

    return {
      damage_dealt: Number(stats.damage_dealt || 0),
      damage_block: Number(stats.damage_block || 0),
      total_heal: Number(stats.total_heal || 0),
    };
  } catch (err) {
    console.warn("❌ Failed to parse player_stats:", playerStatsRaw);
    return {
      damage_dealt: 0,
      damage_block: 0,
      total_heal: 0,
    };
  }
}










export function parseRecentEvents(events = []) {
  let latestKill = null;
  let latestDeath = null;
  let latestAssist = null;
  const killFeed = [];

  for (const event of events) {
    if (event.name === "kill_feed") {
      try {
        const parsed = JSON.parse(event.data);
        killFeed.push(parsed);
      } catch {
        console.warn("❌ Failed to parse kill_feed:", event.data);
      }
    }

    if (event.name === "kill") {
      latestKill = Number(event.data);
    }

    if (event.name === "death") {
      latestDeath = Number(event.data);
    }

    if (event.name === "assist") {
      latestAssist = Number(event.data);
    }
  }

  return {
    kills: killFeed,
    totalKills: latestKill,
    totalDeaths: latestDeath,
    totalAssists: latestAssist,
    raw: events,
  };
}








export function parseMatchMeta(matchInfo = {}) {
  return {
    game_mode: matchInfo.game_mode || "Unknown",
    game_type: matchInfo.game_type || "Unknown",
    map: matchInfo.map || "Unknown",
    match_outcome: matchInfo.match_outcome || null,
    match_id: matchInfo.match_id || null,
  };
}













export function buildPregameContext({
  matchMeta,
  player,
  teammates,
  enemies,
}) {
  return {
    match: {
      game_mode: matchMeta.game_mode,
      game_type: matchMeta.game_type,
      map: matchMeta.map,
    },
    player: {
      name: player?.name || "Unknown",
      character: player?.character_name || null,
    },
    teammates: teammates.map(t => ({
      name: t.name,
      character: t.character_name || null,
    })),
    enemies: enemies.map(e => ({
      name: e.name,
      character: e.character_name || null,
    })),
  };
}






export function buildIntragameContext({
  matchMeta,
  player,
  teammates,
  enemies,
  playerStats,
  recentEvents,
}) {
  return {
    match: {
      game_mode: matchMeta?.game_mode ?? "Unknown",
      game_type: matchMeta?.game_type ?? "Unknown",
      map: matchMeta?.map ?? "Unknown",
    },
    player: {
      name: player?.name ?? "Unknown",
      character: player?.character_name ?? "Unknown",
      stats: {
        damage_dealt: playerStats?.damage_dealt ?? 0,
        damage_block: playerStats?.damage_block ?? 0,
        total_heal: playerStats?.total_heal ?? 0,
        kills: recentEvents?.totalKills ?? 0,
        deaths: recentEvents?.totalDeaths ?? 0,
        assists: recentEvents?.totalAssists ?? 0,
      },
    },
    teammates: teammates.map((t) => ({
      name: t.name,
      character: t.character_name,
    })),
    enemies: enemies.map((e) => ({
      name: e.name,
      character: e.character_name,
    })),
    kill_feed: recentEvents?.kills ?? [],
  };
}







export function buildPostgameContext({
  matchMeta,
  player,
  teammates,
  enemies,
  playerStats,
  recentEvents,
}) {
  return {
    match: {
      game_mode: matchMeta.game_mode,
      game_type: matchMeta.game_type,
      map: matchMeta.map,
      match_outcome: matchMeta.match_outcome,
    },
    player: {
      name: player?.name || "Unknown",
      character: player?.character_name || null,
      stats: {
        damage_dealt: playerStats.damage_dealt,
        damage_block: playerStats.damage_block,
        total_heal: playerStats.total_heal,
        kills: player?.kills ?? recentEvents.totalKills ?? 0,
        deaths: player?.deaths ?? recentEvents.totalDeaths ?? 0,
        assists: player?.assists ?? recentEvents.totalAssists ?? 0,
      },
    },
    teammates: teammates.map((t) => ({
      name: t.name,
      character: t.character_name || null,
    })),
    enemies: enemies.map((e) => ({
      name: e.name,
      character: e.character_name || null,
    })),
    kill_feed: recentEvents.kills.map((k) => ({
      attacker: k.attacker,
      victim: k.victim,
    })),
  };
}
