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
import { useNotification } from "@/services/NotificationService";

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "code" | "reset">("email");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { notify } = useNotification();
  const { setPortal } = useRouter();

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

  // Step 1: Request code
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!validateEmail(email)) {
      notify("Invalid email", "error");
      setLoading(false);
      return;
    }
    axios
      .post(paths.forgotPassword, { email: email.toLowerCase() })
      .then((res) => {
        setId(res.data.message);
        setStep("code");
        notify("Verification code sent to your email", "info");
        setLoading(false);
      })
      .catch((err) => {
        notify(err.response?.data?.message || "Failed to send code", "error");
        setLoading(false);
      });
  };

  // Step 2: Enter code
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

  const handleCodeSubmit = () => {
    const codeValue = code.join("");
    if (codeValue.length !== 6) {
      notify("Please enter a valid verification code", "error");
      return;
    }
    setLoading(true);
    setError("");
    // Just check code format, move to reset step
    setStep("reset");
    setLoading(false);
  };

  // Step 3: Reset password
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!validatePassword(password)) {
      notify(
        "Password must be at least 8 characters long, contain one capital letter, one number, and one special character",
        "error"
      );
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      notify("Passwords do not match", "error");
      setLoading(false);
      return;
    }
    const codeValue = code.join("");
    axios
      .post(paths.forgotPasswordVerify, {
        id,
        code: codeValue,
        newPassword: password,
      })
      .then(() => {
        notify("Password reset successful. Please login.", "info");
        setPortal("login");
        setLoading(false);
      })
      .catch((err) => {
        notify(
          err.response?.data?.message || "Failed to reset password",
          "error"
        );
        setStep("code"); // Go back to code entry on error
        setLoading(false);
      });
  };

  return (
    <div className="_login">
      <Logo />
      <p style={{ margin: "-4px", marginTop: "-12px", fontSize: "0.9rem" }}>
        Forgot your password? Enter your email to reset it.
      </p>
      {step === "email" && (
        <>
          <Field
            value={email}
            setValue={setEmail}
            label="Email"
            icon={<AlternateEmailIcon />}
            placeholder="johndoe@example.com"
            ref={emailRef}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") handleEmailSubmit(e);
            }}
          />
          <button type="submit" onClick={handleEmailSubmit}>
            {loading ? "Sending..." : "Send Code"}
          </button>
          <p className="info">
            Remember your password?{" "}
            <span onClick={() => setPortal("login")}>Login</span>
          </p>
          {error && <p className="error">{error}</p>}
        </>
      )}

      {step === "code" && (
        <div className="verify flex items-center flex-col gap-4">
          <p className="text-center font-normal">
            Please enter the{" "}
            <span className="text-[var(--orange)] font-semibold">
              verification code
            </span>{" "}
            sent to your email. If you can't find the email, please check your
            spam folder.
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
          <button onClick={handleCodeSubmit}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>
          <p className="info">
            Didn't get the code?{" "}
            <span
              onClick={() => {
                setStep("email");
                setCode(["", "", "", "", "", ""]);
              }}
            >
              Try again
            </span>
          </p>
        </div>
      )}

      {step === "reset" && (
        <>
          <Field
            value={password}
            setValue={setPassword}
            label="New Password"
            icon={<KeyIcon />}
            placeholder="********"
            type={showPassword ? "" : "password"}
            ref={passwordRef}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") confirmRef.current?.focus();
            }}
            endIcon={
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            }
            tooltip="Password must be at least 8 characters long, contain one capital letter, one number, and one special character"
          />
          <Field
            value={confirmPassword}
            setValue={setConfirmPassword}
            label="Confirm Password"
            icon={<KeyIcon />}
            placeholder="********"
            type={showConfirm ? "" : "password"}
            ref={confirmRef}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") handleResetSubmit(e);
            }}
            endIcon={
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ cursor: "pointer" }}
              >
                {showConfirm ? <VisibilityOff /> : <Visibility />}
              </span>
            }
          />
          <button type="submit" onClick={handleResetSubmit}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          <p className="info">
            Something went wrong?{" "}
            <span
              onClick={() => {
                setStep("code");
                setPassword("");
                setConfirmPassword("");
              }}
            >
              Go back to code entry
            </span>
          </p>
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
