import { useState } from "react";
import { Link } from "react-router-dom";
import LoginHeader from "../../components/login/LoginHeader";
import LoginInputGroup from "../../components/login/LoginInputGroup";
import { getBookingApiUrl } from "../../utils/api";
import "../../components/login/LoginForm.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email address is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getBookingApiUrl("forgot-password.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false)
        throw new Error(data?.message || "Something went wrong. Please try again.");
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginHeader />
      <main className="login-page">
        <div className="login-card">
          <div className="login-card-accent" />

          {sent ? (
            <div className="fp-success">
              <div className="fp-success-icon">📧</div>
              <h1 className="login-card-title">Check your inbox</h1>
              <p className="login-card-subtitle">
                We sent a password reset link to <strong>{email}</strong>.
                Open it and follow the instructions.
              </p>
              <p className="login-card-subtitle" style={{ fontSize: 13, marginTop: 8 }}>
                Didn't get it? Check your spam folder or{" "}
                <button className="fp-resend-btn" onClick={() => setSent(false)}>
                  try again
                </button>
                .
              </p>
              <Link
                to="/log-in"
                className="login-btn-primary"
                style={{ display: "block", textAlign: "center", textDecoration: "none", marginTop: 28 }}
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <p className="login-card-eyebrow">Account recovery</p>
              <h1 className="login-card-title">Forgot password?</h1>
              <p className="login-card-subtitle">
                Enter the email linked to your account and we'll send you a
                reset link.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <LoginInputGroup
                  label="Email address"
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  error={error}
                />

                <button
                  className="login-btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Send reset link"}
                </button>

                <p className="login-form-switch" style={{ marginTop: 20 }}>
                  Remembered it? <Link to="/log-in">Sign in</Link>
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
