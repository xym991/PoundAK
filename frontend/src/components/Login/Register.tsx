"use client";
import React, { useRef, useState } from "react";
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

const Register = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const { setPortal } = useRouter();
  const [id, setId] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[^\s]{8,}$/;
    return re.test(password);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    nextRef?: React.RefObject<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef?.current) {
        nextRef.current.focus();
      } else {
        handleSubmit(e as any);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(credentials.email)) {
      notify("Invalid email", "error");
      setLoading(false);
      return;
    }

    if (!validatePassword(credentials.password)) {
      notify(
        "Password must be at least 8 characters long, contain one capital letter, one number, and one special character",
        "error"
      );
      setLoading(false);
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      notify("Passwords do not match", "error");
      setLoading(false);
      return;
    }

    setError("");

    axios
      .post(paths.register, {
        ...credentials,
        email: credentials.email.toLowerCase(),
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        notify("Verification code sent successfully", "info");
        setId(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        notify(err.response?.data?.message || "Registration failed", "error");
        setLoading(false);
      });
  };

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const handleVerificationChange = (e: any, index: number) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerificationKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      const prevInput = document.getElementById(`input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerificationSubmit = () => {
    const codeValue = code.join("");
    if (codeValue.length !== 6) {
      notify("Please enter a valid verification code", "error");
      return;
    }

    axios
      .post(paths.verify, { code: codeValue, id })
      .then((res) => {
        notify("Account registered successfully", "info");
        localStorage.setItem("token", res.data.token);
        dispatch(setUser(res.data.info));
        dispatch(setPortal("preferences"));
      })
      .catch((err) => {
        notify(err.response?.data?.message || "Verification failed", "error");
      });
  };

  return (
    <div className="_login">
      <Logo />
      <p style={{ margin: "-4px", marginTop: "-12px", fontSize: "0.9rem" }}>
        Register to to get personalized insights
      </p>
      {!id && (
        <>
          <Field
            value={credentials.email}
            setValue={(v) => setCredentials({ ...credentials, email: v })}
            label="Email"
            icon={<AlternateEmailIcon />}
            placeholder="johndoe@example.com"
            ref={emailRef}
            onKeyDown={(e: any) => handleKeyDown(e, passwordRef)}
          />

          <Field
            value={credentials.password}
            setValue={(v) => setCredentials({ ...credentials, password: v })}
            label="Password"
            icon={<KeyIcon />}
            placeholder="********"
            type={showPassword ? "" : "password"}
            ref={passwordRef}
            onKeyDown={(e: any) => handleKeyDown(e, confirmRef)}
            endIcon={
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            }
          />

          <Field
            value={credentials.confirmPassword}
            setValue={(v) =>
              setCredentials({ ...credentials, confirmPassword: v })
            }
            label="Confirm Password"
            icon={<KeyIcon />}
            placeholder="********"
            type={showConfirm ? "" : "password"}
            ref={confirmRef}
            onKeyDown={(e: any) => handleKeyDown(e)}
            tooltip="Password must be at least 8 characters long, contain one capital letter, one number, and one special character"
            endIcon={
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ cursor: "pointer" }}
              >
                {showConfirm ? <VisibilityOff /> : <Visibility />}
              </span>
            }
          />

          <button type="submit" onClick={handleSubmit}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="info">
            Already have an account?{" "}
            <span onClick={() => setPortal("login")}>Login</span>
          </p>

          {error && <p className="error">{error}</p>}
        </>
      )}

      {id && (
        <div className="verify flex items-center flex-col gap-4">
          <p className="text-center font-normal">
            Please enter the{" "}
            <span className="text-[var(--orange)] font-semibold">
              verification code
            </span>{" "}
            sent to your email to verify your account. If you can't find the
            email, please check your spam folder.
          </p>
          <div className="flex gap-4 mb-2 mt-3 justify-between w-[400px]">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleVerificationChange(e, index)}
                onKeyDown={(e) => handleVerificationKeyDown(e, index)}
              />
            ))}
          </div>
          <button onClick={handleVerificationSubmit}>Verify</button>
        </div>
      )}
    </div>
  );
};

export default Register;
