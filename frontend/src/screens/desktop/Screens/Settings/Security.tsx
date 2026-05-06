"use client";
import React, { useMemo, useState } from "react";
import { Field } from "@/screens/desktop/Screens/Settings/Profile";
import axios from "@/utils/axios";
import paths from "@/utils/routes";
import { useSelector } from "react-redux";
import { useNotification } from "@/services/NotificationService";

const Security = () => {
  const [passwordState, setPasswordState] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const volume = useSelector((state: any) => state.volume);
  const { notify } = useNotification();

  const audio = useMemo(() => {
    const a = new Audio("/assets/audio/light-tick.aac");
    a.volume = volume;
    return a;
  }, [volume]);

  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const onSubmit = async () => {
    const { current, new: newPass, confirm } = passwordState;

    if (!validatePassword(current)) {
      notify("Current password must meet complexity requirements.", "error");
      return;
    }

    if (!validatePassword(newPass)) {
      notify(
        "New password must be at least 8 characters long, contain one capital letter, one number, and one special character.",
        "error"
      );
      return;
    }

    if (newPass !== confirm) {
      notify("New password and confirmation do not match.", "error");
      return;
    }

    try {
      const res = await axios.post(paths.changePassword, {
        oldPassword: current,
        newPassword: newPass,
      });

      localStorage.setItem("token", res.data.token);
      setPasswordState({ current: "", new: "", confirm: "" });
      notify("Password updated successfully", "info");
    } catch (err: any) {
      notify(
        err?.response?.data?.message || "Failed to update password",
        "error"
      );
    }
  };

  return (
    <div className="_settings-page">
      <h2>Security</h2>

      <h3>Update password</h3>

      <div className="section">
        <Field
          label="Current password"
          placeholder="Enter your current password"
          type="password"
          tooltip="Password must be at least 8 characters long, contain one capital letter, one number, and one special character"
          value={passwordState.current}
          setValue={(v) => setPasswordState({ ...passwordState, current: v })}
        />
      </div>

      <div className="section">
        <Field
          label="New password"
          placeholder="Must be 8+ characters, include a capital letter, number, and symbol."
          type="password"
          tooltip="Password must be at least 8 characters long, contain one capital letter, one number, and one special character"
          value={passwordState.new}
          setValue={(v) => setPasswordState({ ...passwordState, new: v })}
        />
      </div>

      <div className="section">
        <Field
          label="Confirm new password"
          placeholder="Re-enter new password"
          type="password"
          tooltip="Password must be at least 8 characters long, contain one capital letter, one number, and one special character"
          value={passwordState.confirm}
          setValue={(v) => setPasswordState({ ...passwordState, confirm: v })}
        />
      </div>

      <div className="page-buttons">
        <button onMouseEnter={() => audio.play()}>Cancel</button>
        <button onMouseEnter={() => audio.play()} onClick={onSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Security;
