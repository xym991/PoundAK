"use client";
import React, { useState, useRef, useEffect } from "react";
import Logo from "../../assets/images/Logo.svg";
import "./Login.css";
import { Field } from "@/screens/desktop/Screens/Settings/Profile";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useRouter from "@/hooks/useRouter";
import axios from "axios";
import paths from "@/utils/routes";
import { useDispatch } from "react-redux";
import { setUser } from "@/state/userSlice";
import { useNotification } from "@/services/NotificationService";
import Discord from "@/assets/images/bottom-nav/discord1.svg";
import { setPreviewState } from "@/state/store";
import { localStorageService } from "@/services/localStorageService";
import { setTab } from "@/state/routerSlice";

export function LoginButton() {
  const discordClientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_API_URL + "/discord/auth"
  );
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;

  const loginWithDiscord = () => {
    overwolf.utils.openUrlInDefaultBrowser(discordAuthUrl);
  };

  return (
    <button
      onClick={loginWithDiscord}
      className="px-4 py-2 bg-indigo-600 text-white  login-discord"
    >
      <Discord />
      Login with Discord
    </button>
  );
}

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    localStorageService.setItem("preview", "");
    dispatch(setTab("home"));
    dispatch(setPortal("login"));
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[^\s]{8,}$/;
    return re.test(password);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    nextRef?: React.RefObject<HTMLElement>
  ) => {
    if (e.key === "Enter" && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
      if (nextRef.current.tagName === "BUTTON") {
        (nextRef.current as HTMLButtonElement).click();
      }
    }
  };

  const dispatch = useDispatch();
  const { notify } = useNotification();
  const { setPortal } = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(credentials.email)) {
      notify("Invalid email", "error");
      return;
    }
    if (!validatePassword(credentials.password)) {
      notify(
        "Password must be at least 8 characters long, contain one capital letter, one number, and one special character",
        "error"
      );
      return;
    }
    setError("");

    axios
      .post(paths.login, {
        ...credentials,
        email: credentials.email.toLowerCase(),
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        notify("Login successful", "info");
        dispatch(setUser(res.data.info));
        dispatch(setPortal(""));
      })
      .catch((err) => {
        notify(err.response?.data?.message || "Login failed", "error");
      });
  }; // components/LoginButton.tsx

  return (
    <div className="_login">
      <Logo />
      <h1
        style={{
          marginTop: "-12px",
          fontWeight: "bold",
          fontSize: "2rem",
          color: "white",
        }}
      >
        Get Gains In-Game and IRL
      </h1>
      <p
        style={{
          marginTop: "-12px",
          marginBottom: "1.2rem",

          fontSize: "1rem",
          fontWeight: "400",
          textAlign: "center",
          color: "white",
        }}
      >
        Testers agree to report bugs, provide feedback, and help shape the
        future of <span className="font-bold">POUND AK</span>
      </p>
      {/* <Field
        ref={emailRef}
        onKeyDown={(e: any) => handleKeyDown(e, passwordRef)}
        value={credentials.email}
        setValue={(v) => setCredentials({ ...credentials, email: v })}
        label="Email"
        icon={<AlternateEmailIcon />}
        placeholder="johndoe@example.com"
      />

      <Field
        ref={passwordRef}
        onKeyDown={(e: any) => handleKeyDown(e, loginButtonRef)}
        value={credentials.password}
        setValue={(v) => setCredentials({ ...credentials, password: v })}
        label="Password"
        icon={<KeyIcon />}
        placeholder="********"
        type={showPassword ? "" : "password"}
        tooltip="Password must be at least 8 characters long, contain one capital letter, one number, and one special character"
        endIcon={
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        }
      />

      <button type="submit" onClick={handleSubmit} ref={loginButtonRef}>
        Login
      </button>

      <p className="info">
        <span
          style={{ marginRight: "auto", display: "inline-block" }}
          onClick={() => setPortal("forgotPassword")}
        >
          Forgot Password?
        </span>
        Don't have an account?{" "}
        <span onClick={() => setPortal("register")}>Register</span>
      </p>

      {error && <p className="error">{error}</p>} */}

      <LoginButton />
      <p className="info">
        Just browsing?
        <span
          onClick={() => {
            localStorageService.setItem("preview", "true");
            dispatch(setPreviewState());
            notify("Preview mode enabled, Dummy data has been added", "info");
            dispatch(setPortal(""));
          }}
        >
          Preview the App
        </span>
      </p>
    </div>
  );
};

export default Login;
