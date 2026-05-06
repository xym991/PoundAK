// store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import routerReducer from "./routerSlice";
import eventReducer from "./eventSlice";
import infoReducer from "./infoSlice";
import fitnessReducer from "./fitnessSlice";
import lifestyleReducer from "./lifestyleSlice";
import mentalReducer from "./mentalSlice";
import gameReducer, { previewGame } from "./gameSlice";
import volumeReducer from "./volumeSlice";
import chatReducer from "./chatSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const RESET_APP = "RESET_APP";
const SET_PREVIEW_STATE = "SET_PREVIEW_STATE";

const appReducer = combineReducers({
  user: userReducer,
  router: routerReducer,
  events: eventReducer,
  gameInfo: infoReducer,
  fitness: fitnessReducer,
  lifestyle: lifestyleReducer,
  mental: mentalReducer,
  game: gameReducer,
  volume: volumeReducer,
  chat: chatReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_APP) {
    storage.removeItem("persist:root");
    state = undefined;
  }
  if (action.type === SET_PREVIEW_STATE) {
    return {
      ...state,
      game: previewGame(),
      chat: {
        sync: true,
        [new Date().toLocaleDateString("en-US")]: [
          {
            sender: "You",
            text: "Help me build a pre-game routine.",
          },
          {
            sender: "Coach",
            text: `<h2>Building a Pre-Game Routine for Marvel Rivals</h2>
      
      <p>To help you get ready for your Marvel Rivals matches, let's create a personalized pre-game routine that suits your needs.</p>
      
      <h3>Step 1: Assess Your Current Habits</h3>
      <p>Since you haven't logged any game stats or activities yet, we'll start from scratch. You mentioned you're not active, so we'll focus on simple, manageable steps to get you ready for gaming.</p>
      
      <h3>Step 2: Warm-Up and Focus Exercises</h3>
      <ul>
        <li>Start with a 5-10 minute warm-up session: stretching or light cardio to get your blood flowing.</li>
        <li>Practice deep breathing exercises to calm your nerves and improve focus.</li>
        <li>Visualize your gameplay: imagine yourself playing well, making quick decisions, and reacting fast.</li>
      </ul>
      
      <h3>Step 3: Pre-Game Checklist</h3>
      <ul>
        <li>Ensure your gaming setup is ready: comfortable seating, proper lighting, and a stable internet connection.</li>
        <li>Review your Marvel Rivals strategy and character picks.</li>
        <li>Set a specific goal for your next match, such as improving your reaction time or mastering a new character.</li>
      </ul>
      
      <h3>Step 4: Consistency is Key</h3>
      <p>Stick to your pre-game routine consistently, even on non-gaming days, to develop a habit. As you progress, you can adjust and refine your routine based on your performance and comfort level.</p>
      
      <p>Let's get started with this routine and track your progress. I'll be here to support you.</p>`,
          },
        ],
        timestamp: 1750865222847,
      },
      fitness: {
        name: "fitness",
        description: "Track the physical grind, log today’s training effort.",
        data: {
          [new Date().toLocaleDateString("en-US")]: {
            value: "0%",
            tasks: [
              {
                value: "0.1%",
                xp: 0,
                id: "training type",
                multiple: true,
                text: "What type of training quest did you complete today? (Select all that apply)",
                options: [
                  {
                    label: "Strength",
                    tooltip:
                      "e.g., running, cycling – Built up stamina for the long haul.",
                    value: "0%",
                    selected: true,
                  },
                  {
                    label: "Endurance",
                    tooltip:
                      "e.g., push-ups, squats – Powered up with resistance and muscle work.",
                    value: "0%",
                    selected: false,
                  },
                  {
                    label: "Flexibility",
                    tooltip:
                      "e.g., stretching, yoga – Improved mobility and cooldown",
                    value: "0%",
                    selected: true,
                  },
                  {
                    label: "Rest Day",
                    tooltip: "Took a break – no activities completed today.",
                    value: "100000%",
                    clear: true,
                  },
                ],
                taskDependency: "",
                timeDependency: "",
              },
              {
                tag: "strength",
                value: "30%",
                xp: 200,
                id: "strength duration",
                text: "How many minutes did you engage in strength activities today?",
                tooltip:
                  "Think about how much time you actually put in—how long did you stay active?",
                locked: false,
                condition: "complete training type to unlock",
                options: [
                  {
                    label: "Short",
                    tooltip:
                      "Quick warm-up – Just a short session, barely got started.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Moderate",
                    tooltip:
                      "Solid session – Got moving and put in a reasonable effort.",
                    value: "60%",
                    selected: true,
                  },
                  {
                    label: "Long",
                    tooltip:
                      "Focused training – Committed time, made real progress.",
                    value: "100%",
                    selected: false,
                  },
                ],
                taskDependency: "training type~strength",
                timeDependency: "",
                rendered: true,
              },
              {
                tag: "strength",
                value: "50%",
                xp: 200,
                id: "strength intensity",
                text: "What is the RPE (Rate of Perceived Exertion) of your strength training today?",
                tooltip:
                  "Think about how much effort you had to put in—how hard did you push?",
                locked: false,
                condition: "complete training duration to unlock",
                options: [
                  {
                    label: "Light",
                    tooltip: "Barely broke a sweat, felt super easy.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Moderate",
                    tooltip: "Took some effort, but stayed in control.",
                    value: "60%",
                    selected: true,
                  },
                  {
                    label: "Max Effort",
                    tooltip: "Went all out, completely maxed effort.",
                    value: "100%",
                    selected: false,
                  },
                ],
                taskDependency: "training type~strength",
                timeDependency: "",
                rendered: true,
              },
              {
                tag: "strength",
                value: "20%",
                xp: 100,
                id: "strength recovery",
                text: "What is the RPR (Rate of Perceived Recovery) of your strength training today?",
                tooltip:
                  "Think about how quickly you felt ready to be active again after your session.",
                locked: false,
                condition: "complete training intensity to unlock",
                options: [
                  {
                    label: "Slow",
                    tooltip: "Took a long time before feeling back to normal.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Average",
                    tooltip: "Took a while, but eventually felt good to go.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Fast",
                    tooltip:
                      "Felt completely refreshed and ready for another session.",
                    value: "100%",
                    selected: true,
                  },
                ],
                taskDependency: "training type~strength",
                timeDependency: "",
                rendered: true,
              },
              {
                tag: "endurance",
                value: "30%",
                xp: 200,
                id: "endurance duration",
                text: "How many minutes did you engage in endurance activities today?",
                tooltip:
                  "Think about how much time you actually put in—how long did you stay active?",
                locked: false,
                condition: "complete training type to unlock",
                options: [
                  {
                    label: "Short",
                    tooltip:
                      "Quick warm-up – Just a short session, barely got started.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Moderate",
                    tooltip:
                      "Solid session – Got moving and put in a reasonable effort.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Long",
                    tooltip:
                      "Focused training – Committed time, made real progress.",
                    value: "100%",
                    selected: false,
                  },
                ],
                taskDependency: "training type~endurance",
                timeDependency: "",
                rendered: false,
              },
              {
                tag: "endurance",
                value: "50%",
                xp: 200,
                id: "endurance intensity",
                text: "What is the RPE (Rate of Perceived Exertion) of your endurance training today?",
                tooltip:
                  "Think about how much effort you had to put in—how hard did you push?",
                locked: false,
                condition: "complete training duration to unlock",
                options: [
                  {
                    label: "Light",
                    tooltip: "Barely broke a sweat, felt super easy.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Moderate",
                    tooltip: "Took some effort, but stayed in control.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Max Effort",
                    tooltip: "Went all out, completely maxed effort.",
                    value: "100%",
                    selected: false,
                  },
                ],
                taskDependency: "training type~endurance",
                timeDependency: "",
                rendered: false,
              },
              {
                tag: "endurance",
                value: "20%",
                xp: 100,
                id: "endurance recovery",
                text: "What is the RPR (Rate of Perceived Recovery) of your strength training today?",
                tooltip:
                  "Think about how quickly you felt ready to be active again after your session.",
                locked: false,
                condition: "complete training intensity to unlock",
                options: [
                  {
                    label: "Slow",
                    tooltip: "Took a long time before feeling back to normal.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Average",
                    tooltip: "Took a while, but eventually felt good to go.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Fast",
                    tooltip:
                      "Felt completely refreshed and ready for another session.",
                    value: "100%",
                    selected: false,
                  },
                ],
                taskDependency: "training type~endurance",
                timeDependency: "",
                rendered: false,
              },
              {
                tag: "flexibility",
                value: "30%",
                xp: 200,
                id: "flexibility duration",
                text: "How many minutes did you engage in flexibility activities today?",
                tooltip:
                  "Think about how much time you actually put in—how long did you stay active?",
                locked: false,
                condition: "complete training type to unlock",
                options: [
                  {
                    label: "Short",
                    tooltip:
                      "Quick warm-up – Just a short session, barely got started.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Moderate",
                    tooltip:
                      "Solid session – Got moving and put in a reasonable effort.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Long",
                    tooltip:
                      "Focused training – Committed time, made real progress.",
                    value: "100%",
                    selected: true,
                  },
                ],
                taskDependency: "training type~flexibility",
                timeDependency: "",
                rendered: true,
              },
              {
                tag: "flexibility",
                value: "50%",
                xp: 200,
                id: "flexibility intensity",
                text: "What is the RPE (Rate of Perceived Exertion) of your flexibility training today?",
                tooltip:
                  "Think about how much effort you had to put in—how hard did you push?",
                locked: false,
                condition: "complete training duration to unlock",
                options: [
                  {
                    label: "Light",
                    tooltip: "Barely broke a sweat, felt super easy.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Moderate",
                    tooltip: "Took some effort, but stayed in control.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Max Effort",
                    tooltip: "Went all out, completely maxed effort.",
                    value: "100%",
                    selected: true,
                  },
                ],
                taskDependency: "training type~flexibility",
                timeDependency: "",
                rendered: true,
              },
              {
                tag: "flexibility",
                value: "20%",
                xp: 100,
                id: "flexibility recovery",
                text: "What is the RPR (Rate of Perceived Recovery) of your flexibility training today?",
                tooltip:
                  "Think about how quickly you felt ready to be active again after your session.",
                locked: false,
                condition: "complete training intensity to unlock",
                options: [
                  {
                    label: "Slow",
                    tooltip: "Took a long time before feeling back to normal.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Average",
                    tooltip: "Took a while, but eventually felt good to go.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Fast",
                    tooltip:
                      "Felt completely refreshed and ready for another session.",
                    value: "100%",
                    selected: true,
                  },
                ],
                taskDependency: "training type~flexibility",
                timeDependency: "",
                rendered: true,
              },
            ],
          },
        },
        timestamp: 1750865582376,
        sync: true,
      },
      lifestyle: {
        name: "lifestyle",
        description: "Gauge your sleep, nutrition, and hydration.",
        data: {
          [new Date().toLocaleDateString("en-US")]: {
            value: "0%",
            tasks: [
              {
                tag: "sleep",
                value: "20%",
                xp: 100,
                id: "sleep duration",
                text: "How many hours of sleep did you get last night?",
                tooltip:
                  "Think about how quickly you felt ready to be active again after your session.",
                options: [
                  {
                    label: "Low",
                    tooltip:
                      "≤5 hrs Running on fumes—nowhere near enough sleep.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Moderate",
                    tooltip:
                      "5-7 hrs Got some rest, but not quite enough to feel fully recharged.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Optimal",
                    tooltip: "7+ hrs Fully recharged and ready to go.",
                    value: "100%",
                    selected: true,
                  },
                ],
                taskDependency: "",
                timeDependency: "",
              },
              {
                tag: "sleep",
                value: "20%",
                xp: 100,
                id: "sleep quality",
                text: "What is the RPR (Rate of Perceived Recovery) of your flexibility training today?",
                tooltip:
                  "Think about how refreshed you felt, not just how long you slept.",
                locked: false,
                condition: "complete sleep duration to unlock",
                options: [
                  {
                    label: "Exhausted",
                    tooltip: "Still tired, needed way more rest.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Grinder",
                    tooltip: "Functional, but not feeling great.",
                    value: "60%",
                    selected: true,
                  },
                  {
                    label: "Refreshed ",
                    tooltip: "Fully rested and ready to go.",
                    value: "100%",
                    selected: false,
                  },
                ],
                taskDependency: "",
                timeDependency: "",
              },
              {
                tag: "nutrition",
                value: "20%",
                xp: 100,
                id: "fuel quantity",
                text: "How well did you fuel your body today?",
                tooltip:
                  "Think about your meals—did you eat balanced meals, or just grab whatever was convenient?",
                options: [
                  {
                    label: "Low",
                    tooltip: " Ate too little, likely under your energy needs.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Moderate",
                    tooltip:
                      "Ate a decent amount, but might not have fully met your energy needs.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Optimal",
                    tooltip:
                      "Ate enough to meet your energy needs for the day.",
                    value: "100%",
                    selected: true,
                  },
                ],
                taskDependency: "",
                timeDependency: "",
              },
              {
                tag: "nutrition",
                value: "20%",
                xp: 100,
                id: "fuel quality",
                text: "How balanced was your energy intake today?",
                tooltip:
                  "Think about the quality of your meals—did you eat in a way that kept your energy steady?",
                locked: false,
                condition: "complete nutrition quantity to unlock",
                options: [
                  {
                    label: "Unbalanced",
                    tooltip:
                      "Mostly processed or junk foods, leading to energy crashes.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Mixed",
                    tooltip:
                      "Some balanced meals, but still included processed or unbalanced choices.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Balanced ",
                    tooltip:
                      "Mostly whole foods, keeping energy steady throughout the day.",
                    value: "100%",
                    selected: false,
                  },
                ],
                taskDependency: "fuel quantity",
                timeDependency: "",
                rendered: true,
              },
              {
                tag: "hydration",
                value: "20%",
                xp: 100,
                id: "hydration quantity",
                text: "How much water did you consume today?",
                tooltip:
                  "Think about whether you drank enough water to stay hydrated.",
                options: [
                  {
                    label: "Low",
                    tooltip:
                      "Barely drank any water—feeling sluggish or dehydrated.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Moderate",
                    tooltip: "Had a decent amount, but could have had more.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Optimal",
                    tooltip: "Stayed fully hydrated throughout the day.",
                    value: "100%",
                    selected: false,
                  },
                ],
                taskDependency: "",
                timeDependency: "",
                rendered: true,
              },
            ],
          },
        },
        timestamp: 1750865604582,
        sync: true,
      },
      mental: {
        name: "mental",
        description: "How sharp, stable, and focused were you today?",
        data: {
          [new Date().toLocaleDateString("en-US")]: {
            value: "0%",
            tasks: [
              {
                tag: "focus",
                value: "50%",
                xp: 100,
                id: "focus",
                text: "How focused were you throughout the day?",
                tooltip:
                  "Think about how well you maintained attention and avoided distractions.",
                options: [
                  {
                    label: "Scattered",
                    tooltip: "Easily distracted, struggled to stay focused.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Variable",
                    tooltip: "Some moments of focus, but inconsistent.",
                    value: "60%",
                    selected: true,
                  },
                  {
                    label: "Locked In",
                    tooltip: "Fully engaged, minimal distractions.",
                    value: "100%",
                    selected: false,
                  },
                ],
                taskDependency: "",
                timeDependency: "",
              },
              {
                tag: "stress",
                value: "30%",
                xp: 200,
                id: "stress",
                text: "How stressed were you throughout the day??",
                tooltip:
                  "Think about how much pressure, tension, or overwhelm you experienced.",
                options: [
                  {
                    label: "Scattered",
                    tooltip:
                      "Constant stress, felt overwhelmed most of the day.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Variable",
                    tooltip: " Had some stress, but handled it okay.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Locked In",
                    tooltip: "Felt relaxed and in control throughout the day.",
                    value: "100%",
                    selected: true,
                  },
                ],
                taskDependency: "",
                timeDependency: "",
              },
              {
                tag: "cognition",
                value: "20%",
                xp: 200,
                id: "cognition",
                text: "How sharp was your thinking today?",
                tooltip:
                  "Think about your mental clarity, memory, and ability to process information.",
                locked: false,
                condition: "complete nutrition quantity to unlock",
                options: [
                  {
                    label: "Foggy",
                    tooltip:
                      "Struggled with recall, slow thinking, or mental fatigue.",
                    value: "30%",
                    selected: false,
                  },
                  {
                    label: "Functional",
                    tooltip:
                      "Thought clearly most of the time, but had some lapses.",
                    value: "60%",
                    selected: false,
                  },
                  {
                    label: "Sharp",
                    tooltip:
                      "Quick thinking, strong memory, and high mental clarity.",
                    value: "100%",
                    selected: true,
                  },
                ],
                taskDependency: "stress",
                timeDependency: "",
                rendered: true,
              },
            ],
          },
        },
        timestamp: 1750865606098,
        sync: true,
      },
    };
  }

  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["events", "gameInfo", "router"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;

export const resetApp = () => ({ type: RESET_APP });
export const setPreviewState = () => ({
  type: SET_PREVIEW_STATE,
});
