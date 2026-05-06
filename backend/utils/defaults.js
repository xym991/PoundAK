export function percent(n) {
  if (n < 0) n = 0;
  // if (n > 100) n = 100;
  return `${n}%`;
}

const trackData = [
  {
    name: "Fitness",
    value: percent(0),
    description: `Track the physical grind, log today’s training effort.`,
    tasks: [
      {
        value: percent(0.1),
        xp: 10,
        id: "training type",
        multiple: true,
        text: `What type of training quest did you complete today? (Select all that apply)`,
        options: [
          {
            label: "Strength",
            tooltip:
              "e.g., running, cycling – Built up stamina for the long haul.",
            value: percent(0),
          },
          {
            label: "Endurance",
            tooltip:
              "e.g., push-ups, squats – Powered up with resistance and muscle work.",
            value: percent(0),
          },
          {
            label: "Flexibility",
            tooltip: "e.g., stretching, yoga – Improved mobility and cooldown",
            value: percent(0),
          },
          {
            label: "Rest Day",
            tooltip: "Took a break – no activities completed today.",
            value: percent(100000),
            clear: true,
          },
        ],
        taskDependency: "",
        timeDependency: "",
      },
      {
        tag: "strength",
        value: percent(30),
        xp: 10,
        id: "strength duration",
        text: `How many minutes did you engage in strength activities today?`,
        tooltip: `Think about how much time you actually put in—how long did you stay active?`,
        locked: false,
        condition: "complete training type to unlock",
        options: [
          {
            label: "Short",
            tooltip:
              "Quick warm-up – Just a short session, barely got started.",
            value: percent(30),
          },
          {
            label: "Moderate",
            tooltip:
              "Solid session – Got moving and put in a reasonable effort.",
            value: percent(60),
          },
          {
            label: "Long",
            tooltip: "Focused training – Committed time, made real progress.",
            value: percent(100),
          },
        ],
        taskDependency: "training type~strength",
        timeDependency: "",
      },
      {
        tag: "strength",
        value: percent(50),
        xp: 10,
        id: "strength intensity",
        text: `What is the RPE (Rate of Perceived Exertion) of your strength training today?`,
        tooltip: `Think about how much effort you had to put in—how hard did you push?`,
        locked: false,
        condition: "complete training duration to unlock",
        options: [
          {
            label: "Light",
            tooltip: "Barely broke a sweat, felt super easy.",
            value: percent(30),
          },
          {
            label: "Moderate",
            tooltip: "Took some effort, but stayed in control.",
            value: percent(60),
          },
          {
            label: "Max Effort",
            tooltip: "Went all out, completely maxed effort.",
            value: percent(100),
          },
        ],
        taskDependency: "training type~strength",
        timeDependency: "",
      },
      {
        tag: "strength",
        value: percent(20),
        xp: 10,
        id: "strength recovery",
        text: `What is the RPR (Rate of Perceived Recovery) of your strength training today?`,
        tooltip: `Think about how quickly you felt ready to be active again after your session.`,
        locked: false,
        condition: "complete training intensity to unlock",
        options: [
          {
            label: "Slow",
            tooltip: "Took a long time before feeling back to normal.",
            value: percent(30),
          },
          {
            label: "Average",
            tooltip: "Took a while, but eventually felt good to go.",
            value: percent(60),
          },
          {
            label: "Fast",
            tooltip: "Felt completely refreshed and ready for another session.",
            value: percent(100),
          },
        ],
        taskDependency: "training type~strength",
        timeDependency: "",
      },
      {
        tag: "endurance",
        value: percent(30),
        xp: 10,
        id: "endurance duration",
        text: `How many minutes did you engage in endurance activities today?`,
        tooltip: `Think about how much time you actually put in—how long did you stay active?`,
        locked: false,
        condition: "complete training type to unlock",
        options: [
          {
            label: "Short",
            tooltip:
              "Quick warm-up – Just a short session, barely got started.",
            value: percent(30),
          },
          {
            label: "Moderate",
            tooltip:
              "Solid session – Got moving and put in a reasonable effort.",
            value: percent(60),
          },
          {
            label: "Long",
            tooltip: "Focused training – Committed time, made real progress.",
            value: percent(100),
          },
        ],
        taskDependency: "training type~endurance",
        timeDependency: "",
      },
      {
        tag: "endurance",
        value: percent(50),
        xp: 10,
        id: "endurance intensity",
        text: `What is the RPE (Rate of Perceived Exertion) of your endurance training today?`,
        tooltip: `Think about how much effort you had to put in—how hard did you push?`,
        locked: false,
        condition: "complete training duration to unlock",
        options: [
          {
            label: "Light",
            tooltip: "Barely broke a sweat, felt super easy.",
            value: percent(30),
          },
          {
            label: "Moderate",
            tooltip: "Took some effort, but stayed in control.",
            value: percent(60),
          },
          {
            label: "Max Effort",
            tooltip: "Went all out, completely maxed effort.",
            value: percent(100),
          },
        ],
        taskDependency: "training type~endurance",
        timeDependency: "",
      },
      {
        tag: "endurance",
        value: percent(20),
        xp: 10,
        id: "endurance recovery",
        text: `What is the RPR (Rate of Perceived Recovery) of your strength training today?`,
        tooltip: `Think about how quickly you felt ready to be active again after your session.`,
        locked: false,
        condition: "complete training intensity to unlock",
        options: [
          {
            label: "Slow",
            tooltip: "Took a long time before feeling back to normal.",
            value: percent(30),
          },
          {
            label: "Average",
            tooltip: "Took a while, but eventually felt good to go.",
            value: percent(60),
          },
          {
            label: "Fast",
            tooltip: "Felt completely refreshed and ready for another session.",
            value: percent(100),
          },
        ],
        taskDependency: "training type~endurance",
        timeDependency: "",
      },
      {
        tag: "flexibility",
        value: percent(30),
        xp: 10,
        id: "flexibility duration",
        text: `How many minutes did you engage in flexibility activities today?`,
        tooltip: `Think about how much time you actually put in—how long did you stay active?`,
        locked: false,
        condition: "complete training type to unlock",
        options: [
          {
            label: "Short",
            tooltip:
              "Quick warm-up – Just a short session, barely got started.",
            value: percent(30),
          },
          {
            label: "Moderate",
            tooltip:
              "Solid session – Got moving and put in a reasonable effort.",
            value: percent(60),
          },
          {
            label: "Long",
            tooltip: "Focused training – Committed time, made real progress.",
            value: percent(100),
          },
        ],
        taskDependency: "training type~flexibility",
        timeDependency: "",
      },
      {
        tag: "flexibility",
        value: percent(50),
        xp: 10,
        id: "flexibility intensity",
        text: `What is the RPE (Rate of Perceived Exertion) of your flexibility training today?`,
        tooltip: `Think about how much effort you had to put in—how hard did you push?`,
        locked: false,
        condition: "complete training duration to unlock",
        options: [
          {
            label: "Light",
            tooltip: "Barely broke a sweat, felt super easy.",
            value: percent(30),
          },
          {
            label: "Moderate",
            tooltip: "Took some effort, but stayed in control.",
            value: percent(60),
          },
          {
            label: "Max Effort",
            tooltip: "Went all out, completely maxed effort.",
            value: percent(100),
          },
        ],
        taskDependency: "training type~flexibility",
        timeDependency: "",
      },
      {
        tag: "flexibility",
        value: percent(20),
        xp: 10,
        id: "flexibility recovery",
        text: `What is the RPR (Rate of Perceived Recovery) of your flexibility training today?`,
        tooltip: `Think about how quickly you felt ready to be active again after your session.`,
        locked: false,
        condition: "complete training intensity to unlock",
        options: [
          {
            label: "Slow",
            tooltip: "Took a long time before feeling back to normal.",
            value: percent(30),
          },
          {
            label: "Average",
            tooltip: "Took a while, but eventually felt good to go.",
            value: percent(60),
          },
          {
            label: "Fast",
            tooltip: "Felt completely refreshed and ready for another session.",
            value: percent(100),
          },
        ],
        taskDependency: "training type~flexibility",
        timeDependency: "",
      },
    ],
  },

  {
    name: "Lifestyle",
    value: percent(0),
    description: `
        Gauge your sleep, nutrition, and hydration.`,
    tasks: [
      {
        tag: "sleep",
        value: percent(20),
        xp: 10,
        id: "sleep duration",
        text: `How many hours of sleep did you get last night?`,
        tooltip: `Think about how quickly you felt ready to be active again after your session.`,
        options: [
          {
            label: "Low",
            tooltip: "≤5 hrs Running on fumes—nowhere near enough sleep.",
            value: percent(30),
          },
          {
            label: "Moderate",
            tooltip:
              "5-7 hrs Got some rest, but not quite enough to feel fully recharged.",
            value: percent(60),
          },
          {
            label: "Optimal",
            tooltip: "7+ hrs Fully recharged and ready to go.",
            value: percent(100),
          },
        ],
        taskDependency: "",
        timeDependency: "",
      },
      {
        tag: "sleep",
        value: percent(20),
        xp: 10,
        id: "sleep quality",
        text: `What is the RPR (Rate of Perceived Recovery) of your flexibility training today?`,
        tooltip: `Think about how refreshed you felt, not just how long you slept.`,
        locked: false,
        condition: "complete sleep duration to unlock",
        options: [
          {
            label: "Exhausted",
            tooltip: "Still tired, needed way more rest.",
            value: percent(30),
          },
          {
            label: "Grinder",
            tooltip: "Functional, but not feeling great.",
            value: percent(60),
          },
          {
            label: "Refreshed ",
            tooltip: "Fully rested and ready to go.",
            value: percent(100),
          },
        ],
        taskDependency: "",
        timeDependency: "",
      },
      {
        tag: "nutrition",
        value: percent(20),
        xp: 10,
        id: "fuel quantity",
        text: `How well did you fuel your body today?`,
        tooltip: `Think about your meals—did you eat balanced meals, or just grab whatever was convenient?`,
        options: [
          {
            label: "Low",
            tooltip: " Ate too little, likely under your energy needs.",
            value: percent(30),
          },
          {
            label: "Moderate",
            tooltip:
              "Ate a decent amount, but might not have fully met your energy needs.",
            value: percent(60),
          },
          {
            label: "Optimal",
            tooltip: "Ate enough to meet your energy needs for the day.",
            value: percent(100),
          },
        ],
        taskDependency: "",
        timeDependency: "",
      },
      {
        tag: "nutrition",
        value: percent(20),
        xp: 10,
        id: "fuel quality",
        text: `How balanced was your energy intake today?`,
        tooltip: `Think about the quality of your meals—did you eat in a way that kept your energy steady?`,
        locked: false,
        condition: "complete nutrition quantity to unlock",
        options: [
          {
            label: "Unbalanced",
            tooltip:
              "Mostly processed or junk foods, leading to energy crashes.",
            value: percent(30),
          },
          {
            label: "Mixed",
            tooltip:
              "Some balanced meals, but still included processed or unbalanced choices.",
            value: percent(60),
          },
          {
            label: "Balanced ",
            tooltip:
              "Mostly whole foods, keeping energy steady throughout the day.",
            value: percent(100),
          },
        ],
        taskDependency: "fuel quantity",
        timeDependency: "",
      },
      {
        tag: "hydration",
        value: percent(20),
        xp: 10,
        id: "hydration quantity",
        text: `How much water did you consume today?`,
        tooltip: `Think about whether you drank enough water to stay hydrated.`,
        options: [
          {
            label: "Low",
            tooltip: "Barely drank any water—feeling sluggish or dehydrated.",
            value: percent(30),
          },
          {
            label: "Moderate",
            tooltip: "Had a decent amount, but could have had more.",
            value: percent(60),
          },
          {
            label: "Optimal",
            tooltip: "Stayed fully hydrated throughout the day.",
            value: percent(100),
          },
        ],
        taskDependency: "",
        timeDependency: "",
      },
    ],
  },

  {
    name: "Mental",
    value: percent(0),
    description: `
        How sharp, stable, and focused were you today?`,
    tasks: [
      {
        tag: "focus",
        value: percent(50),
        xp: 10,
        id: "focus",
        text: `How focused were you throughout the day?`,
        tooltip: `Think about how well you maintained attention and avoided distractions.`,
        options: [
          {
            label: "Scattered",
            tooltip: "Easily distracted, struggled to stay focused.",
            value: percent(30),
          },
          {
            label: "Variable",
            tooltip: "Some moments of focus, but inconsistent.",
            value: percent(60),
          },
          {
            label: "Locked In",
            tooltip: "Fully engaged, minimal distractions.",
            value: percent(100),
          },
        ],
        taskDependency: "",
        timeDependency: "",
      },
      {
        tag: "stress",
        value: percent(30),
        xp: 10,
        id: "stress",
        text: `How stressed were you throughout the day??`,
        tooltip: `Think about how much pressure, tension, or overwhelm you experienced.`,
        options: [
          {
            label: "Scattered",
            tooltip: "Constant stress, felt overwhelmed most of the day.",
            value: percent(30),
          },
          {
            label: "Variable",
            tooltip: " Had some stress, but handled it okay.",
            value: percent(60),
          },
          {
            label: "Locked In",
            tooltip: "Felt relaxed and in control throughout the day.",
            value: percent(100),
          },
        ],
        taskDependency: "",
        timeDependency: "",
      },
      {
        tag: "cognition",
        value: percent(20),
        xp: 10,
        id: "cognition",
        text: `How sharp was your thinking today?`,
        tooltip: `Think about your mental clarity, memory, and ability to process information.`,
        locked: false,
        condition: "complete nutrition quantity to unlock",
        options: [
          {
            label: "Foggy",
            tooltip: "Struggled with recall, slow thinking, or mental fatigue.",
            value: percent(30),
          },
          {
            label: "Functional",
            tooltip: "Thought clearly most of the time, but had some lapses.",
            value: percent(60),
          },
          {
            label: "Sharp",
            tooltip: "Quick thinking, strong memory, and high mental clarity.",
            value: percent(100),
          },
        ],
        taskDependency: "stress",
        timeDependency: "",
      },
    ],
  },
];
export default {
  game: {
    game: "marvel rivals",
    image: "",
    stats: {},
  },
  mental: {
    ...trackData[2],
    date: new Date().toLocaleDateString("en-US"),
  },
  lifestyle: {
    ...trackData[1],
    date: new Date().toLocaleDateString("en-US"),
  },
  fitness: {
    ...trackData[0],
    date: new Date().toLocaleDateString("en-US"),
  },
  chat: {},
};
