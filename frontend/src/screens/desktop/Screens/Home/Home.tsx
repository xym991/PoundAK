// Home.tsx
import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import person from "@/assets/images/person.png";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Gaming from "../../../../assets/images/pillars/Pillar-Gaming-Icon.svg";
import Fitness from "../../../../assets/images/pillars/Pillar-Fitness-Icon.svg";
import Lifestyle from "../../../../assets/images/pillars/Pillar-Lifestyle-Icon.svg";
import Mental from "../../../../assets/images/pillars/Pillar-Mental-Icon.svg";
import ArrowDropUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import ArrowDropDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import wallet1 from "@/assets/images/wallet/wallet1.png";
import wallet2 from "@/assets/images/wallet/wallet2.png";
import calculateTotal from "@/utils/calculateTrackTotal";
import cn from "@/utils/classname";
import { setTab } from "@/state/routerSlice";
import usePlayerContext from "@/screens/background/hooks/usePlayerContext";
import done from "@/assets/images/home/done.png";
import WorkoutCard from "./WorkoutCard";
import StatCard from "./StatCard";
import TaskItem from "./TaskItem";
import Badges from "./Badges";

export function DailyXP() {
  const dispatch = useDispatch();
  const fitness = useSelector((state: any) => state.fitness);
  const mental = useSelector((state: any) => state.mental);
  const lifestyle = useSelector((state: any) => state.lifestyle);
  const today = new Date().toLocaleDateString("en-US");

  return (
    <div
      className="xp-gained flex items-start flex-col text-xs text-[#999] font-semibold"
      onClick={() => dispatch(setTab("wallet"))}
    >
      <p style={{ fontWeight: "600" }}>XP gained today</p>
      <span className="flex gap-2 items-center text-xl text-white font-normal">
        {calculateTotal(lifestyle?.data?.[today], true) +
          calculateTotal(fitness?.data?.[today], true, "fitness") +
          calculateTotal(mental?.data?.[today], true)}
        /1500
        <span className="icon">
          <Image
            src={wallet2}
            alt="wallet"
            height={24}
            width={24}
            className="relative top-[-2px] mx-[-2px]"
          />
        </span>
      </span>
    </div>
  );
}
const Home = () => {
  const fitness = useSelector((state: any) => state.fitness);
  const mental = useSelector((state: any) => state.mental);
  const lifestyle = useSelector((state: any) => state.lifestyle);
  const game = useSelector((state: any) => state.game);
  const user = useSelector((state: any) => state.user);
  const [userImage, setUserImage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    window?.overwolf?.profile.getCurrentUser((result) => {
      if (result && result.success) {
        const user = result;
        setUsername(result.username || "Player");
        if (user && user.avatar) {
          setUserImage(user.avatar);
        } else {
          console.error("User avatar not found");
        }
      } else {
        console.error("Failed to get game info:", result);
      }
    });
  }, []);
  const today = new Date().toLocaleDateString("en-US");
  const dispatch = useDispatch();
  const workouts = [
    {
      title: "Pre Game Pump",
      duration: "10 min",
      xp: 15,
      tokens: 3,
      icon1: wallet1,
      icon2: wallet2,
      description:
        "A quick full-body warm-up to boost circulation, elevate heart rate, and mentally lock you in.",
      recommended: false,
    },
    {
      title: "Tactical Timeout",
      duration: "5 min",
      xp: 10,
      tokens: 2,
      icon1: wallet1,
      icon2: wallet2,
      description:
        "A strategic break that targets tension in your neck, wrists, and back for peak endurance.",
    },
    {
      title: "AFK Mobility",
      duration: "8 min",
      xp: 20,
      tokens: 4,
      icon1: wallet1,
      icon2: wallet2,
      description:
        "For when you're away from keyboard — light movement to keep blood flowing.",
    },
  ];

  return (
    <div className="_dashboard screen flex flex-col gap-4 relative">
      <div className="user-bar">
        <span className="username flex items-center gap-2">
          <Image
            src={user?.info?.image || userImage || person}
            alt="profile"
            height={40}
            width={40}
            style={{
              borderRadius: "50%",
              border: "2px solid #454545",
              objectFit: "cover",
              height: "40px",
              width: "40px",
            }}
          />
          @{user?.info?.playerTag || username}{" "}
          <Badges badges={user?.badges || []} />
        </span>
        <DailyXP />
      </div>

      <div className="section-row flex gap-4">
        <div className="pillars">
          <div className="section-title">PERFORMANCE PILLAR SNAPSHOT</div>
          <div className="pillar-cards">
            <StatCard
              icon={<Gaming />}
              title="Gaming"
              value="78"
              subtext="Accuracy improved by 12%"
            />
            <StatCard
              icon={<Fitness />}
              title="Fitness"
              value="65"
              subtext="Calories burned 360 kcal"
            />
            <StatCard
              icon={<Mental />}
              title="Mental"
              value="82"
              subtext="Focus duration: 42 min"
            />
            <StatCard
              icon={<Lifestyle />}
              title="Lifestyle"
              value="74"
              subtext="Sleep quality improved"
            />
          </div>
        </div>

        <div className="track">
          <div className="section-title">PERFORMANCE TRACK</div>
          <div
            className="task-list stat-card"
            onClick={() => dispatch(setTab("track"))}
          >
            <TaskItem
              name="Log your training"
              xp="500"
              completed={fitness?.data[today]?.tasks?.[0]?.options.reduce(
                (acc: any, op: any) => acc || op?.selected,
                false
              )}
            />
            <TaskItem
              name="Gauge your recovery"
              xp="200"
              completed={fitness?.data[today]?.tasks
                ?.filter((t: any) => t.id.includes("recovery"))
                .flatMap((t: any) => t.options)
                ?.reduce((acc: any, op: any) => acc || op?.selected, false)}
            />
            <TaskItem
              name="Measure hydration"
              xp="100"
              completed={lifestyle?.data[today]?.tasks
                ?.filter((t: any) => t.id.includes("hydration"))?.[0]
                ?.options?.reduce(
                  (acc: any, op: any) => acc || op?.selected,
                  false
                )}
            />
            <TaskItem
              name="Check your focus"
              xp="100"
              completed={mental?.data[today]?.tasks
                ?.filter((t: any) => t.id.includes("focus"))?.[0]
                ?.options?.reduce(
                  (acc: any, op: any) => acc || op?.selected,
                  false
                )}
            />
          </div>
          {/* <a
            href="#"
            className="view-tasks ml-auto w-fit block font-normal"
            onClick={() => dispatch(setTab("track"))}
          >
            View All Tasks
          </a> */}
        </div>
      </div>

      <div className="workout-section">
        <div className="workout-header">
          <span className="section-title">WORKOUT STREAM</span>
          <a href="#" className="browse-link">
            Browse All Workouts
          </a>
        </div>
        <div className="workout-row">
          {workouts.map((w, index) => (
            <WorkoutCard
              key={index}
              // recommended={w.recommended}
              title={w.title}
              duration={w.duration}
              xp={w.xp}
              tokens={w.tokens}
              icon1={w.icon1}
              icon2={w.icon2}
              description={w.description}
              locked={
                <div className="flex gap-1 w-full justify-center items-center flex-wrap">
                  Reach <div className="tag">TETRA Level</div> to unlock
                </div>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
