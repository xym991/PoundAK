export default function calculateTacticalIQ(matchInfo: any, time: number) {
  // if (matchInfo?.game_type?.toLowerCase() == "practice") {
  //   return null;
  // }
  if (!matchInfo || !matchInfo.player_stats) {
    // console.log("🚫 No matchInfo or player_stats found.");
    return null;
  }
  // console.log("Match Info", matchInfo);
  let total = 0;
  const playerstats = {
    ...JSON.parse(matchInfo?.player_stats),
    ...(Object.keys(matchInfo)
      .map((k) => {
        let val = null;
        try {
          val = JSON.parse(matchInfo[k] || "{}");
        } catch (err) {
          return null;
        }
        if (!val || !val.is_local) return null;
        return val;
      })
      .filter((v) => v !== null)[0] || {}),
  };

  playerstats.me = true;

  playerstats.KDA =
    (playerstats.kills + playerstats.assists * 0.75) / (1 + playerstats.deaths);

  // console.log("🧠 Player Stats:", playerstats);

  if (playerstats.damage_dealt / time > 6) {
    total += 10;
    // console.log("✅ Damage dealt > 50000 (+10)", time);
  }
  if (playerstats.damage_dealt / time > 15) {
    total += 10;
    // console.log("✅ Damage dealt > 10000 (+10)");
  }
  if (playerstats.damage_block / time > 12) {
    total += 10;
    // console.log("✅ Damage block > 10000 (+10)");
  }
  if (playerstats.damage_block / time > 30) {
    total += 10;
    // console.log("✅ Damage block > 20000 (+10)");
  }
  if (playerstats.total_heal / time > 3) {
    total += 10;
    // console.log("✅ Total heal > 2000 (+10)");
  }
  if (playerstats.total_heal / time > 8) {
    total += 10;
    // console.log("✅ Total heal > 5000 (+10)");
  }

  if (playerstats.KDA > 1) {
    total += 10;
    // console.log("✅ KDA > 1 (+10)");
  }
  if (playerstats.KDA > 2) {
    total += 10;
    // console.log("✅ KDA > 2 (+10)");
  }
  if (playerstats.KDA > 4) {
    total += 10;
    // console.log("✅ KDA > 4 (+10)");
  }
  if (playerstats.KDA > 8) {
    total += 10;
    // console.log("✅ KDA > 8 (+10)");
  }

  const team = Object.keys(matchInfo)
    .map((k) => {
      let val = null;
      try {
        val = JSON.parse(matchInfo[k] || "{}");
      } catch (err) {
        return null;
      }
      if (val?.is_local === false && val.is_teammate === true) {
        val.KDA = (val.kills + val.assists * 0.75) / (1 + val.deaths);
        return val;
      }
      return null;
    })
    .filter((v) => v !== null)
    .concat([playerstats]);

  // console.log(
  //   "👥 Team players (w/ self):",
  //   team.sort((a, b) => a.KDA - b.KDA)
  // );

  const teamIQBoost = Math.round(
    team
      .sort((a, b) => a.KDA - b.KDA)
      .reduce((acc, player, index) => {
        if (!player.me) return acc;
        const boost = Math.min(((index + 1) / 6) * 40, 40);
        // console.log(`📈 Team KDA rank boost: index=${index}, boost=${boost}`);
        return boost;
      }, 0) || 0
  );

  total += teamIQBoost;

  const enemies = Object.keys(matchInfo)
    .map((k) => {
      let val = null;
      try {
        val = JSON.parse(matchInfo[k] || "{}");
      } catch (err) {
        return null;
      }
      if (val?.is_local === false && val.is_teammate === false) {
        val.KDA = (val.kills + val.assists * 0.75) / (1 + val.deaths);
        return val;
      }
      return null;
    })
    .filter((v) => v !== null)
    .concat([playerstats]);

  // console.log(
  //   "🧨 Enemies (w/ self):",
  //   enemies.sort((a, b) => a.KDA - b.KDA)
  // );

  const enemyIQBoost = Math.round(
    enemies
      .sort((a, b) => a.KDA - b.KDA)
      .reduce((acc, player, index) => {
        if (!player.me) return acc;
        const boost = Math.min(((index + 1) / 5) * 30, 30);

        return boost;
      }, 0) || 0
  );

  // total += enemyIQBoost;
  // console.log("📊 Total IQ :", total);
  const finalIQ = Math.min(total, 100);
  // console.log("🧠 Final Tactical IQ:", finalIQ);

  return finalIQ;
}
