import React, { useEffect, useState } from "react";
import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
} from "recharts";
import colors from "../../../../utils/colors";
import { formatToHumanReadable } from "./Stats";

const generateTwinkleData = (dates: any) => {
  const numDots = 50;
  const yMax = 95;
  const minDistance = 8;
  const maxAttempts = 1000;

  const isTooClose = (a: any, b: any) => {
    if (a.date !== b.date && Math.abs(a.value - b.value) < 4) return false;
    const dy = Math.abs(a.value - b.value);
    return dy < minDistance;
  };

  const points: any[] = [];
  let date = 0;
  let attempts = 0;
  while (points.length < numDots && attempts < maxAttempts) {
    const candidate = {
      date: dates[date],
      value: Math.round(Math.random() * yMax) + 5, // Y axis
      twinkleDelay: Math.floor(Math.random() * 6),
      twinkleDuration: 3 + Math.random() * 3,
    };

    const tooClose = points.some((p) => isTooClose(p, candidate));

    if (!tooClose) {
      points.push(candidate);
    }

    attempts++;
    date++;
    if (date >= dates.length) date = 0;
  }

  return points.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  try {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload?.[0]?.payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#121212",
          color: "#fff",
          padding: "1rem",
          borderRadius: "0px",
          // boxShadow: "0px 0px 16px " + colors.red,
          border: "1px solid #fff",
          fontWeight: "400",
          fontSize: "13px",
          textTransform: "uppercase",
        }}
      >
        <h3>
          {" "}
          {formatToHumanReadable(payload[1]?.name)}: {payload[1].value}
        </h3>
        {Object.keys(p).map(
          (entry: any, index: number) =>
            entry !== "value" &&
            entry !== payload[1]?.name &&
            entry !== payload[0]?.name &&
            (entry === "meta" ? (
              Object.keys(p[entry]).map((key: any, index: number) => (
                <p key={index}>
                  {formatToHumanReadable(key)}: {p[entry][key]}
                </p>
              ))
            ) : (
              <p key={index}>
                {formatToHumanReadable(entry)}: {p[entry]}
              </p>
            ))
        )}
      </div>
    );
  } catch (err) {
    console.log(err);
    return <></>;
  }
};

const Graph = ({
  data,
  name,
  empty,
}: {
  data: any;
  name: string;
  empty: boolean;
}) => {
  if (name.toLowerCase().includes("matches")) {
    data = data.reduce((acc: any, item: any) => {
      const found = acc.find((entry: any) => entry.date === item.date);
      if (found) {
        found.value += 1;
      } else {
        acc.push({ date: item.date, value: item.value === null ? 0 : 1 });
      }
      return acc;
    }, []);
  }

  const CustomTick = ({ x, y, payload }: any) => {
    // Check if the tick has corresponding data
    const hasData = data.some(
      (item: any) =>
        (item.date === payload.value && item.value !== null) || empty
    );

    return (
      <text
        x={x}
        y={y + 12}
        textAnchor="middle"
        fill={hasData ? "#ccc" : "#666"}
        style={{ fontSize: "14px" }}
      >
        {String(payload.value)?.slice(0, payload.value.length - 5) ||
          payload.value}
      </text>
    );
  };

  try {
    const [twinkleData] = useState(
      generateTwinkleData(data.map((p: any) => p.date))
    );

    const displayData = empty ? twinkleData : data;

    return (
      <div className="_graph flex justify-center items-center">
        <style>
          {`
          @keyframes sparkle {
            0% { opacity: 0; }
            30% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
        </style>

        <ScatterChart width={580} height={440}>
          <CartesianGrid strokeDasharray="1 1" stroke="#454545" />
          <XAxis
            dataKey="date"
            stroke="#bbb"
            padding={{ left: 0 }}
            tick={<CustomTick />}
            allowDuplicatedCategory={false}
            tickFormatter={(value) =>
              String(value)?.split("/").slice(0, 2).join("/")
            }
            // domain={!empty ? ["auto", "auto"] : [0, 9]}
            // axisLine={!empty}
          />
          <YAxis
            stroke="#bbb"
            tick={{ fontSize: 14, fill: "#ccc" }}
            tickCount={12}
            domain={!empty ? ["dataMin-dataMin", "dataMax"] : [0, 100]}

            // axisLine={!empty}
          />
          {!empty && (
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />
          )}

          {empty ? (
            twinkleData.map((point, i) => (
              <Scatter
                key={i}
                data={[point]}
                dataKey="value"
                fill={colors.red}
                name={name}
                shape={
                  <circle
                    r={4}
                    style={{
                      animation: `sparkle ${point.twinkleDuration}s infinite`,
                      animationDelay: `${point.twinkleDelay}s`,
                      opacity: 0,
                    }}
                  />
                }
              />
            ))
          ) : (
            <Scatter
              data={displayData}
              dataKey="value"
              fill={colors.red}
              name={name}
            />
          )}
        </ScatterChart>
      </div>
    );
  } catch (err) {
    console.log(err);
    return <></>;
  }
};

export default Graph;
