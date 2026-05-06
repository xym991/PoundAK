import React, { useEffect, useMemo, useState } from "react";
import ArrowDropUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import ArrowDropDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { useSelector } from "react-redux";
import calculateTotal from "@/utils/calculateTrackTotal";
import usePlayerContext from "@/screens/background/hooks/usePlayerContext";
import axios from "@/utils/axios";
import paths from "@/utils/routes";
import getWeeklyData from "@/utils/getWeeklyData";

const StatCard = ({ icon, title }: any) => {
  const data = useSelector(
    (state: any) => state[title == "Gaming" ? "game" : title.toLowerCase()]
  );
  const { curr, prev } = getWeeklyData(data?.data);
  const score: number = useMemo(
    () =>
      Number(
        (
          curr?.reduce(
            (acc: number, data: any) =>
              acc +
              Number(
                calculateTotal(
                  data,
                  false,
                  title == "Gaming" ? "game" : title.toLowerCase()
                )
              ),
            0
          ) / 7
        ).toFixed(0)
      ),
    [data]
  );

  const prevScore: number = useMemo(
    () =>
      Number(
        (
          prev?.reduce(
            (acc: number, data: any) =>
              acc +
              Number(
                calculateTotal(
                  data,
                  false,
                  title == "Gaming" ? "game" : title.toLowerCase()
                )
              ),
            0
          ) / 7
        ).toFixed(0)
      ),
    [data]
  );

  const user = useSelector((state: any) => state.user);
  const storageKey = `insight_${title}`;
  const cachedData = JSON.parse(localStorage.getItem(storageKey) || "{}");
  const playerContext = usePlayerContext();

  const [insight, setInsight] = useState<string>(cachedData.insight || "");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user?._id) return setInsight("No data available");
    if (cachedData.value === score && cachedData.insight) return;

    if (loading) return;

    setLoading(true);
    axios
      .post(paths.ai, {
        prompt: `
          point out key improvements the user has achieved , motivate them / draw meaningful results for the user from the data
          here's the user and pillar data: ${JSON.stringify({
            user: playerContext?.user,
            [title]: playerContext?.[title],
            [`${title} score`]: score,
          })}
          keep it short,  concise and useful. only 2-5 lines. Answer in simple text , no extra special characters/headings/sections. just a text message.
          `,
      })
      .then((response) => {
        const newInsight = response.data.message;
        setInsight(newInsight);
        localStorage.setItem(
          storageKey,
          JSON.stringify({ value: score, insight: newInsight })
        );
      })
      .catch(() => setInsight("No data available."))
      .finally(() => setLoading(false));
  }, [data, user]);

  return (
    <div className="stat-card min-w-[150px] gap-2 flex flex-col">
      <div className="stat-header flex items-center justify-start">
        <span className="stat-icon">{icon}</span>
        <span className="stat-title">{title}</span>
      </div>
      <div className="flex items-end justify-between w-full relative">
        <div className="stat-value font-normal w-full">
          <span className="text-4xl text-white font-semibold">{score}</span>
          /100
        </div>
        {score - prevScore >= 0 && score !== 0 ? (
          <ArrowDropUpIcon style={{ color: "green" }} />
        ) : score !== 0 && score !== 100 ? (
          <ArrowDropDownIcon style={{ color: "red" }} />
        ) : null}
      </div>
      <div className="stat-subtext" title={insight}>
        {loading
          ? "Loading..."
          : insight.slice(0, 45) + (insight.length > 45 ? "..." : "")}
      </div>
    </div>
  );
};

export default StatCard;
