import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function compressTasks(tasks: any) {
  const compressed: any = {};
  for (let task of tasks) {
    for (let option of task.options) {
      if (option.selected) {
        compressed[task.text] =
          (compressed[task.text] || "") + option.label + ", ";
      }
    }
  }
  return compressed;
}

function compressUser(user: any) {
  if (!user || typeof user !== "object") return {};
  const compressed = { ...user, ...user?.info, ...user?.metrics };
  delete compressed?.email;
  delete compressed?._id;
  delete compressed?.createdAt, delete compressed?.updatedAt;
  delete compressed?.__v;
  return compressed;
}

function compressGame(arg: any) {
  if (!arg || typeof arg !== "object") return {};
  const game = { ...arg };
  // delete game.image;
  // const today = new Date().toLocaleDateString("en-US");
  // const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-US");
  // game.stats = {
  //   [today]: [
  //     ...(
  //       game.stats?.[today]?.slice(
  //         Math.max(0, game.stats?.[today]?.length - 10)
  //       ) || []
  //     )?.map((i: any) => {
  //       const stats = { ...i, ...i?.meta };
  //       delete stats.meta;
  //       return stats;
  //     }),
  //   ],
  //   [yesterday]: [
  //     ...(
  //       game.stats?.[yesterday]?.slice(
  //         Math.max(0, game.stats?.[yesterday]?.length - 10)
  //       ) || []
  //     )?.map((i: any) => {
  //       const stats = { ...i, ...i?.meta };
  //       delete stats.meta;
  //       return stats;
  //     }),
  //   ],
  // };

  return game;
}

export default function usePlayerContext() {
  const [state, setState] = useState<any>(null);
  const previous = useRef<any>(null);
  const today = new Date().toLocaleDateString("en-US");
  useEffect(() => {
    const fetchAndUpdate = () => {
      try {
        const persisted = localStorage.getItem("persist:root");
        if (!persisted) return;

        const root = JSON.parse(persisted);
        // console.log("root", root);
        const game = compressGame(JSON.parse(root.game || "{}"));
        // console.log("game", game);
        const lifestyle = {
          ...compressTasks(
            JSON.parse(root.lifestyle || "{}")?.data?.[today]?.tasks
          ),
        };
        // console.log("lifestyle", lifestyle);
        const fitness = {
          ...compressTasks(
            JSON.parse(root.fitness || "{}")?.data?.[today]?.tasks
          ),
        };
        // console.log("fitness", fitness);
        const mental = {
          ...compressTasks(
            JSON.parse(root.mental || "{}")?.data?.[today]?.tasks
          ),
        };
        // console.log('mental', mental);
        const user = compressUser(JSON.parse(root.user || "{}"));
        // console.log('user', user);

        const newState = { game, lifestyle, fitness, mental, user };

        if (JSON.stringify(previous.current) !== JSON.stringify(newState)) {
          previous.current = newState;
          setState(newState);
        }
      } catch (err) {
        console.error("Failed to read persisted state:", err);
      }
    };

    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 10000);

    return () => clearInterval(interval);
  }, []);

  return state;
}
