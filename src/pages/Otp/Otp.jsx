import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingApiUrl } from "../../utils/api";
import { getStoredUser } from "../../utils/authUser";
import "./Otp.css";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export default function Otp() {
  const verifyOtpApiUrl = getBookingApiUrl("verify_otp.php");
  const resendOtpApiUrl = getBookingApiUrl("resend_otp.php");
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inputRefs = useRef([]);
  const user = getStoredUser();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    const timer = setInterval(() => {
      setCooldown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const nextDigits = [...digits];
    const incoming = value.slice(-1);
    nextDigits[index] = incoming;
    setDigits(nextDigits);
    setError("");
    setMessage("");

    if (incoming && index < OTP_LENGTH - 1) {
      const nextIndex = index + 1;
      setActiveIndex(nextIndex);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      const nextIndex = index - 1;
      setActiveIndex(nextIndex);
      inputRefs.current[nextIndex]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      const nextIndex = index - 1;
      setActiveIndex(nextIndex);
      inputRefs.current[nextIndex]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      const nextIndex = index + 1;
      setActiveIndex(nextIndex);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedValue = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedValue) return;

    const nextDigits = [...digits];
    pastedValue
      .slice(0, OTP_LENGTH)
      .split("")
      .forEach((digit, index) => {
        nextDigits[index] = digit;
      });

    setDigits(nextDigits);
    const lastIndex = Math.min(pastedValue.length, OTP_LENGTH) - 1;
    const focusIndex = lastIndex < 0 ? 0 : lastIndex;
    setActiveIndex(focusIndex);
    inputRefs.current[focusIndex]?.focus();
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const code = digits.join("");

    if (code.length !== OTP_LENGTH || digits.some((digit) => !digit)) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(verifyOtpApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: code,
          email: user?.email,
          role: user?.role || "guest",
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.message || "Verification failed. Please try again.",
        );
      }

      const redirectPath = user?.role === "host" ? "/list-property/login" : "/";
      const fallbackMessage =
        user?.role === "host"
          ? "Verification complete. Redirecting to your property listing..."
          : "Verification complete. Redirecting you home...";

      setMessage(data?.message || fallbackMessage);
      setTimeout(() => navigate(redirectPath), 900);
    } catch (submitError) {
      setError(submitError.message || "Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(resendOtpApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.message || "Could not resend code. Please try again.",
        );
      }

      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(""));
      setActiveIndex(0);
      inputRefs.current[0]?.focus();
      setMessage(data?.message || "A new verification code was sent.");
    } catch (resendError) {
      setError(
        resendError.message || "Could not resend code. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="otp-page">
      <section className="otp-card" aria-labelledby="otp-title">
        <p className="otp-eyebrow">Two-step verification</p>
        <h1 className="otp-title" id="otp-title">
          Enter your one-time code
        </h1>
        <p className="otp-subtitle">
          We sent a 6-digit code to your email. The code expires in 10 minutes.
        </p>

        <form onSubmit={handleSubmit} className="otp-form" noValidate>
          <div className="otp-input-row" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                className={`otp-input ${activeIndex === index ? "is-active" : ""}`}
                value={digit}
                onFocus={() => setActiveIndex(index)}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          {error ? (
            <p className="otp-feedback otp-feedback-error">{error}</p>
          ) : null}
          {!error && message ? (
            <p className="otp-feedback otp-feedback-success">{message}</p>
          ) : null}

          <button
            className="otp-btn-primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Verifying..." : "Verify code"}
          </button>
        </form>

        <div className="otp-resend-row">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            className="otp-resend-btn"
            disabled={cooldown > 0 || resending}
            onClick={handleResendCode}
          >
            {resending
              ? "Resending..."
              : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend code"}
          </button>
        </div>
      </section>
    </main>
  );
}
