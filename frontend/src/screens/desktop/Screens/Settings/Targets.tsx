import React, { ReactNode, useState } from "react";

const Target = ({
  metric,
  children,
}: {
  metric: string;
  children: ReactNode;
}) => (
  <div className="_target">
    <h3>{metric}</h3>
    {children}
  </div>
);

const Targets = () => {
  const [state, setState] = useState<any>({
    "Hydration Intake": "60 oz",
    "Max HR": "190 bpm",
    "Caloric Intake": "2500 cal",
    "Sleep Need": "8.2 hrs",
    "Macro Breakdown": {
      Protein: "50%",
      Carbohydrate: "30%",
      Fats: "30%",
    },
    "Cardio Need": "1 hr",
  });
  return (
    <div className="_settings-page">
      <h2>Calculated Targets</h2>
      <div className="targets">
        {Object.keys(state).map((k) => (
          <Target metric={k}>
            {typeof state[k] == "string" && (
              <div className="value">{state[k]}</div>
            )}
            {typeof state[k] == "object" && (
              <div className="values">
                {Object.keys(state[k]).map((_k) => (
                  <Target metric={_k}>
                    <div className="value">{state[k][_k]}</div>
                  </Target>
                ))}
              </div>
            )}
          </Target>
        ))}
      </div>
    </div>
  );
};

export default Targets;
