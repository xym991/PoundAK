import React, { use, useEffect, useMemo, useState } from "react";
import "./Stats.css";
import FieldBg from "../../../../assets/images/stats/stat-field";
import cn from "@/utils/classname";
import Graph from "./Graph";
import { useDispatch, useSelector } from "react-redux";
import { updateStats } from "@/state/gameSlice";
import formatNumber from "@/utils/formatter";
import { empty } from "rxjs";
import { DailyXP } from "../Home/Home";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//////
function generateData(days: string[], multiplyer: number) {
  return days.map((day) => ({
    day,
    value: Math.floor(Math.random() * multiplyer),
  }));
}

//////

const Field = ({
  name,
  value,
  active,
  diff,
  onClick,
}: {
  name: string;
  value: string;
  active: boolean;
  diff: any;
  onClick: () => void;
}) => {
  const volume = useSelector((state: any) => state.volume);
  const audio = useMemo(() => {
    const audio = new Audio("/assets/audio/click.aac");
    audio.volume = volume;
    return audio;
  }, [volume]);

  return (
    <div
      className={cn("_stat", active ? "active" : "")}
      onClick={onClick}
      onMouseEnter={() => audio.play()}
    >
      <FieldBg />
      <h2>{name}</h2>
      <p className="today">{value}</p>
      <p className={cn("diff", diff > -1 ? "p" : "n")}>
        {diff > -1 ? "+" + diff : diff}%
      </p>
    </div>
  );
};

function formatStats(stats: any, date: any) {
  return {
    "Total Matches": stats?.[date]?.length || 0,
    ...stats[date]?.reduce((acc: any, stats: any) => {
      for (const key in stats) {
        if (key == "meta") continue;
        acc[key] = (acc[key] || 0) + stats?.[key] || 0;
      }
      return acc;
    }, {}),
  };
  // if (statsTotal) statsTotal["Total Matches"] = stats[date]?.length || 0;
}

export function formatToHumanReadable(text: string): string {
  if (!text) return text;
  return text.replace(/_/g, " ");
}

const Stats = () => {
  try {
    const [currentField, setCurrentField] = useState("");
    const { stats } = useSelector((state: any) => state.game);
    const today = new Date().toLocaleDateString("en-US");
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString(
      "en-US"
    );
    const dispatch = useDispatch();

    const statsToday = stats[today] ? formatStats(stats, today) : {};
    const statsYesterday = stats[yesterday]
      ? formatStats(stats, yesterday)
      : {};

    const placeholder: any = {
      matches: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      damage_dealt: 0,
      damage_taken: 0,
      healing: 0,
    };

    //console.log(statsToday, statsYesterday);
    const statsLength = Object.keys(stats).length;

    useEffect(() => {
      if (Object.keys(statsToday || {}).length > 1 && !currentField) {
        // setCurrentField("matches");
      }
    }, [stats]);

    const data = Object.keys(stats)?.flatMap((k) => {
      const matches = Array.isArray(stats[k]) ? stats[k] : [];

      if (matches.length === 0) {
        return [{ date: k, value: null }];
      }

      return matches.map((match: any) => ({
        date: k,
        value: match?.[currentField] ?? 0,
        ...match,
      }));
    });
    return (
      <div className="_stats screen w-full flex justify-between flex-1 gap-2 relative">
        <h2>
          performance stats <DailyXP />
        </h2>
        <div className="_stats">
          {Object.keys(statsToday || {}).length > 1 &&
            Object.keys(statsToday || {})?.map((k, i) => (
              <Field
                key={k}
                name={formatToHumanReadable(k)}
                value={formatNumber(statsToday[k])}
                onClick={() =>
                  statsLength && setCurrentField(currentField == k ? "" : k)
                }
                diff={(
                  ((statsToday[k] - statsYesterday?.[k] || 0) /
                    (statsYesterday?.[k] || 1)) *
                  100
                ).toFixed(0)}
                active={k == currentField}
              />
            ))}
          {Object.keys(statsToday || {}).length <= 1 &&
            Object.keys(placeholder).map((k, i) => (
              <Field
                key={k}
                name={formatToHumanReadable(k)}
                value={placeholder[k]}
                onClick={() =>
                  statsLength && setCurrentField(currentField == k ? "" : k)
                }
                diff={0}
                active={k == currentField}
              />
            ))}
        </div>

        <Graph
          data={data}
          name={formatToHumanReadable(currentField)}
          empty={
            !currentField || !data.filter((d: any) => d.value !== null).length
          }
        />
      </div>
    );
  } catch (err) {
    console.log(err);
    return <></>;
  }
};

export default Stats;
