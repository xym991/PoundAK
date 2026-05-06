import React from "react";
import { Field } from "./Profile";
import { useLocalStorage } from "react-use";

const Notifications = () => {
  const [notifications, setNotifications] = useLocalStorage<any>(
    "notifications",
    {
      "Pre-Game Power Up": "Enabled",
      "In-Game Insight": "Enabled",
      "Post-Game Play Call": "Enabled",
    }
  );
  return (
    <div className="_settings-page notifications">
      <h2>In-Game Notifications</h2>

      {Object.keys(notifications).map((k) => (
        <div className="section gap-12 flex">
          <Field
            value={notifications[k]}
            setValue={(v) => setNotifications({ ...notifications, [k]: v })}
            label={k}
            type="select"
            options={["Enabled", "Disabled"]}
          />
        </div>
      ))}
    </div>
  );
};

export default Notifications;
