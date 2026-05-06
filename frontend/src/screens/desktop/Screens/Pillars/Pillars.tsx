import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import "./Pillars.css";
import cn from "../../../../utils/classname";
import IMG1 from "../../../../assets/images/pillars/Pillar-Gaming-Icon.svg";
import IMG2 from "../../../../assets/images/pillars/Pillar-Fitness-Icon.svg";
import IMG3 from "../../../../assets/images/pillars/Pillar-Lifestyle-Icon.svg";
import IMG4 from "../../../../assets/images/pillars/Pillar-Mental-Icon.svg";
import { useSelector } from "react-redux";
import calculateTotal from "@/utils/calculateTrackTotal";
import { addPercentages } from "@/repositories/track.repository";
import axios from "@/utils/axios";
import paths from "@/utils/routes";
import ArrowDropUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import ArrowDropDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { DailyXP } from "../Home/Home";
import getWeeklyData from "@/utils/getWeeklyData";

type pillar = {
  name: string;
  img: ReactNode;

  subFields: string[];
};

export async function getInsight(body: any) {
  return await axios.post(paths.pillarInsight, body);
}
const pillars: pillar[] = [
  {
    name: "game",
    img: <IMG1 />,

    subFields: ["reaction", "adaptability", "tactical IQ"],
  },
  {
    name: "fitness",
    img: <IMG2 />,

    subFields: ["strength", "endurance", "flexibility"],
  },
  {
    name: "mental",
    img: <IMG4 />,

    subFields: ["focus", "stress", "cognition"],
  },
  {
    name: "lifestyle",
    img: <IMG3 />,

    subFields: ["sleep", "hydration", "nutrition"],
  },
];

const PillarInfo = ({
  title,
  tasks,
  pillar,
  metrics,
  id,
}: {
  title: string;
  tasks: any[];
  pillar: string;
  metrics?: any;
  id?: string;
}) => {
  const user = useSelector((state: any) => state.user);

  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [relativeValue, setRelativeValue] = useState("0%");

  useEffect(() => {
    setRelativeValue("0%");
    let val: any = null;
    let timeout: any;
    if (tasks) {
      const filteredTasks = tasks?.filter((task) => task.tag == title) || [];

      let max = 0,
        value = 0;
      for (const task of filteredTasks) {
        let temp = 0;
        for (const option of task.options) {
          if (option.selected)
            value += parseInt(addPercentages(task.value, option.value)) || 0;
          temp = Math.max(temp, parseInt(option.value));
        }
        max += (parseInt(task.value) * temp) / 100 || 0;
      }
      val = ((value / Math.max(max, 1)) * 100).toFixed(2) + "%";
      timeout = setTimeout(() => setRelativeValue(val), 300);
    }
    if (metrics?.length) {
      val =
        Math.round(
          metrics.reduce((acc: any, key: any, index: number) => {
            if (index + 1 === metrics.length) {
              return (acc + parseInt(key)) / metrics.length;
            }
            return acc + parseInt(key);
          }, 0)
        ) + `%`;
      timeout = setTimeout(() => {
        setRelativeValue(val);
      }, 300);
    }
    (() => {
      if (!user?._id) {
        return setInsight("No insights available. Login to get insights");
      }
      const storageKey = `insight_${pillar}_${title}`;
      const cachedData = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (cachedData.value === val && cachedData.insight) {
        return setInsight(cachedData.insight);
      }

      setLoading(true);
      getInsight({
        score: val,
        metric: title,
        pillar,
        context: {},
      })
        .then((response) => {
          const newInsight = response.data.message;
          setInsight(newInsight);
          localStorage.setItem(
            storageKey,
            JSON.stringify({ value: val, insight: newInsight })
          );
        })
        .catch(() => setInsight("No insights available."))
        .finally(() => setLoading(false));
    })();
    return () => clearTimeout(timeout);
  }, [tasks, metrics, title, user?._id, pillar]);
  useEffect(() => {}, [relativeValue, user]);

  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, [title]);

  return (
    <div className={cn("_pillar-info", " fade-in" + id)} key={animateKey}>
      <h4>
        <p>{title}</p> <span>{relativeValue.replace(".00", "")}</span>
        <div
          className={cn("slider")}
          style={{ width: parseInt(relativeValue) ? relativeValue : "1%" }}
        ></div>
      </h4>
      <p>{loading ? "Loading..." : insight}</p>
    </div>
  );
};

const PillarSlice = ({
  currentPillar,
  pillar,
  setPillar,
  index,
  score,
  setScore,
}: {
  currentPillar: pillar;
  pillar: pillar;
  setPillar: (pillar: pillar) => void;
  index: number;
  score: number;
  setScore: (score: number) => void;
}) => {
  const data = useSelector((state: any) => state[pillar.name]);

  const { curr, prev } = getWeeklyData(data?.data);

  useEffect(() => {
    setScore(
      Number(
        (
          curr?.reduce((acc: number, data: any) => {
            return acc + Number(calculateTotal(data, false, pillar.name));
          }, 0) / 7
        ).toFixed(2)
      )
    );
  }, [data]);

  const prevScore: number = useMemo(
    () =>
      Number(
        (
          prev?.reduce(
            (acc: number, data: any) =>
              acc + Number(calculateTotal(data, false, pillar.name)),
            0
          ) / 7
        ).toFixed(2)
      ),
    [data]
  );

  console.log(score, prevScore, curr, prev);

  return (
    <div
      className={cn(
        "_pillar-slice",
        pillar.name,
        currentPillar.name == pillar.name ? "_active" : ""
      )}
      onClick={() => setPillar(pillars[index])}
      //   onMouseEnter={() => audio.play()}
    >
      <h3>{pillar.name === "game" ? "Gaming" : pillar.name}</h3>
      {pillar.img}
      <h4>
        {" "}
        {score + "%"}{" "}
        {score - prevScore >= 0 && score != 0 ? (
          <ArrowDropUpIcon />
        ) : score != 0 && score != 100 ? (
          <ArrowDropDownIcon style={{ color: "red" }} />
        ) : (
          ""
        )}
      </h4>
    </div>
  );
};
const PillarWheel = ({
  pillars,
  currentPillar,
  setPillar,
}: {
  pillars: pillar[];
  currentPillar: pillar;
  setPillar: (pillar: pillar) => void;
}) => {
  const [score, setScore] = useState<Record<string, any>>({});

  return (
    <div className="_pillar-wheel">
      {pillars.map((p, i) => (
        <PillarSlice
          pillar={p}
          setPillar={setPillar}
          index={i}
          currentPillar={currentPillar}
          score={score[p.name] || 0}
          setScore={(s: any) => setScore((prev) => ({ ...prev, [p.name]: s }))}
        />
      ))}
      <div className="center">
        <h2>
          {(
            Object.keys(score)
              .map((k) => score[k])
              .reduce((a, b) => a + b, 0) / 4
          ).toFixed(2)}
        </h2>
        <p>Pound Score</p>
      </div>
    </div>
  );
};

const PillarDetails = ({ pillar }: { pillar: pillar }) => {
  const today = new Date().toLocaleDateString("en-US");
  const data = useSelector((state: any) => state[pillar.name]?.data?.[today]);

  const tasks = data?.tasks?.filter((task: any) =>
    pillar.subFields.includes(task.tag?.toLowerCase())
  );
  const metrics = !tasks && data;

  return (
    <div className="info">
      {/* <div className="cont">
        <h3>{pillar.name === "game" ? "gaming" : pillar.name}</h3>
        {pillar.img}
      </div> */}

      {pillar.subFields.map((field, index) => {
        return (
          <PillarInfo
            id={index.toString()}
            title={field}
            tasks={tasks}
            metrics={metrics[field.replace(" ", "")] || []}
            pillar={pillar.name}
          />
        );
      })}
    </div>
  );
};

const Pillars = () => {
  const [pillar, setPillar] = useState(pillars[0]);

  // Fetch when pillar changes

  return (
    <div className="_pillars w-full flex justify-between flex-1 gap-2 relative screen">
      <h2>
        performance pillars <DailyXP />
      </h2>
      <div className="wheel">
        <PillarWheel
          pillars={pillars}
          setPillar={setPillar}
          currentPillar={pillar}
        />
      </div>
      <PillarDetails pillar={pillar} />
    </div>
  );
};

export default Pillars;
