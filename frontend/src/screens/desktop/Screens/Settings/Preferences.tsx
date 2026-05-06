import React, { useEffect, useState } from "react";
import { Field } from "./Profile";
import axios from "@/utils/axios";
import paths from "@/utils/routes";
import { useDispatch, useSelector } from "react-redux";
import { useNotification } from "@/services/NotificationService";
import { setUser } from "@/state/userSlice";
import "./settings.css";
import Button from "@/components/Button";

const Preferences = ({ onSave, onBoarding }: any) => {
  const [metrics, setMetrics] = useState({
    weight: { value: "", unit: "lbs" },
    height: { value: "", unit: "in" },
    weightGoal: "",
    physiqueGoal: "",
    activityLevel: "",
  });
  const user = useSelector((state: any) => state.user);
  useEffect(() => {
    user?.metrics && setMetrics(user.metrics);
  }, [user?.metrics]);
  const dispatch = useDispatch();
  const { notify } = useNotification();

  // Validate fields to ensure they are filled
  const validate = () => {
    let isValid = true;

    if (!metrics.height.value) {
      notify("Height is required.", "error");
      isValid = false;
    }

    if (!metrics.weight.value) {
      notify("Weight is required.", "error");
      isValid = false;
    }

    if (!metrics.weightGoal) {
      notify("Weight Goal is required.", "error");
      isValid = false;
    }

    if (!metrics.physiqueGoal) {
      notify("Physique Goal is required.", "error");
      isValid = false;
    }

    if (!metrics.activityLevel) {
      notify("Activity Level is required.", "error");
      isValid = false;
    }

    return isValid;
  };

  const handleSave = () => {
    if (!validate()) return;

    axios
      .put(paths.metrics, metrics)
      .then((res) => {
        notify("Metrics updated", "info");
        dispatch(setUser(res.data));
        onSave && onSave();
      })
      .catch((err: any) => {
        console.error(err);
        notify(err.response.data.message, "error");
      });
  };

  return (
    <>
      <div className="_settings-page preferences">
        <h2>Preferences</h2>
        {!onBoarding && (
          <div className="page-buttons">
            <button>Cancel</button>
            <button onClick={handleSave}>Save</button>
          </div>
        )}
        <div className="section">
          <Field
            label="Height"
            value={metrics.height.value}
            setValue={(v) =>
              setMetrics({
                ...metrics,
                height: { ...metrics.height, value: v },
              })
            }
          >
            <Field
              type="dropdown"
              value={metrics.height.unit}
              setValue={(v) =>
                setMetrics({
                  ...metrics,
                  height: { ...metrics.height, unit: v },
                })
              }
              options={["in", "cm"]}
              label="height-unit"
            />
          </Field>
          <Field
            label="Weight"
            value={metrics.weight.value}
            setValue={(v) =>
              setMetrics({
                ...metrics,
                weight: { ...metrics.weight, value: v },
              })
            }
          >
            <Field
              type="dropdown"
              value={metrics.weight.unit}
              setValue={(v) =>
                setMetrics({
                  ...metrics,
                  weight: { ...metrics.weight, unit: v },
                })
              }
              options={["lbs", "kgs"]}
              label="weight-unit"
            />
          </Field>
        </div>
        <div className="section">
          <Field
            label="Weight Goal"
            value={metrics.weightGoal}
            setValue={(v) => setMetrics({ ...metrics, weightGoal: v })}
            type="select"
            options={["maintain", "lose", "gain"]}
          />
        </div>
        <div className="section">
          <Field
            label="Physique Goal"
            value={metrics.physiqueGoal}
            setValue={(v) => setMetrics({ ...metrics, physiqueGoal: v })}
            type="select"
            options={["tone up", "bulk up", "get stronger"]}
            multiple={true}
          />
        </div>
        <div className="section">
          <Field
            label="Activity Level"
            value={metrics.activityLevel}
            setValue={(v) => setMetrics({ ...metrics, activityLevel: v })}
            type="select"
            options={["not active", "active", "very active"]}
          />
        </div>
      </div>
      {onBoarding && (
        <div className="onboarding_buttons flex gap-4 py-4 justify-end ">
          {/* <Button onClick={onSave}>Skip</Button> */}
          <Button onClick={handleSave}>Next</Button>
        </div>
      )}
    </>
  );
};

export default Preferences;
