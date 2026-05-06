/* ally */ import {
  FC,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import useGameState from "@/hooks/useGameState";
import paths from "@/utils/routes";
import axios from "@/utils/axios";
import { useSelector } from "react-redux";
import useLocalStorageListener from "@/hooks/useLocalStorageListener";
import "./index.css";
import usePlayerContext from "@/screens/background/hooks/usePlayerContext";
import { localStorageService } from "@/services/localStorageService";
import Coach from "../../../public/icons/IconMouseOver.png";
import useReaction from "./useReaction";
import tacticalIQ from "./calculateTacticalIQ";
import calculateTacticalIQ from "./calculateTacticalIQ";
import useAdaptability from "./useAdaptability";

//ts-nocheck

const GameStateView: FC = () => {
  const game = useSelector((state: any) => state?.game?.game);
  const gameState: any = useGameState();

  const [insights, setInsights] = useState<any[]>([]);

  const playerContext = usePlayerContext();
  const [matchStartTimestamp, setMatchStartTimestamp] = useState<number | null>(
    null
  );

  const eventsRef = useRef(0);
  const timestamp = useRef(Date.now());

  const notifications: any = JSON.parse(
    localStorage.getItem("notifications") || "{}"
  );
  const { reaction, clearReaction } = useReaction(gameState);
  const [tacticalIQ, setTacticalIQ] = useState<any>(null);
  const calculateAdaptability = useAdaptability(
    gameState?.match_info,
    matchStartTimestamp
  );
  const [practice, setPractice] = useState<any>(null);

  useEffect(() => {
    if (!gameState?.match_info?.game_type) return;
    if (practice === null) {
      if (gameState?.match_info?.game_type?.toLowerCase() === "practice")
        setPractice(true);
      if (gameState?.match_info?.game_type?.toLowerCase() !== "practice")
        setPractice(false);
    }
  }, [gameState?.match_info]);
  useEffect(() => {
    if (
      !gameState?.match_info?.game_type === null ||
      tacticalIQ ||
      !matchStartTimestamp
    )
      return;

    setTacticalIQ(
      calculateTacticalIQ(
        gameState?.match_info,
        Math.floor((Date.now() - (matchStartTimestamp || 0)) / 1000)
      )
    );
  }, [gameState?.match_info, matchStartTimestamp, tacticalIQ]);

  useEffect(() => {
    if (!reaction || !tacticalIQ) return;

    !practice &&
      localStorageService.setItem(
        "game_metrics",
        JSON.stringify({
          reaction,
          tacticalIQ,
          adaptability: calculateAdaptability(Date.now()),
        })
      );
    clearReaction();
    setTacticalIQ(null);
    setMatchStartTimestamp(null);
    setPractice(null);
  }, [reaction, tacticalIQ]);
  const fetchInsights = useCallback(
    async (recent_events: any) => {
      if (notifications["In-Game Insight"] !== "Enabled") return;
      try {
        const res = await axios.post(paths.matchInsight, {
          game: game,

          matchInfo: gameState?.match_info,
          events: recent_events,
          playerData: playerContext.user,
        });

        const id = Date.now();
        setInsights((prev) => [
          ...prev,
          {
            id,
            message: (
              <p
                dangerouslySetInnerHTML={{
                  __html: res.data.message
                    .split("~")
                    .map((line: string) => {
                      return `<p>${line}</p>`;
                    })
                    .join(""),
                }}
              ></p>
            ),
            title: "In-Game Insight",
          },
        ]);

        setTimeout(() => {
          setInsights((prev) => prev.filter((insight) => insight.id !== id));
        }, 6000);
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    },
    [game, gameState, playerContext]
  );

  const fetchPreGameInsight = useCallback(
    async (events: any) => {
      if (!matchStartTimestamp) setMatchStartTimestamp(Date.now());

      if (notifications["Pre-Game Power Up"] !== "Enabled") return;

      try {
        const res = await axios.post(paths.preGame, {
          game: game,

          matchInfo: gameState?.match_info,
          events,

          playerData: playerContext,
        });

        const id = Date.now();
        setInsights((prev) => [
          ...prev,
          {
            id,
            message: (
              <p
                dangerouslySetInnerHTML={{
                  __html: res.data.message
                    .split("~")
                    .map((line: string) => {
                      return `<p>${line}</p>`;
                    })
                    .join(""),
                }}
              ></p>
            ),
            title: "Pre-Game Power Up",
          },
        ]);

        setTimeout(() => {
          setInsights((prev) => prev.filter((insight) => insight.id !== id));
        }, 12000);
      } catch (error) {
        console.error("Error fetching pre-game insight:", error);
      }
    },
    [game, playerContext, gameState]
  );

  const fetchPostGameInsight = useCallback(
    async (events: any) => {
      if (notifications["Post-Game Play Call"] !== "Enabled") return;

      try {
        const res = await axios.post(paths.postGame, {
          game: game,
          matchInfo: gameState?.match_info,
          events,

          playerData: playerContext,
        });

        const id = Date.now();
        setInsights((prev) => [
          ...prev,
          {
            id,
            message: (
              <p
                dangerouslySetInnerHTML={{
                  __html: res.data.message
                    .split("~")
                    .map((line: string) => {
                      return `<p>${line}</p>`;
                    })
                    .join(""),
                }}
              ></p>
            ),
            title: "Post-Game Play Call",
          },
        ]);

        setTimeout(() => {
          setInsights((prev) => prev.filter((insight) => insight.id !== id));
        }, 12000);
      } catch (error) {
        console.error("Error fetching post-game insight:", error);
      }
    },
    [game, playerContext, gameState]
  );

  useLocalStorageListener(
    "death",
    (current: any, prev) => {
      if (practice) return;
      if (!current) return;
      let events = JSON.parse(localStorage.getItem("events") || "[]");
      if (!events?.length) return;
      if (timestamp.current + 5000 > Date.now()) return;

      fetchInsights(events.slice(Math.max(events.length - 10, 0)));
      eventsRef.current = events.length;
      timestamp.current = Date.now();
      localStorage.setItem("death", "");
    },
    [fetchInsights, timestamp]
  );

  useLocalStorageListener(
    "is_in_match",
    (current, prev) => {
      if (practice) return;
      if (Boolean(current)) {
      } else if (!Boolean(current)) {
        const events = JSON.parse(localStorage.getItem("events") || "[]");
        fetchPostGameInsight(events.slice(Math.max(events.length - 10, 0)));
        localStorage.setItem("events", "[]");
      }
    },
    [fetchPostGameInsight]
  );
  useLocalStorageListener(
    "round_start",
    (curr) => {
      if (practice) return;
      if (curr) {
        const events = JSON.parse(localStorage.getItem("events") || "[]");
        fetchPreGameInsight(events.slice(Math.max(events.length - 10, 0)));
        localStorageService.setItem("round_start", "");
      }
    },
    [fetchPreGameInsight]
  );

  return (
    <>
      {insights.length && (
        <div className="game-state-view">
          <AnimatePresence>
            {insights?.map(({ id, title, message }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.8 }}
                className="insight-message"
              >
                <div className="insight-avatar">
                  <img
                    src={Coach.src}
                    alt="Coach Avatar"
                    className="coach-avatar"
                  />
                  <div>
                    <div className="coach-header">
                      <span className="coach-label">COACH</span>
                    </div>

                    <h3 className="text-green-500 text-sm mb-10 block">
                      {title}
                    </h3>
                  </div>
                </div>

                <div className="message-content">{message}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default GameStateView;
