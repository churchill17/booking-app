import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LoginHeader from "../../components/login/LoginHeader";
import LoginInputGroup from "../../components/login/LoginInputGroup";
import { getBookingApiUrl } from "../../utils/api";
import "../../components/login/LoginForm.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const errs = {};
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    if (!confirm) errs.confirm = "Please confirm your password";
    else if (confirm !== password) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(getBookingApiUrl("reset_password.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false)
        throw new Error(data?.message || "Reset failed. Please try again.");
      setDone(true);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── No token in URL ── */
  if (!token) {
    return (
      <>
        <LoginHeader />
        <main className="login-page">
          <div className="login-card">
            <div className="login-card-accent" />
            <div className="fp-success">
              <div className="fp-success-icon">⚠️</div>
              <h1 className="login-card-title">Invalid link</h1>
              <p className="login-card-subtitle">
                This reset link is missing or expired. Please request a new one.
              </p>
              <Link
                to="/forgot-password"
                className="login-btn-primary"
                style={{ display: "block", textAlign: "center", textDecoration: "none", marginTop: 28 }}
              >
                Request new link
              </Link>
            </div>
            <div className="login-card-footer">
              <p>
                <Link to="/terms">Terms &amp; conditions</Link> and{" "}
                <Link to="/privacy">Privacy statement</Link>
              </p>
            </div>
          </div>
          <footer className="login-page-footer">
            All rights reserved. Copyright (2006–2026) – Booking.com™
          </footer>
        </main>
      </>
    );
  }

  return (
    <>
      <LoginHeader />
      <main className="login-page">
        <div className="login-card">
          <div className="login-card-accent" />

          {done ? (
            <div className="fp-success">
              <div className="fp-success-icon">✅</div>
              <h1 className="login-card-title">Password updated!</h1>
              <p className="login-card-subtitle">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>
              <Link
                to="/log-in"
                className="login-btn-primary"
                style={{ display: "block", textAlign: "center", textDecoration: "none", marginTop: 28 }}
              >
                Sign in
              </Link>
            </div>
          ) : (
            <>
              <p className="login-card-eyebrow">Create new password</p>
              <h1 className="login-card-title">Reset password</h1>
              <p className="login-card-subtitle">
                Choose a strong password you haven't used before.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <LoginInputGroup
                  label="New password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                  }}
                  error={errors.password}
                  autoComplete="new-password"
                  rightIcon={showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  rightIconLabel={showPassword ? "Hide password" : "Show password"}
                  onRightIconClick={() => setShowPassword((p) => !p)}
                />

                <LoginInputGroup
                  label="Confirm new password"
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your new password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (errors.confirm) setErrors((p) => ({ ...p, confirm: "" }));
                  }}
                  error={errors.confirm}
                  autoComplete="new-password"
                  rightIcon={showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  rightIconLabel={showConfirm ? "Hide password" : "Show password"}
                  onRightIconClick={() => setShowConfirm((p) => !p)}
                />

                {submitError && (
                  <p className="login-submit-error">{submitError}</p>
                )}

                <button
                  className="login-btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Resetting…" : "Reset password"}
                </button>

                <p className="login-form-switch" style={{ marginTop: 20 }}>
                  <Link to="/log-in">Back to sign in</Link>
                </p>
              </form>
            </>
          )}

          <div className="login-card-footer">
            <p>
              By signing in or creating an account, you agree with our{" "}
              <a href="#">Terms &amp; conditions</a> and{" "}
              <a href="#">Privacy statement</a>
            </p>
          </div>
        </div>

        <footer className="login-page-footer">
          All rights reserved. Copyright (2006–2026) – Booking.com™
        </footer>
      </main>
    </>
  );
}
