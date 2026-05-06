declare global {
  interface Window {
    OwAd: any;
  }
}

import { useCallback, useEffect, useState } from "react";

import Pillars from "./Screens/Pillars/Pillars";
import TallLeft from "@/components/AdWindow/TallLeft";
import Back from "@/components/Back";
import FatRight from "@/components/AdWindow/FatRight";
import "./index.css";
import WideBottom from "@/components/AdWindow/WideBottom";
import Stats from "./Screens/Stats/Stats";
import Track from "./Screens/Track/Track";
import Settings from "./Screens/Settings/Settings";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@/components/Modal/Modal";
import Login from "../../components/Login/Login";
import Register from "@/components/Login/Register";
import Nav from "./header/Nav/index";
import Wallet from "./Screens/Wallet";
import axios from "@/utils/axios";
import paths from "@/utils/routes";
import { setUser } from "@/state/userSlice";
import Journal from "./Screens/Journal/Journal";
import useLocalStorageListener from "@/hooks/useLocalStorageListener";
import {
  changeGame,
  createDates,
  fetchGame,
  revertMetrics,
  syncGame,
  updateMetrics,
  updateStats,
} from "@/state/gameSlice";
import { fetchFitness, revert1, syncFitness } from "@/state/fitnessSlice";
import { fetchMental, revert3, syncMental } from "@/state/mentalSlice";
import { fetchLifestyle, revert2, syncLifestyle } from "@/state/lifestyleSlice";
import Preferences from "./Screens/Settings/Preferences";
import { setPortal } from "@/state/routerSlice";
import Profile from "./Screens/Settings/Profile";
import Options from "./Screens/Options/Options";
import NarrowBottom from "@/components/AdWindow/NarrowBottom";
import AdFree from "@/components/AdWindow/AdFree";
import Home from "./Screens/Home/Home";
import syncAll from "@/utils/syncAll";
import { resetApp } from "@/state/store";
import ForgotPassword from "@/components/Login/ForgotPassword";
import Exchange from "./Screens/Exchange/Exchange";
import Welcome from "@/components/welcome/Welcome";
import { localStorageService } from "@/services/localStorageService";

const screens: any = {
  home: <Home />,
  pillars: <Pillars />,
  stats: <Stats />,
  track: <Track />,
  journal: <Journal />,

  settings: <Settings />,
  wallet: <Wallet />,
  exchange: <Exchange />,
};
export const tabs = Object.keys(screens).slice(0, 5);
const Left = () => (
  <div className="left flex flex-col justify-center items-center">
    <TallLeft></TallLeft>
    <Back></Back>
  </div>
);

const Mid = () => {
  const tab = useSelector((state: any) => state.router.tab);
  return (
    <div className="mid flex flex-col gap-2 flex-1 relative">
      <Nav></Nav>
      <div className="relative w-ful flex-1">
        <div id="portal"></div>
        {screens[tab.split("|")[0]]}
      </div>

      <WideBottom></WideBottom>
    </div>
  );
};

const Right = () => (
  <div className="right relative">
    <div>
      <NarrowBottom />
      <AdFree />
    </div>
    <FatRight></FatRight>
  </div>
);

const RL = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const fitness = useSelector((state: any) => state.fitness);
  const mental = useSelector((state: any) => state.mental);
  const lifestyle = useSelector((state: any) => state.lifestyle);
  const game = useSelector((state: any) => state.game);
  const chat = useSelector((state: any) => state.chat);
  const [today, setToday] = useState(new Date().toLocaleDateString("en-US"));

  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date().toLocaleDateString("en-US");
      if (current !== today) setToday(current);
    }, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, [today]);

  useEffect(() => {
    if (Object.keys(game.stats).length < 7) {
      dispatch(createDates());
    }
    let today = new Date().toLocaleDateString("en-US");

    if (!lifestyle?.data?.[today]) {
      dispatch(revert2());
    }

    if (!mental?.data?.[today]) {
      dispatch(revert3());
    }

    if (!fitness?.data?.[today]) {
      dispatch(revert1());
    }

    if (!game?.data?.[today]) {
      dispatch(revertMetrics());
    }
  }, [today, lifestyle.data, mental.data, fitness.data, game?.data, user?._id]);
  useEffect(() => {
    if (!user?._id) return;
    syncAll({ user, game, fitness, mental, lifestyle, chat });
  }, [user?._id]);

  useEffect(() => {
    overwolf?.extensions?.current?.generateUserEmailHashes(
      user?.email,
      console.log
    );
  }, [user?.email]);
  useLocalStorageListener("login-token", async (token: any) => {
    if (!token) return;
    if (localStorage.getItem("preview")) {
      dispatch(resetApp());
      dispatch(createDates());
    }
    dispatch(setPortal(""));
    await axios
      .get(paths.user)
      .then((res) => {
        if (res.data.status == "error") {
          localStorage.removeItem("token");
          dispatch(setPortal("login"));
        } else {
          dispatch(setUser(res.data));
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        localStorage.removeItem("token");
        dispatch(setPortal("login"));
      });

    localStorage.setItem("login-token", "");
  });

  useLocalStorageListener("register-token", (token: any) => {
    if (!token) return;
    if (localStorage.getItem("preview")) {
      dispatch(resetApp());
      dispatch(createDates());
    }
    axios
      .get(paths.user)
      .then((res) => {
        if (res.data.status == "error") {
          localStorage.removeItem("token");
          dispatch(setPortal("login"));
        } else {
          dispatch(setUser(res.data));

          dispatch(setPortal("preferences"));
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        dispatch(setPortal("login"));
      });
    localStorage.setItem("register-token", "");
  });

  useLocalStorageListener("logout", async (current, prev) => {
    if (current == "true") {
      // console.log("logging out");
      await syncAll({ user, game, fitness, mental, lifestyle, chat });
      dispatch(resetApp());
      localStorage.setItem("logout", "");
      localStorage.setItem("token", "");
      localStorage.setItem("prev_track", "");
      dispatch(createDates());
      dispatch(setPortal("login"));
      // overwolf.extensions.relaunch();
    }
  });

  return <div style={{ display: "none" }}></div>;
};
export default function Main() {
  try {
    useEffect(() => {
      if (typeof window === "undefined") return;

      const initializeAds = () => {
        const adContainer = document.getElementById("fat-right-ad");
        // const adContainer1 = document.getElementById("ad_wide_bottom");
        const adContainer2 = document.getElementById("ad_tall_left");
        const adContainer3 = document.getElementById("ad_narrow_bottom");

        if (adContainer) {
          const adsScript = document.createElement("script");

          adsScript.src =
            "https://content.overwolf.com/libs/ads/latest/owads.min.js";
          adsScript.async = true;
          adsScript.onload = () => {
            const adContainer = document.getElementById("fat-right-ad");
            new window.OwAd(adContainer, {
              size: { width: 400, height: 600 },
              // testAd: true,
              block_top_window_navigation: true,
            });
            // const adContainer1 = document.getElementById("ad_wide_bottom");
            // new window.OwAd(adContainer1, {
            //   size: { width: 970, height: 90 },
            //   testAd: true,
            // });
            new window.OwAd(adContainer2, {
              size: { width: 160, height: 600 },
              // testAd: true,
            });
            new window.OwAd(adContainer3, {
              size: { width: 400, height: 60 },
              // testAd: true,
            });
          };
          adsScript.onerror = () => {
            console.error("Failed to load owads.min.js");
          };
          document.body.appendChild(adsScript);
        } else {
          console.warn("Ad container not found. Retrying...");
        }
      };

      initializeAds();
    }, []);
    const dispatch = useDispatch();
    useEffect(() => {
      if (!localStorage.getItem("token")) {
        dispatch(setPortal("login"));
        return;
      }
      axios
        .get(paths.user)
        .then((res) => {
          if (res.data.status == "error") {
            localStorage.removeItem("token");
            dispatch(setPortal("login"));
          } else {
            dispatch(setUser(res.data));
          }
        })
        .catch((err) => {
          localStorage.removeItem("token");
          dispatch(setPortal("login"));
        });
    }, []);
    useLocalStorageListener("game_changed", (newValue) => {
      if (!newValue) return;
      dispatch(changeGame(newValue));
      localStorage.game_changed = null;
    });
    useLocalStorageListener("_game", (_game: any) => {
      //console.log("received", JSON.parse(_game));
      if (!_game) return;
      dispatch(updateStats(JSON.parse(_game)));
      localStorage._game = null;
    });
    useLocalStorageListener("game_metrics", (game_metrics: any) => {
      if (!game_metrics) return;
      dispatch(updateMetrics(JSON.parse(game_metrics)));
      localStorage.game_metrics = null;
    });

    const router = useSelector((state) => (state as any).router);
    // Step 1: Get user profile
    return (
      <div className="text-slate-200 bg-mainBg top-0 left-0 right-0 bottom-0 absolute _screen">
        <RL />
        <div className="main flex justify-between gap-2">
          <Left />
          <Mid />
          <Right />
        </div>

        {router.portal == "login" && (
          <Modal className="no_close">
            <Login />
          </Modal>
        )}
        {router.portal == "register" && (
          <Modal>
            <Register />
          </Modal>
        )}
        {router.portal == "forgotPassword" && (
          <Modal>
            <ForgotPassword />
          </Modal>
        )}
        {router.portal == "preferences" && (
          <Modal className="no_close">
            {" "}
            <div className="_onboarding">
              <h1> Set Your Peformance Targets</h1>{" "}
              <p>These help us peronalise your XP tracking</p>
              <Preferences
                onBoarding={true}
                onSave={() => dispatch(setPortal("profile"))}
              />
            </div>
          </Modal>
        )}
        {router.portal == "profile" && (
          <Modal className="no_close">
            {" "}
            <div className="_onboarding">
              <h1>Lock in Your Player Identity</h1>{" "}
              <p>
                Complete your profile to start making Gains in Game and IRL{" "}
              </p>
              <Profile
                onBoarding={true}
                onSave={() => dispatch(setPortal("welcome"))}
              />
            </div>
          </Modal>
        )}
        {router.portal == "welcome" && (
          <Modal>
            <Welcome />
          </Modal>
        )}
        {router.portal == "options" && (
          <Modal className="_transparent _options">
            {" "}
            <Options />
          </Modal>
        )}
      </div>
    );
  } catch (err) {
    console.log(err);
  }
}
